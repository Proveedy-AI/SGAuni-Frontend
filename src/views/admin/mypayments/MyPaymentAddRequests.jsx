import { ReactSelect } from '@/components';
import TuitionSummaryCard from '@/components/modals/tuition/TuitionSummaryCard';
import { Alert, Button, Checkbox, Field, toaster } from '@/components/ui';
import {
	useReadMyApplicants,
	useReadPaymentRules,
	useReadProgramsbyId,
} from '@/hooks';
import { useReadEnrollmentsProgramsbyId } from '@/hooks/enrollments_programs/useReadEnrollmentsProgramsbyId';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests';
import { useReadPurposes } from '@/hooks/purposes';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	Input,
	List,
	SimpleGrid,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
	FiAlertCircle,
	FiAlertTriangle,
	FiFileText,
	FiPlus,
} from 'react-icons/fi';

export const MyPaymentAddRequests = () => {
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedPurpose, setSelectedPurpose] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [amountValue, setAmountValue] = useState('');
	const [isAmountReadOnly, setIsAmountReadOnly] = useState(false);
	const [description, setDescription] = useState('');
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const [errors, setErrors] = useState({});
	const [selectedProcessType, setSelectedProcessType] = useState(null);
	const { data: dataUser } = useReadUserLogged();
	const { data: dataMyApplicants } = useReadMyApplicants();
	//const { data: dataPurposes } = useReadPurposes();
	const { mutate: paymentRequests, isPending } = useCreatePaymentRequest();

	/*const { data: PaymentRules } = useReadPaymentRules({
		payment_purpose: selectedPurpose?.value,
		enabled: !!selectedPurpose?.value, // asegúrate de que solo se llame si hay propósito
	});*/

	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment();

	const { data: DataProgram } = useReadProgramsbyId(
		selectedProgram?.programId || null,
		{}
	);
	const { data: DataEnrollmentProgram } = useReadEnrollmentsProgramsbyId(
		selectedProgram?.enrollment_program || null,
		{}
	);

	useEffect(() => {
		if (selectedDocumentType?.value === 1 && dataUser?.document_number) {
			setnumDocCarpeta(dataUser.document_number);
		}
		if (selectedDocumentType?.value === 2) {
			setnumDocCarpeta('');
		}
	}, [selectedDocumentType, dataUser]);

	const globalDiscounts = [
		{
			id: 1,
			label: 'Descuento por ser egresado UNI',
			percentage: 0.15,
			requireGraduate: true,
			purposeToGlobalDiscountId: [2, 4, 5, 6, 7],
		},
	];

	const studentScholarships = [
		{
			id: 10,
			label: 'Beca alto rendimiento',
			percentage: 0.25,
		},
	];

	const validPurposeIds = [4, 5, 6];

	//--cambiar---//
	const MyEnrollment = [
		{
			id: 1,
			program_name: 'Maestría en administración est',
			programId: 2,
			student: 2,
			enrollment_period_program: 1,
			is_first_enrollment: true,
		},
	];

	const MyEnrollmentOptions = MyEnrollment.map((item) => ({
		value: item.id,
		label: item.program_name,
		programId: item.programId,
		enrollment_program: item.enrollment_period_program,
		first: item.is_first_enrollment,
	}));

	const hasStudentRole = dataUser.roles?.some(
		(role) => role.name === 'Estudiante'
	);
	const ProcessTypeOptions = !hasStudentRole
		? [
				{ label: 'Admisión', value: 'admission' },
				{ label: 'Matrícula', value: 'enrollment' },
			]
		: [{ label: 'Admisión', value: 'admission' }];

	const ProgramsOptions =
		selectedProcessType?.value === 'enrollment'
			? MyEnrollmentOptions
			: selectedProcessType?.value === 'admission'
				? dataMyApplicants?.map((program) => ({
						label: program.postgraduate_name,
						value: program.id,
					}))
				: [];

	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const paymentRules = useMemo(
		() => [
			{
				payment_purpose: 1,
				payment_purpose_name: 'Admisión ordinaria',
				process_types: ['admission', 'enrollment'],
				applies_to_students: false,
				applies_to_applicants: true,
				only_first_enrollment: false,
				student_status: null,
				amount_type: 'fijo', // No aplica
				amount: '150',
				use_credits_from: null,
				discount_percentage: null,
			},
			{
				payment_purpose: 4,
				payment_purpose_name: 'Pago por semestre completo',
				process_types: ['enrollment'],
				applies_to_students: true,
				applies_to_applicants: false,
				only_first_enrollment: true,
				student_status: null,
				amount_type: 'calcular',
				amount: null,
				use_credits_from: 'enrollment_program',
				discount_percentage: 0.08,
			},
			{
				payment_purpose: 5,
				payment_purpose_name: 'Pago por curso',
				process_types: ['enrollment'],
				applies_to_students: true,
				applies_to_applicants: false,
				only_first_enrollment: false,
				student_status: null,
				amount_type: 'calcular',
				amount: null,
				use_credits_from: 'program',
				discount_percentage: 0.16,
			},
			{
				payment_purpose: 6,
				payment_purpose_name: 'Matrícula extraordinaria',
				process_types: ['enrollment'],
				applies_to_students: true,
				applies_to_applicants: false,
				only_first_enrollment: false,
				student_status: null, // aplica solo para egresados, si deseas
				amount_type: 'fijo',
				amount: 150.0,
				use_credits_from: null,
				discount_percentage: null,
			},
		],
		[]
	);
	const currentRule = paymentRules?.find(
		(rule) => rule.payment_purpose === selectedPurpose?.value
	);
	const discounts = [
		// 1. Global Discounts válidos para los propósitos seleccionados
		...globalDiscounts
			.filter(() => validPurposeIds.includes(selectedPurpose?.value))
			.filter((d) => !d.requireGraduate || dataUser?.is_uni_graduate)
			.map((d) => ({
				id: `global-${d.id}`,
				label: d.label,
				percentage: d.percentage,
			})),

		// 2. Becas válidas para los propósitos seleccionados
		...studentScholarships
			.filter(() => validPurposeIds.includes(selectedPurpose?.value))
			.map((s) => ({
				id: `scholarship-${s.id}`,
				label: s.label,
				percentage: s.percentage,
			})),

		// 3. Descuento de la regla de pago
		...(currentRule?.discount_percentage
			? [
					{
						id: `rule-${currentRule.payment_purpose}`,
						label: `Descuento por modalidad de pago`,
						percentage: currentRule.discount_percentage,
					},
				]
			: []),
	];
	const userRoles = dataUser.roles?.map((r) => r.name.toLowerCase());

	const isFirstEnrollment = selectedProgram?.first;

	const filteredPurposes = paymentRules.filter((rule) => {
		const matchesProcess = rule.process_types.includes(
			selectedProcessType?.value
		);
		const matchesRole =
			(rule.applies_to_students && !userRoles.includes('estudiante')) ||
			(rule.applies_to_applicants && userRoles.includes('postulante'));

		const matchesFirstEnrollment =
			!rule.only_first_enrollment ||
			(rule.only_first_enrollment && isFirstEnrollment);

		return matchesProcess && matchesRole && matchesFirstEnrollment;
	});

	const PurposesOptions = filteredPurposes.map((rule) => ({
		value: rule.payment_purpose,
		label: rule.payment_purpose_name,
	}));

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const isPreMaestria =
		!hasStudentRole &&
		dataMyApplicants?.find((p) => p.id === selectedProgram)?.modality_id === 1;

	const validateFields = () => {
		const newErrors = {};
		if (!selectedProgram) newErrors.selectedProgram = 'Seleccione un programa';
		if (!selectedDocumentType)
			newErrors.selectedDocumentType = 'Seleccione un tipo de documento';
		if (!numDocCarpeta)
			newErrors.numDocCarpeta = 'Ingrese el número de documento';
		if (!selectedPurpose) newErrors.selectedPurpose = 'Seleccione un propósito';
		if (!selectedMethod)
			newErrors.selectedMethod = 'Seleccione un método de pago';
		if (!amountValue) newErrors.amountValue = 'El monto es requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = () => {
		if (!validateFields()) return;
		const payload =
			selectedProcessType?.value === 'admission'
				? {
						payment_method: selectedMethod?.value,
						amount: amountValue || '0',
						application: selectedProgram?.value, // para admisión
						purpose: selectedPurpose?.value,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
						description: description,
						aceppt_terms: acceptTerms,
					}
				: {
						payment_method: selectedMethod?.value,
						amount: amountValue || '0',
						enrollment: selectedProgram?.value, // para matrícula
						purpose: selectedPurpose?.value,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
						description: description,
						accept_terms: acceptTerms,
					};

    console.log(payload)

		paymentRequests(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Solicitud de pago fue exitoso',
					type: 'success',
				});

				setisSelectCaja(false);
				setSelectedProgram(null);
				setSelectedMethod(null);
				setAmountValue('');
				setnumDocCarpeta('');
				setSelectedDocumentType(null);
				setSelectedPurpose(null);
			},
			onError: (error) => {
				const errorData = error.response?.data;
				if (errorData && typeof errorData === 'object') {
					Object.values(errorData).forEach((errorList) => {
						if (Array.isArray(errorList)) {
							errorList.forEach((message) => {
								toaster.create({
									title: message,
									type: 'error',
								});
							});
						}
					});
				} else {
					toaster.create({
						title: 'Error al solicitar el pago',
						type: 'error',
					});
				}
			},
		});
	};

	useEffect(() => {
		if (!selectedPurpose?.value || selectedPurpose?.value === 1) {
			setAmountValue('');
			setDescription('');

			return;
		}

		console.log('aqui');
		const priceCredit = parseFloat(DataProgram?.price_credit || '0');

		// Obtener la regla correspondiente al propósito seleccionado
		const currentRule = paymentRules?.find(
			(rule) => rule.payment_purpose === selectedPurpose.value
		);

		// Si no hay regla, no se puede calcular
		if (!currentRule) {
			setAmountValue('');
			setIsAmountReadOnly(false);
			return;
		}

		// Si tiene monto fijo
		if (currentRule?.amount_type === 'fijo' && currentRule.amount) {
			setAmountValue(currentRule?.amount);
			setIsAmountReadOnly(true);
			return;
		}

		// Si es monto calculado
		if (currentRule.amount_type === 'calcular') {
			let credits = 0;

			if (currentRule.use_credits_from === 'enrollment_program') {
				credits = parseFloat(DataEnrollmentProgram?.credits || '0');
			} else if (currentRule.use_credits_from === 'program') {
				credits = parseFloat(selectedProgram?.total_credits || '0');
			}

			const baseAmount = credits * priceCredit;
			const discount = currentRule.discount_percentage || 0;
			const finalAmount = (baseAmount * (1 - discount)).toFixed(2);

			setAmountValue(finalAmount);
			setIsAmountReadOnly(false);
			return;
		}

		// Default fallback
		setAmountValue('');
		setIsAmountReadOnly(false);
	}, [
		selectedPurpose?.value,
		DataProgram,
		DataEnrollmentProgram,
		selectedProgram,
		paymentRules,
	]);

	return (
		<Box>
			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiFileText} boxSize={5} color='blue.600' />
						<Heading fontSize='24px'>Solicitar Orden de Pago</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Card.Root>
						<Card.Header>
							<Card.Title>Nueva Solicitud de Orden de Pago</Card.Title>
							<Card.Description>
								Completa los datos para solicitar una nueva orden de pago. El
								administrador revisará tu solicitud y generará la orden
								correspondiente.
							</Card.Description>
							{isPreMaestria && (
								<Alert status='warning' Icon={<FiAlertTriangle />}>
									<Text>
										Para completar tu proceso de admisión en modalidad de pre
										maestría, debes realizar dos solicitudes:
									</Text>
									<List.Root pl='4' mt='2'>
										<List.Item>Solicitud por Derecho de Carpeta</List.Item>
										<List.Item>Solicitud por Carpeta de Admisión</List.Item>
									</List.Root>
								</Alert>
							)}

							{isFirstEnrollment && (
								<Alert status='warning' Icon={<FiAlertTriangle />}>
									<Text>
										Si esta es tu primera matrícula, debes solicitar la
									</Text>
									<List.Root pl='4' mt='2'>
										<List.Item>Solicitud por Derecho de Admisión</List.Item>
										<List.Item>
											Solicitud por Segundo Derecho de Admisión (se debe pagar
											hasta el segundo mes)
										</List.Item>
									</List.Root>
								</Alert>
							)}
						</Card.Header>

						<Card.Body>
							<VStack gap={6} align='stretch'>
								<Field
									label='Tipo de Proceso'
									invalid={!!errors.selectedProcessType}
									errorText={errors.selectedProcessType}
								>
									<ReactSelect
										value={selectedProcessType}
										onChange={(val) => {
											setSelectedProcessType(val);
											setSelectedProgram(null); // limpia selección al cambiar tipo
											setSelectedPurpose(null); // también podría limpiar propósito
										}}
										variant='flushed'
										size='xs'
										isSearchable
										isClearable
										options={ProcessTypeOptions}
									/>
								</Field>

								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									<Field
										label='Programa Académico:'
										invalid={!!errors.selectedProgram}
										errorText={errors.selectedProgram}
									>
										<ReactSelect
											value={selectedProgram}
											onChange={setSelectedProgram}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={ProgramsOptions}
										/>
									</Field>
									<Field
										label='Propósito:'
										invalid={!!errors.selectedPurpose}
										errorText={errors.selectedPurpose}
									>
										<ReactSelect
											value={selectedPurpose}
											onChange={(val) => {
												setSelectedPurpose(val); // puede ser null al limpiar
											}}
											variant='flushed'
											size='xs'
											isSearchable
											isDisabled={selectedProgram === null}
											isClearable
											options={PurposesOptions}
										/>
									</Field>
									<Field
										label='Tipo de documento:'
										invalid={!!errors.selectedDocumentType}
										errorText={errors.selectedDocumentType}
									>
										<ReactSelect
											value={selectedDocumentType}
											onChange={setSelectedDocumentType}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={TypeOptions}
										/>
									</Field>

									<Field
										label='N° Doc'
										invalid={!!errors.numDocCarpeta}
										errorText={errors.numDocCarpeta}
									>
										<Input
											value={numDocCarpeta}
											onChange={(e) => setnumDocCarpeta(e.target.value)}
											placeholder='Ingrese número de documento'
											disabled={selectedDocumentType?.value === 1}
										/>
									</Field>

									<Field
										label='Monto (S/):'
										invalid={!!errors.amountValue}
										errorText={errors.amountValue}
									>
										<Input
											type='number'
											placeholder='Solo para propósitos que lo permiten'
											step='0.01'
											value={amountValue}
											onChange={(e) => setAmountValue(e.target.value)}
											readOnly
										/>
										<Box w={'full'} mt={2}>
											{isAmountReadOnly ? (
												<Alert Icon={<FiAlertCircle />} status='success'>
													Este monto es fijo y ha sido definido por la
													institución.
												</Alert>
											) : !selectedPurpose ? (
												<Alert Icon={<FiAlertCircle />} status='warning'>
													Algunos conceptos tienen monto fijo definido por la
													institución.
												</Alert>
											) : !amountValue ? (
												<Alert Icon={<FiAlertCircle />} status='error'>
													El monto para este propósito no fue definido, contacte
													a un administrador.
												</Alert>
											) : (
												''
											)}
										</Box>
									</Field>

									<Field
										label='Métodos de Pago:'
										invalid={!!errors.selectedMethod}
										errorText={errors.selectedMethod}
									>
										<ReactSelect
											value={selectedMethod}
											onChange={(option) => {
												setSelectedMethod(option);
												setisSelectCaja(option.value === 2);
											}}
											isLoading={isLoadingMethodPayment}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={methodOptions}
										/>
									</Field>
								</SimpleGrid>

								{selectedPurpose?.value === 6 && (
									<TuitionSummaryCard
										title='Cálculo de Matrícula'
										discounts={discounts}
										setDescription={setDescription}
										baseAmount={Number(amountValue)}
									/>
								)}

								{selectedPurpose?.value == 2 && (
									<TuitionSummaryCard
										title='Cálculo de Matrícula'
										discounts={discounts}
										setDescription={setDescription}
										baseAmount={Number(amountValue)}
									/>
								)}

								{selectedPurpose?.value === 4 &&
									DataEnrollmentProgram &&
									DataProgram && (
										<TuitionSummaryCard
											title='Cálculo de Matrícula'
											credits={DataEnrollmentProgram.credits}
											pricePerCredit={parseFloat(DataProgram.price_credit)}
											discounts={discounts}
											setDescription={setDescription}
										/>
									)}

								{selectedPurpose?.value === 5 &&
									selectedProgram &&
									DataProgram && (
										<TuitionSummaryCard
											title='Cálculo de Matrícula'
											credits={DataProgram.total_program_credits}
											pricePerCredit={parseFloat(DataProgram.price_credit)}
											discounts={discounts}
											setDescription={setDescription}
										/>
									)}
								<Field label='Información Adicional adjunta'>
									<Textarea
										value={description}
										disabled
										placeholder='Se adjuntara informacion adicional automáticamente...'
										rows={3}
									/>
								</Field>

								{isSelectCaja && (
									<Box
										mt={3}
										bg='yellow.100'
										p={3}
										textAlign={'center'}
										rounded='md'
										border='1px solid'
										borderColor='yellow.400'
									>
										<Text fontSize='sm' color='yellow.800'>
											Luego de solicitar la orden de pago. Por favor, acércate a
											la oficina de <b>FIEECS</b> para obtener tu recibo físico
											y poder completar el proceso de pago.
										</Text>
									</Box>
								)}

								<Alert status='info' Icon={<FiAlertTriangle />}>
									Tu solicitud será enviada al Administrador de Cobranzas para
									revisión. Recibirás una notificación cuando la orden sea
									generada.
								</Alert>

								<HStack align='start' gap={3}>
									<Checkbox
										checked={acceptTerms}
										onChange={(e) => setAcceptTerms(e.target.checked)}
									/>
									<VStack align='start' gap={1}>
										<Text fontSize='sm'>
											Declaro que los{' '}
											<Text as='a' color='blue.600'>
												datos personales proporcionados
											</Text>{' '}
											son verídicos y completos. En caso contrario, los
											beneficios y solicitudes podrán ser cancelados.
										</Text>
									</VStack>
								</HStack>

								<Button
									loading={isPending}
									colorPalette='blue'
									leftIcon={<FiPlus />}
									disabled={!acceptTerms}
									width='full'
									onClick={handleSubmitData}
								>
									Enviar Solicitud
								</Button>
							</VStack>
						</Card.Body>
					</Card.Root>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
