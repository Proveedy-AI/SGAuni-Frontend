import PropTypes from 'prop-types';
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
import { useReadPaymentDebts } from '@/hooks/admission_debts';
import { useReadMyApplicants } from '@/hooks';

export const FractionateDebt = () => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [program, setProgram] = useState(null);
	const [fractionateDebtPath, setFractionateDebtPath] = useState('');
	const [planType, setPlanType] = useState(null);
	const [amountToPay, setAmountToPay] = useState(null);
	const [acceptedTerms, setAcceptedTerms] = useState(false);

	const { data: dataMyApplicants, isLoading: isLoadingMyApplicants } =
		useReadMyApplicants();

	console.log(dataMyApplicants);

	const {
		data: dataPaymentDebt,
		//isLoading: isLoadingPaymentDebt,
	} = useReadPaymentDebts(
		{
			/* program_id: program?.value */
		},
		{ enabled: open }
	);

	console.log(dataPaymentDebt);

	const paymentDebtLocal = {
		max_installments: 24,
		min_payment_percentage: '20.00',
		postgraduate_program: program?.value || null,
	};

	useEffect(() => {
		if (dataMyApplicants?.length === 1) {
			setProgram({
				value: dataMyApplicants[0].id,
				label: dataMyApplicants[0].postgraduate_name,
			});
		}
	}, [dataMyApplicants]);

	const programOptions =
		dataMyApplicants?.map((applicant) => ({
			value: applicant.id,
			label: applicant.postgraduate_name,
		})) || [];

	//const { mutateAsync: fractionateDebt, isSaving } = useFractionateDebt();

	// Según base de datos
	const planOptions = [{ value: 1, label: 'Cuotas' }];

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		if (!program) newErrors.program = 'El programa es requerido';
		if (!fractionateDebtPath)
			newErrors.fractionateDebtPath = 'El archivo es requerido';
		if (!planType) newErrors.planType = 'El tipo de plan es requerido';
		if (!amountToPay) newErrors.amountToPay = 'El monto a pagar es requerido';
		if (amountToPay <= 0)
			newErrors.amountToPay = 'El monto a pagar debe ser mayor a 0';
		if (!acceptedTerms)
			newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const reset = () => {
		setFractionateDebtPath('');
		setPlanType(null);
		setAmountToPay(0);
		setAcceptedTerms(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) {
			toaster.create({
				title: 'Campos incompletos',
				description: 'Debe ingresar todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			document_path: fractionateDebtPath,
			plan_type: planType?.value,
			amount_to_pay: amountToPay,
		};
		console.log(payload);
		/*
    fractionateDebt(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Solicitud enviada con éxito',
          type: 'success'
        })
        reset();
        setOpen(false);
      },
      onError: () => {
        toaster.create({
          title: 'Error al enviar la solicitud',
          type: 'error'
        })
      }
    })
    
    */
		reset();
		setOpen(false);
	};

	const downloadSampleFile = () => {
		const link = document.createElement('a');
		link.href = '/SolicitudFraccionDeudaUni.docx';
		link.download = 'SolicitudFraccionDeudaUni.docx';
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
									onClear={() => setFractionateDebtPath(null)}
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
										isLoading={isLoadingMyApplicants}
										onChange={(opt) => setProgram(opt?.value)}
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
											dataPaymentDebt?.min_payment_percentage ||
											paymentDebtLocal.min_payment_percentage
										}
										style={{ width: '100%' }}
									/>
								</Field>
								<Field label='Número de cuotas'>
									<Input
										readOnly
										placeholder='Seleccione programa'
										type='number'
										variant='flushed'
										min={1}
										value={
											dataPaymentDebt?.max_installments ||
											paymentDebtLocal.max_installments
										}
										style={{ width: '100%' }}
									/>
								</Field>
							</SimpleGrid>
							<Field label='Monto a pagar'>
								<Input
									placeholder='Seleccione programa'
									type='number'
									min={1}
									value={amountToPay}
									onChange={(e) => setAmountToPay(Number(e.target.value))}
									style={{ width: '100%' }}
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
