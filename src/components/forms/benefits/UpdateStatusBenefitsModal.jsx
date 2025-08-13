import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	IconButton,
	Stack,
	Button,
	Text,
	Textarea,
	Flex,
	Icon,
	Card,
	Heading,
	SimpleGrid,
	Badge,
	HStack,
	Input,
} from '@chakra-ui/react';
import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { LiaCheckCircleSolid } from 'react-icons/lia';
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiEdit3,
	FiMessageSquare,
	FiXCircle,
} from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useAproveeBenefits } from '@/hooks/benefits';

export const UpdateStatusBenefitsModal = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState('');
	const [type, setType] = useState(null);
	const [other_founding_source, setOtherFoundingSource] = useState('');
	const [discount_percentage, setDiscountPercentage] = useState('');
	const [disableUpload, setDisableUpload] = useState(false);
	const [review_document_url, setReviewDocumentUrl] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null); // 4: Aprobado, 3: Rechazado
	const [errors, setErrors] = useState({});

	const { mutate: aproveeBenefits, isPending } = useAproveeBenefits();

	const validateFields = () => {
		const newErrors = {};
		if (selectedStatus === 3 && !comments.trim()) {
			newErrors.comments = 'El comentario es requerido para rechazar.';
		}
		if (selectedStatus === 4 && !type) {
			newErrors.type = 'El tipo de beneficio es requerido.';
		}
		if (selectedStatus === 4 && !discount_percentage) {
			newErrors.discount_percentage =
				'El porcentaje de descuento es requerido.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitStatus = async () => {
		if (!validateFields()) return;
		setDisableUpload(true);
		let s3Url = review_document_url;
		try {
			// Solo subir a S3 si hay un archivo nuevo
			if (review_document_url) {
				s3Url = await uploadToS3(
					review_document_url,
					'sga_uni/benefits_review_documents',
					data?.student_name.replace(/\s+/g, '_') // evita espacios
				);
			}

			const payload =
				selectedStatus === 4
					? {
							comments: selectedStatus === 3 ? comments.trim() : '',
							status: selectedStatus,
							founding_source: selectedStatus === 4 ? type?.value : null,
							other_founding_source:
								selectedStatus === 4 ? other_founding_source : '',
							discount_percentage:
								selectedStatus === 4 ? discount_percentage / 100 : '',
							review_document_url: selectedStatus === 4 ? s3Url : '',
						}
					: {
							status: selectedStatus,
							comments: comments.trim(),
						};

			aproveeBenefits(
				{ id: data.request_benefit, payload },
				{
					onSuccess: () => {
						toaster.create({
							title:
								selectedStatus === 4
									? 'Beneficio aprobado correctamente'
									: 'Beneficio rechazado correctamente',
							type: 'success',
						});
						setOpen(false);
						setComments('');
						setType(null);
						setOtherFoundingSource('');
						setDiscountPercentage('');
						setReviewDocumentUrl('');
						setDisableUpload(false);
						setSelectedStatus(null);
						fetchData();
					},
					onError: (error) => {
						console.error(error);
						toaster.create({
							title: error.response?.data?.[0] || 'Error al actualizar estado',
							type: 'error',
						});
						setDisableUpload(false);
					},
				}
			);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			setDisableUpload(false);
			toaster.create({
				title: 'Error al subir el contrato',
				type: 'error',
			});
		}
	};

	const handleOpenChange = (e) => {
		setOpen(e.open);
		if (!e.open) {
			setSelectedStatus(null);
			setComments('');
		}
	};

	const TypeRequest = [
		{ value: 1, label: 'Universidad' },
		{ value: 2, label: 'Público Nacional' },
		{ value: 3, label: 'Otro' },
	];
	return (
		<Modal
			placement='center'
			title={
				<>
					<HStack>
						<Icon as={FiCheckCircle} boxSize={5} />
						<Text fontWeight='medium'>Aprobar o Rechazar Proceso</Text>
					</HStack>
				</>
			}
			trigger={
				<Box>
					<Tooltip
						content='Aprobar / Rechazar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							disabled={data.status_review_benefit !== 2}
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<LiaCheckCircleSolid />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='3xl'
			loading={disableUpload}
			open={open}
			onOpenChange={handleOpenChange}
			contentRef={contentRef}
			onSave={handleSubmitStatus}
		>
			<Stack
				gap={2}
				pb={6}
				maxH='70vh'
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root>
					<Card.Header>
						<Heading fontSize='lg'>Selecciona una Acción</Heading>
					</Card.Header>

					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
							<Button
								variant='outline'
								size='lg'
								height='4rem'
								flexDirection='column'
								gap={2}
								disabled={isPending}
								bg={selectedStatus === 4 ? 'green.600' : 'transparent'}
								_hover={
									selectedStatus === 4
										? { bg: 'green.700' }
										: {
												bg: 'green.50',
												borderColor: 'green.300',
												color: 'green.700',
											}
								}
								color={selectedStatus === 4 ? 'white' : undefined}
								borderColor={selectedStatus === 4 ? 'green.600' : undefined}
								onClick={() => setSelectedStatus(4)}
							>
								<Icon as={FiCheckCircle} boxSize={5} />
								<Text fontWeight='medium'>Aprobar Beneficio</Text>
							</Button>

							<Button
								variant='outline'
								size='lg'
								height='4rem'
								flexDirection='column'
								gap={2}
								disabled={isPending}
								bg={selectedStatus === 3 ? 'red.600' : 'transparent'}
								_hover={
									selectedStatus === 3
										? { bg: 'red.700' }
										: { bg: 'red.50', borderColor: 'red.300', color: 'red.700' }
								}
								color={selectedStatus === 3 ? 'white' : undefined}
								borderColor={selectedStatus === 3 ? 'red.600' : undefined}
								onClick={() => setSelectedStatus(3)}
							>
								<Icon as={FiXCircle} boxSize={5} />
								<Text fontWeight='medium'>Rechazar Beneficio</Text>
							</Button>
						</SimpleGrid>

						{selectedStatus && (
							<Alert
								mt={6}
								status='info'
								bg={selectedStatus === 4 ? 'green.50' : 'red.50'}
								borderColor={selectedStatus === 4 ? 'green.200' : 'red.200'}
								borderWidth='1px'
								color={selectedStatus === 4 ? 'green.600' : 'red.600'}
								icon={<FiAlertTriangle boxSize={4} mr={2} />}
							>
								<Text color={selectedStatus === 4 ? 'green.800' : 'red.800'}>
									{selectedStatus === 4
										? 'El Beneficio será aprobado y se notificará automáticamente.'
										: 'El Beneficio será rechazado. Por favor, proporciona un comentario explicativo.'}
								</Text>
							</Alert>
						)}
					</Card.Body>
				</Card.Root>

				{selectedStatus === 4 && (
					<Card.Root borderLeft='4px solid' borderLeftColor='green.500'>
						<Card.Header>
							<Flex align='center' gap={2}>
								<Icon as={FiEdit3} boxSize={5} color='green.700' />
								<Heading fontSize='lg' color='gren.700'>
									Completar Datos
								</Heading>
								<Badge colorPalette='green' variant='solid' ml={2}>
									Requerido
								</Badge>
							</Flex>
						</Card.Header>
						<Card.Body>
							<Stack gap={2}>
								<Field
									label='Fuente de Financiamiento'
									errorText={errors.type}
									invalid={!!errors.type}
									required
								>
									<ReactSelect
										value={type}
										onChange={(select) => {
											setType(select);
										}}
										variant='flushed'
										size='xs'
										isSearchable={true}
										isClearable
										name='Fuente de Financiamiento'
										options={TypeRequest}
									/>
								</Field>
								{type?.value === 3 && (
									<Field label='Otra fuente de financiamiento'>
										<Input
											type='text'
											name='other_founding_source'
											placeholder='Ingrese la fuente de financiamiento'
											value={other_founding_source}
											onChange={(e) => setOtherFoundingSource(e.target.value)}
										/>
									</Field>
								)}

								<Field label='Porcentaje de descuento (1 -100%)' required>
									<Input
										type='text'
										name='discount_percentage'
										placeholder='Ingrese el porcentaje de descuento'
										value={discount_percentage}
										onChange={(e) => setDiscountPercentage(e.target.value)}
									/>
								</Field>
								<Field label='Adjuntar documento del Beneficio (Opcional)'>
									<CompactFileUpload
										name='review_document_url'
										accept='application/pdf,image/png,image/jpeg,image/jpg'
										onChange={(file) => {
											const allowedTypes = [
												'application/pdf',
												'image/png',
												'image/jpeg',
												'image/jpg',
											];
											if (!file) {
												setReviewDocumentUrl(null);
												return;
											}

											if (allowedTypes.includes(file.type)) {
												setReviewDocumentUrl(file);
											} else {
												setReviewDocumentUrl(null);
												toaster.create({
													title:
														'Solo se permiten archivos PDF o imágenes (JPG, PNG).',
													type: 'error',
												});
											}
										}}
										onClear={() => setReviewDocumentUrl('')}
									/>
								</Field>
							</Stack>
						</Card.Body>
					</Card.Root>
				)}

				{selectedStatus === 3 && (
					<Card.Root borderLeft='4px solid' borderLeftColor='red.500'>
						<Card.Header>
							<Flex align='center' gap={2}>
								<Icon as={FiMessageSquare} boxSize={5} color='red.700' />
								<Heading fontSize='lg' color='red.700'>
									Comentario de Rechazo
								</Heading>
								<Badge colorPalette='red' variant='solid' ml={2}>
									Requerido
								</Badge>
							</Flex>
						</Card.Header>
						<Card.Body>
							<Box>
								<Heading fontSize='sm' fontWeight='medium' color='gray.700'>
									Explica las razones del rechazo
								</Heading>
								<Textarea
									minHeight='100px'
									resize='none'
									focusBorderColor='red.500'
									value={comments}
									onChange={(e) => setComments(e.target.value)}
									placeholder='Describe las razones por las cuales el Beneficio no puede ser aprobado...'
									disabled={isPending}
								/>
								<Text fontSize='xs' color='gray.500' mt={1}>
									Este comentario será visible para el solicitante.
								</Text>
							</Box>
						</Card.Body>
					</Card.Root>
				)}

				<Card.Root
					borderLeft='4px solid'
					borderLeftColor='yellow.500'
					bg='yellow.50'
				>
					<Card.Header pb={3}>
						<Flex align='center' gap={2}>
							<Icon as={FiMessageSquare} boxSize={5} color='yellow.700' />
							<Heading fontSize='lg' color='yellow.700'>
								Vista Previa - Ejemplo con Rechazo
							</Heading>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Stack spacing={3}>
							<Text fontSize='sm' color='yellow.800'>
								<strong>Ejemplo de comentario de rechazo:</strong>
							</Text>
							<Box
								bg='white'
								p={3}
								rounded='md'
								border='1px solid'
								borderColor='yellow.200'
							>
								<Text fontSize='sm' color='gray.700'>
									&quot;El beneficio no cumple con los requisitos mínimos
									establecidos. Se requiere:
									<br />
									• Actualización del plan de estudios
									<br />
									• Certificación de laboratorios
									<br />
									• Documentación de convenios internacionales
									<br />
									<br />
									Por favor, subsane estos puntos y vuelva a enviar la
									solicitud.&quot;
								</Text>
							</Box>
						</Stack>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

UpdateStatusBenefitsModal.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
