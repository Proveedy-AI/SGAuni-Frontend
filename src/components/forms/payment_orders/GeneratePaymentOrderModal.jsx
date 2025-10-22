import { Alert, Button, Field, Modal, toaster } from '@/components/ui';
import {
	Badge,
	Box,
	Card,
	Flex,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useCreatePaymentOrder } from '@/hooks/payment_orders';
import {
	FiAlertTriangle,
	FiCreditCard,
	FiFileText,
	FiPlus,
	FiUser,
} from 'react-icons/fi';
import { ReactSelect } from '@/components/select';

import { format } from 'date-fns';
import { useReadPaymentRequest } from '@/hooks/payment_requests';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { LuGraduationCap } from 'react-icons/lu';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import { useReadEnrollmentsProgramsbyId } from '@/hooks/enrollments_programs/useReadEnrollmentsProgramsbyId';

export const GeneratePaymentOrderModal = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: generatePaymentOrder, isSaving } =
		useCreatePaymentOrder();

	const { data: dataPaymentRequests } = useReadPaymentRequest(
		{ status: 1 },
		{ enabled: open }
	);

	const requests =
		dataPaymentRequests?.pages?.flatMap((page) => page.results) ?? [];

	const [orderIdInput, setOrderIdInput] = useState('');
	const [discountInput, setDiscountInput] = useState(0);
	const [dueDateInput, setDueDateInput] = useState('');
	const [selectedRequest, setSelectedRequest] = useState(null);

	const requestOptions = requests.map((request) => ({
		value: request.id,
		label: `${request.purpose_display} - ${request.payment_method_display} - ${request.num_document}`,
		description: request.description,
		purpose: request.purpose,
		purpose_display: request.purpose_display,
		amount: request.amount,
		program_name: request.program_name,
		enrollment_process_program: request.enrollment_process_program,
		admission_process_program: request.admission_process_program,
		enrollment_process_name: request.enrollment_process_name,
		admission_process_name: request.admission_process_name,
		num_document: request.num_document,
		payment_method_display: request.payment_method_display,
	}));

	const { data: dataAdmissionPrograms } = useReadAdmissionProgramsById();
	selectedRequest?.admission_process_program;

	const { data: dataEnrollmentPrograms } = useReadEnrollmentsProgramsbyId();
	selectedRequest?.enrollment_process_program;

	const isUniPaymentMethod =
		requests.find((request) => request.id === selectedRequest?.value)
			?.payment_method === 2;

	const handleReset = () => {
		setOrderIdInput('');
		setDiscountInput('');
		setDueDateInput('');
		setSelectedRequest(null);
	};

	useEffect(() => {
		if (!selectedRequest) return;
		// función para calcular el último día de un mes
		const getLastDayOfMonth = (date) => {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0);
		};

		let today = new Date();
		let dueDate = getLastDayOfMonth(today); // por defecto este mes

		// ejemplo: reglas distintas según el propósito
		if (selectedRequest.purpose === 4 || selectedRequest.purpose === 9) {
			// propósito 4 → fin de este mes
			dueDate = getLastDayOfMonth(dueDate);
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		} else if (selectedRequest.purpose === 5) {
			// propósito 5 → fin del próximo mes
			dueDate = getLastDayOfMonth(dueDate);
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		} else if (selectedRequest.purpose === 1 || selectedRequest.purpose === 2) {
			dueDate = dataAdmissionPrograms?.registration_end_date;
			setDueDateInput(dueDate);
		} else if (selectedRequest.purpose === 7) {
			dueDate = dataEnrollmentPrograms?.registration_end_date;
			setDueDateInput(dueDate);
		} else {
			// otros propósitos, puedes definir una fecha por defecto
			dueDate = new Date();
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		}
	}, [selectedRequest, open, dataAdmissionPrograms, dataEnrollmentPrograms]);

	useEffect(() => {
		if (!open) {
			handleReset();
		}
	}, [open]);

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};

		if (!selectedRequest)
			newErrors.selectedRequest = 'Selecciona una solicitud de pago';
		if (
			!discountInput ||
			isNaN(discountInput) ||
			discountInput < 0 ||
			discountInput > 100
		) {
			newErrors.discountInput = 'El descuento debe estar entre 0 y 100';
		}
		if (!dueDateInput)
			newErrors.dueDateInput = 'Selecciona una fecha de vencimiento';
		if (!isUniPaymentMethod && !orderIdInput) {
			newErrors.orderIdInput = 'Ingresa el id de orden';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		if (!selectedRequest || !discountInput || !dueDateInput) {
			toaster.create({
				title: 'Completar los campos necesarios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			request: selectedRequest.value,
			id_orden: orderIdInput || null,
			status: 2,
			discount_value: (Number(discountInput) / 100).toString(),
			due_date: dueDateInput,
		};

		generatePaymentOrder(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Orden generada con éxito',
					type: 'success',
				});
				fetchData();
				handleReset();
			},
			onError: (error) => {
				toaster.create({
					title: error.response?.data?.[0] || 'Error en la creación del examen',
					type: 'error',
				});
			},
		});
	};

	const formatMonetaryNumbers = (text) => {
		if (!text) return text;

		return text.replace(/(-?\s*S\/\s*)(\d+(?:\.\d+)?)/g, (_, prefix, num) => {
			const value = Number(num);
			if (isNaN(value)) return prefix + num;

			return `${prefix}${value.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`;
		});
	};

	return (
		<Stack css={{ '--field-label-width': '180px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<Modal
					title='Generar Orden de Pago'
					placement='center'
					trigger={
						<Button
							bg='uni.secondary'
							color='white'
							size='xs'
							w={{ base: 'full', sm: 'auto' }}
						>
							<FiPlus /> Generar orden de pago
						</Button>
					}
					size='5xl'
					open={open}
					hiddenFooter={true}
					onOpenChange={(e) => setOpen(e.open)}
					contentRef={contentRef}
				>
					<Stack spacing={6} css={{ '--field-label-width': '150px' }}>
						<Flex direction='column' gap={4} mt={2}>
							<Field
								label='Seleccionar Solicitud de Pago'
								invalid={!!errors.selectedRequest}
								errorText={errors.selectedRequest}
							>
								<ReactSelect
									options={requestOptions}
									placeholder='Seleccionar solicitud de pago'
									isClearable={true}
									onChange={(option) => setSelectedRequest(option)}
								/>
							</Field>
							{selectedRequest && (
								<Card.Root
									w='full'
									mx='auto'
									bg='card'
									border='1px solid'
									borderColor='border'
								>
									{/* Header */}
									<Card.Header pb={4}>
										<Box
											display='flex'
											alignItems='center'
											justifyContent='space-between'
										>
											<Card.Title
												fontSize='xl'
												fontWeight='semibold'
												color='primary'
												fontFamily='sans'
											>
												Información de Pago
											</Card.Title>
											<Badge variant='subtle' colorPalette='purple'>
												{selectedRequest.purpose_display}
											</Badge>
										</Box>
									</Card.Header>

									{/* Body */}
									<Card.Body>
										<SimpleGrid columns={2} rowGap={6} columnGap={8}>
											{/* Monto */}
											<Box
												display='flex'
												justifyContent='space-between'
												bg='muted'
												rounded='lg'
											>
												<Box display='flex' alignItems='center' gap={2} mb={1}>
													<FiCreditCard
														size={20}
														color='var(--chakra-colors-primary)'
													/>
													<Text fontSize='sm' color='muted.600' mt={1}>
														Monto
													</Text>
												</Box>

												<Text
													fontSize='2xl'
													fontWeight='bold'
													color='primary'
													fontFamily='mono'
												>
													S/ {selectedRequest.amount}
												</Text>
											</Box>

											{/* Programa */}
											<Box
												display='flex'
												justifyContent='space-between'
												bg='muted'
												rounded='lg'
											>
												<Box display='flex' alignItems='center' gap={2} mb={1}>
													<LuGraduationCap
														size={18}
														color='var(--chakra-colors-secondary)'
													/>
													<Text fontSize='sm' fontWeight='medium'>
														Programa
													</Text>
												</Box>
												<Text fontSize='sm' color='muted.600'>
													{selectedRequest.program_name}
												</Text>
											</Box>

											{/* Proceso */}
											<Box
												display='flex'
												justifyContent='space-between'
												bg='muted'
												rounded='lg'
											>
												<Box display='flex' alignItems='center' gap={2} mb={1}>
													<FiFileText
														size={18}
														color='var(--chakra-colors-secondary)'
													/>
													<Text fontSize='sm' fontWeight='medium'>
														Proceso
													</Text>
												</Box>
												<Text fontSize='sm' color='muted.600'>
													{selectedRequest.enrollment_process_name
														? `Matrícula  ${selectedRequest.enrollment_process_name}`
														: selectedRequest.admission_process_name
															? `Admisión  ${selectedRequest.admission_process_name}`
															: 'Sin información'}
												</Text>
											</Box>

											{/* Documento */}
											<Box
												display='flex'
												justifyContent='space-between'
												bg='muted'
												rounded='lg'
											>
												<Box display='flex' alignItems='center' gap={2} mb={1}>
													<FiUser
														size={18}
														color='var(--chakra-colors-secondary)'
													/>
													<Text fontSize='sm' fontWeight='medium'>
														Documento
													</Text>
												</Box>
												<Text fontSize='sm' color='muted.600' fontFamily='mono'>
													{selectedRequest.num_document}
												</Text>
											</Box>
										</SimpleGrid>

										{/* Método de pago */}
										<Box
											mt={6}
											pt={3}
											borderTop='1px'
											borderColor='border'
											display='flex'
											justifyContent='space-between'
										>
											<Text fontSize='sm' color='muted.600'>
												Método de pago
											</Text>
											<Badge variant='outline' fontSize='xs'>
												{selectedRequest.payment_method_display}
											</Badge>
										</Box>
									</Card.Body>
								</Card.Root>
							)}

							{!isUniPaymentMethod && (
								<Field
									label='Id de Orden'
									invalid={!!errors.orderIdInput}
									errorText={errors.orderIdInput}
								>
									<Input
										placeholder='Ingresar id de Ordesn'
										value={orderIdInput}
										onChange={(e) => setOrderIdInput(e.target.value)}
									/>
								</Field>
							)}
							{selectedRequest?.description && (
								<Alert
									title='Información Importante'
									status='info'
									Icon={<FiAlertTriangle />}
								>
									{formatMonetaryNumbers(selectedRequest.description)}
								</Alert>
							)}
							<SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} w='100%'>
								<Field
									label='Descuento (0 - 100)%'
									invalid={!!errors.discountInput}
									errorText={errors.discountInput}
								>
									<Input
										type='number'
										min={0}
										max={100}
										placeholder='Ingresar descuento'
										value={discountInput}
										onChange={(e) => setDiscountInput(e.target.value)}
									/>
								</Field>
								<Field
									label='Fecha de Vencimiento'
									invalid={!!errors.dueDateInput}
									errorText={errors.dueDateInput}
									required
								>
									<CustomDatePicker
										selectedDate={dueDateInput}
										onDateChange={(date) => {
											const formatted = format(date, 'yyyy-MM-dd');
											setDueDateInput(formatted);
										}}
										buttonSize='md'
										minDate={new Date()}
										size={{ base: '330px', md: '420px' }}
									/>
								</Field>
							</SimpleGrid>
							<Flex
								gap={2}
								mt={4}
								justify={{ base: 'center', sm: 'flex-end' }}
								flexWrap='wrap'
							>
								<IconButton
									size='sm'
									bg='green'
									loading={isSaving}
									disabled={!selectedRequest || !discountInput || !dueDateInput}
									onClick={handleSubmit}
									css={{ _icon: { width: '5', height: '5' } }}
								>
									<FaSave />
								</IconButton>
								<IconButton
									size='sm'
									bg='red'
									onClick={handleReset}
									disabled={!orderIdInput && !discountInput && !dueDateInput}
									css={{ _icon: { width: '5', height: '5' } }}
								>
									<FaTimes />
								</IconButton>
							</Flex>
						</Flex>
					</Stack>
				</Modal>
			</Field>
		</Stack>
	);
};

GeneratePaymentOrderModal.propTypes = {
	requests: PropTypes.arrayOf(PropTypes.object),
	fetchData: PropTypes.func,
};
