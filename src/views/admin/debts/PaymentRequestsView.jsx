import { PaymentRequestsTable } from '@/components/tables/payment_requests';
import { useReadPaymentRequest } from '@/hooks/payment_requests/useReadPaymentRequest';
import {
	Button,
	Heading,
	InputGroup,
	Input,
	Stack,
	Card,
	Flex,
	Icon,
	SimpleGrid,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { FiFileText, FiSearch, FiTrash } from 'react-icons/fi';
import { Field } from '@/components/ui';
import { ReactSelect } from '@/components';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useReadPurposes } from '@/hooks/purposes';
import { useReadPrograms } from '@/hooks';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const PaymentRequestsView = () => {
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedPurpose, setSelectedPurpose] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [selectedApplicantDocumentNumber, setSelectedApplicantDocumentNumber] =
		useState('');

	const hasActiveFilters =
		selectedProgram ||
		selectedStatus ||
		selectedMethod ||
		selectedPurpose ||
		selectedDocumentType ||
		selectedApplicantDocumentNumber;

	const clearFilters = () => {
		setSelectedProgram(null);
		setSelectedStatus(null);
		setSelectedMethod(null);
		setSelectedPurpose(null);
		setSelectedDocumentType(null);
		setSelectedApplicantDocumentNumber('');
	};

	// Construir los parámetros de filtro para el backend
	const filterParams = useMemo(() => {
		const params = {};
		if (selectedProgram) params.program = selectedProgram.value;
		if (selectedStatus) params.status = selectedStatus.value;
		if (selectedMethod) params.payment_method = selectedMethod.value;
		if (selectedPurpose) params.purpose = selectedPurpose.value;
		if (selectedDocumentType) params.document_type = selectedDocumentType.value;
		if (selectedApplicantDocumentNumber.length >= 8) {
			params.num_document = selectedApplicantDocumentNumber;
		}
		return params;
	}, [
		selectedProgram,
		selectedStatus,
		selectedMethod,
		selectedPurpose,
		selectedDocumentType,
		selectedApplicantDocumentNumber,
	]);

	const {
		data: dataPaymentRequests,
		fetchNextPage: fetchNextPagePaymentRequests,
		hasNextPage: hasNextPagePaymentRequests,
		isFetchingNextPage: isFetchingNextPagePaymentRequests,
		isLoading: isPaymentRequestsLoading,
		refetch: refetchPaymentRequests,
	} = useReadPaymentRequest(filterParams);

	const allPaymentRequests =
		dataPaymentRequests?.pages?.flatMap((page) => page.results) ?? [];

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const { data: dataPurposes, isLoading: isLoadingPurposes } =
		useReadPurposes();
	const { data: dataMethodsPayment, isLoading: isLoadingMethodsPayment } =
		useReadMethodPayment();
	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadPrograms();

	const PurposeOptions =
		dataPurposes?.results?.map((item) => ({
			label: item.name,
			value: item.id,
		})) || [];

	const MethodsPaymentOptions =
		dataMethodsPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const ProgramsOptions =
		dataPrograms?.results?.map((program) => ({
			label: program.name,
			value: program.id,
		})) || [];

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const statusOptions = [
		{ id: 1, label: 'Pendiente', value: 1 },
		{ id: 2, label: 'Generado', value: 2 },
		{ id: 3, label: 'Verificado', value: 3 },
		{ id: 4, label: 'Expirado', value: 4 },
	];

	// Ya no necesitamos filtrar aquí porque el backend lo hace
	const totalCount = dataPaymentRequests?.pages?.[0]?.count ?? 0;

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						{/* Izquierda: ícono + título */}
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Solicitudes de Pago</Heading>
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
						</Stack>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
							<Field label='Programa Académico:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedProgram}
									onChange={setSelectedProgram}
									isLoading={isLoadingPrograms}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={ProgramsOptions}
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
							<Field label='Método de Pago:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedMethod}
									onChange={setSelectedMethod}
									isLoading={isLoadingMethodsPayment}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={MethodsPaymentOptions}
								/>
							</Field>
						</SimpleGrid>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
							<Field label='Propósito:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedPurpose}
									onChange={setSelectedPurpose}
									isLoading={isLoadingPurposes}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={PurposeOptions}
								/>
							</Field>
							<Field label='Tipo de Recibo:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedDocumentType}
									onChange={setSelectedDocumentType}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={TypeOptions}
								/>
							</Field>
							<Field label='Postulante:'>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										bg={'white'}
										maxWidth={'550px'}
										placeholder='Buscar por DNI de postulante...'
										value={selectedApplicantDocumentNumber}
										onChange={(e) =>
											setSelectedApplicantDocumentNumber(e.target.value)
										}
									/>
								</InputGroup>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<PaymentRequestsTable
				isLoading={isPaymentRequestsLoading}
				data={allPaymentRequests}
				fetchNextPage={fetchNextPagePaymentRequests}
				fetchData={refetchPaymentRequests}
				totalCount={totalCount}
				hasNextPage={hasNextPagePaymentRequests}
				isFetchingNext={isFetchingNextPagePaymentRequests}
				permissions={permissions}
			/>
		</Stack>
	);
};
