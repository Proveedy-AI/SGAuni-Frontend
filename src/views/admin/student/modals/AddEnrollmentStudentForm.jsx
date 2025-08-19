import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	Button,
	Card,
	Flex,
	Grid,
	GridItem,
	Stack,
	Switch,
	Text,
} from '@chakra-ui/react';
import { Modal, toaster } from '@/components/ui';
import {
	FiCalendar,
	FiFileText,
	FiPlus,
	FiSettings,
	FiUser,
} from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadCurrentEnrollmentProgram } from '@/hooks/enrollments_programs';
import { FaGraduationCap } from 'react-icons/fa';
import { formatDateString } from '@/components/ui/dateHelpers';
import { useCreateEnrollments } from '@/hooks/enrollments_proccess';

export const AddEnrollmentStudentForm = ({
	dataStudent,
	selectProgram,
	fetchData,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [selectedStatus, setSelectedStatus] = useState(null);
	const [firstEnrollment, setFirstEnrollment] = useState(false);
	const [paymentValid, setPaymentValid] = useState(false);
	const [errors, setErrors] = useState({});
	const { mutate: createEnrollments, isPending } = useCreateEnrollments();
	const { data: dataPrograms } = useReadCurrentEnrollmentProgram(
		selectProgram?.value,
		open
	);

	const validateFields = () => {
		const newErrors = {};
		if (!selectedStatus) {
			newErrors.selectedStatus = 'El estado del proceso es obligatorio';
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			student: dataStudent.id,
			enrollment_period_program: dataPrograms?.data?.id,
			status: selectedStatus.value,
			is_first_enrollment: firstEnrollment,
			payment_verified: paymentValid,
		};

		createEnrollments(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Matricula creada con éxito',

					type: 'success',
				});
				setOpen(false);
				fetchData();
				setSelectedStatus(null);
			},
			onError: (error) => {
				const errorData = error.response?.data;

				if (errorData && typeof errorData === 'object') {
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
					toaster.create({
						title: 'Error al crear la matrícula',
						type: 'error',
					});
				}
			},
		});
	};

	const dataStatus = [
		{ label: 'Pago Pendiente', value: 1 },
		{ label: 'Pago Parcial', value: 2 },
		{ label: 'Elegible', value: 4 },
	];

	return (
		<Modal
			title='Agregar Matrícula a Estudiante'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Añadir Matricula
				</Button>
			}
			onSave={handleSubmitData}
			size='4xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
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
					<Card.Body>
						<Stack gap={4}>
							<Box p={4} bg='muted' rounded='lg'>
								<Flex align='center' gap={3} mb={3}>
									<FiUser size={18} color='blue' />
									<Text fontWeight='semibold' fontSize='sm' color='foreground'>
										Información del Estudiante
									</Text>
								</Flex>

								<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3}>
									<Box>
										<Text fontSize='sm' fontWeight='medium' color='foreground'>
											Nombre
										</Text>
										<Text fontSize='sm' color='muted-foreground'>
											{dataStudent.student_name}
										</Text>
									</Box>

									<Box>
										<Text fontSize='sm' fontWeight='medium' color='foreground'>
											Documento
										</Text>
										<Text
											fontSize='sm'
											color='muted-foreground'
											fontFamily='mono'
										>
											{dataStudent?.document_number}
										</Text>
									</Box>
								</Grid>
							</Box>
							<Box>
								<Flex align='center' gap={3}>
									<FaGraduationCap size={20} color='blue' />
									<Box flex='1'>
										<Text fontSize='sm' fontWeight='medium' color='foreground'>
											Periodo Activo disponible
										</Text>
										<Text
											fontSize='lg'
											color='muted-foreground'
											lineHeight='tall'
										>
											{dataPrograms?.data.program_name} -{' '}
											{dataPrograms?.data.enrollment_period_name}
										</Text>
									</Box>
								</Flex>
							</Box>
							<Box>
								<Flex align='center' gap={3} mb={4}>
									<FiCalendar
										size={20}
										color='var(--chakra-colors-secondary)'
									/>
									<Text fontWeight='semibold' color='foreground'>
										Fechas Importantes
									</Text>
								</Flex>

								<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
									<Box
										p={3}
										border='1px solid'
										borderColor='border'
										rounded='lg'
									>
										<Text
											fontSize='xs'
											fontWeight='medium'
											color='muted-foreground'
											textTransform='uppercase'
											letterSpacing='wide'
										>
											Registro
										</Text>
										<Text fontSize='sm' color='foreground' mt={1}>
											{formatDateString(
												dataPrograms?.data?.registration_start_date
											)}{' '}
											-{' '}
											{formatDateString(
												dataPrograms?.data?.registration_end_date
											)}
										</Text>
									</Box>

									<Box
										p={3}
										border='1px solid'
										borderColor='border'
										rounded='lg'
									>
										<Text
											fontSize='xs'
											fontWeight='medium'
											color='muted-foreground'
											textTransform='uppercase'
											letterSpacing='wide'
										>
											Examen
										</Text>
										<Text fontSize='sm' color='foreground' mt={1}>
											{formatDateString(dataPrograms?.data?.examen_start_date)}{' '}
											- {formatDateString(dataPrograms?.data?.examen_end_date)}
										</Text>
									</Box>

									<GridItem colSpan={{ base: 1, md: 2 }}>
										<Box
											p={3}
											border='1px solid'
											borderColor='border'
											rounded='lg'
										>
											<Text
												fontSize='xs'
												fontWeight='medium'
												color='muted-foreground'
												textTransform='uppercase'
												letterSpacing='wide'
											>
												Inicio de Semestre
											</Text>
											<Text fontSize='sm' color='foreground' mt={1}>
												{formatDateString(
													dataPrograms?.data?.semester_start_date
												)}
											</Text>
										</Box>
									</GridItem>
								</Grid>
							</Box>
							<Box pt={4} borderTop='1px solid' borderColor='border'>
								<Flex align='center' gap={3} mb={4}>
									<FiSettings size={20} color='blue' />
									<Text fontWeight='semibold' color='foreground'>
										Configuración
									</Text>
								</Flex>

								<Stack gap={4} w='full'>
									{/* Status Select */}
									<Flex
										direction={{ base: 'column', md: 'row' }}
										align={{ base: 'flex-start', md: 'center' }}
										justify='space-between'
										gap={2}
									>
										<Flex align='center' gap={2}>
											<FiFileText size={16} color='blue' />
											<Text
												fontSize='sm'
												fontWeight='medium'
												color='foreground'
											>
												Estado del Proceso
											</Text>
										</Flex>
										<Box w={{ base: 'full', md: '500px' }}>
											<ReactSelect
												value={selectedStatus}
												onChange={(select) => setSelectedStatus(select)}
												variant='flushed'
												size='sm'
												isSearchable
												isClearable
												options={dataStatus}
											/>

											{errors?.selectedStatus && (
												<Text fontSize='xs' color='red.500' mt={1}>
													{errors.selectedStatus}
												</Text>
											)}
										</Box>
									</Flex>

									{/* First Enrollment */}
									<Flex
										direction={{ base: 'column', md: 'row' }}
										align={{ base: 'flex-start', md: 'center' }}
										justify='space-between'
										gap={2}
									>
										<Text fontSize='sm' fontWeight='medium' color='foreground'>
											Primera matrícula
										</Text>
										<Switch.Root
											checked={firstEnrollment}
											onCheckedChange={(checked) =>
												setFirstEnrollment(checked.checked)
											}
											display='flex'
											justifyContent='space-between'
										>
											<Switch.Label>
												{firstEnrollment ? 'Sí' : 'No'}
											</Switch.Label>
											<Switch.HiddenInput />
											<Switch.Control
												_checked={{ bg: 'uni.secondary' }}
												bg='uni.gray.400'
											/>
										</Switch.Root>
									</Flex>

									{/* Payment Verified */}
									<Flex
										direction={{ base: 'column', md: 'row' }}
										align={{ base: 'flex-start', md: 'center' }}
										justify='space-between'
										gap={2}
									>
										<Text fontSize='sm' fontWeight='medium' color='foreground'>
											Pago verificado
										</Text>
										<Switch.Root
											checked={paymentValid}
											onCheckedChange={(checked) =>
												setPaymentValid(checked.checked)
											}
											display='flex'
											justifyContent='space-between'
										>
											<Switch.Label>{paymentValid ? 'Sí' : 'No'}</Switch.Label>
											<Switch.HiddenInput />
											<Switch.Control
												_checked={{ bg: 'uni.secondary' }}
												bg='uni.gray.400'
											/>
										</Switch.Root>
									</Flex>
								</Stack>
							</Box>
						</Stack>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

AddEnrollmentStudentForm.propTypes = {
	fetchData: PropTypes.func.isRequired,
	selectProgram: PropTypes.object,
	dataStudent: PropTypes.object,
};
