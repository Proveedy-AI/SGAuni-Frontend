import { ReactSelect } from '@/components';
import { Alert, Button, Field, toaster } from '@/components/ui';
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
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	List,
	Separator,
	SimpleGrid,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaCalculator, FaPercentage } from 'react-icons/fa';
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
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [amountValue, setAmountValue] = useState('');
	const [isAmountReadOnly, setIsAmountReadOnly] = useState(false);
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const [errors, setErrors] = useState({});
	const [selectedProcessType, setSelectedProcessType] = useState(null);
	const { data: dataUser } = useReadUserLogged();
	const { data: dataMyApplicants } = useReadMyApplicants();
	const { data: dataPurposes } = useReadPurposes();
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

	const benefits_students = {
		id: 0,
		student: 0,
		student_full_name: 'string',
		founding_source: 1,
		founding_source_display: 'string',
		other_founding_source: 'string',
		discount_percentage: 'string',
	};

	//--cambiar---//
	const MyEnrollment = [
		{
			id: 1,
			program_name: 'Maestría en administración est',
			programId: 2,
			student: 2,
			enrollment_period_program: 1,
			is_first_enrollment: true,
			total_credits: 120,
		},
	];

	const MyEnrollmentOptions = MyEnrollment.map((item) => ({
		value: item.id,
		label: item.program_name,
		programId: item.programId,
		enrollment_program: item.enrollment_period_program,
		first: item.is_first_enrollment,
		total_credits: item.total_credits,
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

	const isFirstEnrollment = selectedProgram?.first;

	const PurposesOptions =
		dataPurposes?.results
			?.filter((item) => {
				if (selectedProcessType?.value === 'enrollment') {
					if (isFirstEnrollment) {
						// Si es primera matrícula, solo mostrar propósito 4
						return { ...item, id: 5 };
					} else {
						// Si no es primera matrícula, mostrar todos menos el 4
						return item.id !== 5;
					}
				}
				if (item.id === 1 || item.id === 2) return true;
			})
			.map((item) => ({
				label: item.name,
				value: item.id,
			})) || [];

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
					}
				: {
						payment_method: selectedMethod?.value,
						amount: amountValue || '0',
						enrollment: selectedProgram?.value, // para matrícula
						purpose: selectedPurpose?.value,
						document_type: selectedDocumentType?.value,
						num_document: numDocCarpeta,
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
		if (!selectedPurpose?.value) {
			setAmountValue('');

			return;
		}
		if (
			!selectedPurpose?.value ||
			!DataProgram ||
			!DataEnrollmentProgram ||
			!selectedProgram
		)
			return;

		const priceCredit = parseFloat(DataProgram.price_credit);
		const fixedAmount = PaymentRules?.results?.[0]?.amount;

		// Si el propósito tiene monto fijo definido
		if (fixedAmount) {
			setAmountValue(fixedAmount);
			setIsAmountReadOnly(true);
			return;
		}

		// Si el propósito no tiene monto fijo (y puede ser calculado)
		let amount = '';
		if (selectedPurpose.value === 4) {
			const credits = DataEnrollmentProgram.credits;
			amount = (credits * priceCredit * 0.92).toFixed(2); // 8% descuento
		} else if (selectedPurpose.value === 5) {
			const credits = selectedProgram.total_credits;
			amount = (credits * priceCredit * 0.84).toFixed(2); // 16% descuento
		}

		setAmountValue(amount);
		setIsAmountReadOnly(false); // los propósitos 4 y 5 son calculados
	}, [
		selectedPurpose?.value,
		DataProgram,
		DataEnrollmentProgram,
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
										<List.Item>Solicitud por Carpeta de Admisión</List.Item>
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
											isReadOnly={selectedDocumentType?.value === 1}
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
								{selectedPurpose?.value === 4 &&
									DataEnrollmentProgram &&
									DataProgram && (
										<>
											<Card.Root
												bg='green.50'
												border='1px solid'
												borderColor='green.200'
												borderRadius='xl'
											>
												<Card.Header pb={2}>
													<Flex align='center' gap={2} color='green.800'>
														<Icon as={FaCalculator} boxSize={5} />
														<Heading fontSize='lg'>
															Cálculo de Matrícula
														</Heading>
													</Flex>
												</Card.Header>

												<Card.Body pt={0}>
													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Créditos
														</Text>
														<Badge variant='subtle' colorPalette='green'>
															{DataEnrollmentProgram.credits}
														</Badge>
													</Flex>

													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Precio por crédito
														</Text>
														<Text fontWeight='medium'>
															S/{' '}
															{Number.parseFloat(
																DataProgram.price_credit
															).toFixed(2)}
														</Text>
													</Flex>

													<Separator my={3} />

													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Subtotal
														</Text>
														<Text fontWeight='medium'>
															S/{' '}
															{(
																DataEnrollmentProgram.credits *
																parseFloat(DataProgram.price_credit)
															).toFixed(2)}
														</Text>
													</Flex>

													<Flex
														justify='space-between'
														align='center'
														mb={2}
														color='green.700'
													>
														<Flex align='center' gap={1} fontSize='sm'>
															<Icon as={FaPercentage} boxSize={4} />
															Descuento aplicado (8%)
														</Flex>
														<Text fontWeight='medium'>
															-S/{' '}
															{(
																DataEnrollmentProgram.credits *
																	parseFloat(DataProgram.price_credit) -
																DataEnrollmentProgram.credits *
																	parseFloat(DataProgram.price_credit) *
																	0.92
															).toFixed(2)}
														</Text>
													</Flex>

													<Separator my={3} />

													<Flex
														justify='space-between'
														align='center'
														mt={2}
														fontWeight='bold'
														fontSize='lg'
														color='green.800'
													>
														<Text>Monto Final</Text>
														<Text>
															S/{' '}
															{(
																DataEnrollmentProgram.credits *
																parseFloat(DataProgram.price_credit) *
																0.92
															).toFixed(2)}
														</Text>
													</Flex>
												</Card.Body>
											</Card.Root>
										</>
									)}

								{selectedPurpose?.value === 5 &&
									selectedProgram &&
									DataProgram && (
										<>
											<Card.Root
												bg='green.50'
												border='1px solid'
												borderColor='green.200'
												borderRadius='xl'
											>
												<Card.Header pb={2}>
													<Flex align='center' gap={2} color='green.800'>
														<Icon as={FaCalculator} boxSize={5} />
														<Heading fontSize='lg'>
															Cálculo de Matrícula
														</Heading>
													</Flex>
												</Card.Header>

												<Card.Body pt={0}>
													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Créditos
														</Text>
														<Badge variant='subtle' colorPalette='green'>
															{selectedProgram.total_credits}
														</Badge>
													</Flex>

													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Precio por crédito
														</Text>
														<Text fontWeight='medium'>
															S/{' '}
															{Number.parseFloat(
																DataProgram.price_credit
															).toFixed(2)}
														</Text>
													</Flex>

													<Separator my={3} />

													<Flex justify='space-between' align='center' mb={2}>
														<Text fontSize='sm' color='gray.600'>
															Subtotal
														</Text>
														<Text fontWeight='medium'>
															S/{' '}
															{(
																selectedProgram.total_credits *
																parseFloat(DataProgram.price_credit)
															).toFixed(2)}
														</Text>
													</Flex>

													<Flex
														justify='space-between'
														align='center'
														mb={2}
														color='green.700'
													>
														<Flex align='center' gap={1} fontSize='sm'>
															<Icon as={FaPercentage} boxSize={4} />
															Descuento aplicado (16%)
														</Flex>
														<Text fontWeight='medium'>
															-S/{' '}
															{(
																selectedProgram.total_credits *
																	parseFloat(DataProgram.price_credit) -
																selectedProgram.total_credits *
																	parseFloat(DataProgram.price_credit) *
																	0.84
															).toFixed(2)}
														</Text>
													</Flex>

													<Separator my={3} />

													<Flex
														justify='space-between'
														align='center'
														mt={2}
														fontWeight='bold'
														fontSize='lg'
														color='green.800'
													>
														<Text>Monto Final</Text>
														<Text>
															S/{' '}
															{(
																selectedProgram.total_credits *
																parseFloat(DataProgram.price_credit) *
																0.84
															).toFixed(2)}
														</Text>
													</Flex>
												</Card.Body>
											</Card.Root>
										</>
									)}
								<Field label='Descripción Adicional'>
									<Textarea
										placeholder='Proporciona detalles adicionales si el propósito lo requiere...'
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

								<Button
									loading={isPending}
									colorPalette='blue'
									leftIcon={<FiPlus />}
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
