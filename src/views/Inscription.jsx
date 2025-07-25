import {
	useReadCountries,
	useReadDepartments,
	useReadDistrict,
	useReadNacionalities,
	useReadProvince,
} from '@/hooks';
import { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Image,
	HStack,
	Input,
	Text,
	Span,
	Flex,
	Button,
	Spinner,
} from '@chakra-ui/react';
import { ReactSelect } from '@/components';
import {
	Field,
	InputPhoneWithMask,
	Radio,
	RadioGroup,
	toaster,
} from '@/components/ui';
import { useNavigate, useParams } from 'react-router';
import { useReadAdmissionByUUID } from '@/hooks/admissions_proccess';
import { useCreatePersonWithAdmission } from '@/hooks/admissions_applicants';
import { format } from 'date-fns';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

export default function AdmissionForm() {
	const { uuid } = useParams();
	const navigate = useNavigate();
	const { data: dataAdmissionProgram, isLoading: isAdmissionProgramLoading } =
		useReadAdmissionByUUID(uuid);

	// Para controlar el programa seleccionado del proceso de admisión
	const [selectedProgram, setSelectedProgram] = useState(null);

	// Para controlar la modalidad seleccionada del programa de postgrado
	const [selectedModality, setSelectedModality] = useState(null);

	// Controlar si es un apellido o dos
	const [isOneLastName, setIsOneLastName] = useState(false);

	const { data: dataCountries, isLoading: isLoadingCountries } =
		useReadCountries();
	const countryOptions =
		dataCountries?.results?.map((country) => ({
			value: country.id,
			label: country.name,
		})) || [];
	const dialCodeOptions =
		dataCountries?.results?.map((country) => ({
			value: country.dial_code,
			label: country.dial_code,
		})) || [];

	const { data: dataNacionalities, isLoading: loadingNationalities } =
		useReadNacionalities();
	const nationalityOptions =
		dataNacionalities?.results?.map((nationality) => ({
			value: nationality.id,
			label: nationality.name,
		})) || [];

	const documentTypeOptions = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'Carné de Extranjería' },
		{ value: 4, label: 'Cédula de Identidad' },
	];

	const postgraduateProgramTypeOptions =
		dataAdmissionProgram?.programs
			?.filter((program) => program.status === 4)
			?.map((program) => ({
				value: program.program, //id del programa
				label: program.program_name, // nombre del programa
			})) || [];

	// Para controlar los departamentos, provincias y distritos
	const { data: dataDepartments, isLoading: loadingDepartments } =
		useReadDepartments();
	const { data: dataProvince, isLoading: loadingProvince } = useReadProvince();
	const { data: dataDistrict, isLoading: loadingDistrict } = useReadDistrict();

	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);

	const modalitiesProgramOptions =
		(selectedProgram &&
			dataAdmissionProgram?.programs
				?.filter((program) => program.program === selectedProgram.value)
				.flatMap(
					(program) =>
						program.modalities?.map((modality) => ({
							value: modality.id,
							label: modality.modality_name,
						})) || []
				)) ||
		[];

	useEffect(() => {
		setSelectedDepartment(null);
		setSelectedProvince(null);
		setSelectedDistrict(null);
	}, [selectedCountry]);

	useEffect(() => {
		setSelectedProvince(null);
		setSelectedDistrict(null);
	}, [selectedDepartment]);

	useEffect(() => {
		setSelectedDistrict(null);
	}, [selectedProvince]);

	const departmentOptions =
		dataDepartments?.results
			?.filter((dep) =>
				selectedCountry ? dep.country === selectedCountry.value : true
			)
			.map((dep) => ({
				value: dep.id,
				label: dep.name,
			})) || [];

	const provinceOptions =
		dataProvince?.results
			?.filter((prov) =>
				selectedDepartment ? prov.department === selectedDepartment.value : true
			)
			.map((prov) => ({
				value: prov.id,
				label: prov.name,
				department_id: prov.department_id,
			})) || [];

	const districtOptions =
		dataDistrict?.results
			?.filter((dist) =>
				selectedProvince ? dist.province === selectedProvince.value : true
			)
			.map((dist) => ({
				value: dist.id,
				label: dist.name,
				province_id: dist.id,
			})) || [];

	useEffect(() => {
		setSelectedProvince(null);
		setSelectedDistrict(null);
	}, [selectedDepartment]);

	useEffect(() => {
		setSelectedDistrict(null);
	}, [selectedProvince]);

	const [inscriptionRequest, setInscriptionRequest] = useState({
		first_name: '',
		last_name: '',
		father_last_name: '',
		mother_last_name: '',
		birth_date: '',
		country: null,
		nationality: null,
		dial_code: dialCodeOptions[0],
		phone_number: '',
		email: '',
		document_type: null,
		document_number: '',
		modality_type: null,
		postgraduate_program_type: null,
		address: '',
		department: null,
		province: null,
		district: null,
	});
	const [isSaving, setIsSaving] = useState(false);
	const { mutate: create } = useCreatePersonWithAdmission();

	const handleSubmitInscription = async () => {
		const missingFields = [];
		setIsSaving(true);
		if (!inscriptionRequest.email) missingFields.push('Correo');
		if (!inscriptionRequest.first_name) missingFields.push('Nombre');
		if (isOneLastName) {
			if (!inscriptionRequest.last_name) missingFields.push('Apellido');
		} else {
			if (!inscriptionRequest.father_last_name)
				missingFields.push('Apellido paterno');
			if (!inscriptionRequest.mother_last_name)
				missingFields.push('Apellido materno');
		}
		if (!inscriptionRequest.document_type?.value)
			missingFields.push('Tipo de documento');
		if (!inscriptionRequest.document_number)
			missingFields.push('Número de documento');
		if (!inscriptionRequest.birth_date)
			missingFields.push('Fecha de nacimiento');
		if (!selectedDistrict?.value) missingFields.push('Distrito');
		if (
			!inscriptionRequest.phone_number ||
			(inscriptionRequest.dial_code && !inscriptionRequest.dial_code.value)
		)
			missingFields.push('Teléfono');
		if (!inscriptionRequest.nationality?.value)
			missingFields.push('Nacionalidad');
		if (!inscriptionRequest.country?.value) missingFields.push('País');
		if (!inscriptionRequest.address) missingFields.push('Dirección');
		if (!selectedModality?.value) missingFields.push('Modalidad');
		if (!dataAdmissionProgram?.id) missingFields.push('Programa de admisión');

		if (missingFields.length > 0) {
			setIsSaving(false);
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}
		const payload = {
			person: {
				user: {
					username: inscriptionRequest.email,
				},
				first_name: inscriptionRequest.first_name,
				paternal_surname: isOneLastName
					? inscriptionRequest.last_name
					: inscriptionRequest.father_last_name || '',
				maternal_surname: isOneLastName
					? ''
					: inscriptionRequest.mother_last_name || '',
				document_type: inscriptionRequest.document_type?.value,
				document_number: inscriptionRequest.document_number,
				birth_date: inscriptionRequest.birth_date,
				district: selectedDistrict?.value,
				phone: inscriptionRequest.dial_code
					? `${inscriptionRequest.dial_code.value} ${inscriptionRequest.phone_number}`
					: inscriptionRequest.phone_number,
				nationality: inscriptionRequest.nationality?.value,
				country: inscriptionRequest.country?.value,
				address: inscriptionRequest.address,
				has_one_surname: isOneLastName,
			},
			admission_program: dataAdmissionProgram?.id,
			modality_id: selectedModality?.value,
		};

		create(payload, {
			onSuccess: () => {
				setIsSaving(false);
				navigate('/auth/login', {
					state: {
						successMessage: 'Registro exitoso, Inicia Sesión',
					},
				});
			},
			onError: (error) => {
				setIsSaving(false);

				const errors = error?.response?.data?.errors;
				let message = 'Error al inscribir.';

				if (errors) {
					const messages = [];

					if (errors.person?.user?.username?.length) {
						messages.push('El correo electrónico ya está registrado.');
					}

					if (errors.person?.document_number?.length) {
						messages.push('El número de documento ya está registrado.');
					}

					if (messages.length) {
						message = messages.join(' ');
					}
				}

				toaster.create({
					title: 'Error al inscribir',
					description: message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Box minH='100dvh' bg='gray.50'>
			<Box bg='#8B2635' py={4}>
				<Container maxW='container.xl'>
					<HStack alignItems={'center'} justify='center'>
						<Image
							w='40px'
							src='/img/logo-UNI.png'
							alt='Logo'
							mr='2'
							filter='brightness(0) invert(1)'
						/>
						<Text
							color='white'
							fontWeight='semibold'
							fontSize={{ base: 'md', lg: 'xl', xl: '2xl' }}
							display={{ base: 'none', md: 'inline' }}
							ml={2}
						>
							FACULTAD DE INGENIERÍA ECONÓMICA ESTADÍSTICAS Y CIENCIAS SOCIALES
							- UNI
						</Text>
						<Text
							color='white'
							fontWeight='semibold'
							fontSize={{ base: '2xl' }}
							display={{ base: 'inline', md: 'none' }}
							ml={2}
						>
							FIEECS UNI
						</Text>
					</HStack>
				</Container>
			</Box>
			{isAdmissionProgramLoading && (
				<Box textAlign='center' py={10}>
					<Spinner size='xl' color='#8B2635' />
					<Text mt={4} color='#8B2635' fontSize='xl'>
						Cargando información del proceso de admisión...
					</Text>
				</Box>
			)}
			{!isAdmissionProgramLoading && (
				<>
					{
						/* Formulario de Inscripción */
						dataAdmissionProgram?.end_date &&
						new Date(dataAdmissionProgram.end_date) >= new Date() ? (
							<Box>
								<Container
									maxW='container.xl'
									py={5}
									fontWeight='bold'
									textAlign='center'
								>
									<Text color='#8B2635' fontSize='2xl'>
										Formulario de Inscripción
									</Text>
									<Span color='gray.500' fontSize='xl'>
										{dataAdmissionProgram?.admission_process_name.toUpperCase()}
									</Span>
								</Container>
								<Container maxW='container.sm'>
									<Flex
										direction={{ base: 'column', md: 'row' }}
										align='start'
										justify='center'
										gap={8}
									>
										{/* Columna 1 */}
										<Box w='100%' maxW='420px' p={6} spaceY={3}>
											<Field label='Nombres completos'>
												<Input
													type='text'
													value={inscriptionRequest.first_name}
													onChange={(e) =>
														setInscriptionRequest({
															...inscriptionRequest,
															first_name: e.target.value,
														})
													}
													placeholder='Ingrese sus nombres completos'
												/>
											</Field>
											<Field label='¿Cuenta solo con un apellido?'>
												<RadioGroup
													value={isOneLastName ? 'yes' : 'no'}
													onChange={(value) => {
														setIsOneLastName(
															value.target.defaultValue === 'yes'
														);
													}}
													direction='row'
													spaceX={4}
												>
													<Radio value='yes'>Sí</Radio>
													<Radio value='no'>No</Radio>
												</RadioGroup>
											</Field>
											{isOneLastName ? (
												<Field label='Apellido'>
													<Input
														type='text'
														value={inscriptionRequest.last_name}
														onChange={(e) =>
															setInscriptionRequest({
																...inscriptionRequest,
																last_name: e.target.value,
															})
														}
														placeholder='Ingrese su apellido'
													/>
												</Field>
											) : (
												<>
													<Field label='Apellido Paterno'>
														<Input
															type='text'
															value={inscriptionRequest.father_last_name}
															onChange={(e) =>
																setInscriptionRequest({
																	...inscriptionRequest,
																	father_last_name: e.target.value,
																})
															}
															placeholder='Ingrese su apellido paterno'
														/>
													</Field>
													<Field label='Apellido Materno'>
														<Input
															type='text'
															value={inscriptionRequest.mother_last_name}
															onChange={(e) =>
																setInscriptionRequest({
																	...inscriptionRequest,
																	mother_last_name: e.target.value,
																})
															}
															placeholder='Ingrese su apellido materno'
														/>
													</Field>
												</>
											)}
											<Field label='Fecha de Nacimiento'>
												<CustomDatePicker
													selectedDate={inscriptionRequest.birth_date}
													onDateChange={(date) =>
														setInscriptionRequest({
															...inscriptionRequest,
															birth_date: format(date, 'yyyy-MM-dd'),
														})
													}
													buttonSize='md'
													size={{ base: '295px', md: '375px' }}
												/>
											</Field>
											<Field label='País de Nacimiento'>
												<ReactSelect
													label='País'
													options={countryOptions}
													value={inscriptionRequest.country}
													onChange={(value) =>
														setInscriptionRequest({
															...inscriptionRequest,
															country: value,
														})
													}
													isLoading={isLoadingCountries}
													placeholder='Seleccione un país'
												/>
											</Field>
											<Field label='Nacionalidad'>
												<ReactSelect
													label='Nacionalidad'
													options={nationalityOptions}
													value={inscriptionRequest.nationality}
													onChange={(value) =>
														setInscriptionRequest({
															...inscriptionRequest,
															nationality: value,
														})
													}
													isLoading={loadingNationalities}
													placeholder='Seleccione una nacionalidad'
												/>
											</Field>
											<Field label='Celular'>
												<Flex w='100%'>
													<ReactSelect
														options={dialCodeOptions}
														value={inscriptionRequest.dial_code}
														onChange={(value) =>
															setInscriptionRequest({
																...inscriptionRequest,
																dial_code: value,
															})
														}
														isLoading={isLoadingCountries}
														styles={{
															container: (base) => ({
																...base,
																width: '90px',
																minWidth: '90px',
																maxWidth: '90px',
															}),
														}}
													/>
													<InputPhoneWithMask
														dialCode={
															inscriptionRequest.dial_code?.value ||
															inscriptionRequest.dial_code
														}
														setDialCode={(value) =>
															setInscriptionRequest({
																...inscriptionRequest,
																dial_code: value,
															})
														}
														setCountry={() => {}}
														options={dialCodeOptions}
														value={inscriptionRequest.phone_number}
														onChange={(e) =>
															setInscriptionRequest({
																...inscriptionRequest,
																phone_number: e.target.value,
															})
														}
														ml={2}
														flex={1}
													/>
												</Flex>
											</Field>
											<Field label='Correo Personal'>
												<Input
													type='email'
													value={inscriptionRequest.email}
													onChange={(e) =>
														setInscriptionRequest({
															...inscriptionRequest,
															email: e.target.value,
														})
													}
													placeholder='Ingrese su correo electrónico'
												/>
											</Field>
											<Field></Field>
										</Box>

										{/* Columna 2 */}
										<Box w='100%' maxW='420px' p={6} spaceY={3}>
											<Field label='Documento de Identidad DNI (o Pasaporte, carné de extranjería, cédula de identidad)'>
												<ReactSelect
													label='Tipo de Documento'
													options={documentTypeOptions}
													value={inscriptionRequest.document_type}
													onChange={(value) =>
														setInscriptionRequest({
															...inscriptionRequest,
															document_type: value,
														})
													}
													placeholder='Seleccione un tipo de documento'
												/>
												<Input
													type='text'
													value={inscriptionRequest.document_number}
													onChange={(e) =>
														setInscriptionRequest({
															...inscriptionRequest,
															document_number: e.target.value,
														})
													}
													placeholder='Ingrese su número de documento'
												/>
											</Field>
											<Field label='Programa académico'>
												<ReactSelect
													label='Programa de Postgrado'
													options={postgraduateProgramTypeOptions}
													value={inscriptionRequest.selectedProgram}
													onChange={(value) => setSelectedProgram(value)}
													isLoading={isAdmissionProgramLoading}
													placeholder='Seleccione un programa de postgrado'
												/>
											</Field>
											<Field label='Tipo de Modalidad de Admisión'>
												<ReactSelect
													label='Modalidad'
													options={modalitiesProgramOptions}
													value={selectedModality}
													onChange={(value) => setSelectedModality(value)}
													isDisabled={!selectedProgram}
													placeholder='Seleccione una modalidad'
												/>
											</Field>
											<Field label='Dirección'>
												<Input
													type='text'
													value={inscriptionRequest.address}
													onChange={(e) =>
														setInscriptionRequest({
															...inscriptionRequest,
															address: e.target.value,
														})
													}
													placeholder='Ingrese su dirección'
												/>
											</Field>
											<Field label='País'>
												<ReactSelect
													label='País'
													options={countryOptions}
													value={selectedCountry}
													onChange={setSelectedCountry}
													isLoading={isLoadingCountries}
													placeholder='Seleccione un país'
												/>
											</Field>
											<Field label='Departamento'>
												<ReactSelect
													label='Departamento'
													options={departmentOptions}
													value={selectedDepartment}
													onChange={setSelectedDepartment}
													isLoading={loadingDepartments}
													placeholder='Seleccione un departamento'
												/>
											</Field>
											<Field label='Provincia'>
												<ReactSelect
													label='Provincia'
													options={provinceOptions}
													value={selectedProvince}
													onChange={setSelectedProvince}
													isLoading={loadingProvince}
													placeholder='Seleccione una provincia'
													isDisabled={!selectedDepartment}
													mt={4}
												/>
											</Field>
											<Field label='Distrito'>
												<ReactSelect
													label='Distrito'
													options={districtOptions}
													value={selectedDistrict}
													onChange={setSelectedDistrict}
													isLoading={loadingDistrict}
													placeholder='Seleccione un distrito'
													mt={4}
												/>
											</Field>
											<HStack justify='end'>
												<Button
													bg='uni.secondary'
													px={10}
													mt={5}
													onClick={handleSubmitInscription}
													loading={isSaving}
												>
													Enviar
												</Button>
											</HStack>
										</Box>
									</Flex>
								</Container>
							</Box>
						) : (
							<Container maxW='container.md' py={20} textAlign='center'>
								<Text fontSize='2xl' color='#8B2635' fontWeight='bold' mb={4}>
									Proceso de admisión ha finalizado
								</Text>
								<Text color='gray.600'>
									El proceso de admisión seleccionado ha finalizado. La fecha
									límite para participar ya ha vencido. Si tienes dudas o
									necesitas más información, por favor contacta a la oficina de
									admisión.
								</Text>
							</Container>
						)
					}
				</>
			)}
		</Box>
	);
}
