import {
	FiAlertTriangle,
	FiCheckCircle,
	FiClock,
	FiInfo,
	FiLayers,
	FiTrendingUp,
} from 'react-icons/fi';

import {
	Box,
	Heading,
	Text,
	Flex,
	Stack,
	SimpleGrid,
	Badge,
	Button,
	Spacer,
	Collapsible,
	Image,
	IconButton,
	Card,
	Icon,
} from '@chakra-ui/react';
import { useReadMyEnrollments } from '@/hooks/person/useReadMyEnrollments';
import { Alert } from '@/components/ui';
import { useNavigate } from 'react-router';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { useReadMyCredits, useUpdateNotifications } from '@/hooks';
import { LuCheckCheck } from 'react-icons/lu';
import React from 'react';

export const StudentDashboard = () => {
	const { data: dataMyEnrollments } = useReadMyEnrollments();
	const { data: dataMyCredits } = useReadMyCredits();

	const { data: profile } = useReadUserLogged();
	const { mutate: updateNotifications } = useUpdateNotifications();

	const handleMarkAsSeen = () => {
		if (profile && profile.admission_notification_uuid) {
			updateNotifications({
				id: profile.admission_notification_uuid,
			});
		}
	};

  const filteredPrograms = profile?.student?.admission_programs?.filter((program) => program?.academic_status === 1);
  console.log(filteredPrograms);
  const filteredMyCredits = Object.values(dataMyCredits?.result || {}).filter((credits) =>
    filteredPrograms?.some(
      (program) => program?.program_name?.trim() === credits?.program_name?.trim()
    )
  );

	/*const dataMyEnrollments = [
		{
			id: 1,
			student: 1,
			enrollment_period_program: 1,
			program_name: 'Ingeniería de Sistemas',
			payment_verified: true,
			is_first_enrollment: true,
			status: 1,
			status_display: 'Activo',
			verified_at: '2024-01-15T10:30:00Z',
		},
	];*/
	const currentEnrollments =
		dataMyEnrollments?.filter(
			(enrollment) => enrollment.is_current_enrollment === true
		) || [];
	const activeEnrollments =
		currentEnrollments?.filter((enrollment) => enrollment.status === 1) || [];

	const firstTimeEnrollments =
		currentEnrollments?.filter(
			(enrollment) => enrollment.is_first_enrollment === true
		) || [];
	const navigate = useNavigate();
	const handleGoRoute = () => {
		navigate(`/mypaymentsdebts/addrequests`);
	};

	const handleGoRouteProfile = () => {
		navigate(`/settings/myprofile`);
	};

	const hasMatriculatedEnrollment = dataMyEnrollments?.some(
		(enrollment) => enrollment.status === 5
	);

	const shouldShowAlert =
		hasMatriculatedEnrollment && !profile?.student?.student_code;

	const enrollmentStatusMap = {
		1: {
			label: 'Pago pendiente',
			color: 'yellow',
			bg: 'yellow.50',
			border: 'yellow.200',
		},
		2: {
			label: 'Pago parcial',
			color: 'orange',
			bg: 'orange.50',
			border: 'orange.200',
		},
		3: {
			label: 'Pago vencido',
			color: 'red',
			bg: 'red.50',
			border: 'red.200',
		},
		4: {
			label: 'Elegible',
			color: 'blue',
			bg: 'blue.50',
			border: 'blue.200',
		},
		5: {
			label: 'Matriculado',
			color: 'green',
			bg: 'green.50',
			border: 'green.200',
		},
		6: {
			label: 'Cancelado',
			color: 'gray',
			bg: 'gray.50',
			border: 'gray.200',
		},
		7: {
			label: 'No matriculado',
			color: 'purple',
			bg: 'purple.50',
			border: 'purple.200',
		},
	};

	const recentEnrollments = dataMyEnrollments?.slice(-3) || [];

	return (
		<Stack mx='auto' gap={4}>
			{profile && profile.admission_notification_uuid && (
				<Collapsible.Root unmountOnExit defaultOpen={true}>
					<Collapsible.Content>
						<Box
							p={6}
							mb={4}
							borderRadius='xl'
							bgImage="url('/img/congratulation.png')"
							bgSize='cover'
							bgPosition='center'
							mx='auto'
							color='white'
							boxShadow='md'
							position='relative'
						>
							<SimpleGrid
								columns={{ base: 1, md: 2 }}
								spacing={6}
								alignItems='center'
							>
								{/* Texto y botón */}
								<Box p={4}>
									<Flex alignItems='center' gap={3}>
										<Text fontSize={{ base: '4xl', md: '5xl' }} lineHeight={1}>
											🎉
										</Text>
										<Heading
											color='black'
											fontSize={{ base: '2xl', md: '3xl' }}
											lineHeight='short'
										>
											¡Felicidades, Ingresaste!
										</Heading>
									</Flex>

									<Box mt={5}>
										<Button
											colorPalette='green'
											size='md'
											borderRadius='lg'
											onClick={() => {}}
										>
											Ver resultados
										</Button>
									</Box>
								</Box>

								{/* GIF grande con efecto */}
								<Box
									p={4}
									borderRadius='xl'
									mb={{ base: 0, md: 10 }}
									display='flex'
									alignItems='center'
									justifyContent='center'
									maxH={{ base: '200px', md: '100px' }}
									transform='rotateX(5deg) rotateY(5deg)'
									transition='transform 0.3s ease-in-out'
									_hover={{
										transform: 'rotateX(0deg) rotateY(0deg) scale(1.03)',
									}}
								>
									<Image
										src='/img/congratulations.gif'
										alt='Celebración'
										maxW={{ base: '80%', md: '100%' }}
										maxH={{ base: '200px', md: '250px' }}
										objectFit='contain'
									/>
								</Box>
							</SimpleGrid>
						</Box>
					</Collapsible.Content>

					{/* Botón fuera del box, parte inferior */}
					<Collapsible.Trigger asChild>
						<Flex
							justify='end'
							w={{ base: 'full', md: '95%' }}
							mx='auto'
							mb={4}
						>
							<IconButton
								size='sm'
								variant='ghost'
								onClick={handleMarkAsSeen}
								aria-label='Cerrar panel'
								_hover={{ color: 'blue.500' }}
							>
								<LuCheckCheck /> Marcar como visto
							</IconButton>
						</Flex>
					</Collapsible.Trigger>
				</Collapsible.Root>
			)}
			{profile?.student?.status === 2 && (
				<Alert
					status='warning'
					borderRadius='md'
					icon={<FiAlertTriangle />}
					title='¡Advertencia! Su cuenta ha sido suspendida 💡'
				>
					Tu cuenta se encuentra actualmente suspendida. Esto puede deberse a
					pagos pendientes u otras razones administrativas.
				</Alert>
			)}
			<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
				{Object.values(filteredMyCredits || {})?.map((program) => (
					<React.Fragment key={program.program_id}>
						{/* Créditos Totales */}
						<Card.Root
							borderWidth='1px'
							borderColor='gray.100'
							shadow='sm'
							rounded='xl'
						>
							<Card.Body p={5}>
								<Flex align='center' gap={4}>
									<Flex
										w={12}
										h={12}
										align='center'
										justify='center'
										rounded='full'
										bg='blue.50'
									>
										<Icon as={FiLayers} boxSize={6} color='blue.500' />
									</Flex>
									<Flex direction='column'>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											{program.program_name} - Créditos Totales
										</Text>
										<Text fontSize='2xl' fontWeight='bold' color='blue.600'>
											{program.total_credits}
										</Text>
									</Flex>
								</Flex>
							</Card.Body>
						</Card.Root>

						{/* Créditos Usados */}
						<Card.Root
							borderWidth='1px'
							borderColor='gray.100'
							shadow='sm'
							rounded='xl'
						>
							<Card.Body p={5}>
								<Flex align='center' gap={4}>
									<Flex
										w={12}
										h={12}
										align='center'
										justify='center'
										rounded='full'
										bg='yellow.50'
									>
										<Icon as={FiTrendingUp} boxSize={6} color='yellow.500' />
									</Flex>
									<Flex direction='column'>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Créditos Usados
										</Text>
										<Text fontSize='2xl' fontWeight='bold' color='yellow.600'>
											{program.used_credits}
										</Text>
									</Flex>
								</Flex>
							</Card.Body>
						</Card.Root>

						{/* Créditos Restantes */}
						<Card.Root
							borderWidth='1px'
							borderColor='gray.100'
							shadow='sm'
							rounded='xl'
						>
							<Card.Body p={5}>
								<Flex align='center' gap={4}>
									<Flex
										w={12}
										h={12}
										align='center'
										justify='center'
										rounded='full'
										bg='green.50'
									>
										<Icon as={FiCheckCircle} boxSize={6} color='green.500' />
									</Flex>
									<Flex direction='column'>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Créditos Restantes
										</Text>
										<Text fontSize='2xl' fontWeight='bold' color='green.600'>
											{program.available_credits}
										</Text>
									</Flex>
								</Flex>
							</Card.Body>
						</Card.Root>
					</React.Fragment>
				))}
			</SimpleGrid>
			<Stack gap={4} mb={2}>
				{activeEnrollments.length > 0 && (
					<Alert
						status='success'
						borderRadius='md'
						px={4}
						py={3}
						alignItems='center'
						title='¡Solicitud de matrícula disponible! 🎓'
						icon={<FiCheckCircle />}
					>
						<Flex w='full' align='center'>
							<Box>
								<Box fontSize='sm'>
									Ya puedes generar tu solicitud de matrícula. Tienes{' '}
									{activeEnrollments.length}{' '}
									{activeEnrollments.length === 1
										? 'inscripción activa'
										: 'inscripciones activas'}
									.
								</Box>
							</Box>

							<Spacer />

							<Button
								colorPalette='green'
								size='sm'
								onClick={() => handleGoRoute()}
							>
								Ir a matrícula
							</Button>
						</Flex>
					</Alert>
				)}

				{firstTimeEnrollments.length > 0 && (
					<Alert
						status='info'
						borderRadius='md'
						icon={<FiInfo />}
						title='Recordatorio importante 💡'
					>
						Como es tu primera inscripción, recuerda que el siguiente mes
						deberás realizar el pago por concepto de &quot;derecho de admisión -
						II&quot;.
					</Alert>
				)}

				{shouldShowAlert && (
					<Alert
						status='info'
						borderRadius='md'
						icon={<FiInfo />}
						title='¡Acción requerida!'
						mb={4}
					>
						<Flex w='full' align='center'>
							<Box>
								Ya estás matriculado, pero no has registrado tu{' '}
								<b>código universitario</b>. Es urgente que actualices este dato
								para continuar sin inconvenientes.
								<Box mt={2} color='orange.500' fontSize='sm'>
									⚠️ También recuerda registrar tu <b>correo institucional</b> como tu username.
								</Box>
							</Box>
							<Spacer />

							<Button
								colorPalette='red'
								size='sm'
								onClick={() => handleGoRouteProfile()}
							>
								Actualizar
							</Button>
						</Flex>
					</Alert>
				)}

				{dataMyEnrollments && dataMyEnrollments.length === 0 && (
					<Alert
						status='warning'
						borderRadius='md'
						icon={<FiAlertTriangle />}
						title='Sin inscripciones activas'
					>
						<Box>
							No tienes inscripciones registradas en este momento. Contacta al
							área académica para más información.
						</Box>
					</Alert>
				)}
			</Stack>

			{recentEnrollments.length > 0 && (
				<Box>
					<Heading size='md' mb={4}>
						Mis Matriculas ({dataMyEnrollments.length})
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
						{recentEnrollments.map((enrollment) => {
							const status = enrollmentStatusMap[enrollment.status] || {
								label: 'Desconocido',
								color: 'gray',
								bg: 'gray.50',
								border: 'gray.200',
							};

							return (
								<Box
									key={enrollment.id}
									p={4}
									borderWidth={2}
									borderRadius='lg'
									bg={status.bg}
									borderColor={status.border}
									_hover={{
										borderColor: status.border.replace('.200', '.300'),
										boxShadow: 'md',
									}}
								>
									<Flex justify='space-between' align='start' mb={3}>
										<Text fontWeight='semibold'>
											{enrollment.program_name || `Programa ${enrollment.id}`}
										</Text>
										<Badge colorPalette={status.color} variant='subtle'>
											{status.label}
										</Badge>
									</Flex>

									<Stack spacing={1} fontSize='sm' color='gray.600'>
										<Text>ID: {enrollment.id}</Text>
										<Text>
											Pago verificado:{' '}
											{enrollment.payment_verified ? '✅ Sí' : '❌ No'}
										</Text>
										<Text>
											Primera inscripción:{' '}
											{enrollment.is_first_enrollment ? '✅ Sí' : '❌ No'}
										</Text>
										{enrollment.verified_at && (
											<Flex align='center'>
												<Box as={FiClock} w={4} h={4} mr={2} color='gray.400' />
												Verificado:{' '}
												{new Date(enrollment.verified_at).toLocaleDateString()}
											</Flex>
										)}
									</Stack>
								</Box>
							);
						})}
					</SimpleGrid>

					{/* Botón para ver más si hay más de 2 */}
					{dataMyEnrollments.length > 3 && (
						<Flex justify='end' mt={1}>
							<Button
								variant='gost'
								onClick={() => navigate('/mycourses')}
								_hover={{
									color: 'blue.500',
								}}
							>
								Ver todos
							</Button>
						</Flex>
					)}
				</Box>
			)}
		</Stack>
	);
};
