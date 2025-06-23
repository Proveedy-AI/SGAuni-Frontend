import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import {
	IconButton,
	Stack,
	Flex,
	Text,
	Input,
	Button,
	Badge,
	Grid,
	SimpleGrid,
	Separator,
	Heading,
	HStack,
	Span,
} from '@chakra-ui/react';
import { ConfirmModal, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiHelpCircle, FiTrash2 } from 'react-icons/fi';
import { FaSave } from 'react-icons/fa';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useCreateVouchers, useDeleteVoucher } from '@/hooks/vouchers';

export const UploadVoucherForm = ({ data, refetch }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const [filePDF, setFilePDF] = useState(null);
	const [isPending, setIsPending] = useState(false);

	const { mutateAsync: createVoucher } = useCreateVouchers();

	const handleSubmit = async () => {
		if (!filePDF || !data?.id) return;

		try {
			setIsPending(true);

			// Subir a S3
			const uploadedUrl = await uploadToS3(
				filePDF,
				'sga_uni/voucher',
				data.document_num?.replace(/\s+/g, '_') || 'voucher'
			);

			// Llamar al hook con el payload
			await createVoucher({
				order: data.id,
				file_path: uploadedUrl,
			});

			toaster.create({
				title: 'Voucher subido exitosamente.',
				type: 'success',
			});
			refetch();
			setFilePDF(null);
		} catch (err) {
			console.log(err);
			toaster.create({
				title: 'Error al subir el voucher.',
				type: 'error',
			});
		} finally {
			setIsPending(false);
		}
	};

	const { mutate: deleteVoucher, isPending: isPendingDelete } =
		useDeleteVoucher();

	const handleDeleteVoucher = (id) => {
		deleteVoucher(id, {
			onSuccess: () => {
				toaster.create({
					title: 'Voucher eliminado correctamente',
					type: 'success',
				});
				refetch();
				setOpenDelete(false);
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	const statusDisplay = [
		{
			id: 1,
			label: 'Pendiente',
			value: 'Pending',
			bg: '#AEAEAE',
			color: '#F5F5F5',
		},
		{
			id: 2,
			label: 'Disponible',
			value: 'Available',
			bg: '#FDD9C6',
			color: '#F86A1E',
		},
		{
			id: 3,
			label: 'Verificado',
			value: 'Verified',
			bg: '#D0EDD0',
			color: '#2D9F2D',
		},
		{
			id: 4,
			label: 'Expirado',
			value: 'Expired',
			bg: '#F7CDCE',
			color: '#E0383B',
		},
	];

	return (
		<Modal
			title='Orden de pago'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					Ver Orden
				</Button>
			}
			size='4xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4} css={{ '--field-label-width': '150px' }}>
				<SimpleGrid columns={[1, 2]} spacingY={2} columnGap={6}>
					<Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
						{[
							{
								label: 'Numero de Orden',
								value: data?.id_orden || '—',
							},
							{
								label: 'Estado',
								value: (
									<Badge
										bg={
											statusDisplay.find((status) => status.id === data?.status)
												?.bg
										}
										color={
											statusDisplay.find((status) => status.id === data?.status)
												?.color
										}
									>
										{statusDisplay.find((status) => status.id === data?.status)
											?.label || 'N/A'}
									</Badge>
								),
							},
						].map(({ label, value }, index) => (
							<React.Fragment key={index}>
								<Text>
									{label}:{' '}
									{index === 0 && (
										<Tooltip
											content='Mas información: Con el numero de orden realiza el pago.'
											positioning={{ placement: 'top-center' }}
											showArrow
											openDelay={0}
										>
											<span>
												<FiHelpCircle
													style={{
														display: 'inline',
														verticalAlign: 'middle',
														cursor: 'pointer',
													}}
												/>
											</span>
										</Tooltip>
									)}
								</Text>
								<Text fontWeight='semibold'>{value}</Text>
							</React.Fragment>
						))}
					</Grid>
					<Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
						{[
							{
								label: 'Descuento',
								value: data?.discount_value
									? `${data.discount_value * 100}%`
									: '—',
							},
							{
								label: 'Monto a pagar',
								value: data?.total_amount ? `S/. ${data.total_amount}` : '—',
							},
						].map(({ label, value }, index) => (
							<React.Fragment key={index}>
								<Text>
									{label}:{' '}
									{index === 0 && (
										<Tooltip
											content='Mas información: Descuento se aplica si eres Egresado UNI'
											positioning={{ placement: 'top-center' }}
											showArrow
											openDelay={0}
										>
											<span>
												<FiHelpCircle
													style={{
														display: 'inline',
														verticalAlign: 'middle',
														cursor: 'pointer',
													}}
												/>
											</span>
										</Tooltip>
									)}
								</Text>
								<Text fontWeight='semibold'>{value}</Text>
							</React.Fragment>
						))}
					</Grid>
				</SimpleGrid>
				<Separator mt={5}></Separator>
				{!data?.voucher?.file_path ? (
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='flex-start'
						align={'end'}
						gap={6}
						mt={2}
					>
						<Field label='Subir Voucher de pago:'>
							<Input
								type='file'
								accept='application/pdf,image/png,image/jpeg,image/jpg'
								size='sm'
								onChange={(e) => {
									const file = e.target.files[0];
									const allowedTypes = [
										'application/pdf',
										'image/png',
										'image/jpeg',
										'image/jpg',
									];

									if (file && allowedTypes.includes(file.type)) {
										setFilePDF(file);
									} else {
										toaster.create({
											title:
												'Solo se permiten archivos PDF o imágenes (JPG, PNG).',
											type: 'error',
										});
									}
								}}
							/>
						</Field>

						<IconButton
							size='sm'
							bg='uni.secondary'
							loading={isPending}
							disabled={!filePDF}
							onClick={handleSubmit}
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FaSave />
						</IconButton>
					</Flex>
				) : (
					<>
						<Heading size='sm' color='green.500'>
							Espera a que verifiquen el pago para continuar
						</Heading>
						<Grid
							templateColumns={{ base: '1fr', md: '200px 1fr' }}
							gap={4}
							mt={5}
						>
							{[
								{
									label: 'Voucher',
									value: (
										<HStack spacing={2}>
											<Button
												size='xs'
												bg='uni.primary'
												as='a'
												href={data?.voucher?.file_path || '#'}
												target='_blank'
												rel='noopener noreferrer'
											>
												Ver Voucher
											</Button>
											<ConfirmModal
												placement='center'
												trigger={
													<IconButton
														disabled={data?.voucher?.is_verified}
														colorPalette='red'
														size='xs'
													>
														<FiTrash2 />
													</IconButton>
												}
												open={openDelete}
												onOpenChange={(e) => setOpenDelete(e.open)}
												onConfirm={() => handleDeleteVoucher(data?.voucher?.id)}
												loading={isPendingDelete}
											>
												<Text>
													¿Estás seguro que quieres eliminar el
													<Span fontWeight='semibold' px='1'>
														Voucher
													</Span>
													?
												</Text>
											</ConfirmModal>
										</HStack>
									),
								},
								{
									label: 'Estado',
									value: (
										<Badge
											bg={data?.voucher.is_verified ? '#D0EDD0' : '#F7CDCE'}
											color={data?.voucher.is_verified ? '#2D9F2D' : '#E0383B'}
										>
											{data?.voucher.is_verified
												? 'Verificado'
												: 'No verificado'}
										</Badge>
									),
								},
							].map(({ label, value }, index) => (
								<React.Fragment key={index}>
									<Text>{label}: </Text>
									<Text fontWeight='semibold'>{value}</Text>
								</React.Fragment>
							))}
						</Grid>
					</>
				)}
				{/*<Box mt={6}>
					<Text fontWeight='semibold' mb={2}>
						Pagos Realizados:
					</Text>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader>Voucher</Table.ColumnHeader>
								<Table.ColumnHeader>Estado</Table.ColumnHeader>
								<Table.ColumnHeader>Acciones</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{data.voucher?.map((item, index) => (
								<Table.Row
									key={item.id}
									bg={{ base: 'white', _dark: 'its.gray.500' }}
								>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell>{item.modality_name}</Table.Cell>
									<Table.Cell>{item.vacancies}</Table.Cell>

									<Table.Cell>
										<Flex gap={2}>
											<IconButton
												size='xs'
												disabled={data.status === 4}
												colorPalette='red'
												onClick={() => handleDelete(item.id)}
												aria-label='Eliminar'
											>
												<FiTrash2 />
											</IconButton>
										</Flex>
									</Table.Cell>
								</Table.Row>
							))}
							{!data.voucher?.length && (
								<Table.Row>
									<Table.Cell colSpan={7} textAlign='center'>
										Sin datos disponibles
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Box>*/}
			</Stack>
		</Modal>
	);
};

UploadVoucherForm.propTypes = {
	data: PropTypes.object,
	refetch: PropTypes.func,
};
