import { Field, ModalSimple, toaster } from '@/components/ui';
import {
	Badge,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaTimes } from 'react-icons/fa';
import {
	useCreatePaymentOrder,
	useReadPaymentOrders,
} from '@/hooks/payment_orders';
import { FiArrowUp, FiDollarSign, FiPlus } from 'react-icons/fi';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

export const GeneratePaymentOrderModalByRequest = ({ item, permissions }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: generatePaymentOrder, isSaving } =
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

	const [orderIdInput, setOrderIdInput] = useState('');
	const [discountInput, setDiscountInput] = useState('');
	const [dueDateInput, setDueDateInput] = useState('');

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
			id_orden: orderIdInput | null,
			discount_value: (Number(discountInput) / 100).toString() || '0',
			due_date: dueDateInput,
		};

		generatePaymentOrder(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Orden generada con éxito',
					type: 'success',
				});
				fetchPaymentOrders();
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

	return (
		<Stack css={{ '--field-label-width': '180px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ModalSimple
					title='Generar Orden de Pago'
					placement='center'
					trigger={
						<IconButton colorPalette='purple' size='xs'>
							<FiArrowUp />
						</IconButton>
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
									<Field label='Descuento'>
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
											selectedDate={
												dueDateInput ? new Date(dueDateInput) : null
											}
											onDateChange={(date) => setDueDateInput(date)}
											buttonSize='md'
											size='150px'
											minDate={new Date()}
										/>
									</Field>
									<Flex gap={2}>
										<IconButton
											size='sm'
											bg='green'
											loading={isSaving}
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
				</ModalSimple>
			</Field>
		</Stack>
	);
};

GeneratePaymentOrderModalByRequest.propTypes = {
	item: PropTypes.object,
	permissions: PropTypes.array,
};
