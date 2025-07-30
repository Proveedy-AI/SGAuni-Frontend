import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { Avatar } from '@/components/ui';
import ApplicantSkeleton from '@/components/ui/ApplicantSkeleton';
import { formatDateString } from '@/components/ui/dateHelpers';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadPersonById } from '@/hooks';
import { useReadStudentById } from '@/hooks/students';
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	FiCheckCircle,
	FiClock,
	FiPhone,
	FiUser,
	FiXCircle,
} from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { useParams } from 'react-router';

export const StudentDetailView = () => {
	const { id } = useParams();

	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataStudent, isLoading: isApplicantLoading } =
		useReadStudentById(decrypted);

	const { data: dataPerson, isLoading: isPersonLoading } = useReadPersonById(
		dataStudent?.person
	);
	console.log(dataPerson);
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

	const documentTypes = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'C.E.' },
		{ value: 4, label: 'Cédula' },
	];
	const documentTypeLabel =
		documentTypes.find((dt) => dt.value === dataPerson?.document_type)?.label ||
		'—';

	const gender = [
		{ value: 1, label: 'Masculino' },
		{ value: 2, label: 'Femenino' },
		{ value: 3, label: 'Otro' },
	];

	const genderLabel =
		gender.find((dt) => dt.value === dataPerson?.gender)?.label || '—';
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
				<Stack spaceY='5' mx={'auto'}>
					<Box
						bg='white'
						rounded='lg'
						border='1px solid'
						borderColor='gray.200'
						shadow='md'
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
					<SimpleGrid columns={{ base: 1, lg: 1 }} gap={6}>
						<Box>
							<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
								<Card.Root shadow='md'>
									<Card.Header pb={0}>
										<HStack gap={2}>
											<Icon as={FiUser} boxSize={5} />
											<Heading size='md'>Información Personal</Heading>
										</HStack>
									</Card.Header>

									<Card.Body>
										<VStack align='stretch' gap={4}>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Nombre completo
													</Text>
													<Text color='gray.900'>
														{dataPerson?.first_name}{' '}
														{dataPerson?.user?.last_name}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Fecha de Nacimiento
													</Text>
													<Text color='gray.900'>
														{dataPerson?.birth_date
															? formatDateString(dataPerson.birth_date)
															: '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Documento de Identidad
													</Text>
													<Text color='gray.900'>
														{documentTypeLabel} : {dataPerson?.document_number}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Género
													</Text>
													<Text color='gray.900'>{genderLabel || '—'}</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Foto de Documento
													</Text>
													{dataPerson?.document_path ? (
														<Badge
															as='a'
															href={dataPerson?.document_path}
															target='_blank'
															size='sm'
															colorPalette='blue'
														>
															Ver documento
														</Badge>
													) : (
														<Badge colorPalette='red'>Sin documento</Badge>
													)}
												</Box>
											</Flex>
										</VStack>
									</Card.Body>
								</Card.Root>

								<Card.Root shadow='md'>
									<Card.Header pb={0}>
										<HStack gap={2}>
											<Icon as={FiPhone} boxSize={5} />
											<Heading size='md'>Información de Contacto</Heading>
										</HStack>
									</Card.Header>

									<Card.Body>
										<VStack align='stretch' gap={4}>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Teléfono
													</Text>
													<Text color='gray.900'>
														{dataPerson?.phone || '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														otro teléfono
													</Text>
													<Text color='gray.900'>
														{dataPerson?.alternativePhone || '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Contacto de Emergencia
													</Text>
													<Text color='gray.900'>
														{dataPerson?.emergencyContact || '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Teléfono de Emergencia
													</Text>
													<Text color='gray.900'>
														{dataPerson?.emergencyPhone || '—'}
													</Text>
												</Box>
											</Flex>

											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Correo Personal
													</Text>
													<Text color='gray.900'>
														{dataPerson?.personal_email || '—'}
													</Text>
												</Box>
											</Flex>
										</VStack>
									</Card.Body>
								</Card.Root>
								<Card.Root shadow={'md'}>
									<Card.Header pb={0}>
										<HStack gap={2}>
											<Icon as={LuGraduationCap} boxSize={5} />
											<Heading size='md'>Información Académica</Heading>
										</HStack>
									</Card.Header>

									<Card.Body>
										<VStack align='stretch' gap={4}>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														¿Es graduado de la UNI?
													</Text>
													<Text>
														<Badge
															colorPalette={
																dataPerson?.is_uni_graduate ? 'green' : 'red'
															}
															px={2}
															py={1}
															fontSize='sm'
															borderRadius='md'
														>
															{dataPerson?.is_uni_graduate ? 'Sí' : 'No'}
														</Badge>
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Correo Institucional
													</Text>
													<Text color='gray.900'>
														{dataPerson?.uni_email || '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Código UNI
													</Text>
													<Text color='gray.900'>
														{dataPerson?.uni_code || '—'}
													</Text>
												</Box>
											</Flex>
											<Flex gap={3} align='start'>
												<Box>
													<Text
														fontSize='sm'
														fontWeight='medium'
														color='gray.600'
													>
														Colegiatura
													</Text>
													<Text color='gray.900'>
														{dataPerson?.license_number || '—'}
													</Text>
												</Box>
											</Flex>
										</VStack>
									</Card.Body>
								</Card.Root>
							</SimpleGrid>
						</Box>
					</SimpleGrid>
				</Stack>
			) : (
				<Heading size='sm' color='gray.500'>
					Postulante no encontrado
				</Heading>
			)}
		</Box>
	);
};
