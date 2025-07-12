import { ReactSelect } from '@/components';
import { Alert, Field, toaster } from '@/components/ui';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadMyPaymentRequest } from '@/hooks/payment_requests';
import { useCreateVouchers } from '@/hooks/vouchers';
import { uploadToS3 } from '@/utils/uploadToS3';

import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Table,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { FiAlertCircle, FiUpload, FiUploadCloud } from 'react-icons/fi';

export const MyPaymentUpload = () => {
	const [selectedOrders, setSelectedOrders] = useState(null);
	const [selectedRequests, setSelectedRequests] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [paymentDate, setPaymentDate] = useState('');
	const [notes, setNotes] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [resetFileKey, setResetFileKey] = useState(0);

	const { data: paymentRequests, isLoading: isLoadingRequests } =
		useReadMyPaymentRequest();
	const { data: paymentOrders, isLoading: isLoadingOrders } =
		useReadPaymentOrders(
			{ request: selectedRequests?.value, status: 1 },
			{
				enabled: !!selectedRequests,
			}
		);

	const { mutateAsync: createVoucher } = useCreateVouchers();

	const validateFields = () => {
		const newErrors = {};
		if (!selectedOrders)
			newErrors.selectedOrders = 'Seleccione una orden de pago';
		if (!selectedFile)
			newErrors.selectedFile = 'Debe adjuntar el comprobante de pago';
		if (!paymentDate) newErrors.paymentDate = 'Seleccione la fecha de pago';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const requestOptions = paymentRequests
		?.filter((request) => request.status === 1)
		.map((request) => ({
			value: request.id,
			label: `Solicitud #${request.id} - ${request.purpose_display} - ${request.admission_process_program_name}`,
			name: `${request.purpose_display} - ${request.num_document}`,
		}));

	const allPaymentOrders =
		paymentOrders?.pages?.flatMap((page) => page.results) ?? [];
	const orderOptions = allPaymentOrders
		? allPaymentOrders.map((order) => ({
				value: order.id,
				label: `Orden #${order.id_orden} - S/ ${order.total_amount} - ${order.document_type_display}`,
				amount: order.total_amount,
			}))
		: [];

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!validateFields()) return;
			// Upload file to S3
			const s3Url = await uploadToS3(
				selectedFile,
				'sga_uni/vouchers',
				selectedRequests.name.replace(/\s+/g, '_')
			);

			// Create voucher
			await createVoucher({
				order: selectedOrders.value,
				file_path: s3Url,
				payment_date: new Date(paymentDate).toISOString(),
				description: notes,
			});

			toaster.create({
				title: 'Éxito',
				description: 'Comprobante subido correctamente',
				type: 'success',
			});

			// Reset form
			setSelectedRequests(null);
			setSelectedOrders(null);
			setSelectedFile(null);
			setPaymentDate('');
			setNotes('');
			setResetFileKey((prev) => prev + 1); // Forzar el reseteo del componente
		} catch (error) {
			toaster.create({
				title: 'Error',
				description: error.message || 'Error al subir el comprobante',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiUploadCloud} boxSize={5} color='blue.600' />
						<Heading fontSize={{ base: '16px', md: '24px' }}>
							Subir Comprobante de Pago
						</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Card.Root>
						<Card.Header>
							<Card.Description>
								Puedes subir un comprobante para una orden individual
							</Card.Description>
						</Card.Header>
						<Card.Body>
							<VStack gap={6} align='stretch'>
								<Box>
									<Text mb={2} fontWeight='medium'>
										Selecciona las órdenes a pagar:
									</Text>
									<Box
										borderWidth='1px'
										borderRadius='lg'
										p={4}
										maxH='12rem'
										gap={4}
										overflowY='auto'
									>
										<Field
											label='Solicitudes:'
											invalid={!!errors.selectedRequests}
										>
											<ReactSelect
												value={selectedRequests}
												isLoading={isLoadingRequests}
												onChange={setSelectedRequests}
												variant='flushed'
												size='xs'
												isSearchable
												isClearable
												options={requestOptions}
											/>
										</Field>
										<Field
											label='Ordenes de Pago:'
											mt={2}
											invalid={!!errors.selectedOrders}
											errorText={errors.selectedOrders}
										>
											<ReactSelect
												value={selectedOrders}
												onChange={setSelectedOrders}
												isLoading={isLoadingOrders}
												isDisabled={!selectedRequests}
												variant='flushed'
												size='xs'
												isSearchable
												isClearable
												options={orderOptions}
											/>
										</Field>
									</Box>
								</Box>

								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									<Box>
										<Field
											label='Comprobante de Pago:'
											required
											invalid={!!errors.selectedFile}
											errorText={errors.selectedFile}
										>
											<CompactFileUpload
												key={resetFileKey}
												name='voucher_path'
												accept='application/pdf,image/png,image/jpeg,image/jpg'
												onChange={(file) => {
													const allowedTypes = [
														'application/pdf',
														'image/png',
														'image/jpeg',
														'image/jpg',
													];
													if (!file) {
														setSelectedFile(null);
														return;
													}

													if (allowedTypes.includes(file.type)) {
														setSelectedFile(file);
													} else {
														setSelectedFile(null);
														toaster.create({
															title:
																'Solo se permiten archivos PDF o imágenes (JPG, PNG).',
															type: 'error',
														});
													}
												}}
												defaultFile={null}
												onClear={() => setSelectedFile(null)}
											/>
										</Field>
										<Text fontSize='xs' color='gray.500'>
											Formatos: PDF, JPG, PNG (máx. 5MB)
										</Text>
									</Box>

									<Box>
										<Field
											label='Fecha de Pago:'
											w='full'
											required
											invalid={!!errors.paymentDate}
											errorText={errors.paymentDate}
										>
											<CustomDatePicker
												selectedDate={paymentDate}
												onDateChange={(date) =>
													setPaymentDate(format(date, 'yyyy-MM-dd'))
												}
												placeholder='Selecciona una fecha de inicio'
												buttonSize='md'
												asChild
												size={{ base: '280px', md: '250px' }}
											/>
										</Field>
									</Box>
								</SimpleGrid>

								<Box>
									<Text fontWeight='medium'>Notas adicionales</Text>
									<Textarea
										id='notes'
										placeholder='Comentarios sobre el pago, número de operación, etc...'
										rows={3}
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
									/>
								</Box>

								<Alert icon={<FiAlertCircle />} status='info' borderRadius='md'>
									Una vez subido el comprobante, las órdenes seleccionadas
									cambiarán a estado &quot;En revisión&quot; hasta que se valide
									el pago.
								</Alert>

								<Button
									width='full'
									colorPalette='blue'
									onClick={handleSubmit}
									loading={isSubmitting}
									loadingText='Subiendo comprobante...'
								>
									<Icon as={FiUpload} mr={2} />
									Subir Comprobante
								</Button>
							</VStack>
						</Card.Body>
					</Card.Root>
				</Card.Body>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Heading size='md'>Comprobantes Subidos</Heading>
				</Card.Header>
				<Card.Body>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader>Fecha creación</Table.ColumnHeader>
								<Table.ColumnHeader>N° de Orden</Table.ColumnHeader>
								<Table.ColumnHeader>Archivo</Table.ColumnHeader>
								<Table.ColumnHeader>Monto (S/.)</Table.ColumnHeader>
								<Table.ColumnHeader>Estado</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							<Table.Row>
								<Table.Cell colSpan={6} textAlign='center'>
									Sin datos disponibles
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Card.Body>
			</Card.Root>
		</Stack>
	);
};
