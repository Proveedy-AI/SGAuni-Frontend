import { ReactSelect } from '@/components';
import {
	GeneratePaymentOrderModal,
	LoadExcelValidationsModal,
} from '@/components/forms/payment_orders';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { Field } from '@/components/ui';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';

export const PaymentOrdersView = () => {
	const [ordenId, setOrdenId] = useState('');
	const [documentNum, setDocumentNum] = useState('');
	const [email, setEmail] = useState('');
	const [dueDate, setDueDate] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);

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
		status: selectedStatus?.value
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
	];



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
							<Field label='Fecha de Vencimiento:'>
								<Input
									type='date'
									placeholder='Buscar por fecha de vencimiento'
									value={dueDate}
									onChange={(e) => setDueDate(e.target.value)}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<PaymentOrdersTable
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
