import { ReactSelect } from '@/components';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { TransferRequestsTable } from '@/components/tables/transfer_requests/TransferRequestsTable';
import { Field } from '@/components/ui';
import { useReadPrograms } from '@/hooks';
import { useReadTransferRequest } from '@/hooks/transfer_requests';
import {
	Heading,
	InputGroup,
	Input,
	Flex,
	Card,
	Icon,
	Stack,
	Button,
	SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiTrash, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useDebounce } from 'use-debounce';

export const TransferRequestsView = () => {
	const { 
    data: dataTransferRequests, 
    isLoading: isLoadingTransferRequests,
    refetch: refetchTransferRequests
  } = useReadTransferRequest();
  const navigate = useNavigate();

  const handleClickRow = (id) => {
    const encrypted = Encryptor.encrypt(id);
    const encoded = encodeURIComponent(encrypted);
    navigate(`/students/${encoded}`);
  }

  const { data: dataPrograms, isLoading: isLoadingPrograms } = useReadPrograms();
	const [selectedProgramFrom, setSelectedProgramFrom] = useState(null);
	const [selectedProgramTo, setSelectedProgramTo] = useState(null);
	const [studentName, setStudentName] = useState('');
	const [debouncedSearch] = useDebounce(studentName.trim(), 500);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters =
		selectedProgramFrom ||
		selectedProgramTo ||
		studentName ||
		debouncedSearch ||
		selectedStatus;

	const clearFilters = () => {
		setSelectedProgramFrom(null);
		setSelectedProgramTo(null);
		setStudentName('');
		setSelectedStatus(null);
	};

	// Opciones para filtros
	const statusOptions = [
		{ label: 'En revisión', value: 1 },
		{ label: 'Aprobado', value: 2 },
		{ label: 'Rechazado', value: 3 },
	];

  const ProgramOptions = dataPrograms?.results?.map((program) => ({
		label: program.name,
		value: program.id,
	}));

	// Filtrar datos locales
	const filteredData = dataTransferRequests?.results?.filter((request) => {
			const matchesProgramFrom =
				!selectedProgramFrom ||
				request.from_program === selectedProgramFrom.value;
			const matchesProgramTo =
				!selectedProgramTo ||
				request.to_program === selectedProgramTo.value;
			const matchesStudent =
				!debouncedSearch ||
				request.student_full_name
					.toLowerCase()
					.includes(debouncedSearch.toLowerCase()) ||
				request.student_code.includes(debouncedSearch);
			const matchesStatus =
				!selectedStatus || request.status === selectedStatus.value;
			return (
				matchesProgramFrom &&
				matchesProgramTo &&
				matchesStudent &&
				matchesStatus
			);
		});

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						{/* Izquierda: ícono + título */}
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Solicitudes de Traslado</Heading>
						</Flex>

						{/* Derecha: Botón limpiar filtros */}
						<Stack direction='row' gap={2} align='center'>
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
					<Stack gap={2} mb={2}>
						<SimpleGrid columns={{ base: 1, lg: 2 }} gap={2}>
							{/* Filtro por estudiante */}
							<Field label='Estudiante:'>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										bg={'white'}
										placeholder='Buscar por nombre o código de estudiante...'
										value={studentName}
										onChange={(e) => setStudentName(e.target.value)}
									/>
								</InputGroup>
							</Field>

							{/* Filtro por programa de procedencia */}
							<Field label='Programa de procedencia:'>
								<ReactSelect
									value={selectedProgramFrom}
									onChange={setSelectedProgramFrom}
									options={ProgramOptions}
                  isLoading={isLoadingPrograms}
									placeholder='Todos los programas de procedencia'
									isClearable
									size='sm'
								/>
							</Field>

							{/* Filtro por programa de destino */}
							<Field label='Programa de destino:'>
								<ReactSelect
									value={selectedProgramTo}
									onChange={setSelectedProgramTo}
									options={ProgramOptions}
                  isLoading={isLoadingPrograms}
									placeholder='Todos los programas de destino'
									isClearable
									size='sm'
								/>
							</Field>

							{/* Filtro por estado */}
							<Field label='Estado:'>
								<ReactSelect
									value={selectedStatus}
									onChange={setSelectedStatus}
									options={statusOptions}
									placeholder='Todos los estados'
									isClearable
									size='sm'
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			{/* Tabla de solicitudes */}
			<TransferRequestsTable
        data={filteredData}
        fetchData={refetchTransferRequests}
        isLoading={isLoadingTransferRequests}
        handleClickRow={handleClickRow}
      />
		</Stack>
	);
};
