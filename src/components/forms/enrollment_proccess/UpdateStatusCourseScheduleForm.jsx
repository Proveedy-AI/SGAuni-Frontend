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
} from '@chakra-ui/react';
import { Alert, Modal, toaster, Tooltip } from '@/components/ui';
import { LiaCheckCircleSolid } from 'react-icons/lia';
import {
	FiAlertTriangle,
	FiBookOpen,
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiHash,
	FiMessageSquare,
	FiUser,
	FiXCircle,
} from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { useAproveeCourseSchedule } from '@/hooks/enrollments_programs/schedule/useAproveeCourseSchedule';

const daysOfWeek2 = [
	{ label: 'L', fullName: 'Lunes', value: '1' },
	{ label: 'M', fullName: 'Martes', value: '2' },
	{ label: 'M', fullName: 'Miércoles', value: '3' },
	{ label: 'J', fullName: 'Jueves', value: '4' },
	{ label: 'V', fullName: 'Viernes', value: '5' },
	{ label: 'S', fullName: 'Sábado', value: '6' },
	{ label: 'D', fullName: 'Domingo', value: '7' },
];

export const UpdateStatusCourseScheduleForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null); // 4: Aprobado, 3: Rechazado

	const { mutate: aproveeCourse, isPending } = useAproveeCourseSchedule();

	const handleSubmitStatus = () => {
		if (!selectedStatus) {
			toaster.create({
				title: 'Por favor selecciona una acción: aprobar o rechazar.',
				type: 'warning',
			});
			return;
		}

		if (selectedStatus === 3 && !comments.trim()) {
			toaster.create({
				title: 'Por favor ingresa un comentario para rechazar.',
				type: 'warning',
			});
			return;
		}

		const payload = {
			comments: selectedStatus === 3 ? comments.trim() : '',
			status: selectedStatus,
		};

		aproveeCourse(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title:
							selectedStatus === 4
								? 'Horario aprobado correctamente'
								: 'Horario rechazado correctamente',
						type: 'success',
					});
					setOpen(false);
					setComments('');
					setSelectedStatus(null);
					fetchData();
				},
				onError: (error) => {
					console.error(error);
					toaster.create({
						title: error.response?.data?.[0] || 'Error al actualizar estado',
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
	const dayLabel =
		daysOfWeek2.find((d) => d.value === String(data?.day_of_week))?.fullName ??
		`Día ${data?.day_of_week}`;
	return (
		<Modal
			placement='center'
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
							disabled={data.status_review !== 2}
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<LiaCheckCircleSolid />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='2xl'
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
				<Box
					top='0'
					bg='white'
					borderBottom='1px solid'
					borderColor='gray.200'
					px={6}
					pb={2}
					zIndex={1}
				>
					<Flex justify='space-between' align='flex-start'>
						<Box>
							<Flex align='center' gap={2}>
								<Icon as={FiCheckCircle} color='blue.600' boxSize={6} />
								<Text fontSize='2xl' fontWeight='bold'>
									Aprobar o Rechazar Horario
								</Text>
							</Flex>
						</Box>
					</Flex>
				</Box>

				<Card.Root borderLeft='4px solid' borderLeftColor='blue.500'>
					<Card.Header>
						<Flex align='center' gap={2}>
							<Icon as={LuGraduationCap} boxSize={5} color='blue.600' />
							<Heading fontSize='lg'>Información del Horario</Heading>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Box mb={2}>
							<Text fontSize='sm' fontWeight='medium' color='gray.600'>
								Curso
							</Text>
							<Text fontSize='lg' fontWeight='semibold' color='gray.900' mt={1}>
								{data?.course_name} ({data?.course_group_code})
							</Text>
						</Box>

						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiBookOpen} boxSize={3} />
									Créditos
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{data?.credits}
								</Text>
							</Box>

							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiHash} boxSize={3} />
									Ciclo
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{data?.cycle}
								</Text>
							</Box>

							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiCalendar} boxSize={3} />
									Día
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{dayLabel}
								</Text>
							</Box>

							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiClock} boxSize={3} />
									Horario
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{data?.start_time} - {data?.end_time}
								</Text>
							</Box>

							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiUser} boxSize={3} />
									Obligatorio
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{data?.is_mandatory ? 'Sí' : 'No'}
								</Text>
							</Box>

							<Box>
								<Text
									fontSize='sm'
									fontWeight='medium'
									color='gray.600'
									display='flex'
									alignItems='center'
									gap={1}
								>
									<Icon as={FiCalendar} boxSize={3} />
									Estado
								</Text>
								<Text
									fontSize='base'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{data?.status_review_display}
								</Text>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
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
								<Text fontWeight='medium'>Aprobar Horario</Text>
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
								<Text fontWeight='medium'>Rechazar Horario</Text>
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
										? 'El proceso será aprobado y se notificará automáticamente.'
										: 'El proceso será rechazado. Por favor, proporciona un comentario explicativo.'}
								</Text>
							</Alert>
						)}
					</Card.Body>
				</Card.Root>

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
									placeholder='Describe las razones por las cuales el proceso no puede ser aprobado...'
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
									&quot;El programa no cumple con los requisitos mínimos de
									acreditación establecidos. Se requiere:
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

UpdateStatusCourseScheduleForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
