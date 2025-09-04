import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaTimes } from 'react-icons/fa';
import {
	useCreatePaymentOrder,
	useReadPaymentOrders,
} from '@/hooks/payment_orders';
import {
	FiAlertTriangle,
	FiArrowUp,
	FiCreditCard,
	FiDollarSign,
	FiFileText,
	FiPlus,
	FiUser,
} from 'react-icons/fi';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { LuGraduationCap } from 'react-icons/lu';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import { useReadEnrollmentsProgramsbyId } from '@/hooks/enrollments_programs/useReadEnrollmentsProgramsbyId';

export const GeneratePaymentOrderModalByRequest = ({
	fetchData,
	item,
	permissions,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: generatePaymentOrder, isPending } =
		useCreatePaymentOrder();
	const {
		data: dataPaymentOrders,
		isLoading: loadingPaymentOrders,
		refetch: fetchPaymentOrders,
	} = useReadPaymentOrders({ request: item.id }, { enabled: open });

	const allPaymentRequests =
		dataPaymentOrders?.pages?.flatMap((page) => page.results) ?? [];

	const sortedFilteredOrders = allPaymentRequests?.sort(
		(a, b) => a.status - b.status
	);

	const { data: dataAdmissionPrograms } = useReadAdmissionProgramsById(
		item.admission_process_program
	);

	const { data: dataEnrollmentPrograms } = useReadEnrollmentsProgramsbyId(
		item.enrollment_process_program
	);

	const [orderIdInput, setOrderIdInput] = useState('');
	const [discountInput, setDiscountInput] = useState();
	const [dueDateInput, setDueDateInput] = useState('');

	useEffect(() => {
		if (!item?.purpose) return;
		setDiscountInput(
			item.discount_value ? Number(item.discount_value).toString() : ''
		);
		// función para calcular el último día de un mes
		const getLastDayOfMonth = (date) => {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0);
		};

		let today = new Date();
		let dueDate = getLastDayOfMonth(today); // por defecto este mes

		// ejemplo: reglas distintas según el propósito
		if (item.purpose === 4 || item.purpose === 9) {
			// propósito 4 → fin de este mes
			dueDate = getLastDayOfMonth(dueDate);
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		} else if (item.purpose === 5) {
			// propósito 5 → fin del próximo mes
			dueDate = getLastDayOfMonth(dueDate);
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		} else if (item.purpose === 1 || item.purpose === 2) {
			dueDate = dataAdmissionPrograms?.registration_end_date;
			setDueDateInput(dueDate);
		} else if (item.purpose === 7) {
			dueDate = dataEnrollmentPrograms?.registration_end_date;
			setDueDateInput(dueDate);
		} else {
			// otros propósitos, puedes definir una fecha por defecto
			dueDate = new Date();
			setDueDateInput(dueDate.toISOString().split('T')[0]);
		}
	}, [item?.purpose, open, dataAdmissionPrograms, dataEnrollmentPrograms]);

	const handleReset = () => {
		setOrderIdInput('');
		setDiscountInput('');
		setDueDateInput('');
	};

	useEffect(() => {
		if (!open) {
			handleReset();
		}
	}, [open]);

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		if (item?.payment_method !== 2 && !orderIdInput)
			newErrors.orderId = 'El ID de la orden es requerido';
		if (!dueDateInput)
			newErrors.dueDate = 'La fecha de vencimiento es requerida';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) {
			toaster.create({
				title: 'Campos incompletos',
				description: 'Por favor, complete todos los campos requeridos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			request: item.id,
			discount_value: (Number(discountInput) / 100).toString() || '0',
			due_date: dueDateInput,
		};

    if(item?.payment_method !== 2) //Si no es Caja UNI, enviar el ID de orden
      payload.id_orden = orderIdInput;
    
		generatePaymentOrder(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Orden generada con éxito',
					type: 'success',
				});
				fetchPaymentOrders();
				fetchData();
				handleReset();
			},
			onError: (error) => {
				toaster.create({
					title:
						error.response?.data?.[0] ||
						'Error en la creación de la orden de pago',
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
						<Box>
							<Tooltip
								content='Generar orden de pago'
								positioning={{ placement: 'bottom-center' }}
								showArrow
								openDelay={0}
							>
								<IconButton colorPalette='purple' size='xs'>
									<FiArrowUp />
								</IconButton>
							</Tooltip>
						</Box>
					}
					size='5xl'
					open={open}
					hiddenFooter={true}
					onOpenChange={(e) => setOpen(e.open)}
					contentRef={contentRef}
				>
					<Stack
						gap={2}
						pb={6}
						maxH={{ base: 'full', md: '75vh' }}
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
							<Card.Header pb={0}>
								<Flex align='center' gap={2}>
									<Icon as={FiPlus} w={5} h={5} color='purple.600' />
									<Heading size='sm'>Generar Orden de Pago</Heading>
								</Flex>

								{item?.status === 3 && (
									<Alert
										title='Orden Verificado'
										status='success'
										Icon={<FiAlertTriangle />}
									>
										La orden ha sido verificada.
									</Alert>
								)}
								{item?.description && (
									<Alert
										title='Información Importante'
										status='info'
										Icon={<FiAlertTriangle />}
									>
										{formatMonetaryNumbers(item.description)}
									</Alert>
								)}
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
												{item.purpose_display}
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
													S/ {item.amount}
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
													{item.program_name}
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
													{item.enrollment_process_name
														? `Matrícula  ${item.enrollment_process_name}`
														: item.admission_process_name
															? `Admisión  ${item.admission_process_name}`
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
													{item.num_document}
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
												{item.payment_method_display}
											</Badge>
										</Box>
									</Card.Body>
								</Card.Root>
							</Card.Header>
							<Card.Body>
								<Flex
									direction={{ base: 'column', md: 'row' }}
									justify='flex-start'
									align={'end'}
									gap={2}
									mt={2}
								>
									{item?.payment_method !== 2 && (
										<Field
											label='Id de Orden'
											required={item?.payment_method !== 2}
											invalid={!!errors.orderId}
											errorMessage={errors.orderId}
										>
											<Input
												placeholder='Ingresar id de Orden'
												value={orderIdInput}
												onChange={(e) => setOrderIdInput(e.target.value)}
											/>
										</Field>
									)}
									<Field label='Descuento (0 - 100)%'>
										<Input
											type='number'
											min={0}
											max={100}
											placeholder='Opcional'
											minLength={0}
											maxLength={3}
											value={discountInput}
											onChange={(e) => setDiscountInput(e.target.value)}
										/>
									</Field>
									<Field
										label='Fecha de Vencimiento'
										required
										invalid={!!errors.dueDate}
										errorText={errors.dueDate} // usamos errorText para mantener la consistencia con tu otro código
									>
										<CustomDatePicker
											selectedDate={dueDateInput}
											onDateChange={(date) => {
												const formatted = format(date, 'yyyy-MM-dd');
												setDueDateInput(formatted);
											}}
											buttonSize='md'
											minDate={new Date()}
											size={{ base: '230px', md: '300px' }}
										/>
									</Field>
									<Flex gap={2}>
										<IconButton
											size='sm'
											bg='green'
											loading={isPending}
											disabled={
												(item?.payment_method !== 2 && !orderIdInput) ||
												!dueDateInput ||
												item?.status === 3
											}
											onClick={handleSubmit}
											css={{ _icon: { width: '5', height: '5' } }}
										>
											<FaSave />
										</IconButton>
										<IconButton
											size='sm'
											bg='red'
											onClick={handleReset}
											disabled={
												item?.payment_method !== 2 &&
												!orderIdInput &&
												!dueDateInput
											}
											css={{ _icon: { width: '5', height: '5' } }}
										>
											<FaTimes />
										</IconButton>
									</Flex>
								</Flex>
							</Card.Body>
						</Card.Root>

						<Card.Root>
							<Card.Header pb={8}>
								<Flex justify='space-between' align='center'>
									<Flex align='center' gap={2}>
										<Icon as={FiDollarSign} w={5} h={5} color='blue.600' />
										<Heading size='sm'>Ordenes de pago generadas</Heading>
										<Badge
											variant='subtle'
											colorScheme='blue'
											bg='blue.50'
											color='blue.700'
											border='1px solid'
											borderColor='blue.200'
										>
											{dataPaymentOrders?.results?.length} ordenes de pago
										</Badge>
									</Flex>
								</Flex>
							</Card.Header>

							<Card.Body pt={0}>
								<PaymentOrdersTable
									isLoading={loadingPaymentOrders}
									data={sortedFilteredOrders}
									refetch={fetchPaymentOrders}
									permissions={permissions}
								/>
							</Card.Body>
						</Card.Root>
					</Stack>
				</Modal>
			</Field>
		</Stack>
	);
};

GeneratePaymentOrderModalByRequest.propTypes = {
	item: PropTypes.object,
	permissions: PropTypes.array,
	fetchData: PropTypes.func,
};
