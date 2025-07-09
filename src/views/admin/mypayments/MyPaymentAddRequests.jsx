import { ReactSelect } from '@/components';
import { Alert, Button, Field, toaster } from '@/components/ui';
import { useReadMyApplicants, useReadPaymentRules } from '@/hooks';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests';
import { useReadPurposes } from '@/hooks/purposes';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	List,
	SimpleGrid,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiFileText, FiPlus } from 'react-icons/fi';

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

	useEffect(() => {
		if (selectedDocumentType?.value === 1 && dataUser?.document_number) {
			setnumDocCarpeta(dataUser.document_number);
		}
		if (selectedDocumentType?.value === 2) {
			setnumDocCarpeta('');
		}
	}, [selectedDocumentType, dataUser]);

	useEffect(() => {
		const fixedAmount = PaymentRules?.results?.[0]?.amount;

		if (selectedPurpose && fixedAmount) {
			setAmountValue(fixedAmount);
			setIsAmountReadOnly(true);
		} else if (!selectedPurpose) {
			// Si el propósito se borra (null)
			setAmountValue('');
			setIsAmountReadOnly(false);
		} else {
			// Si el propósito no tiene monto fijo
			setAmountValue('');
			setIsAmountReadOnly(false);
		}
	}, [selectedPurpose, PaymentRules]);

	//--cambiar---//
	const MyEnrollmentOptions = [
		{ value: 1, label: 'Administración' },
		{ value: 2, label: 'Finanzas' },
	];

	const hasStudentRole = dataUser.roles?.some(
		(role) => role.name === 'Estudiante'
	);

	const ProgramsOptions = hasStudentRole
		? MyEnrollmentOptions
		: dataMyApplicants?.map((program) => ({
				label: program.postgraduate_name,
				value: program.id,
			})) || [];

	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const PurposesOptions =
		dataPurposes?.results
			?.filter((item) => {
				if (hasStudentRole) return true;
				return item.id === 1 || item.id === 2;
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
		const payload = {
			payment_method: selectedMethod?.value,
			amount: amountValue || '0',
			application: selectedProgram?.value,
			purpose: selectedPurpose?.value,
			document_type: selectedDocumentType?.value,
			num_document: numDocCarpeta,
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
										<Text
											fontSize='xs'
											color={
												!amountValue && selectedPurpose ? 'red.500' : 'gray.500'
											}
											mt={1}
										>
											{isAmountReadOnly
												? 'Este monto es fijo y ha sido definido por la institución.'
												: !selectedPurpose
													? 'Algunos conceptos tienen monto fijo definido por la institución.'
													: !amountValue
														? 'El monto para este propósito no fue definido, contacte a un administrador.'
														: 'Algunos conceptos tienen monto fijo definido por la institución.'}
										</Text>
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
