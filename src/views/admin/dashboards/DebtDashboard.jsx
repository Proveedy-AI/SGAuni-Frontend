// dashboard/AdminDashboard.jsx
import { ReactSelect } from '@/components';
import { Field } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useReadEnrollmentsPrograms } from '@/hooks/enrollments_programs';
import { useReadMethodPayment } from '@/hooks/method_payments';
import {
	Box,
	Card,
	Grid,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { /*useMemo,*/ useState } from 'react';
import { FiCreditCard, FiDollarSign, FiFileText } from 'react-icons/fi';
import { HiClipboardList } from 'react-icons/hi';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export const DebtDashboard = () => {
	const [incomesFlow] = useState('1');
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedProgramEnrollment, setSelectedProgramEnrollment] =
		useState(null);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedMethod, setSelectedMethod] = useState(null);
	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadAdmissionsPrograms({ status: 4 });

	const {
		data: dataProgramsEnrollment,
		isLoading: isLoadingProgramsEnrollment,
	} = useReadEnrollmentsPrograms({ status: 4 });

	const { data: dataMethodsPayment, isLoading: isLoadingMethodsPayment } =
		useReadMethodPayment();

	/*const filterParams = useMemo(() => {
		const params = {};
		if (selectedProgram) params.admission_program = selectedProgram.value;
		if (selectedProgramEnrollment)
			params.enrollment_program = selectedProgramEnrollment.value;
		if (selectedMethod) params.method_payment = selectedMethod.value;
		if (startDate) params.start_date = startDate;
		if (endDate) params.end_date = endDate;

		return params;
	}, [
		selectedProgram,
		selectedProgramEnrollment,
		selectedMethod,
		startDate,
		endDate,
	]);

	const {
		data: dataReportsdebts,
		isLoading: loadingReportsdebts,
		refetch: fetchReportsdebts,
	} = useReadDataReportdebts(filterParams, {});*/

	// Simulación de datos reales
	const dataIncomesFlow = {
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
		totalIncome: 5000,
		totalDebts: 4000,
		totalRequest: 900,
		totalOrders: 500,
		totalEntrants: 300,
		totalRetired: 100,
	};

	const loadingIncomesFlow = false;

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

	const allPrograms =
		dataPrograms?.pages?.flatMap((page) => page.results) ?? [];
	const ProgramsOptions =
		allPrograms?.map((program) => ({
			label: `${program.program_name} - ${program.admission_process_name}`,
			value: program.id,
		})) || [];

	const EnrollmentOptions =
		dataProgramsEnrollment?.results?.map((program) => ({
			label: `${program.program_name} - ${program.enrollment_period_name}`,
			value: program.id,
		})) || [];

	const MethodsPaymentOptions =
		dataMethodsPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	return (
		<Stack gap={4}>
			<Box bg='white' p={4} rounded='lg' shadow='sm'>
				<SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
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

					<Field label='Periodo de Admisión:'>
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
					<Field label='Periodo de Matricula:'>
						<ReactSelect
							placeholder='Seleccionar'
							value={selectedProgramEnrollment}
							onChange={setSelectedProgramEnrollment}
							isLoading={isLoadingProgramsEnrollment}
							variant='flushed'
							size='xs'
							isSearchable
							isClearable
							options={EnrollmentOptions}
						/>
					</Field>
				</SimpleGrid>
			</Box>

			<Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
				{/* Total de Ingresos */}
				<Card.Root bg='white' shadow='sm'>
					<Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<Card.Title fontSize='sm' fontWeight='medium' color='gray.600'>
							Total de Ingresos
						</Card.Title>
						<Box
							w={10}
							h={10}
							bg='green.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiDollarSign size={20} color='#16a34a' />
						</Box>
					</Card.Header>
					<Card.Body>
						<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							S/.{dataIncomesFlow?.totalIncome || 0}
						</Text>
					</Card.Body>
				</Card.Root>

				{/* Total de Deuda */}
				<Card.Root bg='white' shadow='sm'>
					<Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<Card.Title fontSize='sm' fontWeight='medium' color='gray.600'>
							Total de Deuda
						</Card.Title>
						<Box
							w={10}
							h={10}
							bg='red.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiFileText size={20} color='#dc2626' />
						</Box>
					</Card.Header>
					<Card.Body>
						<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							S/. {dataIncomesFlow.totalDebts || 0}
						</Text>
					</Card.Body>
				</Card.Root>

				{/* Solicitudes */}
				<Card.Root bg='white' shadow='sm'>
					<Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<Card.Title fontSize='sm' fontWeight='medium' color='gray.600'>
							Solicitudes
						</Card.Title>
						<Box
							w={10}
							h={10}
							bg='blue.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<HiClipboardList size={20} color='#2563eb' />
						</Box>
					</Card.Header>
					<Card.Body>
						<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataIncomesFlow?.totalRequest || 0}
						</Text>
					</Card.Body>
				</Card.Root>

				{/* Órdenes de Pago */}
				<Card.Root bg='white' shadow='sm'>
					<Card.Header
						display='flex'
						flexDirection='row'
						alignItems='center'
						justifyContent='space-between'
						pb={2}
					>
						<Card.Title fontSize='sm' fontWeight='medium' color='gray.600'>
							Órdenes de Pago
						</Card.Title>
						<Box
							w={10}
							h={10}
							bg='purple.100'
							rounded='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FiCreditCard size={20} color='#7e22ce' />
						</Box>
					</Card.Header>
					<Card.Body>
						<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
							{dataIncomesFlow?.totalOrders || 0}
						</Text>
					</Card.Body>
				</Card.Root>
			</Grid>

			<Card.Root bg='white' shadow='sm'>
				<Card.Header>
					<Card.Title fontSize='lg' fontWeight='semibold' color='gray.900'>
						Cantidad de Estudiantes
					</Card.Title>
				</Card.Header>
				<Card.Body>
					<Card.Root
						display='grid'
						gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
						gap={6}
					>
						<Card.Root
							bg='green.50'
							p={4}
							rounded='lg'
							borderWidth='1px'
							borderColor='green.200'
						>
							<Card.Body p={0}>
								<Card.Title
									fontSize='sm'
									fontWeight='medium'
									color='green.700'
									mb={1}
								>
									Inscritos
								</Card.Title>
								<Card.Title fontSize='3xl' fontWeight='bold' color='green.900'>
									{dataIncomesFlow?.totalEntrants || 0}
								</Card.Title>
							</Card.Body>
						</Card.Root>

						<Card.Root
							bg='red.50'
							p={4}
							rounded='lg'
							borderWidth='1px'
							borderColor='red.200'
						>
							<Card.Body p={0}>
								<Card.Title
									fontSize='sm'
									fontWeight='medium'
									color='red.700'
									mb={1}
								>
									Retirados
								</Card.Title>
								<Card.Title fontSize='3xl' fontWeight='bold' color='red.900'>
									{dataIncomesFlow?.totalRetired || 0}
								</Card.Title>
							</Card.Body>
						</Card.Root>
					</Card.Root>
				</Card.Body>
			</Card.Root>

			<Stack
				bg={{ base: 'white', _dark: 'its.gray.500' }}
				p='4'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				gap='1'
			>
				<Stack
					justify='space-between'
					align='center'
					w='full'
					direction={{ base: 'column', sm: 'row' }}
				>
					<Box w='full'>
						<Heading
							size={{
								xs: 'xs',
								sm: 'sm',
								md: 'md',
							}}
						>
							Flujo monetario neto
						</Heading>
					</Box>
				</Stack>

				<Box w='full' h='400px'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
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
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='name' />
							<YAxis />
							<Tooltip />
							<Legend
								align='center'
								verticalAlign='top'
								wrapperStyle={{ paddingBottom: '10px' }}
							/>
							<Line
								type='monotone'
								dataKey='currentRevenue'
								name='Ingresos'
								stroke='green'
								activeDot={{ r: 8 }}
							/>
							<Line
								type='monotone'
								dataKey='previousRevenue'
								name='Deudas'
								stroke='red'
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>
			</Stack>
		</Stack>
	);
};
