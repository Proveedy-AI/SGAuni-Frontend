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
import { useAproveeFractionationRequest } from '@/hooks/fractionation_requests';

export const UpdateStatusFractionatopmModal = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState('');
	const [upfront_percentage, setUpfrontPercentage] = useState('');
	console.log(data);
	const [selectedStatus, setSelectedStatus] = useState(null); // 4: Aprobado, 3: Rechazado
	const [errors, setErrors] = useState({});

	const { mutate: aproveeFractionation, isPending } =
		useAproveeFractionationRequest();

	const validateFields = () => {
		const newErrors = {};
		if (selectedStatus === 2 && !comments.trim()) {
			newErrors.comments = 'El comentario es requerido para rechazar.';
		}
		if (selectedStatus === 3 && !upfront_percentage) {
			newErrors.upfront_percentage = 'El porcentaje inicial es requerido.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitStatus = () => {
		if (!validateFields()) return;

		const payload = {
			comments: selectedStatus === 2 ? comments.trim() : '',
			status: selectedStatus,
			upfront_percentage: selectedStatus === 3 ? upfront_percentage / 100 : '',
		};

		aproveeFractionation(
			{ id: data.plan, payload },
			{
				onSuccess: () => {
					toaster.create({
						title:
							selectedStatus === 3
								? 'Fraccionamiento aprobado correctamente'
								: 'Fraccionamiento rechazado correctamente',
						type: 'success',
					});
					setOpen(false);
					setComments('');

					setSelectedStatus(null);
					fetchData();
				},
				onError: (error) => {
					const data = error.response?.data;

					// Intentamos encontrar el primer string de error dentro de cualquier campo
					let message = 'Error al actualizar estado';
					if (data) {
						if (Array.isArray(data)) {
							message = data[0];
						} else if (typeof data === 'object') {
							const firstKey = Object.keys(data)[0];
							if (Array.isArray(data[firstKey])) {
								message = data[firstKey][0];
							} else if (typeof data[firstKey] === 'string') {
								message = data[firstKey];
							}
						}
					}

					toaster.create({
						title: message,
						type: 'error',
					});
				},
			}
		);
	};

	const handleOpenChange = (e) => {
		setOpen(e.open);
		if (!e.open) {
			setSelectedStatus(null);
			setComments('');
		}
	};

	return (
		<Modal
			placement='center'
			title={
				<>
					<HStack>
						<Icon as={FiCheckCircle} boxSize={5} />
						<Text fontWeight='medium'>Aprobar o Rechazar Fraccionamiento</Text>
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
							disabled={data.status !== 1}
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<LiaCheckCircleSolid />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='3xl'
			loading={isPending}
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
								bg={selectedStatus === 3 ? 'green.600' : 'transparent'}
								_hover={
									selectedStatus === 3
										? { bg: 'green.700' }
										: {
												bg: 'green.50',
												borderColor: 'green.300',
												color: 'green.700',
											}
								}
								color={selectedStatus === 3 ? 'white' : undefined}
								borderColor={selectedStatus === 3 ? 'green.600' : undefined}
								onClick={() => setSelectedStatus(3)}
							>
								<Icon as={FiCheckCircle} boxSize={5} />
								<Text fontWeight='medium'>Aprobar Proceso</Text>
							</Button>

							<Button
								variant='outline'
								size='lg'
								height='4rem'
								flexDirection='column'
								gap={2}
								disabled={isPending}
								bg={selectedStatus === 2 ? 'red.600' : 'transparent'}
								_hover={
									selectedStatus === 2
										? { bg: 'red.700' }
										: { bg: 'red.50', borderColor: 'red.300', color: 'red.700' }
								}
								color={selectedStatus === 2 ? 'white' : undefined}
								borderColor={selectedStatus === 2 ? 'red.600' : undefined}
								onClick={() => setSelectedStatus(2)}
							>
								<Icon as={FiXCircle} boxSize={5} />
								<Text fontWeight='medium'>Rechazar Proceso</Text>
							</Button>
						</SimpleGrid>

						{selectedStatus && (
							<Alert
								mt={6}
								status='info'
								bg={selectedStatus === 3 ? 'green.50' : 'red.50'}
								borderColor={selectedStatus === 3 ? 'green.200' : 'red.200'}
								borderWidth='1px'
								color={selectedStatus === 3 ? 'green.600' : 'red.600'}
								icon={<FiAlertTriangle boxSize={4} mr={2} />}
							>
								<Text color={selectedStatus === 3 ? 'green.800' : 'red.800'}>
									{selectedStatus === 3
										? 'El proceso será aprobado y se notificará automáticamente.'
										: 'El proceso será rechazado. Por favor, proporciona un comentario explicativo.'}
								</Text>
							</Alert>
						)}
					</Card.Body>
				</Card.Root>

				{selectedStatus === 3 && (
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
									label='Porcentaje de Pago Inicial (1 -100%)'
									errors={errors}
									required
								>
									<Input
										type='text'
										name='upfront_percentage'
										placeholder='Ingrese el porcentaje de pago inicial'
										value={upfront_percentage}
										onChange={(e) => setUpfrontPercentage(e.target.value)}
									/>
								</Field>
							</Stack>
						</Card.Body>
					</Card.Root>
				)}

				{selectedStatus === 2 && (
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
									&quot;El Fraccionamiento no cumple con los requisitos mínimos
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

UpdateStatusFractionatopmModal.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
