import { ReactSelect } from '@/components';
import { PreviewMyOrdenDetailsModal } from '@/components/modals';
import { Field } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import { useReadMyApplicants } from '@/hooks';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useReadMyPaymentRequest } from '@/hooks/payment_requests';
import { useReadPurposes } from '@/hooks/purposes';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Table,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText, FiTrash } from 'react-icons/fi';

export const MyPaymentRequests = () => {
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedPurpose, setSelectedPurpose] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);

	const hasActiveFilters =
		selectedProgram ||
		selectedStatus ||
		selectedMethod ||
		selectedPurpose ||
		selectedDocumentType;

	const clearFilters = () => {
		setSelectedProgram(null);
		setSelectedStatus(null);
		setSelectedMethod(null);
		setSelectedPurpose(null);
		setSelectedDocumentType(null);
	};

	const { data: dataPaymentRequests } = useReadMyPaymentRequest();

	const { data: dataMyApplicants } = useReadMyApplicants();
	const { data: dataPurposes } = useReadPurposes();
	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment();

	const filteredRequests = dataPaymentRequests?.filter((item) => {
		const matchProgram = selectedProgram
			? item.admission_process_program_name === selectedProgram.label
			: true;
		const matchStatus = selectedStatus
			? item.status === selectedStatus.value
			: true;
		const matchMethod = selectedMethod
			? item.payment_method === selectedMethod.value
			: true;
		const matchPurpose = selectedPurpose
			? item.purpose === selectedPurpose.value
			: true;
		const matchDocType = selectedDocumentType
			? item.document_type === selectedDocumentType.value
			: true;

		return (
			matchProgram && matchStatus && matchMethod && matchPurpose && matchDocType
		);
	});

	const ProgramsOptions = dataMyApplicants?.map((programs) => ({
		label: programs.postgraduate_name,
		value: programs.id,
	}));

	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const StatusOptions = [
		{ value: 1, label: 'Pendiente' },
		{ value: 2, label: 'Generado' },
		{ value: 3, label: 'Pagado' }, // puedes agregar más si aplica
		{ value: 4, label: 'Expirado' },
	];
	const statusColorMap = {
		1: 'red',
		2: 'blue',
		3: 'green',
		4: 'yellow',
	};

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Mis Solicitudes de Pago</Heading>
						</Flex>
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
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
							<Field label='Programa Académico:'>
								<ReactSelect
									value={selectedProgram}
									onChange={setSelectedProgram}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={ProgramsOptions}
								/>
							</Field>
							<Field label='Estado:'>
								<ReactSelect
									value={selectedStatus}
									onChange={setSelectedStatus}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={StatusOptions}
								/>
							</Field>
							<Field label='Métodos de Pago:'>
								<ReactSelect
									value={selectedMethod}
									onChange={setSelectedMethod}
									isLoading={isLoadingMethodPayment}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={methodOptions}
								/>
							</Field>
						</SimpleGrid>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 2, xl: 2 }} gap={6}>
							<Field label='Propósito:'>
								<ReactSelect
									value={selectedPurpose}
									onChange={setSelectedPurpose}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={
										dataPurposes?.results?.map((item) => ({
											label: item.name,
											value: item.id,
										})) || []
									}
								/>
							</Field>
							<Field label='Tipo de documento:'>
								<ReactSelect
									value={selectedDocumentType}
									onChange={setSelectedDocumentType}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={TypeOptions}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>
			<Card.Root>
				<Card.Body>
					<Box overflowX='auto'>
						<Table.Root size='sm' striped>
							<Table.Header></Table.Header>
							<Table.Row>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader w={'20%'}>Programa</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>Proceso</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>Propósito</Table.ColumnHeader>
								<Table.ColumnHeader w={'10%'}>Monto</Table.ColumnHeader>
								<Table.ColumnHeader>Estado</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>
									Fecha Solicitud
								</Table.ColumnHeader>
								<Table.ColumnHeader>O. de Pago</Table.ColumnHeader>
							</Table.Row>

							<Table.Body>
								{filteredRequests && filteredRequests.length > 0 ? (
									filteredRequests.map((item, index) => (
										<Table.Row key={item.id}>
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell>
												{item.admission_process_program_name || item.enrollment_process_program_name}
											</Table.Cell>
											<Table.Cell>
												{item.admission_process_name || item.enrollment_process_name}
											</Table.Cell>
											<Table.Cell>{item.purpose_display}</Table.Cell>
											<Table.Cell>S/ {item.amount}</Table.Cell>
											<Table.Cell>
												<Badge
													colorPalette={statusColorMap[item.status] || 'gray'}
													variant='solid'
												>
													{
														StatusOptions.find(
															(opt) => opt.value === item.status
														)?.label
													}
												</Badge>
											</Table.Cell>
											<Table.Cell>
												{formatDateString(item.requested_at)}
											</Table.Cell>
											<Table.Cell>
												<PreviewMyOrdenDetailsModal data={item} />
											</Table.Cell>
										</Table.Row>
									))
								) : (
									<Table.Row>
										<Table.Cell colSpan={8} textAlign='center'>
											No hay solicitudes de pago
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table.Root>
					</Box>
				</Card.Body>
			</Card.Root>
		</Stack>
	);
};
