import { Alert, Button, Field, Modal, toaster } from '@/components/ui';
import { Flex, IconButton, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useCreatePaymentOrder } from '@/hooks/payment_orders';
import { FiAlertTriangle, FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';

import { format } from 'date-fns';
import { useReadPaymentRequest } from '@/hooks/payment_requests';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

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
	}));

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
							{!isUniPaymentMethod && (
								<Field
									label='Id de Orden'
									invalid={!!errors.orderIdInput}
									errorText={errors.orderIdInput}
								>
									<Input
										placeholder='Ingresar id de Orden'
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
