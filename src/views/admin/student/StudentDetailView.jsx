import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { Avatar } from '@/components/ui';
import ApplicantSkeleton from '@/components/ui/ApplicantSkeleton';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadPersonById } from '@/hooks';
import { useReadDocuments } from '@/hooks/documents';
import { useReadEnrollmentsList } from '@/hooks/enrollments/useReadEnrollmentsList';
import { useReadStudentById } from '@/hooks/students';
import { Badge, Box, Flex, Heading, Stack, Tabs, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { useParams } from 'react-router';
import { GeneralDataStudent } from './sections/GeneralDataStudent';
import { EnrollmentStudent } from './sections/EnrollmentStudent';

export const StudentDetailView = () => {
	const { id } = useParams();
	const [tab, setTab] = useState(1);
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataStudent, isLoading: isApplicantLoading } =
		useReadStudentById(decrypted);

	const { data: dataPerson, isLoading: isPersonLoading } = useReadPersonById(
		dataStudent?.person
	);

	const { data: dataEnrollments, isLoading: isLoadingEnrollment } =
		useReadEnrollmentsList({ student: decrypted });

	const myEnrollment = dataEnrollments?.results || [];

	const { data: dataDocuments } = useReadDocuments({
		application: dataStudent?.application,
	});

	const statusEnum = [
		{
			id: 1,
			label: 'Activo',
			bg: 'green',
			color: 'green',
			icon: FiCheckCircle,
		},
		{
			id: 2,
			label: 'Suspendido',
			bg: 'yellow',
			color: 'yellow',
			icon: FiClock,
		},
		{
			id: 3,
			label: 'Graduado',
			bg: 'blue',
			color: 'blue',
			icon: LuGraduationCap,
		},
		{
			id: 4,
			label: 'Retirado',
			bg: 'red',
			color: 'red',
			icon: FiXCircle,
		},
	];

	const statusEnumSelected = statusEnum.find(
		(item) => item.id === dataStudent?.status
	);

	return (
		<Box spaceY='5'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Estudiantes', to: '/students' },
					{ label: `${dataPerson?.first_name} ${dataPerson?.user?.last_name}` },
				]}
			/>

			{isApplicantLoading || isPersonLoading ? (
				<ApplicantSkeleton />
			) : dataStudent ? (
				<Stack mx={'auto'}>
					<Box
						bg='white'
						rounded='lg'
						border='1px solid'
						borderColor='gray.200'
						p={6}
					>
						<Flex
							direction={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'flex-start', md: 'center' }}
							gap={4}
						>
							{/* Avatar + Nombre + Rol */}
							<Flex align='center' gap={4}>
								<Avatar
									boxSize='4rem'
									name={`${dataPerson?.first_name} ${dataPerson?.user?.last_name}`}
									src={dataStudent?.profile_image || '/placeholder.svg'}
								/>
								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
										{isApplicantLoading
											? 'Cargando...'
											: `${dataPerson?.first_name} ${dataPerson?.user?.last_name}`}
									</Text>
								</Box>
							</Flex>

							{/* Badge de estado */}
							{statusEnumSelected && (
								<Badge
									px={3}
									py={1}
									display='flex'
									alignItems='center'
									alignSelf={{ base: 'flex-start', md: 'auto' }}
									border='1px solid'
									borderColor={`${statusEnumSelected.color}.200`}
									bg={`${statusEnumSelected.bg}.50`}
									color={`${statusEnumSelected.color}.700`}
								>
									<Box as={statusEnumSelected.icon} w={4} h={4} mr={1} />
									{statusEnumSelected.label}
								</Badge>
							)}
						</Flex>
					</Box>
					<Tabs.Root
						value={tab}
						onValueChange={(e) => setTab(e.value)}
						size={{ base: 'sm', md: 'md' }}
					>
						<>
							<Box
								overflowX='auto'
								whiteSpace='nowrap'
								css={{
									'&::-webkit-scrollbar': { height: '6px' },
									'&::-webkit-scrollbar-thumb': {
										background: '#A0AEC0', // Color del thumb
										borderRadius: '4px',
									},
								}}
							>
								<Tabs.List minW='max-content' colorPalette='cyan'>
									<Tabs.Trigger
										value={1}
										color={tab === 1 ? 'uni.secondary' : ''}
									>
										Datos Generales
									</Tabs.Trigger>

									<Tabs.Trigger
										value={2}
										color={tab === 2 ? 'uni.secondary' : ''}
									>
										Matriculas
									</Tabs.Trigger>
									<Tabs.Trigger
										value={3}
										color={tab === 3 ? 'uni.secondary' : ''}
									>
										Registro Académico
									</Tabs.Trigger>
									<Tabs.Trigger
										value={4}
										color={tab === 4 ? 'uni.secondary' : ''}
									>
										Postulaciones
									</Tabs.Trigger>
								</Tabs.List>
							</Box>
						</>
						<Tabs.Content value={1}>
							<Stack>
								<GeneralDataStudent
									dataPerson={dataPerson}
									dataDocuments={dataDocuments}
								/>
							</Stack>
						</Tabs.Content>
						<Tabs.Content value={2}>
							<Stack>
								{/* Cargar la tabla de Tipos de Programas */}
								<EnrollmentStudent
									myEnrollment={myEnrollment}
									isLoadingEnrollment={isLoadingEnrollment}
								/>
							</Stack>
						</Tabs.Content>
						<Tabs.Content value={3}>
							<Stack>
								<Stack
									direction={{ base: 'column', sm: 'row' }}
									align={{ base: 'start', sm: 'center' }}
									justify='space-between'
								>
									<Heading size='md'>Gestión de Enfoques de Programas</Heading>
								</Stack>

								{/* Cargar la tabla de Enfoques de Programas */}
							</Stack>
						</Tabs.Content>
					</Tabs.Root>
				</Stack>
			) : (
				<Heading size='sm' color='gray.500'>
					Postulante no encontrado
				</Heading>
			)}
		</Box>
	);
};
