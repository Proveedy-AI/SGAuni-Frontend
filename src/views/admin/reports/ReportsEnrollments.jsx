import { ReactSelect } from '@/components';
import { Button, Field } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadPrograms } from '@/hooks';
import { useReadEnrollments } from '@/hooks/enrollments_proccess';
import { useReadReportEnrollment } from '@/hooks/reports';
import * as react from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import * as recharts from 'recharts';

export const ReportsEnrollments = () => {
	const today = new Date();

	// primer día del mes actual
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// formatear en YYYY-MM-DD
	const formatDate = (date) => date.toISOString().split('T')[0];
	const [selectedProgram, setSelectedProgram] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState([]);
	const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
	const [endDate, setEndDate] = useState(formatDate(today));
	const { data: dataPeriod, isLoading: isLoadingPeriodEnrollment } =
		useReadEnrollments();

	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadPrograms();

	const filterParams = useMemo(() => {
		const params = {};
		if (selectedProgram?.length > 0) {
			params.program = selectedProgram.map((opt) => opt.value).join(',');
		}
		if (selectedPeriod?.length > 0) {
			params.enrollment_period = selectedPeriod
				.map((opt) => opt.value)
				.join(',');
		}
		if (startDate) params.start_date = startDate;
		if (endDate) params.end_date = endDate;
		return params;
	}, [selectedProgram, selectedPeriod, startDate, endDate]);

	const { data: dataEnrollmentReport } = useReadReportEnrollment(
		filterParams,
		{}
	);

	/*const dataEnrollmentReport = {
		semesterData: [
			{ semester: '2024-I', enrollment: 120, noenrollment: 30 },
			{ semester: '2024-II', enrollment: 150, noenrollment: 40 },
			{ semester: '2025-I', enrollment: 180, noenrollment: 50 },
		],
		statusData: [
			{ name: 'Activos', value: 300 },
			{ name: 'Retirados', value: 50 },
			{ name: 'Egresados', value: 80 },
		],
		programData: [
			{ name: 'Ingeniería de Sistemas', enrollment: 120, noenrollment: 20 },
			{ name: 'Administración de Empresas', enrollment: 80, noenrollment: 10 },
		],
	};*/

	const PieData = dataEnrollmentReport?.statusData;
	const lineData = dataEnrollmentReport?.semesterData;
	const barData = dataEnrollmentReport?.programData;
	const COLORS = ['#4FD1C5', '#F56565', '#4299E1'];

	const PeriodOptions = useMemo(
		() =>
			dataPeriod?.results?.map((program) => ({
				label: program.academic_period_name,
				value: program.id,
				start_date: program.start_date,
				end_date: program.end_date,
			})) || [],
		[dataPeriod]
	);

	useEffect(() => {
		if (PeriodOptions.length > 0) {
			setSelectedPeriod([PeriodOptions[0]]);
		}
	}, [PeriodOptions]);

	const ProgramsOptions =
		dataPrograms?.results?.map((program) => ({
			value: program.id,
			label: program.name,
		})) || [];

	// Simulación de datos reales

	return (
		<react.Stack gap={4}>
			<react.Box bg='white' p={4} rounded='lg' shadow='sm'>
				<react.Flex align='center' justify='space-between' mb={4}>
					<react.Heading size='md'>Reporte de Matricula</react.Heading>

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
							isLoading={isLoadingPeriodEnrollment}
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
				templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }}
				gap={6}
			>
				{/* PieChart → 2/5 en desktop, full width en mobile */}
				<react.Box
					bg='white'
					p={4}
					rounded='lg'
					shadow='sm'
					gridColumn={{ base: 'span 1', md: 'span 2' }}
				>
					<react.Heading size='sm' mb={4}>
						Alumnos por Estado
					</react.Heading>
					<recharts.ResponsiveContainer width='100%' height={300}>
						<recharts.PieChart>
							<recharts.Pie
								data={PieData}
								cx='50%'
								cy='50%'
								labelLine={false}
								label={({ name, value }) => `${name}: ${value}`}
								outerRadius={100}
								fill='#8884d8'
								dataKey='value'
							>
								{PieData?.map((entry, index) => (
									<recharts.Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</recharts.Pie>
							<recharts.Tooltip />
						</recharts.PieChart>
					</recharts.ResponsiveContainer>
				</react.Box>

				{/* LineChart → 3/5 en desktop, full width en mobile */}
				<react.Stack
					bg={{ base: 'white', _dark: 'its.gray.500' }}
					p='4'
					borderRadius='10px'
					overflow='hidden'
					boxShadow='md'
					gap='1'
					gridColumn={{ base: 'span 1', md: 'span 3' }}
				>
					<react.Heading size='sm' mb={2}>
						Alumnos por Semestre
					</react.Heading>

					<react.Box w='full' h={{ base: '300px', md: '400px' }}>
						<recharts.ResponsiveContainer width='100%' height='100%'>
							<recharts.LineChart
								data={lineData}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<recharts.CartesianGrid strokeDasharray='3 3' />
								<recharts.XAxis dataKey='semester' />
								<recharts.YAxis />
								<recharts.Tooltip />
								<recharts.Legend
									align='center'
									verticalAlign='top'
									wrapperStyle={{ paddingBottom: '10px' }}
								/>
								<recharts.Line
									type='monotone'
									dataKey='enrollment'
									name='Matriculados'
									stroke='green'
									activeDot={{ r: 8 }}
								/>
								<recharts.Line
									type='monotone'
									dataKey='noenrollment'
									name='No Matriculados'
									stroke='red'
									activeDot={{ r: 8 }}
								/>
							</recharts.LineChart>
						</recharts.ResponsiveContainer>
					</react.Box>
				</react.Stack>
			</react.Grid>

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
							Alumnos por Programa
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
							<recharts.Bar
								dataKey='enrollment'
								name='Matriculados'
								fill='#3182CE'
							/>
							<recharts.Bar
								dataKey='noenrollment'
								name='No Matriculados'
								fill='#E53E3E'
							/>
						</recharts.BarChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>
		</react.Stack>
	);
};
