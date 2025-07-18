import { ReactSelect } from '@/components';
import {
	CancelSomePaymentOrders,
	GeneratePaymentOrderModal,
	LoadExcelValidationsModal,
	//LoadExcelValidationsModal,
} from '@/components/forms/payment_orders';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { Field, toaster, Tooltip } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	useCancelPaymentOrders,
	useReadPaymentOrders,
} from '@/hooks/payment_orders';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
	Button,
	Box,
	IconButton,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiFileText, FiTrash } from 'react-icons/fi';
import { HiCheck } from 'react-icons/hi2';

export const PaymentOrdersView = () => {
	const [ordenId, setOrdenId] = useState('');
	const [documentNum, setDocumentNum] = useState('');
	const [email, setEmail] = useState('');
	const [dueDate, setDueDate] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters =
		ordenId || documentNum || email || dueDate || selectedStatus;

	const clearFilters = () => {
		setOrdenId('');
		setDocumentNum('');
		setEmail('');
		setDueDate(null);
		setSelectedStatus(null);
	};

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const {
		data: dataPaymentOrders,
		fetchNextPage: fetchNextPagePaymentOrders,
		hasNextPage: hasNextPagePaymentOrders,
		isFetchingNextPage: isFetchingNextPagePaymentOrders,
		isLoading: loadingPaymentOrders,
		refetch: fetchPaymentOrders,
	} = useReadPaymentOrders({
		status: selectedStatus?.value,
	});

	const allPaymentOrders =
		dataPaymentOrders?.pages?.flatMap((page) => page.results) ?? [];

	const filteredPaymentOrders = allPaymentOrders?.filter((request) => {
		const matchOrdenId = ordenId
			? request?.id_orden.toString().includes(ordenId)
			: true;
		const matchDocumentNum = documentNum
			? request.document_num.toString().includes(documentNum)
			: true;
		const matchEmail = email ? request.email.includes(email) : true;
		const matchDueDate = dueDate ? request.due_date === dueDate : true;

		return matchOrdenId && matchDocumentNum && matchEmail && matchDueDate;
	});

	const sortedPaymentOrders = filteredPaymentOrders?.sort(
		(a, b) => a.status - b.status
	);

	const statusOptions = [
		{ id: 1, label: 'Pendiente', value: 1 },
		{ id: 2, label: 'Generado', value: 2 },
		{ id: 3, label: 'Verificado', value: 3 },
		{ id: 4, label: 'Expirado', value: 4 },
		{ id: 5, label: 'Cancelado', value: 5 },
	];

	const [isMassiveCancelOpen, setIsMassiveCancelOpen] = useState(false);
	const [selectedOrderIds, setSelectedOrderIds] = useState([]);

	const addOrderIdToCancel = (orderId) => {
		setSelectedOrderIds((prev) => {
			if (prev.includes(orderId)) {
				return prev.filter((id) => id !== orderId);
			} else {
				return [...prev, orderId];
			}
		});
	};

	const { mutateAsync: cancelPaymentOrders } = useCancelPaymentOrders();

	const handleMassiveCancel = () => {
		const payload = {
			payment_order_ids: selectedOrderIds,
		};

		console.log(payload);

		cancelPaymentOrders(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Ordenes canceladas con éxito',
					type: 'success',
				});
				fetchPaymentOrders();
				setIsMassiveCancelOpen(false);
				setSelectedOrderIds([]);
			},
			onError: (error) => {
				toaster.create({
					title: error.message || 'Error al cancelar las ordenes',
					type: 'error',
				});
			},
		});
	};

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex
						justify='space-between'
						align='center'
						direction={{ base: 'column', sm: 'row' }}
						gap={4} // Espacio entre filas en pantallas pequeñas
					>
						{/* Izquierda */}
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Ordenes de Pago</Heading>
						</Flex>

						{/* Derecha */}
						<Stack direction='row' spacing={2} align='center'>
							{hasActiveFilters && (
								<Button
									variant='outline'
									colorPalette='red'
									size='sm'
									onClick={clearFilters}
								>
									<FiTrash />
									Limpiar Filtros
								</Button>
							)}
							<LoadExcelValidationsModal />
							<GeneratePaymentOrderModal fetchData={fetchPaymentOrders} />
						</Stack>
					</Flex>
				</Card.Header>

				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, sm: 3 }} gap={6}>
							<Field label='Id de orden:'>
								<Input
									placeholder='Buscar por id de orden'
									value={ordenId}
									onChange={(e) => setOrdenId(e.target.value)}
								/>
							</Field>
							<Field label='Documento de identidad:'>
								<Input
									placeholder='Buscar por documento de identidad'
									value={documentNum}
									onChange={(e) => setDocumentNum(e.target.value)}
								/>
							</Field>
							<Field label='Estado:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedStatus}
									onChange={setSelectedStatus}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={statusOptions}
								/>
							</Field>
							<Field label='Correo Electrónico:'>
								<Input
									placeholder='Buscar por correo electrónico'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Field>
							<Field label='Fecha de Vencimiento'>
								<CustomDatePicker
									selectedDate={dueDate}
									onDateChange={(date) =>
										setDueDate(format(date, 'yyyy-MM-dd'))
									}
									buttonSize='md'
									asChild
									size={{ base: '330px', md: '350px' }}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<Box display='flex' justifyContent='flex-end' gap={2}>
				{isMassiveCancelOpen && (
					<>
						<Tooltip
							content='Seleccinar todos'
							positioning={{ placement: 'bottom-center' }}
							showArrow
							openDelay={0}
						>
							<IconButton
								colorPalette='green'
								size='xs'
								onClick={() =>
									setSelectedOrderIds(
										sortedPaymentOrders
											?.filter((item) => item.status !== 3)
											.map((item) => item.id)
									)
								}
							>
								<HiCheck />
							</IconButton>
						</Tooltip>
						<Tooltip
							content='Quitar todos'
							positioning={{ placement: 'bottom-center' }}
							showArrow
							openDelay={0}
						>
							<IconButton
								disabled={selectedOrderIds.length === 0}
								colorPalette='red'
								size='xs'
								onClick={() => setSelectedOrderIds([])}
							>
								<FaTimes />
							</IconButton>
						</Tooltip>
						<CancelSomePaymentOrders
							selectedOrderIds={selectedOrderIds}
							onCancel={handleMassiveCancel}
						/>
					</>
				)}
				<Button
					bg={isMassiveCancelOpen ? 'red.500' : 'uni.secondary'}
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
					onClick={
						isMassiveCancelOpen
							? () => setIsMassiveCancelOpen(false)
							: () => setIsMassiveCancelOpen(true)
					}
				>
					{!isMassiveCancelOpen ? 'Cancelar varias ordenes' : 'Cancelar'}
				</Button>
			</Box>

			<PaymentOrdersTable
				isSelected={isMassiveCancelOpen}
				selectedOrderIds={selectedOrderIds}
				addOrderIdToCancel={addOrderIdToCancel}
				isLoading={loadingPaymentOrders}
				data={sortedPaymentOrders}
				fetchNextPage={fetchNextPagePaymentOrders}
				hasNextPage={hasNextPagePaymentOrders}
				isFetchingNext={isFetchingNextPagePaymentOrders}
				refetch={fetchPaymentOrders}
				permissions={permissions}
			/>
		</Stack>
	);
};
