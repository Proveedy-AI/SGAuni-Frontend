import { ReactSelect } from '@/components';
import { TransferRequestsTable } from '@/components/tables/transfer_requests/TransferRequestsTable';
import { Field } from '@/components/ui';
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
import { useMemo, useState } from 'react';
import { FiSearch, FiTrash, FiFileText } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

// Data local simulando API (fuera del componente para evitar re-renderizados)
const localTransferRequests = [
	{
		id: 1,
		student_id: 1,
		student_name: "Juan Pérez García",
		document_number: "12345678",
		program_id: 1,
		program_name_from: "Maestría en Contabilidad",
		program_destination_id: 2,
		program_name_to: "Maestria en Administración",
		document_path: "path/to/document1.pdf",
		created_at: "2025-01-15T10:30:00Z",
		status: 3,
		status_display: "Rechazado",
	},
	{
		id: 2,
		student_id: 2,
		student_name: "María López Rodríguez",
		document_number: "87654321",
		program_id: 2,
		program_name_from: "Maestria en Administración",
		program_destination_id: 3,
		program_name_to: "Maestria en Data Science",
		document_path: "path/to/document2.pdf",
		created_at: "2025-02-10T14:20:00Z",
		status: 1,
		status_display: "En revisión",
	},
	{
		id: 3,
		student_id: 3,
		student_name: "Carlos Mendoza Silva",
		document_number: "45678912",
		program_id: 1,
		program_name_from: "Maestría en Contabilidad",
		program_destination_id: 4,
		program_name_to: "Maestria en Inteligencia Artificial",
		document_path: "path/to/document3.pdf",
		created_at: "2025-01-25T08:15:00Z",
		status: 2,
		status_display: "Aprobado",
	},
	{
		id: 4,
		student_id: 4,
		student_name: "Ana Torres Vega",
		document_number: "32165498",
		program_id: 3,
		program_name_from: "Maestria en Data Science",
		program_destination_id: 5,
		program_name_to: "Maestría en Gestión Pública",
		document_path: "path/to/document4.pdf",
		created_at: "2025-02-05T16:45:00Z",
		status: 1,
		status_display: "En revisión",
	},
	{
		id: 5,
		student_id: 5,
		student_name: "Roberto Díaz Castro",
		document_number: "78912345",
		program_id: 2,
		program_name_from: "Maestria en Administración",
		program_destination_id: 1,
		program_name_to: "Maestría en Contabilidad",
		document_path: "path/to/document5.pdf",
		created_at: "2025-01-30T11:20:00Z",
		status: 2,
		status_display: "Aprobado",
	}
];

export const TransferRequestsView = () => {
	const [selectedProgramFrom, setSelectedProgramFrom] = useState(null);
	const [selectedProgramTo, setSelectedProgramTo] = useState(null);
	const [studentName, setStudentName] = useState('');
	const [debouncedSearch] = useDebounce(studentName.trim(), 500);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters = selectedProgramFrom || selectedProgramTo || studentName || debouncedSearch || selectedStatus;

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

	// Programas de procedencia
	const programFromOptions = useMemo(() => {
	 const programs = new Set();
	 localTransferRequests.forEach(req => {
		 programs.add(JSON.stringify({ id: req.program_id, name: req.program_name_from }));
	 });
	 return Array.from(programs)
		 .map(str => JSON.parse(str))
		 .map(program => ({ label: program.name, value: program.id }));
	}, []);

	// Programas de destino
	const programToOptions = useMemo(() => {
	 const programs = new Set();
	 localTransferRequests.forEach(req => {
		 programs.add(JSON.stringify({ id: req.program_destination_id, name: req.program_name_to }));
	 });
	 return Array.from(programs)
		 .map(str => JSON.parse(str))
		 .map(program => ({ label: program.name, value: program.id }));
	}, []);

	// Filtrar datos locales
	const filteredData = useMemo(() => {
	 return localTransferRequests.filter(request => {
		 const matchesProgramFrom = !selectedProgramFrom || request.program_id === selectedProgramFrom.value;
		 const matchesProgramTo = !selectedProgramTo || request.program_destination_id === selectedProgramTo.value;
		 const matchesStudent = !debouncedSearch || 
			 request.student_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
			 request.document_number.includes(debouncedSearch);
		 const matchesStatus = !selectedStatus || request.status === selectedStatus.value;
		 return matchesProgramFrom && matchesProgramTo && matchesStudent && matchesStatus;
	 });
	}, [selectedProgramFrom, selectedProgramTo, debouncedSearch, selectedStatus]);

	// Simular comportamiento de paginación para el componente
	const mockTableProps = {
		data: filteredData,
		fetchData: () => {},
		isLoading: false,
		totalCount: filteredData.length,
		isFetchingNextPage: false,
		fetchNextPage: () => {},
		hasNextPage: false,
		resetPageTrigger: 0,
	};

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
						 <SimpleGrid columns={{ base: 1, lg: 2}} gap={2}>
							 {/* Filtro por estudiante */}
							 <Field label='Estudiante:'>
								 <InputGroup flex='1' startElement={<FiSearch />}>
									 <Input
										 bg={'white'}
										 placeholder='Buscar por nombre o documento...'
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
									 options={programFromOptions}
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
									 options={programToOptions}
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
			<TransferRequestsTable {...mockTableProps} />
		</Stack>
	);
};
