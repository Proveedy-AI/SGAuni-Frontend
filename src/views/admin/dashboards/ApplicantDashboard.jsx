import { useReadMyApplicants, useReadMyRequestBenefits } from '@/hooks';
import { useReadMyPaymentRequest } from '@/hooks/payment_requests';
import { useReadMyPaymentVouchers } from '@/hooks/payment_vouchers/useReadMyPaymentVouchers';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Grid,
	Icon,
	Stack,
	Text,
} from '@chakra-ui/react';
import {
	FiAlertCircle,
	FiArrowRight,
	FiCheckCircle,
	FiClock,
	FiCreditCard,
	FiFileText,
	FiTrendingUp,
} from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { useNavigate } from 'react-router';

export const ApplicantDashboard = () => {
	const { data: dataMyRequests } = useReadMyRequestBenefits();
	console.log('dataMyRequests', dataMyRequests);
	const { data: dataMyApplicants } = useReadMyApplicants();
	console.log('dataMyApplicants', dataMyApplicants);
	const { data: dataMyPaymentVouchers } = useReadMyPaymentVouchers();
	console.log('dataMyPaymentVouchers', dataMyPaymentVouchers);
	const { data: dataMyPaymentRequests } = useReadMyPaymentRequest();

	console.log('dataMyPaymentRequests', dataMyPaymentRequests);

	const totalRequests = dataMyPaymentRequests?.length || 0;
	const approvedRequests =
		dataMyPaymentRequests?.filter((req) => req.status === 3).length || 0;
	const pendingRequests =
		dataMyPaymentRequests?.filter((req) => req.status === 2).length || 0;

	const totalVouchers = dataMyPaymentVouchers?.length || 0;

	const stats = [
		{
			label: 'Total Solicitudes de pagos',
			value: totalRequests,
			color: 'esmerald',
			icon: FiFileText,
			valueColor: 'gray.900',
		},
		{
			label: 'Verificados',
			value: approvedRequests,
			color: 'green',
			icon: FiCheckCircle,
			valueColor: 'green.500',
		},
		{
			label: 'Generados',
			value: pendingRequests,
			color: 'orange',
			icon: FiClock,
			valueColor: 'orange.400',
		},
		{
			label: 'Comprobantes',
			value: totalVouchers,
			color: 'blue',
			icon: FiCreditCard,
			valueColor: 'blue.500',
		},
	];

	const getStatusIcon = (status) => {
		switch (status) {
			case 'Aprobado':
			case 'Verificado':
				return <Icon as={FiCheckCircle} boxSize={4} />;
			case 'En revision':
				return <Icon as={FiClock} boxSize={4} />;
			case 'Incompleto':
				return <Icon as={FiAlertCircle} boxSize={4} />;
			default:
				return <Icon as={FiClock} boxSize={4} />;
		}
	};

	const navigate = useNavigate();
	const handleGoRoute = () => {
		navigate(`/mypaymentsdebts/addBenefits`);
	};
	const handleRoute = () => {
		navigate(`/admissions/myapplicants`);
	};
	return (
		<Stack gap={6}>
			{/* Stats */}
			<Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
				{stats.map((stat, i) => (
					<Card.Root
						key={i}
						borderLeft='4px solid'
						borderLeftColor={`${stat.color}.400`}
						_hover={{ shadow: 'lg' }}
						transition='all 0.2s'
					>
						<Card.Body p={6}>
							<Flex align='center' justify='space-between'>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										{stat.label}
									</Text>
									<Text
										fontSize='3xl'
										fontWeight='bold'
										color={stat.valueColor}
									>
										{stat.value}
									</Text>
								</Box>
								<Icon as={stat.icon} boxSize={8} color={`${stat.color}.500`} />
							</Flex>
						</Card.Body>
					</Card.Root>
				))}
			</Grid>
			<Card.Root
				_hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
				transition='all 0.3s'
			>
				{/* Header */}
				<Card.Header pb={4}>
					<Flex align='center' gap={3}>
						<Box p={2} bg='green.50' rounded='lg'>
							<Icon as={FiFileText} boxSize={6} color='green.600' />
						</Box>
						<Box>
							<Card.Title fontWeight='bold' fontSize='xl'>
								Solicitudes de Beneficios
							</Card.Title>
							<Card.Description color='gray.600'>
								Ver el estado de tus solicitudes
							</Card.Description>
						</Box>
					</Flex>
				</Card.Header>

				{/* Body */}
				<Card.Body display='flex' flexDirection='column' gap={4}>
					{dataMyRequests?.slice(0, 2).map((request) => (
						<Box
							key={request.id}
							p={4}
							bg='gray.50'
							rounded='lg'
							display='flex'
							flexDirection='column'
							gap={2}
						>
							<Flex align='center' justify='space-between'>
								<Text fontWeight='semibold' fontSize='sm'>
									{request.type_display}
								</Text>

								<Badge
									colorPalette={
										request?.status_benefit === 1
											? 'gray'
											: request?.status_benefit === 2
												? 'blue'
												: request?.status_benefit === 3
													? 'red'
													: request?.status_benefit === 4
														? 'green'
														: 'gray'
									}
									display='flex'
									alignItems='center'
									gap={1}
									px={2}
									py={0.5}
									rounded='md'
								>
									{getStatusIcon(request.status_benefit_display)}
									{request?.status_benefit_display}
								</Badge>
							</Flex>

							<Text fontSize='sm' color='gray.600'>
								{request.enrollment_period_program}
							</Text>
							<Text fontSize='xs' color='gray.500'>
								Período: {request.enrollment_period}
							</Text>

							{request.has_benefit && request.studentbenefit && (
								<Flex align='center' gap={2} fontSize='sm' color='green.600'>
									<Icon as={FiTrendingUp} boxSize={4} />
									Descuento:{' '}
									{(
										Number.parseFloat(
											request.studentbenefit.discount_percentage
										) * 100
									).toFixed(0)}
									%
								</Flex>
							)}
						</Box>
					))}

					{totalRequests > 2 && (
						<Text fontSize='sm' color='gray.500' textAlign='center'>
							+{totalRequests - 2} solicitudes más
						</Text>
					)}

					<Button
						w='full'
						bg='green.600'
						_hover={{ bg: 'green.700' }}
						color='white'
						onClick={handleGoRoute}
					>
						Ver Todas las Solicitudes <FiArrowRight size={16} />
					</Button>
				</Card.Body>
			</Card.Root>
			<Card.Root
				_hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
				transition='all 0.3s'
			>
				{/* Header */}
				<Card.Header pb={4}>
					<Flex align='center' gap={3}>
						<Box p={2} bg='blue.50' rounded='lg'>
							<Icon as={LuGraduationCap} boxSize={6} color='blue.600' />
						</Box>
						<Box>
							<Card.Title fontWeight='bold' fontSize='xl'>
								Historial de Postulaciones
							</Card.Title>
							<Card.Description color='gray.600'>
								Explora tus postulaciones anteriores
							</Card.Description>
						</Box>
					</Flex>
				</Card.Header>

				{/* Body */}
				<Card.Body display='flex' flexDirection='column' gap={4}>
					{dataMyApplicants?.slice(0, 1).map((applicant) => {
						const completedDocs =
							applicant.rules?.filter((rule) => rule.is_required).length || 0;

						return (
							<Box
								key={applicant.id}
								p={4}
								bg='gray.50'
								rounded='lg'
								display='flex'
								flexDirection='column'
								gap={3}
							>
								<Flex align='center' justify='space-between'>
									<Text fontWeight='semibold'>
										{applicant.postgraduate_name}
									</Text>

									<Badge
										colorPalette={
											applicant?.status_display === 'Incompleto'
												? 'orange'
												: applicant?.status_display === 'Completado'
													? 'blue'
													: applicant?.status_display === 'Evaluado'
														? 'purpule'
														: applicant?.status_display === 'Aprobado'
															? 'green'
															: applicant?.status_display === 'Rechazado'
																? 'red'
																: 'gray'
										}
										display='flex'
										alignItems='center'
										gap={1}
										px={2}
										py={0.5}
										rounded='md'
									>
										{getStatusIcon(applicant.status_display)}
										{applicant?.status_display}
									</Badge>
								</Flex>

								{/* Datos */}
								<Box display='flex' flexDirection='column' gap={1}>
									<Text fontSize='sm' color='gray.600'>
										<Text as='span' fontWeight='medium'>
											Modalidad:
										</Text>{' '}
										{applicant.modality_display}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										<Text as='span' fontWeight='medium'>
											Proceso:
										</Text>{' '}
										{applicant.admission_process_name}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										<Text as='span' fontWeight='medium'>
											Inicio:
										</Text>{' '}
										{applicant.semester_start_date}
									</Text>
								</Box>

								{/* Progreso */}
								<Box>
									<Flex justify='space-between' fontSize='sm' mb={1}>
										<Text>Documentos Requeridos</Text>
										<Text>{completedDocs}</Text>
									</Flex>
								</Box>
							</Box>
						);
					})}

					<Button
						onClick={handleRoute}
						variant='outline'
						colorPalette='blue'
						w='full'
					>
						Ver Historial Completo <FiArrowRight size={16} />
					</Button>
				</Card.Body>
			</Card.Root>
		</Stack>
	);
};
