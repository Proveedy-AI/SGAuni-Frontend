import { DocumentCard } from '@/components/card/DocumentCard';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GenerateApplicantDataPdfModal } from '@/components/forms/admissions';
import { PaymentOrdersByApplicationTable } from '@/components/tables/payment_orders';
import { Avatar, Tooltip } from '@/components/ui';
import ApplicantSkeleton from '@/components/ui/ApplicantSkeleton';
import { formatDateString } from '@/components/ui/dateHelpers';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadPersonById } from '@/hooks';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';
import { useReadDocuments } from '@/hooks/documents';
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
	FiCreditCard,
	FiFileText,
	FiLock,
	FiMapPin,
	FiPhone,
	FiUser,
	FiXCircle,
} from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { useParams } from 'react-router';

export const AdmissionApplicantDetail = () => {
	const { programId, id } = useParams();
	const decodedProgrma = decodeURIComponent(programId);
	const encodeProgram = encodeURIComponent(decodedProgrma);
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataApplicant, isLoading: isApplicantLoading } =
		useReadAdmissionApplicantById(decrypted);
	const { data: dataPerson, isLoading: isPersonLoading } = useReadPersonById(
		dataApplicant?.person_details?.id
	);

	const { data: dataDocuments } = useReadDocuments({
		application: dataApplicant?.id,
	});
console.log(dataApplicant)
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

	const handleDownload = (filePath) => {
		window.open(filePath, '_blank');
	};

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

			{isApplicantLoading || isPersonLoading ? (
				<ApplicantSkeleton />
			) : dataApplicant ? (
				<Stack spaceY='5' mx={'auto'}>
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
															{documentTypeLabel} :{' '}
															{dataPerson?.document_number}
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
												<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
													<Flex gap={3} align='start'>
														<Box>
															<Text
																fontSize='sm'
																fontWeight='medium'
																color='gray.600'
															>
																Universidad de Procedencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.university || '—'}
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
																Año de Graduación
															</Text>
															<Text color='gray.900'>
																{dataPerson?.graduationYear || '—'}
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
																Nivel Educativo
															</Text>
															<Text color='gray.900'>
																{dataPerson?.previousEducation || '—'}
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
																¿Es graduado de la UNI?
															</Text>
															<Text>
																<Badge
																	colorPalette={
																		dataPerson?.is_uni_graduate
																			? 'green'
																			: 'red'
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
																Año de Graduación
															</Text>
															<Text color='gray.900'>
																{dataPerson?.graduationYear || '—'}
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
												</SimpleGrid>
											</VStack>
										</Card.Body>
									</Card.Root>
									<Card.Root shadow={'md'}>
										<Card.Header pb={0}>
											<HStack gap={2}>
												<Icon as={FiMapPin} boxSize={5} />
												<Heading size='md'>Información de Ubicación</Heading>
											</HStack>
										</Card.Header>

										<Card.Body>
											<VStack align='stretch' gap={4}>
												<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
													<Flex gap={3} align='start'>
														<Box>
															<Text
																fontSize='sm'
																fontWeight='medium'
																color='gray.600'
															>
																Pais de Nacimiento
															</Text>
															<Text color='gray.900'>
																{dataPerson?.birth_country_name || '—'}
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
																Ubigeo de Nacimiento
															</Text>
															<Text color='gray.900'>
																{dataPerson?.birth_ubigeo_code || '—'}
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
																Nacionalidad
															</Text>
															<Text color='gray.900'>
																{dataPerson?.nationality_name || '—'}
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
																País de Residencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.residenceCountry_name || '—'}
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
																Departamento de Residencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.department_name || '—'}
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
																Provincia de Residencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.province_name || '—'}
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
																Distrito de Residencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.district_name || '—'}
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
																Ubigeo de Residencia
															</Text>
															<Text color='gray.900'>
																{dataPerson?.address_ubigeo_code || '—'}
															</Text>
														</Box>
													</Flex>
												</SimpleGrid>
												<Flex gap={3} align='start'>
													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.600'
														>
															Dirección
														</Text>
														<Text color='gray.900'>
															{dataPerson?.address || '—'}
														</Text>
													</Box>
												</Flex>
											</VStack>
										</Card.Body>
									</Card.Root>
									<Card.Root shadow={'md'}>
										<Card.Header pb={0}>
											<HStack gap={2}>
												<Icon as={FiFileText} boxSize={5} />
												<Heading size='md'>Datos Adicionales</Heading>
											</HStack>
										</Card.Header>

										<Card.Body>
											<VStack align='stretch' gap={4}>
												<Flex gap={3} align='start'>
													<Flex gap={3} align='start'>
														<Box>
															<Text
																fontSize='sm'
																fontWeight='medium'
																color='gray.600'
															>
																¿Tiene alguna discapacidad?
															</Text>
															<Text>
																<Badge
																	colorPalette={
																		dataPerson?.has_disability ? 'green' : 'red'
																	}
																	px={2}
																	py={1}
																	fontSize='sm'
																	borderRadius='md'
																>
																	{dataPerson?.has_disability ? 'Sí' : 'No'}
																</Badge>
															</Text>
														</Box>
													</Flex>
												</Flex>
												{dataPerson?.has_disability && (
													<>
														<Flex gap={3} align='start'>
															<Box>
																<Text
																	fontSize='sm'
																	fontWeight='medium'
																	color='gray.600'
																>
																	Discapacidad
																</Text>
																<Text color='gray.900'>
																	{dataPerson?.type_disability_name || '—'}
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
																	Descripción de la discapacidad
																</Text>
																<Text color='gray.900'>
																	{dataPerson?.other_disability || '—'}
																</Text>
															</Box>
														</Flex>
													</>
												)}
												<Flex gap={3} align='start'>
													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.600'
														>
															Experiencia Laboral
														</Text>
														<Text color='gray.900'>
															{dataPerson?.workExperience || '—'}
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
															Código Postal
														</Text>
														<Text color='gray.900'>
															{dataPerson?.postalCode || '—'}
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
															¿Cómo se enteró de nuestro programa?
														</Text>
														<Text color='gray.900'>
															{dataPerson?.howDidYouKnow || '—'}
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
															Comentarios Adicionales
														</Text>
														<Text color='gray.900'>
															{dataPerson?.additionalComments || '—'}
														</Text>
													</Box>
												</Flex>
											</VStack>
										</Card.Body>
									</Card.Root>
									<Card.Root shadow={'md'}>
										<Card.Header pb={0}>
											<HStack gap={2}>
												<Icon as={FiLock} boxSize={5} />
												<Heading size='md'>Aceptación de Términos</Heading>
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
															Interesado en información sobre becas
														</Text>
														<Text>
															<Badge
																colorPalette={
																	dataPerson?.scholarshipInterest
																		? 'green'
																		: 'red'
																}
																px={2}
																py={1}
																fontSize='sm'
																borderRadius='md'
															>
																{dataPerson?.scholarshipInterest ? 'Sí' : 'No'}
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
															Acepta el tratamiento de datos personales
														</Text>
														<Text>
															<Badge
																colorPalette={
																	dataPerson?.acceptsDataProcessing
																		? 'green'
																		: 'red'
																}
																px={2}
																py={1}
																fontSize='sm'
																borderRadius='md'
															>
																{dataPerson?.acceptsDataProcessing
																	? 'Sí'
																	: 'No'}
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
															Acepta los términos y condiciones
														</Text>
														<Text>
															<Badge
																colorPalette={
																	dataPerson?.acceptsTerms ? 'green' : 'red'
																}
																px={2}
																py={1}
																fontSize='sm'
																borderRadius='md'
															>
																{dataPerson?.acceptsTerms ? 'Sí' : 'No'}
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
															Fecha de Admisión
														</Text>
														<Text color='gray.900'>
															{dataPerson?.admission_date
																? formatDateString(dataPerson.admission_date)
																: '—'}
														</Text>
													</Box>
												</Flex>
											</VStack>
										</Card.Body>
									</Card.Root>
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
									{dataApplicant?.payment_orders?.length} trámites
								</Badge>
							</Flex>
						</Card.Header>

						<Card.Body>
							<PaymentOrdersByApplicationTable
								data={dataApplicant?.payment_orders}
							/>
						</Card.Body>
					</Card.Root>
					<Card.Root shadow={'md'}>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={FiFileText} boxSize={5} />
								<Heading size='md'>Documentos</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							{dataDocuments?.results?.length === 0 ? (
								<Box
									colSpan={{ base: 1, md: 2 }}
									p={6}
									borderWidth='1px'
									borderRadius='lg'
									textAlign='center'
									color='gray.500'
								>
									No hay documentos disponibles.
								</Box>
							) : (
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									{dataDocuments?.results.map((doc) => (
										<DocumentCard
											key={doc.id}
											doc={doc}
											handleDownload={handleDownload}
										/>
									))}
								</SimpleGrid>
							)}
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
