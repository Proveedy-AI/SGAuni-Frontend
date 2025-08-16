import {
	Alert,
	Checkbox,
	Field,
	Radio,
	RadioGroup,
	toaster,
} from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
	useReadCountries,
	useReadDepartments,
	useReadDistrict,
	useReadNacionalities,
	useReadProvince,
} from '@/hooks';
import { useCreatePersonWithAdmission } from '@/hooks/admissions_applicants';
import { useReadAdmissionByUUID } from '@/hooks/admissions_proccess';
import { useReadDisabilities } from '@/hooks/disabilities';
import {
	Badge,
	Box,
	Card,
	Container,
	Heading,
	HStack,
	Icon,
	Image,
	Input,
	Progress,
	SimpleGrid,
	Text,
	VStack,
	Textarea,
	Flex,
	Button,
	Separator,
	Spinner,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
	FaArrowLeft,
	FaArrowRight,
	FaCalendarAlt,
	FaCheckCircle,
	FaEnvelope,
	FaEye,
	FaFileAlt,
	FaGlobe,
	FaGraduationCap,
	FaInfoCircle,
	FaMapMarkerAlt,
	FaPaperPlane,
	FaPhone,
} from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router';

const STEPS = [
	{
		id: 1,
		title: 'Información Personal',
		icon: FiUser,
		description: 'Datos básicos del postulante',
		fields: [
			'first_name',
			'last_name',
			'father_last_name',
			'mother_last_name',
			'birth_date',
			'gender',
		],
	},
	{
		id: 2,
		title: 'Contacto',
		icon: FaPhone,
		description: 'Información de contacto',
		fields: [
			'email',
			'phone_number',
			'alternativePhone',
			'emergencyContact',
			'emergencyPhone',
		],
	},
	{
		id: 3,
		title: 'Documentos',
		icon: FaFileAlt,
		description: 'Documentación de identidad',
		fields: [
			'document_type',
			'document_number',
			'nationality',
			'birthCountry',
			'residenceCountry',
		],
	},
	{
		id: 4,
		title: 'Dirección',
		icon: FaMapMarkerAlt,
		description: 'Ubicación de residencia',
		fields: ['address', 'department', 'province', 'district'],
	},
	{
		id: 5,
		title: 'Programa Académico',
		icon: FaGraduationCap,
		description: 'Información académica',
		fields: [
			'postgraduate_program_type',
			'modality_type',
			'previousEducation',
			'university',
			'graduationYear',
		],
	},
	{
		id: 6,
		title: 'Información Adicional',
		icon: FaInfoCircle,
		description: 'Datos complementarios',
		fields: ['scholarshipInterest', 'howDidYouKnow'],
	},
	{
		id: 7,
		title: 'Revisión y Envío',
		icon: FaEye,
		description: 'Confirmar información',
		fields: ['acceptsTerms', 'acceptsDataProcessing'],
	},
];

export default function ChakraInscriptionForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const { uuid } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		// Personal Info
		first_name: '',
		last_name: '',
		father_last_name: '',
		mother_last_name: '',
		birth_date: '',
		hasOneLastName: false,
		gender: '',

		// Contact Info
		email: '',
		phone_number: '',
		dial_code: '+51',
		alternativePhone: '',
		emergencyContact: '',
		emergencyPhone: '',

		// Document Info
		document_type: '',
		document_number: '',
		nationality: '',
		birthCountry: '',
		residenceCountry: '',

		// Address Info
		address: '',
		department: '',
		province: '',
		district: '',
		postalCode: '',
		referenceAddress: '',

		// Academic Info
		postgraduate_program_type: '',
		modality_type: '',
		previousEducation: '',
		university: '',
		graduationYear: '',
		hasWorkExperience: false,
		workExperience: '',

		// Additional Info
		has_disability: false,
		type_disability: '',
		other_disability: '',
		scholarshipInterest: false,
		howDidYouKnow: '',
		additionalComments: '',
		acceptsTerms: false,
		acceptsDataProcessing: false,
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const bgColor = 'gray.50';
	const cardBg = 'white';
	const borderColor = 'gray.200';

	//-------Hooks-----------

	const { data: dataNacionalities } = useReadNacionalities();
	const { data: dataAdmissionProgram, isLoading: isAdmissionProgramLoading } =
		useReadAdmissionByUUID(uuid);
	const { data: dataDepartments } = useReadDepartments();
	const { data: dataProvince } = useReadProvince();
	const { data: dataDistrict } = useReadDistrict();
	const { data: dataCountries } = useReadCountries();
	const { mutate: create } = useCreatePersonWithAdmission();
	const { data: dataDisabilites } = useReadDisabilities();

	// Reset dependent fields when parent changes
	useEffect(() => {
		if (formData.department) {
			setFormData((prev) => ({ ...prev, province: '', district: '' }));
		}
	}, [formData.department]);

	useEffect(() => {
		if (formData.province) {
			setFormData((prev) => ({ ...prev, district: '' }));
		}
	}, [formData.province]);

	useEffect(() => {
		if (formData.postgraduate_program_type) {
			setFormData((prev) => ({ ...prev, modality_type: '' }));
		}
	}, [formData.postgraduate_program_type]);

	// Validation functions
	const validateField = (fieldName, value, document_type = '') => {
		if (typeof value === 'string') {
			switch (fieldName) {
				case 'first_name':
					return value.length < 0
						? 'El nombre debe tener al menos 2 caracteres'
						: '';
				case 'gender':
					if (!value || value.trim() === '') {
						return 'Seleccione un género';
					}
					return '';
				case 'email': {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return !emailRegex.test(value) ? 'Ingrese un email válido' : '';
				}
				case 'phone_number':
					return value.length < 9
						? 'El teléfono debe tener al menos 9 dígitos'
						: '';
				case 'document_number':
					if (document_type === '1' && value.length !== 8) {
						return 'El DNI debe tener 8 dígitos';
					}
					return value.length < 8
						? 'El número de documento debe tener al menos 8 caracteres'
						: '';
				case 'document_type':
					return value.length < 1 ? 'El tipo de documento es requerido' : '';
				case 'howDidYouKnow':
					return value == '' ? 'Este campo es requerido' : '';
				case 'birth_date':
					if (value) {
						const birth_date = new Date(value);
						const today = new Date();
						const age = today.getFullYear() - birth_date.getFullYear();
						if (age < 18) {
							return 'Debe ser mayor de 18 años';
						}
						if (age > 100) {
							return 'Fecha de nacimiento inválida';
						}
					}
					return '';
				default:
					return '';
			}
		} else if (typeof value === 'boolean') {
			if (
				fieldName === 'acceptsTerms' ||
				fieldName === 'acceptsDataProcessing'
			) {
				return !value ? 'Debe aceptar para continuar' : '';
			}
		}

		return '';
	};

	const validateCurrentStep = () => {
		const currentStepFields = STEPS[currentStep - 1].fields;
		const newErrors = {};
		let isValid = true;

		currentStepFields.forEach((field) => {
			// Skip validation for optional fields based on conditions
			if (formData.hasOneLastName) {
				if (field === 'father_last_name' || field === 'mother_last_name') {
					// omitir estos campos si tiene un solo apellido
					return;
				}
			} else {
				if (field === 'last_name') {
					// omitir este campo si tiene dos apellidos
					return;
				}
			}
			if (field === 'other_disability' && !formData.has_disability) return;
			if (field === 'workExperience' && !formData.hasWorkExperience) return;
			if (
				field === 'alternativePhone' ||
				field === 'postalCode' ||
				field === 'referenceAddress' ||
				field === 'additionalComments'
			) {
				return;
			}

			const value = formData[field];

			if (
				typeof value === 'string' &&
				value.trim() === '' &&
				value !== undefined
			) {
				newErrors[field] = 'Este campo es requerido';
				isValid = false;
			} else if (
				typeof value === 'boolean' &&
				(field === 'acceptsTerms' || field === 'acceptsDataProcessing')
			) {
				if (!value) {
					newErrors[field] = 'Debe aceptar para continuar';
					isValid = false;
				}
			} else {
				const error = validateField(field, value, formData.document_type);
				if (error) {
					newErrors[field] = error;
					isValid = false;
				}
			}
		});

		setErrors((prev) => ({ ...prev, ...newErrors }));
		return isValid;
	};

	const handleFieldChange = (fieldName, value) => {
		const fieldsToConvertToInt = [];

		const convertedValue =
			fieldsToConvertToInt.includes(fieldName) && value !== null
				? Number(value)
				: value;

		setFormData((prev) => ({ ...prev, [fieldName]: convertedValue }));

		if (errors[fieldName]) {
			setErrors((prev) => ({ ...prev, [fieldName]: '' }));
		}
	};

	const handleFieldBlur = (fieldName) => {
		const fieldValue = formData[fieldName];
		const error = validateField(fieldName, fieldValue, formData.document_type);
		setErrors((prev) => ({ ...prev, [fieldName]: error }));
	};

	const nextStep = () => {
		if (validateCurrentStep()) {
			setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
		} else {
			toaster.create({
				title: 'Campos incompletos',
				description: 'Por favor complete todos los campos requeridos',
				type: 'warning',
				duration: 3000,
			});
		}
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const goToStep = (stepNumber) => {
		if (stepNumber < currentStep) {
			setCurrentStep(stepNumber);
		}
	};

	const handleSubmit = async () => {
		if (!validateCurrentStep()) return;

		setIsSubmitting(true);
		const payload = {
			person: {
				user: {
					username: formData.email,
				},
				personal_email: formData.email,
				first_name: formData.first_name,
				paternal_surname: formData.hasOneLastName
					? formData.last_name
					: formData.father_last_name || '',
				maternal_surname: formData.hasOneLastName
					? ''
					: formData.mother_last_name || '',
				document_type: Number(formData.document_type),
				document_number: formData.document_number,
				birth_date: formData.birth_date,
				district: Number(formData.district),
				phone: formData.dial_code
					? `${formData.dial_code} ${formData.phone_number}`
					: formData.phone_number,
				nationality: Number(formData.nationality),
				address: formData.address,
				has_one_surname: formData.hasOneLastName,
				type_disability: Number(formData.type_disability) || null,
				other_disability: formData.other_disability || '',
				has_disability: formData.has_disability,
				alternativePhone: formData.alternativePhone,
				emergencyContact: formData.emergencyContact,
				emergencyPhone: formData.emergencyPhone,
				birth_country: Number(formData.birthCountry),
				residenceCountry: Number(formData.residenceCountry),
				department: Number(formData.department),
				province: Number(formData.province),
				postalCode: formData.postalCode,
				referenceAddress: formData.referenceAddress,
				previousEducation: formData.previousEducation,
				university: formData.university,
				graduationYear: formData.graduationYear,
				hasWorkExperience: formData.hasWorkExperience,
				workExperience: formData.workExperience,
				scholarshipInterest: formData.scholarshipInterest,
				howDidYouKnow: formData.howDidYouKnow,
				additionalComments: formData.additionalComments,
				gender: formData.gender,
				acceptsTerms: formData.acceptsTerms,
				acceptsDataProcessing: formData.acceptsDataProcessing,
			},
			admission_program: dataAdmissionProgram?.id,
			modality_id: Number(formData.modality_type),
		};

		create(payload, {
			onSuccess: () => {
				setIsSubmitting(false);
				navigate('/auth/login', {
					state: {
						successMessage: 'Registro exitoso, revise su correo electrónico.',
					},
				});
			},
			onError: (error) => {
				setIsSubmitting(false);
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

	//-------DATA-----------

	const postgraduateProgramTypeOptions =
		dataAdmissionProgram?.programs
			?.filter((program) => program.status === 4)
			?.map((program) => ({
				value: program.program.toString(), //id del programa
				label: program.program_name, // nombre del programa
			})) || [];

	const nationalityOptions =
		dataNacionalities?.results?.map((nationality) => ({
			value: nationality.id.toString(),
			label: nationality.name,
		})) || [];

	const countryOptions =
		dataCountries?.results?.map((country) => ({
			value: country.id.toString(),
			label: country.name,
			code: country.iso_code,
		})) || [];

	const dialCodeOptions =
		dataCountries?.results?.map((country) => ({
			value: country.dial_code.toString(),
			label: country.dial_code,
			code: country.iso_code,
		})) || [];

	const progress = (currentStep / STEPS.length) * 100;
	const currentStepData = STEPS[currentStep - 1];

	const availableDepartments = formData.residenceCountry
		? dataDepartments?.results
				?.filter((dep) => dep.country === Number(formData.residenceCountry))
				.map((dep) => ({
					value: dep.id.toString(),
					label: dep.name,
				})) || []
		: [];

	const DisabilitesOptions =
		dataDisabilites?.results?.map((disability) => ({
			value: disability.id.toString(),
			label: disability.name,
		})) || [];
	// Get available options based on selections
	const availableProvinces =
		dataProvince?.results
			?.filter((prov) =>
				formData.department
					? prov.department === Number(formData.department)
					: true
			)
			.map((prov) => ({
				value: prov.id.toString(),
				label: prov.name,
				department_id: prov.department,
			})) || [];

	const availableDistricts =
		dataDistrict?.results
			?.filter((dist) =>
				formData.province ? dist.province === Number(formData.province) : true
			)
			.map((dist) => ({
				value: dist.id.toString(),
				label: dist.name,
				province_id: dist.province,
			})) || [];

	const availableModalities =
		formData.postgraduate_program_type && dataAdmissionProgram?.programs?.length
			? dataAdmissionProgram.programs
					.filter(
						(program) =>
							program.program === Number(formData.postgraduate_program_type)
					)
					.flatMap(
						(program) =>
							program.modalities?.map((modality) => ({
								value: modality.id.toString(),
								label: modality.modality_name,
							})) || []
					)
			: [];

	const documentTypeOptions = [
		{ value: '1', label: 'DNI (Documento Nacional de Identidad)' },
		{ value: '2', label: 'Pasaporte' },
		{ value: '3', label: 'Carné de Extranjería' },
		{ value: '4', label: 'Cédula de Identidad' },
	];

	const getLabelFromOptions = (options, value) =>
		options.find((item) => item.value === value)?.label || '';

	return (
		<Box minH='100vh' bg={bgColor}>
			{/* Header */}
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
							<Container maxW='6xl' py={8}>
								{/* Progress Section */}
								<Card.Root mb={8} px={6} pt={4} shadow='lg' bg={cardBg}>
									<Card.Title pb={4}>
										<HStack justify='space-between' mb={4}>
											<VStack align='start' spacing={1}>
												<Heading fontSize={'24px'} color='#8B2635'>
													Formulario de Inscripción
												</Heading>
												<Text color='gray.600'>
													{dataAdmissionProgram?.admission_process_name.toUpperCase()}
												</Text>
											</VStack>
											<Badge
												colorPalette='gray'
												px={3}
												py={1}
												borderRadius='lg'
											>
												Paso {currentStep} de {STEPS.length}
											</Badge>
										</HStack>
										<Progress.Root value={progress} max={100} size={'md'}>
											<Progress.Track
												style={{
													backgroundColor: '#EDF2F7', // gray.200
													borderRadius: '8px',
													overflow: 'hidden',
												}}
											>
												<Progress.Range
													style={{
														backgroundColor: '#000000',
														transition: 'width 0.2s ease',
													}}
												/>
											</Progress.Track>

											<Text fontSize='sm' color='gray.600' mt={2}>
												{Math.round(progress)}% completado
											</Text>
										</Progress.Root>
									</Card.Title>
								</Card.Root>

								{/* Steps Navigation */}
								<Box mb={8} overflowX='auto'>
									<HStack
										spacing={{ base: 2, md: 8 }}
										justify='center'
										minW='max-content'
										px={4}
									>
										{STEPS.map((step) => {
											const IconComponent = step.icon;
											const isCompleted = currentStep > step.id;
											const isCurrent = currentStep === step.id;
											const isClickable = step.id < currentStep;

											return (
												<VStack key={step.id} w='6rem' align='center'>
													<Button
														onClick={() => isClickable && goToStep(step.id)}
														disabled={!isClickable}
														w={14}
														h={14}
														borderRadius='full'
														bg={
															isCompleted
																? 'green.500'
																: isCurrent
																	? '#8B2635'
																	: isClickable
																		? 'gray.300'
																		: 'gray.200'
														}
														color={
															isCompleted || isCurrent ? 'white' : 'gray.600'
														}
														_hover={{
															bg: isCompleted
																? 'green.600'
																: isCurrent
																	? '#7A1F2B'
																	: isClickable
																		? 'gray.400'
																		: 'gray.200',
														}}
														shadow={isCompleted || isCurrent ? 'lg' : 'none'}
													>
														<Icon
															as={isCompleted ? FaCheckCircle : IconComponent}
															w={6}
															h={6}
														></Icon>
													</Button>
													<VStack
														spacing={1}
														textAlign='center'
														maxW={24}
														minH='3em'
													>
														<Text
															fontSize='xs'
															fontWeight='medium'
															color={isCurrent ? '#8B2635' : 'gray.600'}
															noOfLines={2}
															minH='2.5em' // fija el alto del texto a dos líneas aprox.
														>
															{step.title}
														</Text>
													</VStack>
												</VStack>
											);
										})}
									</HStack>
								</Box>

								{/* Form Content */}
								<Card.Root p={8} shadow='lg' bg={cardBg}>
									<Card.Title
										bg='gray.50'
										borderTopRadius='md'
										borderBottom='1px'
										borderColor={borderColor}
									>
										<HStack spacing={1}>
											<Icon
												as={currentStepData.icon}
												w={5}
												h={5}
												color='#8B2635'
											/>
											<VStack align='start'>
												<Heading fontSize='20px' fontWeight={'bold'}>
													{currentStepData.title}{' '}
												</Heading>
											</VStack>
										</HStack>
									</Card.Title>
									<Separator mt={4} />
									<Card.Body p={2}>
										{/* Step 1: Personal Information */}
										{currentStep === 1 && (
											<VStack spacing={8}>
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													gap={10}
													w='full'
												>
													<VStack gap={6} align='stretch'>
														<Field
															label={
																<>
																	<Icon as={FiUser} w={4} h={4} />
																	Nombres
																</>
															}
															required
															errorText={errors.first_name}
															invalid={!!errors.first_name}
														>
															<Input
																value={formData.first_name}
																onChange={(e) =>
																	handleFieldChange(
																		'first_name',
																		e.target.value
																	)
																}
																onBlur={() => handleFieldBlur('first_name')}
																placeholder='Ingrese sus nombres completos'
															/>
														</Field>

														<Field
															label='¿Cuenta solo con un apellido?'
															errorText={errors.hasOneLastName}
															invalid={!!errors.hasOneLastName}
														>
															<RadioGroup
																value={formData.hasOneLastName ? 'yes' : 'no'}
																onChange={(value) =>
																	handleFieldChange(
																		'hasOneLastName',
																		value.target.defaultValue === 'yes'
																	)
																}
																spaceX={4}
															>
																<Radio value='yes'>Sí</Radio>
																<Radio value='no'>No</Radio>
															</RadioGroup>
														</Field>

														<Field
															label='Género'
															required
															errorText={errors.gender}
															invalid={!!errors.gender}
														>
															<RadioGroup
																value={formData.gender}
																onChange={(value) =>
																	handleFieldChange(
																		'gender',
																		value.target.defaultValue
																	)
																}
																spaceX={4}
															>
																<Radio value='1'>Masculino</Radio>
																<Radio value='2'>Femenino</Radio>
																<Radio value='3'>Otro</Radio>
															</RadioGroup>
														</Field>
													</VStack>

													<VStack gap={6} align='stretch'>
														{formData.hasOneLastName ? (
															<Field
																label='Apellido'
																errorText={errors.last_name}
																invalid={!!errors.last_name}
															>
																<Input
																	value={formData.last_name}
																	onChange={(e) =>
																		handleFieldChange(
																			'last_name',
																			e.target.value
																		)
																	}
																	onBlur={() => handleFieldBlur('last_name')}
																	placeholder='Ingrese su apellido'
																/>
															</Field>
														) : (
															<>
																<Field
																	label='Apellido Paterno'
																	required
																	errorText={errors.father_last_name}
																	invalid={!!errors.father_last_name}
																>
																	<Input
																		value={formData.father_last_name}
																		onChange={(e) =>
																			handleFieldChange(
																				'father_last_name',
																				e.target.value
																			)
																		}
																		onBlur={() =>
																			handleFieldBlur('father_last_name')
																		}
																		placeholder='Ingrese su apellido paterno'
																	/>
																</Field>

																<Field
																	label='Apellido Materno'
																	required
																	errorText={errors.mother_last_name}
																	invalid={!!errors.mother_last_name}
																>
																	<Input
																		value={formData.mother_last_name}
																		onChange={(e) =>
																			handleFieldChange(
																				'mother_last_name',
																				e.target.value
																			)
																		}
																		onBlur={() =>
																			handleFieldBlur('mother_last_name')
																		}
																		placeholder='Ingrese su apellido materno'
																	/>
																</Field>
															</>
														)}

														<Field
															label={
																<Flex
																	align='center'
																	gap={2}
																	fontWeight='medium'
																>
																	<Icon as={FaCalendarAlt} w={4} h={4} />
																	Fecha de Nacimiento
																</Flex>
															}
															required
															errorText={errors.birth_date}
															invalid={!!errors.birth_date}
														>
															<CustomDatePicker
																selectedDate={
																	formData.birth_date
																		? formData.birth_date
																		: null
																}
																onDateChange={(date) =>
																	handleFieldChange(
																		'birth_date',
																		format(date, 'yyyy-MM-dd')
																	)
																}
																buttonSize='md'
																disableFutureDates={true}
																asChild={true}
															/>
														</Field>
													</VStack>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 2: Contact Information */}
										{currentStep === 2 && (
											<VStack spacing={8}>
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													gap={10}
													w='full'
												>
													<VStack gap={6} align='stretch'>
														<Field
															label={
																<Flex
																	align='center'
																	gap={2}
																	fontWeight='medium'
																>
																	<Icon as={FaEnvelope} w={4} h={4} />
																	Correo Electrónico
																</Flex>
															}
															errorText={errors.email}
															invalid={!!errors.email}
															required
															helpText='Se enviará información importante a este correo'
														>
															<Input
																type='email'
																value={formData.email}
																onChange={(e) =>
																	handleFieldChange('email', e.target.value)
																}
																onBlur={() => handleFieldBlur('email')}
																placeholder='ejemplo@correo.com'
															/>
														</Field>

														<Field
															label={
																<Flex
																	align='center'
																	gap={2}
																	fontWeight='medium'
																>
																	<Icon as={FaPhone} w={4} h={4} />
																	Teléfono Principal
																</Flex>
															}
															required
															errorText={errors.phone_number}
															invalid={!!errors.phone_number}
														>
															<HStack w={'full'} gap={2} align='center'>
																<CustomSelect
																	placeholder='Seleccione'
																	defaultValue={formData.dial_code}
																	onChange={(val) =>
																		handleFieldChange('dial_code', val)
																	}
																	items={dialCodeOptions}
																	w={'120px'}
																	renderLeft={(item) => (
																		<img
																			src={`https://flagcdn.com/w20/${item.code}.png`}
																			alt={item.label}
																			className='w-5 h-4'
																		/>
																	)}
																	renderValue={(item) => (
																		<HStack className='flex items-center gap-2'>
																			<img
																				src={`https://flagcdn.com/w20/${item.code}.png`}
																				alt={item.label}
																				className='w-5 h-4'
																			/>
																			{item.label}
																		</HStack>
																	)}
																/>
																<Input
																	value={formData.phone_number}
																	onChange={(e) =>
																		handleFieldChange(
																			'phone_number',
																			e.target.value
																		)
																	}
																	onBlur={() => handleFieldBlur('phone_number')}
																	placeholder='999 999 999'
																	flex={1}
																	w={'full'}
																/>
															</HStack>
														</Field>

														<Field label='Teléfono Alternativo'>
															<Input
																value={formData.alternativePhone}
																onChange={(e) =>
																	handleFieldChange(
																		'alternativePhone',
																		e.target.value
																	)
																}
																placeholder='Teléfono opcional'
															/>
														</Field>
													</VStack>

													<VStack gap={6} align='stretch'>
														<Field
															label='Contacto de Emergencia'
															required
															errorText={errors.emergencyContact}
															invalid={!!errors.emergencyContact}
														>
															<Input
																value={formData.emergencyContact}
																onChange={(e) =>
																	handleFieldChange(
																		'emergencyContact',
																		e.target.value
																	)
																}
																onBlur={() =>
																	handleFieldBlur('emergencyContact')
																}
																placeholder='Nombre completo del contacto'
															/>
														</Field>

														<Field
															label='Teléfono de Emergencia'
															required
															errorText={errors.emergencyPhone}
															invalid={!!errors.emergencyPhone}
														>
															<Input
																value={formData.emergencyPhone}
																onChange={(e) =>
																	handleFieldChange(
																		'emergencyPhone',
																		e.target.value
																	)
																}
																onBlur={() => handleFieldBlur('emergencyPhone')}
																placeholder='Teléfono del contacto de emergencia'
															/>
														</Field>

														<Alert
															status='info'
															title='Información importante'
															icon={<FaInfoCircle />}
														>
															La información de contacto de emergencia es
															importante para casos de urgencia durante el
															proceso académico.
														</Alert>
													</VStack>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 3: Document Information */}
										{currentStep === 3 && (
											<VStack spacing={8}>
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													gap={8}
													w='full'
												>
													<VStack gap={6} align='stretch'>
														<Field
															label={
																<Flex align='center' gap={2}>
																	<Icon as={FaFileAlt} w={4} h={4} />
																	Tipo de Documento
																</Flex>
															}
															errorText={errors.document_type}
															required
															invalid={!!errors.document_type}
														>
															<CustomSelect
																placeholder='Seleccione tipo de documento'
																defaultValue={formData.document_type}
																onChange={(val) =>
																	handleFieldChange('document_type', val)
																}
																items={documentTypeOptions}
															/>
														</Field>

														<Field
															label='Número de Documento'
															required
															errorText={errors.document_number}
															invalid={!!errors.document_number}
														>
															<Input
																value={formData.document_number}
																onChange={(e) =>
																	handleFieldChange(
																		'document_number',
																		e.target.value
																	)
																}
																onBlur={() =>
																	handleFieldBlur('document_number')
																}
																placeholder='Ingrese número de documento'
															/>
														</Field>

														<Field
															label='Nacionalidad'
															required
															errorText={errors.nationality}
															invalid={!!errors.nationality}
														>
															<CustomSelect
																placeholder='Seleccione nacionalidad'
																defaultValue={formData.nationality}
																onChange={(val) =>
																	handleFieldChange('nationality', val)
																}
																items={nationalityOptions}
															/>
														</Field>
													</VStack>

													<VStack spacing={6} align='stretch'>
														<Field
															label={
																<>
																	<Icon as={FaGlobe} w={4} h={4} />
																	País de Nacimiento
																</>
															}
															required
															errorText={errors.birthCountry}
															invalid={!!errors.birthCountry}
														>
															<CustomSelect
																placeholder='Seleccione país de nacimiento'
																defaultValue={formData.birthCountry}
																onChange={(val) =>
																	handleFieldChange('birthCountry', val)
																}
																items={countryOptions}
																renderLeft={(item) => (
																	<img
																		src={`https://flagcdn.com/w20/${item.code}.png`}
																		alt={item.label}
																		className='w-5 h-4'
																	/>
																)}
															/>
														</Field>

														<Field
															label='País de Residencia'
															required
															errorText={errors.residenceCountry}
															invalid={!!errors.residenceCountry}
														>
															<CustomSelect
																placeholder='Seleccione país de residencia'
																defaultValue={formData.residenceCountry}
																onChange={(val) =>
																	handleFieldChange('residenceCountry', val)
																}
																items={countryOptions}
																renderLeft={(item) => (
																	<img
																		src={`https://flagcdn.com/w20/${item.code}.png`}
																		alt={item.label}
																		className='w-5 h-4'
																	/>
																)}
															/>
														</Field>

														<Alert
															status='info'
															title='Información importante'
															icon={<FaInfoCircle />}
														>
															Asegúrese de que la información del documento sea
															exacta. Deberá presentar el documento original
															durante el proceso de matrícula.
														</Alert>
													</VStack>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 4: Address Information */}
										{currentStep === 4 && (
											<VStack gap={8} align='stretch'>
												<Field
													label={
														<>
															<Icon as={FaMapMarkerAlt} w={4} h={4} />
															Dirección Completa
														</>
													}
													required
													errorText={errors.address}
													invalid={!!errors.address}
												>
													<Textarea
														value={formData.address}
														onChange={(e) =>
															handleFieldChange('address', e.target.value)
														}
														onBlur={() => handleFieldBlur('address')}
														placeholder='Ingrese su dirección completa (calle, número, urbanización, etc.)'
														rows={3}
													/>
												</Field>

												<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
													<Field
														label='Departamento de Residencia'
														required
														errorText={errors.department}
														invalid={!!errors.department}
													>
														<CustomSelect
															items={availableDepartments}
															defaultValue={formData.department}
															onChange={(val) =>
																handleFieldChange('department', val)
															}
														/>
													</Field>

													<Field
														label='Provincia de Residencia'
														required
														errorText={errors.province}
														invalid={!!errors.province}
													>
														<CustomSelect
															placeholder='Seleccione'
															defaultValue={formData.province}
															onChange={(val) => {
																handleFieldChange('province', val);
																handleFieldChange('district', '');
															}}
															items={availableProvinces}
															isDisabled={!formData.department}
														/>
													</Field>

													<Field
														label='Distrito de Residencia'
														required
														errorText={errors.district}
														invalid={!!errors.district}
													>
														<CustomSelect
															placeholder='Seleccione'
															defaultValue={formData.district}
															onChange={(val) =>
																handleFieldChange('district', val)
															}
															items={availableDistricts}
															isDisabled={!formData.province}
														/>
													</Field>
												</SimpleGrid>

												<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
													<Field label='Código Postal'>
														<Input
															value={formData.postalCode}
															onChange={(e) =>
																handleFieldChange('postalCode', e.target.value)
															}
															placeholder='Código postal (opcional)'
														/>
													</Field>

													<Field label='Referencia de Ubicación'>
														<Input
															value={formData.referenceAddress}
															onChange={(e) =>
																handleFieldChange(
																	'referenceAddress',
																	e.target.value
																)
															}
															placeholder='Ej: Cerca al parque, frente a la iglesia'
														/>
													</Field>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 5: Academic postgraduate_program_type */}
										{currentStep === 5 && (
											<VStack gap={8}>
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													gap={8}
													w='full'
												>
													<VStack gap={2} align='stretch'>
														<Field
															label={
																<>
																	<Icon as={FaGraduationCap} w={4} h={4} />
																	Programa Académico
																</>
															}
															required
															errorText={errors.postgraduate_program_type}
															invalid={!!errors.postgraduate_program_type}
														>
															<CustomSelect
																placeholder='Seleccione programa académico'
																defaultValue={
																	formData.postgraduate_program_type
																}
																onChange={(val) =>
																	handleFieldChange(
																		'postgraduate_program_type',
																		val
																	)
																}
																items={postgraduateProgramTypeOptions}
															/>
														</Field>

														<Field
															label='Modalidad de Admisión'
															required
															errorText={errors.modality_type}
															invalid={!!errors.modality_type}
														>
															<CustomSelect
																placeholder='Seleccione modalidad'
																items={availableModalities}
																defaultValue={formData.modality_type}
																onChange={(val) =>
																	handleFieldChange('modality_type', val)
																}
																disabled={!formData.postgraduate_program_type}
															/>
														</Field>

														<Field
															label='Nivel de Educación Previa'
															required
															errorText={errors.previousEducation}
															invalid={!!errors.previousEducation}
														>
															<CustomSelect
																placeholder='Seleccione nivel educativo'
																defaultValue={formData.previousEducation}
																onChange={(val) =>
																	handleFieldChange('previousEducation', val)
																}
																items={[
																	{ value: 'bachiller', label: 'Bachiller' },
																	{
																		value: 'licenciado',
																		label: 'Licenciado/Titulado',
																	},
																	{ value: 'magister', label: 'Magíster' },
																	{ value: 'doctor', label: 'Doctor' },
																]}
															/>
														</Field>
													</VStack>

													<VStack gap={6} align='stretch'>
														<Field
															label='Universidad de Procedencia'
															required
															invalid={!!errors.university}
															errorText={errors.university}
														>
															<Input
																value={formData.university}
																onChange={(e) =>
																	handleFieldChange(
																		'university',
																		e.target.value
																	)
																}
																onBlur={() => handleFieldBlur('university')}
																placeholder='Nombre de la universidad'
															/>
														</Field>

														<Field
															label='Año de Graduación'
															required
															errorText={errors.graduationYear}
															invalid={!!errors.graduationYear}
														>
															<CustomSelect
																placeholder='Seleccione año'
																defaultValue={formData.graduationYear}
																onChange={(val) =>
																	handleFieldChange('graduationYear', val)
																}
																items={Array.from({ length: 30 }, (_, i) => {
																	const year = new Date().getFullYear() - i;
																	return {
																		value: year.toString(),
																		label: year.toString(),
																	};
																})}
															/>
														</Field>

														<VStack spacing={4} align='stretch'>
															<Checkbox
																checked={formData.hasWorkExperience}
																onChange={(e) =>
																	handleFieldChange(
																		'hasWorkExperience',
																		e.target.checked
																	)
																}
															>
																Tengo experiencia laboral relevante
															</Checkbox>

															{formData.hasWorkExperience && (
																<Field label='Descripción de Experiencia Laboral'>
																	<Textarea
																		value={formData.workExperience}
																		onChange={(e) =>
																			handleFieldChange(
																				'workExperience',
																				e.target.value
																			)
																		}
																		placeholder='Describa brevemente su experiencia laboral relevante'
																		rows={3}
																	/>
																</Field>
															)}
														</VStack>
													</VStack>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 6: Additional Information */}
										{currentStep === 6 && (
											<VStack gap={8}>
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													gap={8}
													w='full'
												>
													<VStack gap={6} align='stretch'>
														<VStack gap={4} align='stretch'>
															<Checkbox
																checked={formData.has_disability}
																onChange={(e) =>
																	handleFieldChange(
																		'has_disability',
																		e.target.checked
																	)
																}
															>
																Tengo alguna discapacidad o necesidad especial
															</Checkbox>
															{formData.has_disability && (
																<>
																	<Field label='Tipo de Discapacidad:'>
																		<CustomSelect
																			placeholder='Seleccione modalidad'
																			items={DisabilitesOptions}
																			defaultValue={formData.type_disability}
																			onChange={(val) =>
																				handleFieldChange(
																					'type_disability',
																					val
																				)
																			}
																		/>
																	</Field>

																	<Field label='Descripción de Discapacidad:'>
																		<Textarea
																			value={formData.other_disability}
																			onChange={(e) =>
																				handleFieldChange(
																					'other_disability',
																					e.target.value
																				)
																			}
																			placeholder='Describa su discapacidad o necesidad especial para brindarle el apoyo adecuado'
																			rows={3}
																		/>
																	</Field>
																</>
															)}
														</VStack>

														<Checkbox
															checked={formData.scholarshipInterest}
															onChange={(e) =>
																handleFieldChange(
																	'scholarshipInterest',
																	e.target.checked
																)
															}
														>
															Estoy interesado en información sobre becas
														</Checkbox>
													</VStack>

													<VStack gap={6} align='stretch'>
														<Field
															label='¿Cómo se enteró de nuestro programa?'
															required
															errorText={errors.howDidYouKnow}
															invalid={!!errors.howDidYouKnow}
														>
															<CustomSelect
																placeholder='Seleccione una opción'
																defaultValue={formData.howDidYouKnow}
																onChange={(val) =>
																	handleFieldChange('howDidYouKnow', val)
																}
																items={[
																	{
																		value: 'web-uni',
																		label: 'Página web de la UNI',
																	},
																	{
																		value: 'redes-sociales',
																		label: 'Redes sociales',
																	},
																	{
																		value: 'recomendacion',
																		label: 'Recomendación de conocidos',
																	},
																	{
																		value: 'feria-educativa',
																		label: 'Feria educativa',
																	},
																	{ value: 'publicidad', label: 'Publicidad' },
																	{ value: 'otro', label: 'Otro' },
																]}
															/>
														</Field>

														<Field label='Comentarios Adicionales'>
															<Textarea
																value={formData.additionalComments}
																onChange={(e) =>
																	handleFieldChange(
																		'additionalComments',
																		e.target.value
																	)
																}
																placeholder='Cualquier información adicional que desee compartir (opcional)'
																rows={4}
															/>
														</Field>
													</VStack>
												</SimpleGrid>
											</VStack>
										)}

										{/* Step 7: Review and Submit */}
										{currentStep === 7 && (
											<VStack gap={8} align='stretch'>
												<Box bg='blue.50' p={6} borderRadius='lg'>
													<Heading size='md' color='blue.900' mb={4}>
														Resumen de su Inscripción
													</Heading>
													<SimpleGrid
														columns={{ base: 1, md: 2 }}
														spacing={6}
														fontSize='sm'
													>
														<VStack align='stretch' gap={2}>
															<Heading size='sm' color='uni.secondary'>
																Información Personal
															</Heading>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Nombre:
																</Text>{' '}
																{formData.first_name}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Apellidos:
																</Text>{' '}
																{formData.hasOneLastName
																	? formData.last_name
																	: `${formData.father_last_name} ${formData.mother_last_name}`}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Fecha de Nacimiento:
																</Text>{' '}
																{formData.birth_date}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Género:
																</Text>{' '}
																{formData.gender}
															</Text>
														</VStack>
														<VStack align='stretch' gap={2}>
															<Heading size='sm' color='uni.secondary'>
																Contacto
															</Heading>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Email:
																</Text>{' '}
																{formData.email}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Teléfono:
																</Text>{' '}
																{formData.dial_code} {formData.phone_number}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Contacto de Emergencia:
																</Text>{' '}
																{formData.emergencyContact}
															</Text>
														</VStack>
														<VStack align='stretch' gap={2}>
															<Heading size='sm' color='uni.secondary' mt={5}>
																Documentos
															</Heading>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Tipo:
																</Text>{' '}
																{getLabelFromOptions(
																	documentTypeOptions,
																	formData.document_type.toString()
																)}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Número:
																</Text>{' '}
																{formData.document_number}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Nacionalidad:
																</Text>{' '}
																{getLabelFromOptions(
																	nationalityOptions,
																	formData.nationality.toString()
																)}
															</Text>
														</VStack>
														<VStack align='stretch' spacing={2}>
															<Heading size='sm' color='uni.secondary'>
																Programa Académico
															</Heading>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Programa:
																</Text>{' '}
																{getLabelFromOptions(
																	postgraduateProgramTypeOptions,
																	formData.postgraduate_program_type.toString()
																)}
															</Text>
															<Text>
																<Text as='span' fontWeight='bold'>
																	Modalidad:
																</Text>{' '}
																{getLabelFromOptions(
																	availableModalities,
																	formData.modality_type.toString()
																)}
															</Text>
														</VStack>
													</SimpleGrid>
												</Box>

												<VStack gap={6} align='stretch'>
													<VStack gap={4} align='stretch'>
														<HStack align='start' spacing={3}>
															<Checkbox
																checked={formData.acceptsTerms}
																onChange={(e) =>
																	handleFieldChange(
																		'acceptsTerms',
																		e.target.checked
																	)
																}
																mt={1}
															/>
															<VStack align='start' spacing={1}>
																<Text>
																	Acepto los{' '}
																	<Text
																		as='a'
																		href='#'
																		color='blue.600'
																		textDecoration='underline'
																	>
																		términos y condiciones
																	</Text>{' '}
																	del proceso de admisión *
																</Text>
																{errors.acceptsTerms && (
																	<Text color='red.500' fontSize='sm'>
																		{errors.acceptsTerms}
																	</Text>
																)}
															</VStack>
														</HStack>

														<HStack align='start' gap={3}>
															<Checkbox
																checked={formData.acceptsDataProcessing}
																onChange={(e) =>
																	handleFieldChange(
																		'acceptsDataProcessing',
																		e.target.checked
																	)
																}
																mt={1}
															/>
															<VStack align='start' gap={1}>
																<Text>
																	Autorizo el tratamiento de mis datos
																	personales conforme a la{' '}
																	<Text
																		as='a'
																		href='#'
																		color='blue.600'
																		textDecoration='underline'
																	>
																		Ley de Protección de Datos Personales
																	</Text>{' '}
																	*
																</Text>
																{errors.acceptsDataProcessing && (
																	<Text color='red.500' fontSize='sm'>
																		{errors.acceptsDataProcessing}
																	</Text>
																)}
															</VStack>
														</HStack>
													</VStack>
													<Alert
														status='success'
														title='Información importante'
														icon={<FaCheckCircle />}
													>
														Al enviar este formulario, su inscripción será
														procesada y recibirá un correo de confirmación con
														los siguientes pasos del proceso de admisión.
													</Alert>
												</VStack>
											</VStack>
										)}

										{/* Navigation Buttons */}
										<Flex
											justify='space-between'
											pt={8}
											borderTop='1px'
											borderColor={borderColor}
										>
											<Button
												variant='outline'
												onClick={prevStep}
												isDisabled={currentStep === 1}
												leftIcon={<FaArrowLeft />}
												px={6}
												py={2}
											>
												Anterior
											</Button>

											{currentStep < STEPS.length ? (
												<Button
													onClick={nextStep}
													bg='#8B2635'
													color='white'
													_hover={{ bg: '#7A1F2B' }}
													rightIcon={<FaArrowRight />}
													px={6}
													py={2}
												>
													Siguiente
												</Button>
											) : (
												<Button
													onClick={handleSubmit}
													loading={isSubmitting}
													loadingText='Enviando Inscripción...'
													disabled={
														!formData.acceptsTerms ||
														!formData.acceptsDataProcessing
													}
													bg='green.600'
													color='white'
													_hover={{ bg: 'green.700' }}
													px={8}
													py={2}
													size='lg'
												>
													Enviar Inscripción <FaPaperPlane />
												</Button>
											)}
										</Flex>
									</Card.Body>
								</Card.Root>

								{/* Help Section */}
								<Card.Root mt={8} bg='gray.50'>
									<Card.Body p={6}>
										<VStack spacing={4} textAlign='center'>
											<Heading size='md' color='gray.800'>
												¿Necesita Ayuda?
											</Heading>
											<Text color='gray.600'>
												Si tiene alguna duda durante el proceso de inscripción,
												puede contactarnos:
											</Text>
											<Flex
												direction={{ base: 'column', md: 'row' }}
												gap={4}
												fontSize='sm'
											>
												<HStack>
													<Icon as={FaEnvelope} w={4} h={4} color='#8B2635' />
													<Text>admision@fieecs.uni.edu.pe</Text>
												</HStack>
												<HStack>
													<Icon as={FaPhone} w={4} h={4} color='#8B2635' />
													<Text>(01) 481-1070 ext. 123</Text>
												</HStack>
											</Flex>
										</VStack>
									</Card.Body>
								</Card.Root>
							</Container>
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
								<Card.Root mt={8} bg='gray.50'>
									<Card.Body p={6}>
										<VStack spacing={4} textAlign='center'>
											<Heading size='md' color='gray.800'>
												¿Necesita Ayuda?
											</Heading>
											<Text color='gray.600'>
												Si tiene alguna duda durante el proceso de inscripción,
												puede contactarnos:
											</Text>
											<Flex
												direction={{ base: 'column', md: 'row' }}
												gap={4}
												fontSize='sm'
											>
												<HStack>
													<Icon as={FaEnvelope} w={4} h={4} color='#8B2635' />
													<Text>admision@fieecs.uni.edu.pe</Text>
												</HStack>
												<HStack>
													<Icon as={FaPhone} w={4} h={4} color='#8B2635' />
													<Text>(01) 481-1070 ext. 123</Text>
												</HStack>
											</Flex>
										</VStack>
									</Card.Body>
								</Card.Root>
							</Container>
						)
					}
				</>
			)}
		</Box>
	);
}
