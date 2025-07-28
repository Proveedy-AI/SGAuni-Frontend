import { ReactSelect } from '@/components';
import { CommitmentLettersTable } from '@/components/tables/commitment_letters';
import { Field } from '@/components/ui';
import { useReadFractionationRequests } from '@/hooks/fractionation_requests';
import {
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText, FiTrash } from 'react-icons/fi';

export const CommitmentLetters = () => {
	const {
		data: dataFractionationRequest2,
		refetch: fetchFractionationRequests,
		isLoading: loadingFractionationRequests,
		fetchNextPage: fetchNextPageFractionationRequests,
		hasNextPage: hasNextPageFractionationRequests,
		isFetchingNextPage: isFetchingNextPageFractionationRequests,
	} = useReadFractionationRequests();

	const allFractionation =
		dataFractionationRequest2?.pages?.flatMap((page) => page.results) ?? [];

	/*const dataFractionationRequests = {
		results: [
			{
				id: 1,
				plan_purpose: 'Fraccionamiento',
				status: 2,
				status_display: 'En revisión',
				student_name: 'Juan Pérez',
				enrollment_name: '2024-I',
				plan_type_display: 'Cuotas',
				total_amount: '1200.00',
				total_amortization: '400.00',
				total_balance: '800.00',
				upfront_percentage: '33%',
				number_of_installments: 3,
				program_name: 'Ingeniería de Sistemas',
				reviewed_at: '2024-05-10T10:00:00.000Z',
				payment_document_type: 1,
				payment_document_type_display: 'Boleta',
				path_commitment_letter:
					'https://example.com/doc/54asd6s4asdas4d89asd4as',
				num_document_person: '12345678',
			},
		],
	};*/

	const RecipeTypesOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const StatusOptions = [
		{ value: 1, label: 'En revisión' },
		{ value: 2, label: 'Aprobado' },
		{ value: 3, label: 'Rechazado' },
	];

	const [selectedRecipeType, setSelectedRecipeType] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [applicantDocNumber, setApplicantDocNumber] = useState('');

	const hasActiveFilters =
		selectedRecipeType || selectedStatus || applicantDocNumber;

	const isFiltering = hasActiveFilters;
	const clearFilters = () => {
		setSelectedRecipeType(null);
		setSelectedStatus(null);
		setApplicantDocNumber('');
	};

	const filteredRequests = allFractionation?.filter((request) => {
		const matchRecipeType = selectedRecipeType
			? request.payment_document_type === selectedRecipeType.value
			: true;
		const matchStatus = selectedStatus
			? request.status_review === selectedStatus.value
			: true;
		const matchApplicantDocNumber = applicantDocNumber
			? request.num_document_person.includes(applicantDocNumber)
			: true;
		return matchRecipeType && matchStatus && matchApplicantDocNumber;
	});

	const totalCount = isFiltering
		? filteredRequests.length
		: (dataFractionationRequest2?.pages?.[0]?.count ?? 0);

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
							<Heading fontSize='24px'>Solicitudes de Fraccionamiento</Heading>
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
						<SimpleGrid columns={{ base: 1, sm: 3 }} gap={6}>
							<Field label='Tipo de Documento:'>
								<ReactSelect
									placeholder='Seleccionar tipo de Documento'
									value={selectedRecipeType}
									onChange={setSelectedRecipeType}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={RecipeTypesOptions}
								/>
							</Field>
							<Field label='Estado:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedStatus}
									onChange={(selected) => setSelectedStatus(selected)}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={StatusOptions}
								/>
							</Field>
							<Field label='Número de documento del postulante:'>
								<Input
									placeholder='Buscar por número de documento'
									value={applicantDocNumber}
									onChange={(e) => setApplicantDocNumber(e.target.value)}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<CommitmentLettersTable
				isLoading={loadingFractionationRequests}
				data={filteredRequests}
				totalCount={totalCount}
				refetch={fetchFractionationRequests}
				fetchNextPage={fetchNextPageFractionationRequests}
				hasNextPage={hasNextPageFractionationRequests}
				isFetchingNextPage={isFetchingNextPageFractionationRequests}
			/>
		</Stack>
	);
};
