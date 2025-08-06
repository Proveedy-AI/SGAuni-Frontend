import {
	Alert,
	Button,
	Checkbox,
	Field,
	Modal,
	toaster,
} from '@/components/ui';
import {
	Stack,
	Card,
	Text,
	Flex,
	Icon,
	Spinner,
	HStack,
	Input,
	Box,
	SimpleGrid,
	VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { FiAlertTriangle, FiCreditCard } from 'react-icons/fi';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';

export const ProcessEnrollmentModal = ({
	paymentPlan,
	baseAmount,
	description,
	discountValue,
	amountCredits,
	onNext,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [enrollmentItem, setEnrollmentItem] = useState(null);

	useEffect(() => {
		const stored = EncryptedStorage.load('selectedEnrollmentProccess');
		setEnrollmentItem(stored);
	}, []);

	const [errors, setErrors] = useState({});

	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment({ enabled: open });

	const { mutate: paymentRequests, isPending } = useCreatePaymentRequest();

	const validateFields = () => {
		const newErrors = {};
		if (!selectedDocumentType)
			newErrors.selectedDocumentType = 'Seleccione un tipo de documento';
		if (!acceptTerms)
			newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';
		if (!numDocCarpeta)
			newErrors.numDocCarpeta = 'Ingrese el número de documento';
		if (!selectedMethod)
			newErrors.selectedMethod = 'Seleccione un método de pago';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = () => {
		if (!validateFields()) return;
		const payload =
			paymentPlan === 5 || paymentPlan === 4
				? {
						payment_method: selectedMethod?.value,
						amount: baseAmount || '0',
						enrollment: enrollmentItem?.id, // para admisión
						purpose: paymentPlan,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
						description: description,
						acepted_terms: acceptTerms,
						discount_value: discountValue || '',
						amount_credits_total: amountCredits,
					}
				: {
						payment_method: selectedMethod?.value,
						amount: baseAmount || '0',
						enrollment: enrollmentItem.id, // para matrícula
						purpose: paymentPlan,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
						description: description,
						acepted_terms: acceptTerms,
						discount_value: discountValue || '',
						amount_credits_total: amountCredits,
					};
		console.log('Payload:', payload);
		onNext();
		/*paymentRequests(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Solicitud de pago fue exitoso',
					type: 'success',
				});

				setisSelectCaja(false);
				setSelectedMethod(null);
				setnumDocCarpeta('');
				setSelectedDocumentType(null);
			},
			onError: (error) => {
				const errorData = error.response?.data;

				if (Array.isArray(errorData)) {
					// Caso como: ["Ya existe una solicitud de pago Pendiente..."]
					errorData.forEach((message) => {
						toaster.create({
							title: message,
							type: 'error',
						});
					});
				} else if (errorData && typeof errorData === 'object') {
					// Caso como: { field1: ["msg1", "msg2"], field2: ["msg3"] }
					Object.values(errorData).forEach((errorList) => {
						if (Array.isArray(errorList)) {
							errorList.forEach((message) => {
								toaster.create({
									title: message,
									type: 'error',
								});
							});
						}
					});
				} else {
					// Fallback
					toaster.create({
						title: 'Error al solicitar el pago',
						type: 'error',
					});
				}
			},*/
	};

	// Efecto de carga cuando se abre el modal
	useEffect(() => {
		if (open) {
			setLoading(true);
			const timeout = setTimeout(() => {
				setLoading(false);
			}, 1500); // duración del "efecto de carga"

			return () => clearTimeout(timeout); // limpieza
		}
	}, [open]);

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];
	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];
	return (
		<Modal
			placement='center'
			trigger={<Button colorPalette='blue'>Procesar Orden</Button>}
			open={open}
			onSave={handleSubmitData}
			onOpenChange={(e) => setOpen(e.open)}
			size='2xl'
			loading={isPending}
		>
			<Stack gap={4} pb={6}>
				{loading ? (
					<Flex justify='center' align='center' minH='200px'>
						<Spinner
							thickness='4px'
							speed='0.65s'
							emptyColor='gray.200'
							color='blue.500'
							size='xl'
						/>
					</Flex>
				) : (
					<Card.Root>
						<Card.Header>
							<HStack justify='center' mb={4}>
								<Icon as={FiCreditCard} boxSize={6} color='blue.500' />

								<Text
									fontSize='xl'
									fontWeight='semibold'
									textAlign='center'
									color='blue.600'
								>
									Solicitar Orden de Pago
								</Text>
							</HStack>
						</Card.Header>
						<Card.Body spaceY={4}>
							{(paymentPlan === 5 || paymentPlan === 4) && (
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									<Field
										label='Tipo de documento:'
										invalid={!!errors.selectedDocumentType}
										errorText={errors.selectedDocumentType}
									>
										<ReactSelect
											value={selectedDocumentType}
											onChange={setSelectedDocumentType}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={TypeOptions}
										/>
									</Field>
									<Field
										label='N° Doc'
										invalid={!!errors.numDocCarpeta}
										errorText={errors.numDocCarpeta}
									>
										<Input
											value={numDocCarpeta}
											onChange={(e) => setnumDocCarpeta(e.target.value)}
											placeholder='Ingrese número de documento'
											disabled={selectedDocumentType?.value === 1}
										/>
									</Field>
									<Field
										label='Monto (S/):'
										invalid={!!errors.amountValue}
										errorText={errors.amountValue}
									>
										<Input
											type='number'
											placeholder='Solo para propósitos que lo permiten'
											step='0.01'
											value={baseAmount}
											readOnly
										/>
									</Field>
									<Field
										label='Métodos de Pago:'
										invalid={!!errors.selectedMethod}
										errorText={errors.selectedMethod}
									>
										<ReactSelect
											value={selectedMethod}
											onChange={(option) => {
												setSelectedMethod(option);
												setisSelectCaja(option.value === 2);
											}}
											isLoading={isLoadingMethodPayment}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={methodOptions}
										/>
									</Field>
									<Field label='Descuento: %'>
										<Input
											type='number'
											placeholder='Solo para propósitos que lo permiten'
											step='0.01'
											value={discountValue || ''}
											readOnly
										/>
									</Field>
								</SimpleGrid>
							)}

							{isSelectCaja && (
								<Box
									mt={3}
									bg='yellow.100'
									p={3}
									textAlign={'center'}
									rounded='md'
									border='1px solid'
									borderColor='yellow.400'
								>
									<Text fontSize='sm' color='yellow.800'>
										Luego de solicitar la orden de pago. Por favor, acércate a
										la oficina de <b>FIEECS</b> para obtener tu recibo físico y
										poder completar el proceso de pago.
									</Text>
								</Box>
							)}

							<Alert status='info' Icon={<FiAlertTriangle />}>
								Tu solicitud será enviada al Administrador de Cobranzas para
								revisión. Recibirás una notificación cuando la orden sea
								generada.
							</Alert>
							<HStack align='start' gap={3}>
								<Checkbox
									checked={acceptTerms}
									onChange={(e) => setAcceptTerms(e.target.checked)}
								/>
								<VStack align='start' gap={1}>
									<Text fontSize='sm'>
										Declaro que los{' '}
										<Text as='a' color='blue.600'>
											datos personales proporcionados
										</Text>{' '}
										son verídicos y completos. En caso contrario, los beneficios
										y solicitudes podrán ser cancelados.
									</Text>
									{errors.acceptTerms && (
										<Text color='red.500' fontSize='sm'>
											{errors.acceptTerms}
										</Text>
									)}
								</VStack>
							</HStack>
						</Card.Body>
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

ProcessEnrollmentModal.propTypes = {
	paymentPlan: PropTypes.number,
	discountValue: PropTypes.string,
	baseAmount: PropTypes.number,
	description: PropTypes.string,
	amountCredits: PropTypes.number,
	onNext: PropTypes.func,
};
