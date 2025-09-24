import { ReactSelect } from '@/components';
import { Field } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadPrograms } from '@/hooks';
import { useReadAdmissions } from '@/hooks/admissions_proccess';
import { useReadEnrollments } from '@/hooks/enrollments_proccess';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useReadDataDashPayment } from '@/hooks/reports';
import * as react from '@chakra-ui/react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { FiCreditCard, FiDollarSign, FiFileText } from 'react-icons/fi';
import { HiClipboardList } from 'react-icons/hi';
import * as recharts from 'recharts';

export const ReportsFinancial = () => {
	const today = new Date();

	// primer día del mes actual
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// formatear en YYYY-MM-DD
	const formatDate = (date) => date.toISOString().split('T')[0];
	const [incomesFlow] = useState('1');
	const [selectedProgram, setSelectedProgram] = useState([]);
	const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
	const [endDate, setEndDate] = useState(formatDate(today));
	const [selectedMethod, setSelectedMethod] = useState(null);
	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadPrograms();
	const [selectedPeriod, setSelectedPeriod] = useState([]);
	const [selectedTypePeriod, setSelectedTypePeriod] = useState('');

	const { data: dataMethodsPayment, isLoading: isLoadingMethodsPayment } =
		useReadMethodPayment();
	const { data: dataPeriodEnrollments, isLoading: isLoadingPeriodEnrollment } =
		useReadEnrollments();

	const { data: dataPeriodAdmission, isLoading: isLoadingPeriodAdmission } =
		useReadAdmissions();

	const filterParams = useMemo(() => {
		const params = {};
		if (selectedPeriod?.length > 0 && selectedTypePeriod) {
			if (selectedTypePeriod === 'admission') {
				params.admission_process = selectedPeriod
					.map((opt) => opt.value)
					.join(',');
			} else if (selectedTypePeriod === 'enrollment') {
				params.enrollment_period = selectedPeriod
					.map((opt) => opt.value)
					.join(',');
			}
		}
		if (selectedProgram?.length > 0) {
			params.program_id = selectedProgram.map((opt) => opt.value).join(',');
		}
		if (selectedMethod) params.method_payment = selectedMethod.value;
		if (startDate) params.start_date = startDate;
		if (endDate) params.end_date = endDate;

		return params;
	}, [
		selectedProgram,
		selectedPeriod,
		selectedTypePeriod,
		selectedMethod,
		startDate,
		endDate,
	]);

	const { data: dataIncomesFlow, isLoading: loadingIncomesFlow } =
		useReadDataDashPayment(filterParams, {});

	// Simulación de datos reales
	/*const dataIncomesFlow = {
		income: {
			dailyRevenue: [
				{ date: '2024-06-01', PEN: 1200 },
				{ date: '2024-06-02', PEN: 1350 },
				{ date: '2024-06-03', PEN: 1100 },
				{ date: '2024-06-04', PEN: 1450 },
			],
		},
		debts: {
			dailyRevenue: [
				{ date: '2024-05-29', PEN: 1000 },
				{ date: '2024-05-30', PEN: 1250 },
				{ date: '2024-05-31', PEN: 1050 },
				{ date: '2024-06-01', PEN: 1300 },
			],
		},
		programData: [
			{ name: 'Ingeniería de Sistemas', income: 120, debts: 20 },
			{ name: 'Administración de Empresas', income: 80, debts: 10 },
		],
		semesterData: [
			{ name: '2023-1', income: 1200, debts: 1000 },
			{ name: '2023-2', income: 1350, debts: 1250 },
			{ name: '2024-1', income: 1100, debts: 1050 },
			{ name: '2024-2', income: 1450, debts: 1300 },
		],
		totalIncome: 5000,
		totalDebts: 4000,
		totalRequest: 900,
		totalOrders: 500,
	};*/

	//const loadingIncomesFlow = false;
	const barData = dataIncomesFlow?.programData;
	const areaData = dataIncomesFlow?.semesterData;
	const lineData =
		loadingIncomesFlow || incomesFlow === '1'
			? dataIncomesFlow?.income?.dailyRevenue?.map((entry, index) => ({
					name: entry.date,
					currentRevenue: entry.PEN,
					previousRevenue:
						dataIncomesFlow?.debts?.dailyRevenue[index]?.PEN || 0,
				})) || []
			: dataIncomesFlow?.income?.monthlyRevenue?.map((entry) => ({
					name: entry.month,
					currentRevenue: entry.PEN,
					previousRevenue:
						dataIncomesFlow?.debts?.monthlyRevenue.find(
							(prev) => prev.month === entry.month
						)?.PEN || 0,
				})) || [];

	const ProgramsOptions =
		dataPrograms?.results?.map((program) => ({
			value: program.id,
			label: program.name,
		})) || [];

	const MethodsPaymentOptions =
		dataMethodsPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const PeriodOptions = useMemo(() => {
		if (selectedTypePeriod === 'enrollment') {
			return (
				dataPeriodEnrollments?.results?.map((period) => ({
					label: period.academic_period_name, // 👈 usa el campo correcto según tu API
					value: period.id,
					start_date: period.start_date,
					end_date: period.end_date,
				})) || []
			);
		}

		if (selectedTypePeriod === 'admission') {
			return (
				dataPeriodAdmission?.results?.map((period) => ({
					label: period.admission_process_name,
					value: period.id,
					start_date: period.start_date,
					end_date: period.end_date,
				})) || []
			);
		}

		return [];
	}, [selectedTypePeriod, dataPeriodEnrollments, dataPeriodAdmission]);

	return (
		<react.Stack gap={4}>
			<react.Box bg='white' p={4} rounded='lg' shadow='sm'>
				<react.SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
					{/* Filtrar por Fecha */}
					<Field label='Tipo de Periodo:'>
						<ReactSelect
							placeholder='Seleccionar'
							value={
								selectedTypePeriod
									? {
											label:
												selectedTypePeriod === 'admission'
													? 'Admisión'
													: 'Matrícula',
											value: selectedTypePeriod,
										}
									: null
							}
							onChange={(option) =>
								setSelectedTypePeriod(option?.value || null)
							}
							variant='flushed'
							size='xs'
							isSearchable={false}
							isClearable={true}
							options={[
								{ label: 'Admisión', value: 'admission' },
								{ label: 'Matrícula', value: 'enrollment' },
							]}
						/>
					</Field>

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
							isLoading={isLoadingPeriodEnrollment || isLoadingPeriodAdmission}
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

					{/* Filtrar por Método de Pago */}
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
							Total de Ingresos
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
							<FiDollarSign size={20} color='#16a34a' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							S/.{dataIncomesFlow?.totalIncome || 0}
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
							Total de Deuda
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
							<FiFileText size={20} color='#dc2626' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							S/. {dataIncomesFlow?.totalDebts || 0}
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
							Solicitudes
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
							<HiClipboardList size={20} color='#2563eb' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataIncomesFlow?.totalRequest || 0}
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
							Órdenes de Pago
						</react.Card.Title>
						<react.Box
							w={10}
							h={10}
							bg='purple.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiCreditCard size={20} color='#7e22ce' />
						</react.Box>
					</react.Card.Header>
					<react.Card.Body>
						<react.Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataIncomesFlow?.totalOrders || 0}
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
							Flujo monetario neto
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
								dataKey='currentRevenue'
								name='Ingresos'
								stroke='green'
								activeDot={{ r: 8 }}
							/>
							<recharts.Line
								type='monotone'
								dataKey='previousRevenue'
								name='Deudas'
								stroke='red'
								activeDot={{ r: 8 }}
							/>
						</recharts.LineChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>

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
							Flujo por Semestre
						</react.Heading>
					</react.Box>
				</react.Stack>

				<react.Box w='full' h='400px'>
					<recharts.ResponsiveContainer width='100%' height='100%'>
						<recharts.AreaChart
							width={500}
							height={300}
							data={areaData}
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
							<recharts.Area
								type='monotone'
								dataKey='income'
								name='Ingresos'
								stroke='green'
								fill='rgba(0, 128, 0, 0.3)'
								activeDot={{ r: 8 }}
							/>

							<recharts.Area
								type='monotone'
								dataKey='debts'
								name='Deudas'
								stroke='red'
								fill='rgba(255, 0, 0, 0.3)'
								activeDot={{ r: 8 }}
							/>
						</recharts.AreaChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>

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
							Flujo por Programa
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
							<recharts.Bar dataKey='income' name='Ingresos' fill='#3182CE' />
							<recharts.Bar dataKey='debts' name='Deudas' fill='#E53E3E' />
						</recharts.BarChart>
					</recharts.ResponsiveContainer>
				</react.Box>
			</react.Stack>
		</react.Stack>
	);
};
