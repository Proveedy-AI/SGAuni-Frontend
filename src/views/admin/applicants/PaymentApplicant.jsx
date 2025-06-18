import { useState, useEffect } from 'react';
import { Field, toaster } from '@/components/ui';
import {
	Box,
	Heading,
	Text,
	Stack,
	Flex,
	Input,
	Button,
	Spinner,
} from '@chakra-ui/react';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { ReactSelect } from '@/components';
import { useReadMethodPayment } from '@/hooks/method_payments';
import { useCreatePaymentRequest } from '@/hooks/payment_requests/useCreatePaymentRequest';
import { useReadPaymentRequest } from '@/hooks/payment_requests/useReadPaymentRequest';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useReadPaymentRules } from '@/hooks/payment_rules';
import { useReadPurposes } from '@/hooks/purposes';

export const PaymentApplicant = () => {
	const { data: dataUser } = useReadUserLogged();

	const { data: MethodPayment, isLoading: isLoadingMethodPayment } =
		useReadMethodPayment();
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const { data: PaymentRules } = useReadPaymentRules();
	const { data: dataPurposes } = useReadPurposes();

	const {
		data: PaymentRequest,
		isLoading: isLoadingPaymentRquest,
		refetch,
	} = useReadPaymentRequest();

	const methodOptions =
		MethodPayment?.results?.map((method) => ({
			value: method.id,
			label: method.name,
		})) || [];
	const TypeOptions = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'RUC' },
	];

	const [methodCarpeta, setmethodCarpeta] = useState(null);
	const [docTypeCarpeta, setdocTypeCarpeta] = useState(null);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');

	const [docTypeAdmision, setDocTypeAdmision] = useState(null);
	const [numDocAdmision, setNumDocAdmision] = useState('');
	const [methodAdmision, setMethodAdmision] = useState(null);

	useEffect(() => {
		if (docTypeCarpeta?.value === 1 && dataUser?.document_number) {
			setnumDocCarpeta(dataUser.document_number);
		}
		if (docTypeAdmision?.value === 1 && dataUser?.document_number) {
			setNumDocAdmision(dataUser.document_number);
		}
	}, [docTypeCarpeta, dataUser, docTypeAdmision]);

	const item = EncryptedStorage.load('selectedApplicant');

	// Filtrar las reglas aplicables al postulante
	const paymentRules = PaymentRules?.results?.filter(
		(req) =>
			req.program === item?.admission_program &&
			req.admission_modality === item?.modality_id
	);

	// Construir mapa de propósitos enriquecidos
	const purposes = {};

	dataPurposes?.results?.forEach((purposeItem) => {
		const id = purposeItem.id;
		purposes[id] = {
			name: item.name,
			rule: paymentRules?.find((rule) => rule.payment_purpose === id) ?? null,
			existingRequest:
				PaymentRequest?.results?.find(
					(req) => req.application === item?.id && req.purpose === id
				) ?? null,
		};
	});

	const { mutate: paymentRequests, isPending } = useCreatePaymentRequest();

	const handleSubmitData = (e, propuse, values) => {
		e.preventDefault();
		const rule = purposes[propuse]?.rule;
		const payload = {
			payment_method: values.method.value,
			amount: rule?.amount || '0',
			application: item.id,
			purpose: propuse,
			document_type: values.docType.value,
			num_document: values.numDoc,
		};

		paymentRequests(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Solicitud de pago fue exitoso',
					type: 'success',
				});
				setisSelectCaja(false);
				refetch();
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
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
			mb={10}
			mt={1}
		>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
				mb={5}
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
					}}
					color={'gray.500'}
				>
					Solicitar Ordenes de pago
				</Heading>
				<Text fontWeight='semibold' color={'gray.500'}>
					2 de 4
				</Text>
			</Stack>

			<Stack Stack align={{ base: 'start', sm: 'center' }} mb={5}>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
					}}
					color={'gray.500'}
				>
					Orden de Pago: Derecho de Carpeta (S/
					{purposes[1]?.rule?.amount ?? '-'})
				</Heading>
			</Stack>
			{isLoadingPaymentRquest ? (
				<Flex
					height='50vh'
					align='center'
					justify='center'
					bg='white' // opcional: color de fondo
				>
					<Spinner
						size='xl'
						thickness='4px'
						speed='0.65s'
						color='uni.primary'
					/>
				</Flex>
			) : purposes[2]?.existingRequest ? (
				<Box
					width='100%'
					bg='gray.50'
					border='1px solid'
					borderColor='gray.200'
					borderRadius='md'
					p={6}
					mt={5}
					textAlign='center'
				>
					<Heading size='sm' color='green.600' mb={2}>
						Ya solicitaste esta orden de pago
					</Heading>
					<Text>
						Estado:{' '}
						<strong>{purposes[2].existingRequest.status_display}</strong>
					</Text>
					<Text>
						Monto: <strong>S/. {purposes[2].existingRequest.amount}</strong>
					</Text>
					<Text fontSize='sm'>
						Método:{' '}
						<strong>
							{purposes[2].existingRequest?.payment_method_display}
						</strong>{' '}
						{purposes[2].existingRequest?.payment_method === 2 && ( // Asumiendo que 3 es "Caja"
							<Text as='span' fontSize='xs' color='gray.500' ml={1}>
								(Acércate a FIEECS por tu recibo)
							</Text>
						)}
					</Text>
					<Text>
						N° Documento:{' '}
						<strong>{purposes[2].existingRequest.num_document}</strong>
					</Text>
				</Box>
			) : (
				<Flex justify='center' align='center' width='100%'>
					<Stack
						maxW={{ base: '100%', md: '50%' }}
						width='100%'
						align='center' // Alinea hijos al centro horizontal
						spacing={4}
					>
						<Field label='Tipo de documento'>
							<ReactSelect
								label='Tipo de documento'
								options={TypeOptions}
								value={docTypeCarpeta}
								onChange={(option) => setdocTypeCarpeta(option)}
								isClearable={true}
								placeholder='Seleccione tipo de documento'
							/>
						</Field>

						<Field label='N° Doc'>
							<Input
								value={numDocCarpeta}
								onChange={(e) => setnumDocCarpeta(e.target.value)}
								placeholder='Ingrese número de documento'
								isReadOnly={docTypeCarpeta?.value === 1}
							/>
						</Field>

						<Field label='Metodo de pago'>
							<ReactSelect
								label='Metodo de pago'
								options={methodOptions}
								value={methodCarpeta}
								isLoading={isLoadingMethodPayment}
								onChange={(option) => {
									setmethodCarpeta(option);
									setisSelectCaja(option.value === 2);
								}}
								isClearable={true}
								placeholder='Seleccione Metodo de pago'
							/>
						</Field>
						<Button
							loading={isPending}
							mt={5}
							bg={'uni.secondary'}
							onClick={(e) =>
								handleSubmitData(e, 2, {
									docType: docTypeCarpeta,
									numDoc: numDocCarpeta,
									method: methodCarpeta,
								})
							}
						>
							Solicitar Carpeta
						</Button>
					</Stack>
				</Flex>
			)}
			{purposes[1]?.rule && (
				<>
					{' '}
					<Stack Stack align={{ base: 'start', sm: 'center' }} mb={5} mt={10}>
						<Heading
							size={{
								xs: 'xs',
								sm: 'sm',
								md: 'md',
							}}
							color={'gray.500'}
						>
							Orden de Pago: Derecho de Admisión ( S/.
							{purposes[1]?.rule?.amount ?? '-'})
						</Heading>
					</Stack>
					{isLoadingPaymentRquest ? (
						<Flex
							height='50vh'
							align='center'
							justify='center'
							bg='white' // opcional: color de fondo
						>
							<Spinner
								size='xl'
								thickness='4px'
								speed='0.65s'
								color='uni.primary'
							/>
						</Flex>
					) : purposes[1]?.existingRequest ? (
						<Box
							width='100%'
							bg='gray.50'
							border='1px solid'
							borderColor='gray.200'
							borderRadius='md'
							p={6}
							mt={5}
							textAlign='center'
						>
							<Heading size='sm' color='green.600' mb={2}>
								Ya solicitaste esta orden de pago
							</Heading>
							<Text>
								Estado:{' '}
								<strong>{purposes[1].existingRequest.status_display}</strong>
							</Text>
							<Text>
								Monto: <strong>S/. {purposes[1].existingRequest.amount}</strong>
							</Text>
							<Text fontSize='sm'>
								Método:{' '}
								<strong>
									{purposes[1].existingRequest?.payment_method_display}
								</strong>{' '}
								{purposes[1].existingRequest?.payment_method === 2 && ( // Asumiendo que 3 es "Caja"
									<Text as='span' fontSize='xs' color='gray.500' ml={1}>
										(Acércate a FIEECS por tu recibo)
									</Text>
								)}
							</Text>
							<Text>
								N° Documento:{' '}
								<strong>{purposes[1].existingRequest.num_document}</strong>
							</Text>
							<Text mt={2} fontSize={13} color={'gray.500'}>
								*Si usted es egresado UNI se le aplicará el 15% de Descuento en
								esta orden.
							</Text>
						</Box>
					) : (
						<Flex justify='center' align='center' width='100%'>
							<Stack
								maxW={{ base: '100%', md: '50%' }}
								width='100%'
								align='center' // Alinea hijos al centro horizontal
								spacing={4}
							>
								<Field label='Tipo de documento'>
									<ReactSelect
										label='Tipo de documento'
										options={TypeOptions}
										value={docTypeAdmision}
										onChange={(option) => setDocTypeAdmision(option)}
										isClearable={true}
										placeholder='Seleccione tipo de documento'
									/>
								</Field>

								<Field label='N° Doc'>
									<Input
										value={numDocAdmision}
										onChange={(e) => setNumDocAdmision(e.target.value)}
										placeholder='Ingrese número de documento'
										isReadOnly={docTypeAdmision?.value === 1}
									/>
								</Field>

								<Field label='Metodo de pago'>
									<ReactSelect
										label='Metodo de pago'
										options={methodOptions}
										value={methodAdmision}
										isLoading={isLoadingMethodPayment}
										onChange={(option) => {
											setMethodAdmision(option);
											setisSelectCaja(option.value === 2);
										}}
										isClearable={true}
										placeholder='Seleccione Metodo de pago'
									/>
								</Field>
								<Button
									loading={isPending}
									mt={5}
									bg={'uni.secondary'}
									onClick={(e) =>
										handleSubmitData(e, 1, {
											docType: docTypeAdmision,
											numDoc: numDocAdmision,
											method: methodAdmision,
										})
									}
								>
									Solicitar Admisión
								</Button>
							</Stack>
						</Flex>
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
						Luego de solicitar la orden de pago. Por favor, acércate a la
						oficina de <b>FIEECS</b> para obtener tu recibo físico y poder
						completar el proceso de pago.
					</Text>
				</Box>
			)}
			<Stack Stack align={{ base: 'start', sm: 'center' }} mt={5}>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'sm',
					}}
					color={'gray.500'}
				>
					Te notificaremos cuando podrás realizar el pago
				</Heading>
			</Stack>
		</Box>
	);
};
