import {
	Alert,
	Button,
	Checkbox,
	Field,
	Modal,
	toaster,
} from '@/components/ui';
import {
	Stack,
	Card,
	Text,
	Flex,
	Icon,
	Spinner,
	HStack,
	Input,
	Box,
	SimpleGrid,
	VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import {
	FiAlertTriangle,
	FiCreditCard,
	FiDollarSign,
	FiDownload,
} from 'react-icons/fi';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests';
import { useCreatePaymentPlansCredits } from '@/hooks/payments_plans/useCreatePaymentPlansCredits';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';

export const ProcessEnrollmentModal = ({
	paymentPlan,
	baseAmount,
	onConfirmEnrollment,
	description,
	discountValue,
	amountCredits,
	onNext,
	enrollmentItem,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [numDoc, setNumDoc] = useState('');
	const [disableUpload, setDisableUpload] = useState(false);
	const [fractionateDebtPath, setFractionateDebtPath] = useState('');
	const [installments, setInstallments] = useState(null);

	const [errors, setErrors] = useState({});

	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment({ enabled: open });

	const { mutate: paymentRequests, isPending } = useCreatePaymentRequest();
	const {
		mutate: createPaymentPlansCredits,
		isLoading: isLoadingPaymentPlansCredits,
	} = useCreatePaymentPlansCredits();

	const validateFields = () => {
		const newErrors = {};
		if (!selectedDocumentType)
			newErrors.selectedDocumentType = 'Seleccione un tipo de documento';
		if (!numDoc) newErrors.numDoc = 'Ingrese el número de documento';
		if (paymentPlan === 4 || paymentPlan === 5) {
			if (!acceptTerms)
				newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';

			if (!selectedMethod)
				newErrors.selectedMethod = 'Seleccione un método de pago';
		}
		if (paymentPlan === 999) {
			if (!installments || installments < 1) {
				newErrors.installments = 'Ingrese un número de cuotas válido';
			}
			if (installments > enrollmentItem?.max_installments) {
				newErrors.installments = `El número máximo de cuotas es ${enrollmentItem?.max_installments}`;
			}
			if (installments >= 5) {
				if (!fractionateDebtPath)
					newErrors.fractionateDebtPath = 'El archivo es requerido';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async () => {
		if (!validateFields()) return;

		if (paymentPlan === 4 || paymentPlan === 5 || paymentPlan === 9) {
			const payload = {
				payment_method: selectedMethod?.value,
				amount: baseAmount || '0',
				enrollment: enrollmentItem?.id, // para admisión
				purpose: paymentPlan,
				document_type: selectedDocumentType?.value,
				num_document: numDoc,
				description: description,
				acepted_terms: acceptTerms,
				discount_value: discountValue || '',
				amount_credits_total: amountCredits,
			};

			paymentRequests(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Solicitud de pago fue exitoso',
						type: 'success',
					});
					onConfirmEnrollment();

					setisSelectCaja(false);
					setSelectedMethod(null);
					setNumDoc('');
					setSelectedDocumentType(null);
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
		} else {
			setDisableUpload(true);
			let s3Url = fractionateDebtPath;
			try {
				// Solo subir a S3 si hay un archivo nuevo
				if (fractionateDebtPath) {
					s3Url = await uploadToS3(
						fractionateDebtPath,
						'sga_uni/pagos_armadas',
						numDoc.replace(/\s+/g, '_') // evita espacios
					);
				}
				const payload = {
					enrollment: enrollmentItem?.uuid, // para matrícula
					number_of_installments: installments,
					payment_document_type: selectedDocumentType?.value,
					num_document_person: numDoc,
					path_commitment_letter: s3Url,
					upfront_percentage: enrollmentItem.min_payment_percentage,
					payment_method: selectedMethod?.value,
					amount: baseAmount || '0',
					accepts_terms: acceptTerms,
				};

				createPaymentPlansCredits(payload, {
					onSuccess: () => {
						toaster.create({
							title: 'Solicitud de pago fue exitoso',
							type: 'success',
						});
						onNext();
						setisSelectCaja(false);
						setSelectedMethod(null);
						setNumDoc('');
						setSelectedDocumentType(null);
						setDisableUpload(false);
					},
					onError: (error) => {
						const errorData = error.response?.data;
						setDisableUpload(false);
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
			} catch (error) {
				console.error('Error al subir el archivo:', error);
				setDisableUpload(false);
				toaster.create({
					title: 'Error al subir el archivo',
					type: 'error',
				});
			}
		}
	};

	// Efecto de carga cuando se abre el modal
	useEffect(() => {
		if (open) {
			setLoading(true);
			const timeout = setTimeout(() => {
				setLoading(false);
			}, 1500); // duración del "efecto de carga"

			return () => clearTimeout(timeout); // limpieza
		}
	}, [open]);

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];
	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const downloadSampleFile = () => {
		const link = document.createElement('a');
		link.href = '/templates/Compromiso-Pagos-armadas.docx';
		link.download = 'Compromiso-Pagos-armadas.docx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return (
		<Modal
			placement='center'
			trigger={
				<Button disabled={!paymentPlan} colorPalette='blue'>
					Procesar Orden
				</Button>
			}
			open={open}
			onSave={handleSubmitData}
			onOpenChange={(e) => setOpen(e.open)}
			size='2xl'
			saveLabel='Solicitar'
			loading={isPending || isLoadingPaymentPlansCredits || disableUpload}
		>
			<Stack gap={4} pb={6}>
				{loading ? (
					<Flex justify='center' align='center' minH='200px'>
						<Spinner
							thickness='4px'
							speed='0.65s'
							emptyColor='gray.200'
							color='blue.500'
							size='xl'
						/>
					</Flex>
				) : (
					<>
						<Card.Root>
							<Card.Header>
								<HStack justify='center' mb={4}>
									<Icon as={FiCreditCard} boxSize={6} color='blue.500' />

									<Text
										fontSize='xl'
										fontWeight='semibold'
										textAlign='center'
										color='blue.600'
									>
										Solicitar Orden de Pago
									</Text>
								</HStack>
							</Card.Header>
							<Card.Body gap={4}>
								{(paymentPlan === 5 ||
									paymentPlan === 4 ||
									paymentPlan === 9) && (
									<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
											invalid={!!errors.numDoc}
											errorText={errors.numDoc}
										>
											<Input
												value={numDoc}
												onChange={(e) => setNumDoc(e.target.value)}
												placeholder={
													selectedDocumentType?.value === 1
														? 'Ingrese número de documento'
														: selectedDocumentType?.value === 2
															? 'Ingrese número de RUC'
															: 'Ingrese número de documento'
												}
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
												value={baseAmount}
												readOnly
											/>
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
										<Field label='Descuento: %'>
											<Input
												type='number'
												placeholder='Solo para propósitos que lo permiten'
												step='0.01'
												value={discountValue || ''}
												readOnly
											/>
										</Field>
									</SimpleGrid>
								)}

								{paymentPlan === 999 && (
									<>
										<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
												invalid={!!errors.numDoc}
												errorText={errors.numDoc}
											>
												<Input
													value={numDoc}
													onChange={(e) => setNumDoc(e.target.value)}
													placeholder={
														selectedDocumentType?.value === 1
															? 'Ingrese número de documento'
															: selectedDocumentType?.value === 2
																? 'Ingrese número de RUC'
																: 'Ingrese número de documento'
													}
												/>
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
											<Field label='Porcentaje inicial (%)'>
												<Input
													readOnly
													placeholder='Seleccione programa'
													type='number'
													variant='flushed'
													min={0}
													max={100}
													value={
														enrollmentItem?.min_payment_percentage * 100 || ''
													}
													style={{ width: '100%' }}
												/>
											</Field>
											<Field
												label={`Número de cuotas (máximo ${enrollmentItem?.max_installments}) adicional al pago inicial`}
												invalid={!!errors.installments}
												errorText={errors.installments}
											>
												<Input
													placeholder='Numero de cuotas'
													type='number'
													variant='flushed'
													min={1}
													max={enrollmentItem?.max_installments}
													value={installments}
													onChange={(e) =>
														setInstallments(Number(e.target.value))
													}
													style={{ width: '100%' }}
												/>
											</Field>
										</SimpleGrid>
										{paymentPlan === 999 && installments >= 5 && (
											<Card.Root>
												<Card.Header
													flexDirection={'row'}
													alignItems={'center'}
													fontSize='lg'
													fontWeight='bold'
												>
													<FiDollarSign /> Solicitud de Pagos en Armadas
												</Card.Header>
												<Card.Body>
													<Stack css={{ '--field-label-width': '150px' }}>
														<Text fontSize='sm' mb={2}>
															Permite solicitar el pago en armadas, es decir,
															dividir el monto total en pagos más pequeños y
															manejables. Adjunta el documento de solicitud para
															iniciar el proceso.
														</Text>
														<Button
															variant='link'
															leftIcon={<FiDownload />}
															onClick={downloadSampleFile}
															ml={2}
															bg='transparent'
															border='1px solid'
															_hover={{ bg: 'gray.100' }}
														>
															Descargar plantilla de solicitud
														</Button>
														<Field
															label='Adjuntar solicitud'
															invalid={!!errors.fractionateDebtPath}
															errorText={errors.fractionateDebtPath}
															required
														>
															<CompactFileUpload
																name='path_cv'
																onChange={(file) =>
																	setFractionateDebtPath(file)
																}
																onClear={() => setFractionateDebtPath('')}
															/>
														</Field>
													</Stack>
												</Card.Body>
											</Card.Root>
										)}
									</>
								)}

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
								{(paymentPlan === 5 || paymentPlan === 4) && (
									<Alert status='info' Icon={<FiAlertTriangle />}>
										Tu solicitud será enviada al Administrador de Cobranzas para
										revisión. Recibirás una notificación cuando la orden sea
										generada.
									</Alert>
								)}
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
										{errors.acceptTerms && (
											<Text color='red.500' fontSize='sm'>
												{errors.acceptTerms}
											</Text>
										)}
									</VStack>
								</HStack>
							</Card.Body>
						</Card.Root>
					</>
				)}
			</Stack>
		</Modal>
	);
};

ProcessEnrollmentModal.propTypes = {
	paymentPlan: PropTypes.number,
	discountValue: PropTypes.string,
	baseAmount: PropTypes.number,
	description: PropTypes.string,
	amountCredits: PropTypes.number,
	onNext: PropTypes.func,
	enrollmentItem: PropTypes.object,
	onConfirmEnrollment: PropTypes.func,
};
