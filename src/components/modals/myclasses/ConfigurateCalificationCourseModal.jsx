import { ReactSelect } from '@/components/select';
import { Field, Button, Modal, toaster } from '@/components/ui';
import {
	Card,
	Flex,
	Heading,
	Input,
	Stack,
	Text,
	VStack,
	HStack,
	Badge,
	Alert,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FiSave, FiSettings, FiAlertTriangle } from 'react-icons/fi';
import { useConfigureEvaluationByCourse } from '@/hooks/course_groups';

export const ConfigurateCalificationCourseModal = ({
	fetchData,
	courseGroup,
	data,
	hasConfiguration,
}) => {
	const [open, setOpen] = useState(false);
	const [evaluationMethod, setEvaluationMethod] = useState(null); // Nueva: Método de evaluación
	const [qualificationType, setQualificationType] = useState(null);
	const [numberOfEvaluations, setNumberOfEvaluations] = useState('');
	const [evaluations, setEvaluations] = useState([]);
	const [errors, setErrors] = useState({});
	const [currentStep, setCurrentStep] = useState(1); // 1: Método, 2: Tipo, 3: Número, 4: Configurar

  const evaluationComponents = data?.evaluation_components || [];

	const { mutate: configureEvaluation, isLoading: isConfiguring } =
		useConfigureEvaluationByCourse(courseGroup?.id);

	const EvaluationMethods = [
		{ value: 1, label: 'Nota Final' },
		{ value: 2, label: 'Evaluaciones Parciales' },
	];

	const QualificationTypes = [
		{ value: 1, label: 'Porcentaje por pesos' },
		{ value: 2, label: 'Promedio simple' },
	];

	// Determinar si ya está configurado
	const isAlreadyConfigured = hasConfiguration;
	const currentQualificationLabel =
		QualificationTypes.find((q) => q.value === data?.qualification_type_code)?.label ||
		'No definido';

	// Reset form cuando se abre la modal
	useEffect(() => {
		if (open && !isAlreadyConfigured) {
			setCurrentStep(1);
			setEvaluationMethod(null);
			setQualificationType(null);
			setNumberOfEvaluations('');
			setEvaluations([]);
			setErrors({});
		}
	}, [open, isAlreadyConfigured]);

	// Inicializar evaluaciones vacías cuando cambia el número
	useEffect(() => {
		if (numberOfEvaluations && parseInt(numberOfEvaluations) > 0) {
			const num = parseInt(numberOfEvaluations);
			const newEvaluations = Array.from({ length: num }, () => ({
				name: '',
				weight: qualificationType?.value === 1 ? 0 : null,
			}));
			setEvaluations(newEvaluations);
		}
	}, [numberOfEvaluations, qualificationType]);

	const validateStep = (step) => {
		const newErrors = {};

		if (step === 1) {
			if (!evaluationMethod) {
				newErrors.evaluationMethod = 'Debe seleccionar un método de evaluación';
			}
		}

		if (step === 2) {
			if (evaluationMethod?.value === 2 && !qualificationType) {
				newErrors.qualificationType =
					'Debe seleccionar un tipo de calificación';
			}
		}

		if (step === 3) {
			if (
				evaluationMethod?.value === 2 &&
				(!numberOfEvaluations || parseInt(numberOfEvaluations) < 1)
			) {
				newErrors.numberOfEvaluations =
					'Debe ingresar un número válido de evaluaciones';
			}
		}

		if (step === 4) {
			evaluations.forEach((evaluation, index) => {
				if (!evaluation.name.trim()) {
					newErrors[`evaluation_${index}_name`] =
						`El nombre de la evaluación ${index + 1} es requerido`;
				}
				if (
					qualificationType?.value === 1 &&
					(!evaluation.weight || evaluation.weight <= 0)
				) {
					newErrors[`evaluation_${index}_weight`] =
						`El peso de la evaluación ${index + 1} debe ser mayor a 0`;
				}
			});

			// Validar que los pesos sumen 100% si es por pesos
			if (qualificationType?.value === 1) {
				const totalWeight = evaluations.reduce(
					(sum, evaluation) => sum + (parseFloat(evaluation.weight) || 0),
					0
				);
				if (totalWeight !== 100) {
					newErrors.totalWeight = `Los pesos deben sumar exactamente 100%. Actualmente suma ${totalWeight}%`;
				}
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep(currentStep)) {
			// Lógica especial de navegación
			if (currentStep === 1 && evaluationMethod?.value === 1) {
				// Para nota única, saltar directo al paso 2 (resumen)
				setCurrentStep(2);
			} else {
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const handleBack = () => {
		// Lógica especial de navegación hacia atrás
		if (currentStep === 2 && evaluationMethod?.value === 1) {
			// Para nota única, regresar directo al paso 1
			setCurrentStep(1);
		} else {
			setCurrentStep(currentStep - 1);
		}
		setErrors({});
	};

	const handleEvaluationChange = (index, field, value) => {
		const newEvaluations = [...evaluations];
		newEvaluations[index] = {
			...newEvaluations[index],
			[field]: field === 'weight' ? parseFloat(value) || 0 : value,
		};
		setEvaluations(newEvaluations);

		// Limpiar errores específicos
		if (errors[`evaluation_${index}_${field}`]) {
			const newErrors = { ...errors };
			delete newErrors[`evaluation_${index}_${field}`];
			setErrors(newErrors);
		}
	};

	const handleSubmit = () => {
		let payload;

		// Caso 1: Nota Única
		if (evaluationMethod?.value === 1) {
			payload = {
				qualification_type: 2, // Siempre promedio simple para nota única
				number_of_evaluations: 1,
				evaluation_components: [
					{
						name: 'Evaluación final',
						weight: null,
					},
				],
			};
		}
		// Caso 2: Notas Parciales
		else {
			if (!validateStep(4)) {
				return;
			}

			payload = {
				qualification_type: qualificationType.value,
				number_of_evaluations: parseInt(numberOfEvaluations),
				evaluation_components: evaluations.map((evaluation) => ({
					name: evaluation.name,
					weight: qualificationType.value === 1 ? evaluation.weight : 0,
				})),
			};
		}

		configureEvaluation(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Configuración guardada',
						description: 'Las evaluaciones se han configurado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData && fetchData();
				},
				onError: (error) => {
					toaster.create({
						title: 'Error al configurar',
						description:
							error.message ||
							'Ocurrió un error al configurar las evaluaciones',
						type: 'error',
					});
				},
			}
		);
	};

	const renderStepContent = () => {
		if (isAlreadyConfigured) {
			return (
				<Card.Root>
					<Card.Header>
						<Heading
							color={'#0661D8'}
							size='lg'
							display='flex'
							alignItems='center'
							gapX={2}
						>
							<FiSettings /> Configuración Actual
						</Heading>
					</Card.Header>
					<Card.Body>
						<VStack spacing={4} align='start'>
							<HStack>
								<Text fontWeight='semibold'>Tipo de calificación:</Text>
								<Badge colorScheme='blue'>{currentQualificationLabel}</Badge>
							</HStack>

							<Text fontWeight='semibold'>Evaluaciones configuradas:</Text>
							<VStack spacing={2} align='start' w='full'>
								{evaluationComponents?.map((component, index) => (
									<HStack
										key={component.id || index}
										w='full'
										justify='space-between'
									>
										<Text>{component.name}</Text>
										{data?.qualification_type_code === 1 && (
											<Badge variant='outline'>{component.weight}%</Badge>
										)}
									</HStack>
								))}
							</VStack>

							<Text fontSize='sm' color='gray.500' fontStyle='italic'>
								La configuración ya está definida. No se puede modificar una vez
								establecida.
							</Text>
						</VStack>
					</Card.Body>
				</Card.Root>
			);
		}

		// Paso 1: Seleccionar método de evaluación
		if (currentStep === 1) {
			return (
				<Card.Root>
					<Card.Header>
						<Heading color={'#0661D8'} size='lg'>
							Paso 1: Método de Evaluación
						</Heading>
						<Text fontSize='sm' color='gray.500'>
							¿Cómo deseas evaluar a los estudiantes de este curso?
						</Text>
					</Card.Header>
					<Card.Body>
						<Field
							label='Método de evaluación'
							invalid={!!errors.evaluationMethod}
							errorText={errors.evaluationMethod}
							required
						>
							<ReactSelect
								options={EvaluationMethods}
								value={evaluationMethod}
								onChange={setEvaluationMethod}
								placeholder='Selecciona el método de evaluación'
							/>
						</Field>

						{evaluationMethod && (
							<Card.Root mt={4} bg='blue.50' borderColor='blue.200'>
								<Card.Body>
									<Text fontSize='sm'>
										<strong>{evaluationMethod.label}:</strong>{' '}
										{evaluationMethod.value === 1
											? 'Se registrará una sola calificación final por estudiante.'
											: 'Se registrarán múltiples evaluaciones parciales que conformarán la nota final.'}
									</Text>
								</Card.Body>
							</Card.Root>
						)}
					</Card.Body>
				</Card.Root>
			);
		}

		// Paso 2: Seleccionar tipo de calificación (solo para parciales)
		if (currentStep === 2 && evaluationMethod?.value === 2) {
			return (
				<Card.Root>
					<Card.Header>
						<Heading color={'#0661D8'} size='lg'>
							Paso 2: Tipo de Calificación
						</Heading>
						<Text fontSize='sm' color='gray.500'>
							Selecciona cómo se calcularán las evaluaciones parciales.
						</Text>
					</Card.Header>
					<Card.Body>
						<Field
							label='Tipo de calificación'
							invalid={!!errors.qualificationType}
							errorText={errors.qualificationType}
							required
						>
							<ReactSelect
								options={QualificationTypes}
								value={qualificationType}
								onChange={setQualificationType}
								placeholder='Selecciona el tipo de calificación'
							/>
						</Field>

						{qualificationType && (
							<Card.Root mt={4} bg='blue.50' borderColor='blue.200'>
								<Card.Body>
									<Text fontSize='sm'>
										<strong>{qualificationType.label}:</strong>{' '}
										{qualificationType.value === 1
											? 'Cada evaluación tendrá un peso específico que debe sumar 100%.'
											: 'Todas las evaluaciones tendrán el mismo peso en la nota final.'}
									</Text>
								</Card.Body>
							</Card.Root>
						)}
					</Card.Body>
				</Card.Root>
			);
		}

		// Paso 3: Número de evaluaciones (solo para parciales)
		if (
			(currentStep === 2 && evaluationMethod?.value === 1) ||
			(currentStep === 3 && evaluationMethod?.value === 2)
		) {
			// Para nota única, saltar directamente al resumen
			if (evaluationMethod?.value === 1) {
				return (
					<Card.Root>
						<Card.Header>
							<Heading color={'#0661D8'} size='lg'>
								Paso 2: Resumen de Configuración
							</Heading>
							<Text fontSize='sm' color='gray.500'>
								Confirma la configuración para la evaluación final.
							</Text>
						</Card.Header>
						<Card.Body>
							<VStack spacing={4} align='start'>
								{/* Alerta de advertencia */}
								<Alert.Root status='warning' variant='subtle'>
									<Alert.Indicator>
										<FiAlertTriangle />
									</Alert.Indicator>
									<Alert.Title>¡Importante!</Alert.Title>
									<Alert.Description>
										Una vez configurado, el sistema de evaluación no podrá ser modificado. 
										Revise cuidadosamente antes de confirmar.
									</Alert.Description>
								</Alert.Root>

								<HStack>
									<Text fontWeight='semibold'>Método:</Text>
									<Badge colorScheme='blue'>Nota Final</Badge>
								</HStack>
								<HStack>
									<Text fontWeight='semibold'>Tipo:</Text>
									<Badge colorScheme='green'>Promedio Simple</Badge>
								</HStack>
								<HStack>
									<Text fontWeight='semibold'>Evaluaciones:</Text>
									<Text>1 - Evaluación final</Text>
								</HStack>

								<Text fontSize='sm' color='gray.500' fontStyle='italic'>
									Se creará un campo único para registrar la calificación final
									de cada estudiante.
								</Text>

							</VStack>
						</Card.Body>
					</Card.Root>
				);
			}

			// Para parciales, mostrar selector de número
			return (
				<Card.Root>
					<Card.Header>
						<Heading color={'#0661D8'} size='lg'>
							Paso 3: Número de Evaluaciones
						</Heading>
						<Text fontSize='sm' color='gray.500'>
							¿Cuántas evaluaciones parciales tendrá este curso?
						</Text>
					</Card.Header>
					<Card.Body>
						<Field
							label='Número de evaluaciones'
							invalid={!!errors.numberOfEvaluations}
							errorText={errors.numberOfEvaluations}
							required
						>
							<Input
								type='number'
								min={1}
								max={20}
								placeholder='Ej: 4'
								value={numberOfEvaluations}
								onChange={(e) => setNumberOfEvaluations(e.target.value)}
							/>
						</Field>
					</Card.Body>
				</Card.Root>
			);
		}

		// Paso 4: Configurar evaluaciones (solo para parciales)
		if (currentStep === 4 && evaluationMethod?.value === 2) {
			return (
				<VStack spacing={4}>
					<Card.Root w='full'>
						<Card.Header>
							<Heading color={'#0661D8'} size='lg'>
								Paso 4: Configurar Evaluaciones
							</Heading>
							<Text fontSize='sm' color='gray.500'>
								Define el nombre{' '}
								{qualificationType?.value === 1 ? 'y peso' : ''} de cada
								evaluación.
							</Text>
						</Card.Header>
					</Card.Root>

					{evaluations.map((evaluation, index) => (
						<Card.Root key={index} w='full'>
							<Card.Header>
								<Heading size='md' color='#0661D8'>
									Evaluación {index + 1}
								</Heading>
							</Card.Header>
							<Card.Body>
								<Flex gap={4} direction={{ base: 'column', md: 'row' }}>
									<Field
										label='Nombre de la evaluación'
										invalid={!!errors[`evaluation_${index}_name`]}
										errorText={errors[`evaluation_${index}_name`]}
										required
										flex={1}
									>
										<Input
											placeholder='Ej. Parcial 1, Examen Final, Trabajo Grupal'
											value={evaluation.name}
											onChange={(e) =>
												handleEvaluationChange(index, 'name', e.target.value)
											}
										/>
									</Field>

									{qualificationType?.value === 1 && (
										<Field
											label='Peso (%)'
											invalid={!!errors[`evaluation_${index}_weight`]}
											errorText={errors[`evaluation_${index}_weight`]}
											required
											maxW={{ base: '100%', md: '150px' }}
										>
											<Input
												type='number'
												min={0}
												max={100}
												step={0.1}
												placeholder='25'
												value={evaluation.weight}
												onChange={(e) =>
													handleEvaluationChange(
														index,
														'weight',
														e.target.value
													)
												}
											/>
										</Field>
									)}
								</Flex>
							</Card.Body>
						</Card.Root>
					))}

					{qualificationType?.value === 1 && (
						<Card.Root w='full' bg='yellow.50' borderColor='yellow.200'>
							<Card.Body>
								<HStack>
									<Text fontWeight='semibold'>Total de pesos:</Text>
									<Badge
										colorScheme={
											evaluations.reduce(
												(sum, evaluation) =>
													sum + (parseFloat(evaluation.weight) || 0),
												0
											) === 100
												? 'green'
												: 'red'
										}
									>
										{evaluations.reduce(
											(sum, evaluation) =>
												sum + (parseFloat(evaluation.weight) || 0),
											0
										)}
										%
									</Badge>
								</HStack>
								{errors.totalWeight && (
									<Text color='red.500' fontSize='sm' mt={2}>
										{errors.totalWeight}
									</Text>
								)}
							</Card.Body>
						</Card.Root>
					)}

					{/* Alerta de advertencia para evaluaciones parciales */}
					<Alert.Root status='warning' variant='subtle' w='full'>
						<Alert.Indicator>
							<FiAlertTriangle />
						</Alert.Indicator>
						<Alert.Title>¡Configuración Irreversible!</Alert.Title>
						<Alert.Description>
							Una vez guardada la configuración de evaluaciones, no podrá modificar los nombres, 
							cantidades ni pesos de las evaluaciones. Verifique que toda la información sea correcta.
						</Alert.Description>
					</Alert.Root>
				</VStack>
			);
		}
	};

	return (
		<Modal
			placement='center'
			title='Configurar Evaluaciones del Curso'
			size='4xl'
			trigger={
				<Button
					size='xs'
					bg='uni.secondary'
					color='white'
					px={2}
					onClick={() => setOpen(true)}
				>
					{isAlreadyConfigured ? 'Ver Configuración' : 'Configurar'}
				</Button>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			hiddenFooter={true}
		>
			<Stack spacing={4}>
				{renderStepContent()}

				{!isAlreadyConfigured && (
					<Flex justify='space-between' mt={6}>
						<Button
							variant='outline'
							onClick={handleBack}
							isDisabled={currentStep === 1}
						>
							Anterior
						</Button>

						<HStack>
							{/* Lógica de navegación dinámica */}
							{currentStep === 1 ? (
								<Button bg='#0661D8' color='white' onClick={handleNext}>
									Siguiente
								</Button>
							) : evaluationMethod?.value === 1 && currentStep === 2 ? (
								<Button
									bg='green.500'
									color='white'
									onClick={handleSubmit}
									isLoading={isConfiguring}
									leftIcon={<FiSave />}
								>
									Guardar Configuración
								</Button>
							) : evaluationMethod?.value === 2 && currentStep < 4 ? (
								<Button bg='#0661D8' color='white' onClick={handleNext}>
									Siguiente
								</Button>
							) : (
								<Button
									bg='green.500'
									color='white'
									onClick={handleSubmit}
									isLoading={isConfiguring}
									leftIcon={<FiSave />}
								>
									Guardar Configuración
								</Button>
							)}
						</HStack>
					</Flex>
				)}
			</Stack>
		</Modal>
	);
};

ConfigurateCalificationCourseModal.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
	courseGroup: PropTypes.object,
	evaluationComponents: PropTypes.array,
	hasConfiguration: PropTypes.bool,
};
