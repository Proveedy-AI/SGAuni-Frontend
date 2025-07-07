import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GenerateApplicantDataPdfModal } from '@/components/forms/admissions';
import { PaymentOrdersByApplicationTable } from '@/components/tables/payment_orders';
import { Avatar, Tooltip } from '@/components/ui';
import ApplicantSkeleton from '@/components/ui/ApplicantSkeleton';
import { formatDateString } from '@/components/ui/dateHelpers';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiCreditCard,
	FiGlobe,
	FiHome,
	FiMail,
	FiMapPin,
	FiPhone,
	FiUser,
	FiXCircle,
} from 'react-icons/fi';
import { LuGraduationCap, LuIdCard } from 'react-icons/lu';
import { useParams } from 'react-router';

export const AdmissionApplicantDetail = () => {
	const { programId, id } = useParams();
	const decodedProgrma = decodeURIComponent(programId);
	const encodeProgram = encodeURIComponent(decodedProgrma);
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataApplicant, isLoading: isApplicantLoading } =
		useReadAdmissionApplicantById(decrypted);

	const statusEnum = [
		{
			id: 1,
			label: 'En Revisión',
			bg: '#FDD9C6',
			color: 'orange',
			icon: FiClock,
		},
		{
			id: 2,
			label: 'Aprobado',
			bg: 'green',
			color: 'white',
			icon: FiCheckCircle,
		},
		{ id: 3, label: 'Rechazado', bg: 'red', color: 'white', icon: FiXCircle },
	];

	const statusEnumSelected = statusEnum.find(
		(item) => item.id === dataApplicant?.status
	);

	return (
		<Box spaceY='5'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Postulantes', to: '/admissions/applicants' },
					{
						label: isApplicantLoading
							? 'Cargando...'
							: dataApplicant?.postgrade_name,
						to: `/admissions/applicants/programs/${encodeProgram}`,
					},
					{ label: dataApplicant?.person_full_name },
				]}
			/>

			{isApplicantLoading ? (
				<ApplicantSkeleton />
			) : dataApplicant ? (
				<Stack maxW={'80%'} spaceY='5' mx={'auto'}>
					<Box bg='white' rounded='lg' shadow='md' p={6}>
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
									name={dataApplicant?.person_full_name}
									src={dataApplicant?.profile_image || '/placeholder.svg'}
								/>
								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='gray.900'>
										{isApplicantLoading
											? 'Cargando...'
											: dataApplicant?.person_full_name}
									</Text>
									<Text color='gray.600'>
										Postulante a programa de posgrado
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
						{/* Información del Programa */}
						<Box bg='white' rounded='lg' shadow='md'>
							<Box borderBottomWidth='1px' p={4}>
								<Flex align='center' gap={2}>
									<Icon as={LuGraduationCap} boxSize={5} color='blue.600' />
									<Text fontWeight='bold'>Información del Programa</Text>
								</Flex>
							</Box>
							<Box p={4}>
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									<Box>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Programa Académico
										</Text>
										<Text
											fontSize='lg'
											fontWeight='semibold'
											color='gray.900'
											mt={1}
										>
											{dataApplicant.postgrade_name}
										</Text>
									</Box>
									<Box>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Modalidad
										</Text>
										<Text
											fontSize='lg'
											fontWeight='semibold'
											color='gray.900'
											mt={1}
										>
											{dataApplicant.modality_display || 'No especificada'}
										</Text>
									</Box>
								</SimpleGrid>
							</Box>
						</Box>

						{/* Datos Personales */}
						<Box bg='white' rounded='lg' shadow='md'>
							<Box borderBottomWidth='1px' p={4}>
								<Flex
									direction={{ base: 'column', md: 'row' }}
									justify='space-between'
									align={{ base: 'flex-start', md: 'center' }}
									gap={2}
								>
									{/* Título e ícono */}
									<Flex align='center' gap={2}>
										<Icon as={FiUser} boxSize={5} color='green.600' />
										<Text fontWeight='bold'>Datos Personales</Text>
									</Flex>

									{/* Botón de descarga */}
									<Tooltip label='Descargar datos del postulante' hasArrow>
										<GenerateApplicantDataPdfModal
											applicationPersonalData={dataApplicant}
										/>
									</Tooltip>
								</Flex>
							</Box>

							<Box p={4}>
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
									{/* Columna 1 */}
									<VStack align='stretch' gap={4}>
										<Flex gap={3} align='start'>
											<Icon as={FiCalendar} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Fecha de Nacimiento
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.birth_date
														? formatDateString(
																dataApplicant.person_details.birth_date
															)
														: '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiGlobe} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													País de Nacimiento
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.country_name || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiGlobe} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Nacionalidad
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.nationality_name ||
														'—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiPhone} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Celular
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.phone || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiMail} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Correo Electrónico
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.email || '—'}
												</Text>
											</Box>
										</Flex>
									</VStack>

									{/* Columna 2 */}
									<VStack align='stretch' gap={4}>
										<Flex gap={3} align='start'>
											<Icon as={LuIdCard} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Documento de Identidad
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.document_number || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiHome} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Dirección
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.address || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiMapPin} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Departamento
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.department_name || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiMapPin} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Provincia
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.province_name || '—'}
												</Text>
											</Box>
										</Flex>

										<Flex gap={3} align='start'>
											<Icon as={FiMapPin} boxSize={4} color='gray.400' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='gray.600'
												>
													Distrito
												</Text>
												<Text color='gray.900'>
													{dataApplicant.person_details?.district_name || '—'}
												</Text>
											</Box>
										</Flex>
									</VStack>
								</SimpleGrid>
							</Box>
						</Box>
					</SimpleGrid>

					<Card.Root>
						<Card.Header>
							<Flex align='center' gap={2}>
								<Icon as={FiCreditCard} boxSize={5} color='blue.600' />
								<Heading size='md'>Trámites y Pagos</Heading>
								<Badge colorScheme='blue'>
									{dataApplicant.payment_orders.length} trámites
								</Badge>
							</Flex>
						</Card.Header>

						<Card.Body>
							<PaymentOrdersByApplicationTable
								data={dataApplicant?.payment_orders}
							/>
						</Card.Body>
					</Card.Root>
				</Stack>
			) : (
				<Heading size='sm' color='gray.500'>
					Postulante no encontrado
				</Heading>
			)}
		</Box>
	);
};
