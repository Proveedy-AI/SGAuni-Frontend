import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { ReactSelect } from '@/components';
import { Alert, Button, Checkbox, Field, toaster } from '@/components/ui';
import { useReadPaymentRules } from '@/hooks';
import { useReadMethodPayment } from '@/hooks/method_payments';
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
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
	FiAlertCircle,
	FiAlertTriangle,
	FiFileText,
	FiPlus,
} from 'react-icons/fi';
import { useRequestReincorporation } from '@/hooks/enrollments';
import { useNavigate } from 'react-router';

export const MyReintegrationFormView = () => {
	const navigate = useNavigate();
	const enrollment = EncryptedStorage.load('selectedEnrollmentProccess');
	const { mutate: reintegrateEnrollment, isPending } =
		useRequestReincorporation();

	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [errors, setErrors] = useState({});

	const { data: dataUser } = useReadUserLogged();

	const { data: PaymentRules } = useReadPaymentRules({
		payment_purpose: 10, // Reintegración
	});
	const selectedPaymentRule = PaymentRules?.results[0];

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

	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];

	const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

	const validateFields = () => {
		const newErrors = {};
		if (!selectedDocumentType)
			newErrors.selectedDocumentType = 'Seleccione un tipo de documento';
		if (!numDocCarpeta)
			newErrors.numDocCarpeta = 'Ingrese el número de documento';
		if (!selectedMethod)
			newErrors.selectedMethod = 'Seleccione un método de pago';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = () => {
		if (!validateFields()) return;

		const payload = {
			current_enrollment_program: enrollment.id,
			payment_method: selectedMethod?.value,
			payment_document: selectedDocumentType?.value,
		};

		console.log('Payload de reintegración:', payload);

		reintegrateEnrollment(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Solicitud de reintegración enviada exitosamente',
					type: 'success',
				});

				// Limpiar formulario
				setSelectedMethod(null);
				setnumDocCarpeta('');
				setSelectedDocumentType(null);
				setAcceptTerms(false);
				navigate('/myprocedures/');
			},
			onError: (error) => {
				toaster.create({
					title: 'Error al enviar la solicitud de reintegración',
					type: 'error',
					description: error.message,
				});
			},
		});
	};

	return (
		<Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Trámites', to: '/myprocedures' },
					{
						label: 'Proceso de Reincorporación',
						to: '/myprocedures/reintegration-process',
					},
					{ label: enrollment ? enrollment?.program_name : 'Cargando...' },
				]}
			/>

			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiFileText} boxSize={5} color='blue.600' />
						<Heading fontSize='24px'>Solicitar Reincorporación</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Card.Root>
						<Card.Header>
							<Card.Title>Nueva Solicitud de Reincorporación</Card.Title>
							<Card.Description>
								Completa los datos para solicitar tu reincorporación al programa
								académico. El administrador revisará tu solicitud y generará la
								orden correspondiente.
							</Card.Description>

							<Alert status='info' Icon={<FiAlertTriangle />}>
								<Text>
									La reincorporación te permite volver a incorporarte al
									programa después de una postergación.
								</Text>
								<List.Root pl='4' mt='2'>
									<List.Item>
										Se evaluarán tus condiciones académicas y financieras
									</List.Item>
									<List.Item>
										No debes tener deudas pendientes con la universidad
									</List.Item>
									<List.Item>
										Debes estar en estado de &quot;postergación&quot;
										previamente
									</List.Item>
								</List.Root>
							</Alert>
						</Card.Header>

						<Card.Body>
							<VStack gap={6} align='stretch'>
								<Field label='Tipo de Proceso'>
									<Input
										value='Matrícula'
										readOnly
										variant='flushed'
										bg='gray.50'
										color='gray.600'
									/>
								</Field>

								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									<Field label='Programa Académico:'>
										<Input
											value={
												enrollment
													? `${enrollment.program_name} - ${enrollment.enrollment_period_name}`
													: 'Cargando...'
											}
											readOnly
											variant='flushed'
											bg='gray.50'
											color='gray.600'
										/>
									</Field>

									<Field label='Propósito:'>
										<Input
											value={
												selectedPaymentRule
													? selectedPaymentRule.payment_purpose_name
													: 'Cargando...'
											}
											readOnly
											variant='flushed'
											bg='gray.50'
											color='gray.600'
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

									<Field label='Monto (S/):'>
										<Input
											type='number'
											value={selectedPaymentRule?.amount}
											readOnly
											variant='flushed'
											bg='gray.50'
											color='gray.600'
										/>
										<Box w={'full'} mt={2}>
											<Alert Icon={<FiAlertCircle />} status='success'>
												Este monto es fijo y ha sido definido por la
												institución.
											</Alert>
										</Box>
									</Field>

									<Field
										label='Métodos de Pago:'
										invalid={!!errors.selectedMethod}
										errorText={errors.selectedMethod}
									>
										<ReactSelect
											value={selectedMethod}
											onChange={setSelectedMethod}
											isLoading={isLoadingMethodPayment}
											variant='flushed'
											size='xs'
											isSearchable
											isClearable
											options={methodOptions}
										/>
									</Field>
								</SimpleGrid>

								<Alert status='info' Icon={<FiAlertTriangle />}>
									Tu solicitud de reintegración será enviada al Administrador de
									Cobranzas para revisión. Recibirás una notificación cuando la
									orden sea generada.
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
									colorPalette='blue'
									leftIcon={<FiPlus />}
									disabled={!acceptTerms}
									width='full'
									onClick={handleSubmitData}
									loading={isPending}
								>
									Enviar Solicitud de Reintegración
								</Button>
							</VStack>
						</Card.Body>
					</Card.Root>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
