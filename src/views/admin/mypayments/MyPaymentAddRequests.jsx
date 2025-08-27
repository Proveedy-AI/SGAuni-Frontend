import { ReactSelect } from '@/components';
import TuitionSummaryCard from '@/components/modals/tuition/TuitionSummaryCard';
import { Alert, Button, Checkbox, Field, toaster } from '@/components/ui';
import {
	useReadMyApplicants,
	useReadMyBenefits,
	useReadMyCredits,
	useReadMyEnrollments,
	useReadPaymentRules,
	useReadProgramsbyId,
} from '@/hooks';
//import { useReadEnrollmentsProgramsbyId } from '@/hooks/enrollments_programs/useReadEnrollmentsProgramsbyId';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests';
import { useReadGraduateUni } from '@/hooks/person/useReadGraduateUni';
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
import { useEffect, useState } from 'react';
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
	const [discountValue, setDiscountValue] = useState('');
	const [isAmountReadOnly, setIsAmountReadOnly] = useState(false);
	const [description, setDescription] = useState('');
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const [errors, setErrors] = useState({});
	const [selectedProcessType, setSelectedProcessType] = useState(null);
	const { data: dataUser } = useReadUserLogged();
	const { data: dataMyApplicants } = useReadMyApplicants();
	const { mutate: paymentRequests, isPending } = useCreatePaymentRequest();

	const { data: PaymentRules } = useReadPaymentRules({
		payment_purpose: selectedPurpose?.value,
		enabled: !!selectedPurpose?.value, // asegúrate de que solo se llame si hay propósito
	});

	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment();

	const { data: DataProgram } = useReadProgramsbyId(
		selectedProgram?.programId || null,
		{}
	);

	const hasStudentRole = dataUser.roles?.some(
		(role) => role.name === 'Estudiante'
	);

	const { data: MyEnrollment } = useReadMyEnrollments();
	const { data: studentScholarships } = useReadMyBenefits();
	const { data: globalDiscountsRaw } = useReadGraduateUni();
	const { data: MyCredits } = useReadMyCredits({ enabled: hasStudentRole });
	/*const { data: DataEnrollmentProgram } = useReadEnrollmentsProgramsbyId(
		selectedProgram?.enrollment_program || null,
		{}
	);*/

	useEffect(() => {
		if (selectedDocumentType?.value === 1 && dataUser?.document_number) {
			setnumDocCarpeta(dataUser.document_number);
		}
		if (selectedDocumentType?.value === 2) {
			setnumDocCarpeta('');
		}
	}, [selectedDocumentType, dataUser]);

	const creditsInfo = MyCredits?.result?.[selectedProgram?.programId];

	const rawDiscounts = globalDiscountsRaw ?? {};
	const globalDiscounts = Object.values(rawDiscounts)
		.map((item) => {
			if (typeof item === 'string') {
				try {
					return JSON.parse(item);
				} catch (e) {
					console.error('Error parseando descuento global:', item, e);
					return null;
				}
			}
			return item;
		})
		.filter(Boolean);

	const validPurposeIds = [4, 5, 6];

	const MyEnrollmentOptions = MyEnrollment?.map((item) => ({
		value: item.id,
		label: `${item.program_name} - ${item.program_period}`,
		programId: item.program_id,
		enrollment_program: item.enrollment_period_program,
		first: item.is_first_enrollment,
	}));

	const ProcessTypeOptions = hasStudentRole
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

	const currentRule = PaymentRules?.results?.find(
		(rule) => rule.payment_purpose === selectedPurpose?.value
	);

	const discounts = [
		// 1. Global Discounts válidos para los propósitos seleccionados
		...(Array.isArray(globalDiscounts)
			? globalDiscounts
					.filter(
						(d) =>
							Array.isArray(d.purposeToGlobalDiscountId) &&
							d.purposeToGlobalDiscountId.includes(selectedPurpose?.value)
					)
					.filter((d) => !d.requireGraduate || dataUser?.is_uni_graduate)
					.map((d) => ({
						id: `global-${d.id}`,
						label: d.label,
						percentage: Number(d.percentage * 100),
					}))
			: []),
		// 2. Becas válidas para los propósitos seleccionados
		...(Array.isArray(studentScholarships)
			? studentScholarships
					.filter(() => validPurposeIds.includes(selectedPurpose?.value))
					.map((s) => ({
						id: `scholarship-${s.id}`,
						label: s.label,
						percentage: s.percentage * 100,
					}))
			: []),

		// 3. Descuento de la regla de pago
		...(currentRule?.discount_percentage
			? [
					{
						id: `rule-${currentRule.payment_purpose}`,
						label: `Descuento por modalidad de pago`,
						percentage: currentRule.discount_percentage * 100,
					},
				]
			: []),
	];

	const userRoles = dataUser.roles?.map((r) => r.name.toLowerCase());

	const isFirstEnrollment = selectedProgram?.first;

	const filteredPurposes = PaymentRules?.results?.filter((rule) => {
		const matchesProcess = rule.process_types.includes(
			selectedProcessType?.value
		);
		const matchesRole =
			(rule.applies_to_students && userRoles.includes('estudiante')) ||
			(rule.applies_to_applicants && userRoles.includes('postulante'));
		const matchesFirstEnrollment =
			!rule.only_first_enrollment ||
			(rule.only_first_enrollment && isFirstEnrollment);
		const isNotExcluded = rule.payment_purpose !== 4;

		return (
			matchesProcess && matchesRole && matchesFirstEnrollment && isNotExcluded
		);
	});

	const PurposesOptions = filteredPurposes?.map((rule) => ({
		value: rule.payment_purpose,
		label: rule.payment_purpose_name,
	}));

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const isPreMaestria =
		!hasStudentRole &&
		dataMyApplicants?.find((p) => p.id === Number(selectedProgram?.value))?.modality_id === 1;

	const validateFields = () => {
		const newErrors = {};
		if (!selectedProgram) newErrors.selectedProgram = 'Seleccione un programa';
		if (!selectedDocumentType)
			newErrors.selectedDocumentType = 'Seleccione un tipo de documento';
		if (!numDocCarpeta)
			newErrors.numDocCarpeta = 'Ingrese el número de documento';
		if (!selectedPurpose)
			newErrors.selectedPurpose = 'Seleccione un concepto de pago';
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
						acepted_terms: acceptTerms,
						discount_value: discountValue || '',
					}
				: {
						payment_method: selectedMethod?.value,
						amount: amountValue || '0',
						enrollment: selectedProgram?.value, // para matrícula
						purpose: selectedPurpose?.value,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
						description: description,
						acepted_terms: acceptTerms,
						discount_value: discountValue || '',
						amount_credits_total:
							selectedPurpose?.value === 5 ? creditsInfo?.total_credits : '',
					};

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
				setDescription('');
				setAcceptTerms(false);
				setSelectedProcessType(null);
				setSelectedDocumentType(null);
				setSelectedPurpose(null);
			},
			onError: (error) => {
				const errorData = error.response?.data;

				if (Array.isArray(errorData)) {
					// Caso como: ["Ya existe una solicitud de pago Pendiente..."]
					errorData.forEach((message) => {
						toaster.create({
							title: message,
							type: 'error',
						});
					});
				} else if (errorData && typeof errorData === 'object') {
					// Caso como: { field1: ["msg1", "msg2"], field2: ["msg3"] }
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
					// Fallback
					toaster.create({
						title: 'Error al solicitar el pago',
						type: 'error',
					});
				}
			},
		});
	};

	useEffect(() => {
		if (!selectedPurpose?.value) {
			setAmountValue('');
			setDescription('');

			return;
		}

		const priceCredit = parseFloat(DataProgram?.price_credit || '0');

		// Obtener la regla correspondiente al propósito seleccionado
		const currentRule = PaymentRules?.results?.find(
			(rule) => rule.payment_purpose === selectedPurpose.value
		);

		// Si no hay regla, no se puede calcular
		if (!currentRule) {
			setAmountValue('');
			setIsAmountReadOnly(false);
			return;
		}

		// Si tiene monto fijo
		if (currentRule?.amount_type == 1) {
			setAmountValue(currentRule?.amount);
			setIsAmountReadOnly(true);
			return;
		}

		// Si es monto calculado
		if (currentRule.amount_type === 2) {
			let credits = 0;

			/*if (currentRule.use_credits_from === 1) {
				credits = parseFloat(DataEnrollmentProgram?.credits || '0');
			} else */
			if (currentRule.use_credits_from === 2) {
				credits = parseFloat(creditsInfo?.total_credits || '0');
			}

			const baseAmount = credits * priceCredit;
			const finalAmount = baseAmount.toFixed(2);

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
		creditsInfo,
		//DataEnrollmentProgram,
		selectedProgram,
		PaymentRules,
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
										<List.Item>Solicitud por Carpeta de Admisión - I</List.Item>
									</List.Root>
								</Alert>
							)}

							{isFirstEnrollment && (
								<Alert status='warning' Icon={<FiAlertTriangle />}>
									<Text>
										Si esta es tu primera matrícula, debes solicitar la
									</Text>
									<List.Root pl='4' mt='2'>
										<List.Item>
											Solicitud Derecho de Admisión - II (se debe pagar hasta el
											segundo mes)
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
										label='Concepto de pago:'
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
										label='N° Documento'
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
											) : !amountValue &&
											  currentRule?.amount_type_display !== 'Calcular' ? (
												<Alert Icon={<FiAlertCircle />} status='error'>
													El monto para este concepto de pago no fue definido,
													contacte a un administrador.
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
										setDiscountValue={setDiscountValue}
										baseAmount={Number(amountValue)}
									/>
								)}

								{selectedPurpose?.value == 2 && (
									<TuitionSummaryCard
										title='Cálculo de Matrícula'
										discounts={discounts}
										setDescription={setDescription}
										setDiscountValue={setDiscountValue}
										baseAmount={Number(amountValue)}
									/>
								)}

								{/*selectedPurpose?.value === 4 &&
									DataEnrollmentProgram &&
									DataProgram && (
										<TuitionSummaryCard
											title='Cálculo de Matrícula'
											credits={DataEnrollmentProgram.credits}
											pricePerCredit={parseFloat(DataProgram.price_credit)}
											discounts={discounts}
											setDiscountValue={setDiscountValue}
											setDescription={setDescription}
										/>
									)*/}

								{selectedPurpose?.value === 5 &&
									selectedProgram &&
									DataProgram && (
										<TuitionSummaryCard
											title='Cálculo de Matrícula'
											credits={creditsInfo?.total_credits || 0}
											pricePerCredit={parseFloat(DataProgram.price_credit)}
											discounts={discounts}
											setDiscountValue={setDiscountValue}
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
