import { ReactSelect } from '@/components';
import { Button, Field } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadPrograms } from '@/hooks';
import { useReadAdmissions } from '@/hooks/admissions_proccess';
import { useReadReportAdmission } from '@/hooks/reports';

import * as react from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { FiClock, FiUserCheck, FiUsers, FiUserX } from 'react-icons/fi';
import * as recharts from 'recharts';

export const ReportsAdmission = () => {
	const today = new Date();

	// primer día del mes actual
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// formatear en YYYY-MM-DD
	const formatDate = (date) => date.toISOString().split('T')[0];
	const [selectedProgram, setSelectedProgram] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState([]);
	const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
	const [endDate, setEndDate] = useState(formatDate(today));
	const { data: dataPeriod, isLoading: isLoadingPeriodAdmission } =
		useReadAdmissions();

	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadPrograms();

	const filterParams = useMemo(() => {
		const params = {};
		if (selectedProgram?.length > 0) {
			params.program = selectedProgram?.map((opt) => opt.value).join(',');
		}
		if (selectedPeriod?.length > 0) {
			params.admission_process = selectedPeriod
				?.map((opt) => opt.value)
				.join(',');
		}
		if (startDate) params.start_date = startDate;
		if (endDate) params.end_date = endDate;
		return params;
	}, [selectedProgram, selectedPeriod, startDate, endDate]);

	const { data: dataAdmissionReport } = useReadReportAdmission(
		filterParams,
		{}
	);

	/*const dataAdmissionReport = {
		semesterData: [
			{ name: '2023-1', approved: 1200, rejected: 1000, inProgress: 5000 },
			{ name: '2023-2', approved: 1350, rejected: 1250, inProgress: 5000 },
			{ name: '2024-1', approved: 1100, rejected: 1050, inProgress: 5000 },
			{ name: '2024-2', approved: 1450, rejected: 1300, inProgress: 5000 },
		],
		programData: [
			{ name: 'Ingeniería de Sistemas', postulantes: 120 },
			{ name: 'Administración de Empresas', postulantes: 80 },
		],
		totalInProgress: 5000,
		totalRejected: 4000,
		totalApproved: 900,
	};*/

	const lineData = dataAdmissionReport?.semesterData;
	const barData = dataAdmissionReport?.programData;

	const PeriodOptions = useMemo(
		() =>
			dataPeriod?.results?.map((program) => ({
				label: program.admission_process_name,
				value: program.id,
				start_date: program.start_date,
				end_date: program.end_date,
			})) || [],
		[dataPeriod]
	);

	useEffect(() => {
		if (PeriodOptions?.length > 0) {
			setSelectedPeriod([PeriodOptions[0]]);
		}
	}, [PeriodOptions]);

	const ProgramsOptions =
		dataPrograms?.results?.map((program) => ({
			value: program.id,
			label: program.name,
		})) || [];

	// Simulación de datos reales
  const totalApplicants = dataAdmissionReport ? 
    (dataAdmissionReport?.totalApproved + dataAdmissionReport?.totalRejected + dataAdmissionReport?.totalInProgress) 
    : 0

	return (
		<react.Stack gap={4}>
			<react.Box bg='white' p={4} rounded='lg' shadow='sm'>
				<react.Flex align='center' justify='space-between' mb={4}>
					<react.Heading size='md'>Reporte de Admisión</react.Heading>

					{
						// Solo mostrar si hay filtros activos
						(selectedProgram?.length > 0 || startDate || endDate) && (
							<Button
								size='sm'
								variant='outline'
								colorPalette='red'
								onClick={() => {
									setSelectedPeriod([]);
									setSelectedProgram([]);
									setStartDate(null);
									setEndDate(null);
								}}
							>
								Limpiar filtros
							</Button>
						)
					}
				</react.Flex>
				<react.SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
					<Field label='Periodo:'>
						<ReactSelect
							placeholder='Seleccionar'
							value={selectedPeriod}
							onChange={(options) => {
								setSelectedPeriod(options);

								if (options && options.length > 0) {
									// Encuentra la fecha más antigua y la más reciente
									const minDate = options.reduce(
										(min, opt) => (opt.start_date < min ? opt.start_date : min),
										options[0].start_date
									);

									const maxDate = options.reduce(
										(max, opt) => (opt.end_date > max ? opt.end_date : max),
										options[0].end_date
									);

									setStartDate(minDate);
									setEndDate(maxDate);
								} else {
									// Si no hay selección, resetea al default
									setStartDate(formatDate(firstDayOfMonth));
									setEndDate(formatDate(today));
								}
							}}
							isLoading={isLoadingPeriodAdmission}
							variant='flushed'
							size='xs'
							isMulti
							isSearchable
							isClearable
							options={PeriodOptions}
						/>
					</Field>
					<Field label='Programas:'>
						<ReactSelect
							placeholder='Seleccionar'
							value={selectedProgram}
							onChange={setSelectedProgram}
							isLoading={isLoadingPrograms}
							variant='flushed'
							size='xs'
							isMulti={true}
							isSearchable
							isClearable
							options={ProgramsOptions}
						/>
					</Field>
					{/* Filtrar por Fecha */}
					<Field label='Fecha de Inicio'>
						<CustomDatePicker
							selectedDate={startDate}
							onDateChange={(date) => setStartDate(format(date, 'yyyy-MM-dd'))}
							buttonSize='md'
							asChild
							size={{ base: '250px', md: '300px' }}
						/>
					</Field>
					<Field label='Fecha de Fin'>
						<CustomDatePicker
							selectedDate={endDate}
							onDateChange={(date) => setEndDate(format(date, 'yyyy-MM-dd'))}
							buttonSize='md'
							asChild
							size={{ base: '250px', md: '300px' }}
						/>
					</Field>
				</react.SimpleGrid>
			</react.Box>

			<react.Grid
				templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
				gap={6}
			>
				{/* Total de Ingresos */}
				<react.Card.Root bg='white' shadow='sm'>
					<react.Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<react.Card.Title
							fontSize='sm'
							fontWeight='medium'
							color='gray.600'
						>
							Total Postulantes
						</react.Card.Title>
						<react.Box
							w={10}
							h={10}
							bg='green.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiUsers size={20} color='#16a34a' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{totalApplicants}
						</react.Text>
					</react.Card.Body>
				</react.Card.Root>

				{/* Total de Deuda */}
				<react.Card.Root bg='white' shadow='sm'>
					<react.Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<react.Card.Title
							fontSize='sm'
							fontWeight='medium'
							color='gray.600'
						>
							En Proceso
						</react.Card.Title>
						<react.Box
							w={10}
							h={10}
							bg='blue.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiClock size={20} color='#2629dcff' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataAdmissionReport?.totalInProgress || 0}
						</react.Text>
					</react.Card.Body>
				</react.Card.Root>

				{/* Solicitudes */}
				<react.Card.Root bg='white' shadow='sm'>
					<react.Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<react.Card.Title
							fontSize='sm'
							fontWeight='medium'
							color='gray.600'
						>
							Admitidos
						</react.Card.Title>
						<react.Box
							w={10}
							h={10}
							bg='green.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiUserCheck size={20} color='#25eb35ff' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataAdmissionReport?.totalApproved || 0}
						</react.Text>
					</react.Card.Body>
				</react.Card.Root>

				{/* Órdenes de Pago */}
				<react.Card.Root bg='white' shadow='sm'>
					<react.Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<react.Card.Title
							fontSize='sm'
							fontWeight='medium'
							color='gray.600'
						>
							Rechazados
						</react.Card.Title>
						<react.Box
							w={10}
							h={10}
							bg='red.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiUserX size={20} color='#ce3c22ff' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataAdmissionReport?.totalRejected || 0}
						</react.Text>
					</react.Card.Body>
				</react.Card.Root>
			</react.Grid>

			<react.Stack
				bg={{ base: 'white', _dark: 'its.gray.500' }}
				p='4'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				gap='1'
			>
				<react.Stack
					justify='space-between'
					align='center'
					w='full'
					direction={{ base: 'column', sm: 'row' }}
				>
					<react.Box w='full'>
						<react.Heading
							size={{
								xs: 'xs',
								sm: 'sm',
								md: 'md',
							}}
						>
							Postulantes por Semestre
						</react.Heading>
					</react.Box>
				</react.Stack>

				<react.Box w='full' h='400px'>
					<recharts.ResponsiveContainer width='100%' height='100%'>
						<recharts.LineChart
							width={500}
							height={300}
							data={lineData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<recharts.CartesianGrid strokeDasharray='3 3' />
							<recharts.XAxis dataKey='name' />
							<recharts.YAxis />
							<recharts.Tooltip />
							<recharts.Legend
								align='center'
								verticalAlign='top'
								wrapperStyle={{ paddingBottom: '10px' }}
							/>
							<recharts.Line
								type='monotone'
								dataKey='approved'
								name='Admitidos'
								stroke='green'
								activeDot={{ r: 8 }}
							/>
							<recharts.Line
								type='monotone'
								dataKey='inProgress'
								name='En Progreso'
								stroke='blue'
								activeDot={{ r: 8 }}
							/>
							<recharts.Line
								type='monotone'
								dataKey='rejected'
								name='Rechazados'
								stroke='red'
								activeDot={{ r: 8 }}
							/>
						</recharts.LineChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>

			{/* Barra de Programas */}
			<react.Stack
				bg={{ base: 'white', _dark: 'its.gray.500' }}
				p='4'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				gap='1'
			>
				<react.Stack
					justify='space-between'
					align='center'
					w='full'
					mb={10}
					direction={{ base: 'column', sm: 'row' }}
				>
					<react.Box w='full'>
						<react.Heading
							size={{
								xs: 'xs',
								sm: 'sm',
								md: 'md',
							}}
						>
							Postulantes por Programa
						</react.Heading>
					</react.Box>
				</react.Stack>
				<react.Box w='full' h='400px'>
					<recharts.ResponsiveContainer width='100%' height='100%'>
						<recharts.BarChart
							width={500}
							height={300}
							data={barData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<recharts.CartesianGrid strokeDasharray='3 3' />
							<recharts.XAxis dataKey='name' />
							<recharts.YAxis />
							<recharts.Tooltip />
							<recharts.Bar dataKey='postulantes' fill='#3182CE' />
						</recharts.BarChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>
		</react.Stack>
	);
};
