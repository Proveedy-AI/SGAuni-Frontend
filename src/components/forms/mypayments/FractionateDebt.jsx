import { ReactSelect } from '@/components/select';
import { Button, Checkbox, Field, Modal, toaster } from '@/components/ui';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import {
	Stack,
	Text,
	Card,
	Input,
	HStack,
	VStack,
	SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiDollarSign, FiDownload, FiInfo } from 'react-icons/fi';

import PropTypes from 'prop-types';
import { useReadMyEnrollments, useReadProgramsbyId } from '@/hooks';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useCreatePaymentPlans } from '@/hooks/payments_plans/useCreatePaymentPlans';

export const FractionateDebt = ({ countDebts }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [program, setProgram] = useState(null);
	const [fractionateDebtPath, setFractionateDebtPath] = useState('');
	const [planType, setPlanType] = useState(null);
	const [amount, setAmount] = useState(countDebts || 0);
	const [installments, setInstallments] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [disableUpload, setDisableUpload] = useState(false);
	const { data: dataMyEnrollment } = useReadMyEnrollments(
		{},
		{ enabled: open }
	);

	const { data: DataProgram } = useReadProgramsbyId(program?.value || null, {
		enabled: open,
	});

	const paymentDebtLocal = {
		max_installments: 6,
		min_payment_percentage: '20.00',
		postgraduate_program: program?.value || null,
	};

	useEffect(() => {
		if (dataMyEnrollment?.length === 1) {
			setProgram({
				enrollment: dataMyEnrollment[0].id,
				value: dataMyEnrollment[0].programId,
				label: dataMyEnrollment[0].program_name,
			});
		}
	}, [dataMyEnrollment]);

	const programOptions =
		dataMyEnrollment?.map((applicant) => ({
			value: applicant.programId,
			label: applicant.program_name,
			enrollment: applicant.id,
		})) || [];

	const { mutate: fractionateDebt } = useCreatePaymentPlans();

	// Según base de datos
	const planOptions = [{ value: 3, label: 'Cuotas' }];

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		if (!program) newErrors.program = 'El programa es requerido';
		if (!fractionateDebtPath)
			newErrors.fractionateDebtPath = 'El archivo es requerido';
		if (!planType) newErrors.planType = 'El tipo de plan es requerido';
		if (!installments)
			newErrors.installments = 'El número de cuotas es requerido';
		if (installments <= 1 || installments > paymentDebtLocal?.max_installments)
			newErrors.installments = `El número de cuotas debe ser entre 1 y ${paymentDebtLocal?.max_installments}`;
		if (!acceptedTerms)
			newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones';
		if (!numDocCarpeta)
			newErrors.numDocCarpeta = 'El número de documento es requerido';
		if (selectedDocumentType?.value === 1 && !numDocCarpeta)
			newErrors.numDocCarpeta =
				'El número de documento es requerido para boleta	';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const reset = () => {
		setFractionateDebtPath('');
		setPlanType(null);
		setInstallments(0);
		setAcceptedTerms(false);
	};

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		setDisableUpload(true);
		if (!validate()) {
			toaster.create({
				title: 'Campos incompletos',
				description: 'Debe ingresar todos los campos',
				type: 'warning',
			});
			return;
		}

		let s3Url = fractionateDebtPath;
		try {
			// Solo subir a S3 si hay un archivo nuevo
			if (fractionateDebtPath) {
				s3Url = await uploadToS3(
					fractionateDebtPath,
					'sga_uni/fraccionar_deuda',
					numDocCarpeta.replace(/\s+/g, '_') // evita espacios
				);
			}

			const payload = {
				enrollment: program?.enrollment,
				payment_purpose: planType.value,
				upfront_percentage: DataProgram?.min_payment_percentage,
				number_of_installments: installments,
				payment_document_type: selectedDocumentType?.value,
				num_document_person: numDocCarpeta,
				document_path: s3Url,
			};

			fractionateDebt(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Solicitud enviada con éxito',
						type: 'success',
					});
					reset();
					setOpen(false);
					setDisableUpload(false);
				},
				onError: () => {
					toaster.create({
						title: 'Error al enviar la solicitud',
						type: 'error',
					});
				},
			});

			setDisableUpload(false);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			setDisableUpload(false);
			toaster.create({
				title: 'Error al subir el contrato',
				type: 'error',
			});
		}
	};

	const downloadSampleFile = () => {
		const link = document.createElement('a');
		link.href = '/templates/Compromiso-fraccionamiento.docx';
		link.download = 'Compromiso-fraccionamiento.docx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<Modal
			title='Fraccionar Deuda'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					Fraccionar deuda
				</Button>
			}
			onSave={handleSubmit}
			loading={disableUpload}
			size='3xl'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack gap={3}>
				<Card.Root>
					<Card.Header
						flexDirection={'row'}
						alignItems={'center'}
						fontSize='lg'
						fontWeight='bold'
					>
						<FiDollarSign /> Solicitud de Fraccionamiento
					</Card.Header>
					<Card.Body>
						<Stack css={{ '--field-label-width': '150px' }}>
							<Text fontSize='sm' mb={2}>
								Permite solicitar el fraccionamiento de una deuda, es decir,
								dividir el monto total en pagos más pequeños y manejables.
								Adjunta el documento de solicitud para iniciar el proceso.
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
									onChange={(file) => setFractionateDebtPath(file)}
									onClear={() => setFractionateDebtPath('')}
								/>
							</Field>
						</Stack>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header
						flexDirection={'row'}
						alignItems={'center'}
						fontSize='lg'
						fontWeight='bold'
					>
						<FiInfo /> Detalles de Fraccionamiento
					</Card.Header>
					<Card.Body>
						<Stack css={{ '--field-label-width': '150px' }}>
							<SimpleGrid columns={2} gap={2}>
								<Field
									label='Programa'
									required
									invalid={!!errors.program}
									error={errors.program}
								>
									<ReactSelect
										options={programOptions}
										value={program}
										onChange={(opt) => setProgram(opt)}
										placeholder='Selecciona un programa'
									/>
								</Field>
								<Field
									label='Tipo de plan'
									required
									invalid={!!errors.planType}
									error={errors.planType}
								>
									<ReactSelect
										options={planOptions}
										value={planOptions.find((opt) => opt.value === planType)}
										onChange={(opt) => setPlanType(opt?.value)}
										placeholder='Selecciona el tipo de plan'
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
											DataProgram?.min_payment_percentage ||
											paymentDebtLocal.min_payment_percentage
										}
										style={{ width: '100%' }}
									/>
								</Field>
								<Field
									label={`Número de cuotas (máximo ${DataProgram?.max_installments || paymentDebtLocal.max_installments})`}
									invalid={!!errors.installments}
									errorText={errors.installments}
								>
									<Input
										placeholder='Numero de cuotas'
										type='number'
										variant='flushed'
										min={1}
										max={
											DataProgram?.max_installments ||
											paymentDebtLocal.max_installments
										}
										value={installments}
										onChange={(e) => setInstallments(Number(e.target.value))}
										style={{ width: '100%' }}
									/>
								</Field>
							</SimpleGrid>
							<Field label='Monto minimo a pagar'>
								<Input
									type='number'
									disabled
									min={1}
									value={
										(amount * DataProgram?.min_payment_percentage) / 100 || 0
									}
									onChange={(e) => setAmount(Number(e.target.value))}
									style={{ width: '100%' }}
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
									placeholder={
										selectedDocumentType?.value === 1
											? 'Ingrese número de documento'
											: 'Ingrese número de RUC'
									}
									isReadOnly={selectedDocumentType?.value === 1}
								/>
							</Field>
							<HStack>
								<Checkbox
									checked={acceptedTerms}
									onChange={(e) => setAcceptedTerms(e.target.checked)}
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
										del proceso de fraccionamiento de deuda *
									</Text>
									{errors.acceptedTerms && (
										<Text color='red.500' fontSize='sm'>
											{errors.acceptedTerms}
										</Text>
									)}
								</VStack>
							</HStack>
						</Stack>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

FractionateDebt.propTypes = {
	countDebts: PropTypes.any,
	debtsByPurpose: PropTypes.array.isRequired,
	dataMyApplicants: PropTypes.array.isRequired,
};
