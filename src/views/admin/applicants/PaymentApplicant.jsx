import {
	Box,
	Heading,
	Text,
	Stack,
	Flex,
	Spinner,
	Grid,
	Badge,
	Card,
	Icon,
	Button,
} from '@chakra-ui/react';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useReadPurposes } from '@/hooks/purposes';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadMyPaymentRequest } from '@/hooks/payment_requests/useReadMyPaymentRequest';
//import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import PropTypes from 'prop-types';
import {
	FiCheckCircle,
	FiClock,
	FiCreditCard,
	FiFileText,
} from 'react-icons/fi';
import { useReadPaymentRules } from '@/hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export const PaymentApplicant = ({ onValidationChange }) => {
	const navigate = useNavigate();
	const { data: dataPurposes } = useReadPurposes();
	//const { data: dataUser } = useReadUserLogged();
	const { data: PaymentRequest, isLoading: isLoadingPaymentRquest } =
		useReadMyPaymentRequest();
	/*const hasStudentRole = dataUser.roles?.some(
		(role) => role.name === 'Estudiante'
	);*/
	const item = EncryptedStorage.load('selectedApplicant');
	const isPreMaestria = item?.modality_id === 1;
	const { data: PaymentRules } = useReadPaymentRules();

	const statusDisplay = [
		{
			id: 1,
			label: 'Pendiente',
			value: 'Pendiente',
			bg: '#AEAEAE',
			color: '#F5F5F5',
		},
		{
			id: 2,
			label: 'Generado',
			value: 'Generado',
			bg: '#FDD9C6',
			color: '#F86A1E',
		},
		{
			id: 3,
			label: 'Verificado',
			value: 'Verificado',
			bg: '#D0EDD0',
			color: '#2D9F2D',
		},
		{
			id: 4,
			label: 'Expirado',
			value: 'Expirado',
			bg: '#F7CDCE',
			color: '#E0383B',
		},
	];

	const carpetaRequest = PaymentRequest?.find(
		(req) => req.application === item?.id && req.purpose === 1
	);
	const admisionRequest = PaymentRequest?.find(
		(req) => req.application === item?.id && req.purpose === 2
	);

	// Obtener órdenes usando filtros del backend
	const { data: carpetaOrderData } = useReadPaymentOrders({
		request: carpetaRequest?.id,
	});
	const { data: admisionOrderData } = useReadPaymentOrders({
		request: admisionRequest?.id,
	});

	// Extraer la primera orden encontrada (si existe)
	const carpetaOrder =
		carpetaOrderData?.pages?.[0]?.results?.find(
			(order) => order.request === carpetaRequest?.id
		) || null;

	const admisionOrder =
		admisionOrderData?.pages?.[0]?.results?.find(
			(order) => order.request === admisionRequest?.id
		) || null;

	const paymentRules = PaymentRules?.results?.filter(
		(req) => req.applies_to_applicants === true
	);

	useEffect(() => {
		const cumpleCondicion =
			carpetaOrder?.status === 3 &&
			(!isPreMaestria || admisionOrder?.status === 3);

		onValidationChange?.(cumpleCondicion);
	}, [carpetaOrder?.status, isPreMaestria, admisionOrder?.status]);

	// Construir mapa de propósitos enriquecidos
	const purposes = {};

	// Procesar cada propósito
	dataPurposes?.results?.forEach((purposeItem) => {
		const id = purposeItem.id;
		const existingRequest =
			PaymentRequest?.find(
				(req) => req.application === item?.id && req.purpose === id
			) ?? null;

		purposes[id] = {
			name: item.name,
			rule: paymentRules?.find((rule) => rule.payment_purpose === id) ?? null,
			existingRequest,
			existingOrder: null, // Se manejará en el render
		};
	});

	const handleRedirect = () => {
		navigate('/mypaymentsdebts/addrequests'); // reemplaza con la ruta deseada
	};

	const renderPaymentRequestCard = (request, rule, order, purposeName) => {
		const status = statusDisplay.find((s) => s.id === request.status);
		const StatusIcon = status?.icon || FiClock;

		return (
			<Card.Root w='full'>
				<Card.Header>
					<Card.Title>
						<Flex align='center' gap={2} fontSize='lg'>
							<Icon as={StatusIcon} boxSize={5} />
							Orden de Pago: {purposeName} (S/ {rule?.amount})
						</Flex>
					</Card.Title>
				</Card.Header>

				<Card.Body>
					{/* Estado de la solicitud */}
					<Flex justify='space-between' align='center' mb={2}>
						<Text fontWeight='medium'>Estado de Solicitud:</Text>
						<Badge
							bg={status?.bg || 'gray.100'}
							color={status?.color || 'black'}
						>
							{status?.label}
						</Badge>
					</Flex>

					{/* Detalles de la solicitud */}
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
						gap={4}
						fontSize='sm'
						mb={2}
					>
						<Flex justify='space-between'>
							<Text fontWeight='medium'>Monto:</Text>
							<Text>S/ {request?.amount}</Text>
						</Flex>
						<Flex justify='space-between'>
							<Text fontWeight='medium'>Método:</Text>
							<Text>{request.payment_method_display}</Text>
						</Flex>
						<Flex justify='space-between'>
							<Text fontWeight='medium'>N° Documento:</Text>
							<Text>{request.num_document}</Text>
						</Flex>
					</Grid>

					{request.payment_method === 2 && (
						<Box
							fontSize='xs'
							color='gray.500'
							bg='gray.100'
							p={2}
							borderRadius='md'
							mb={2}
						>
							(Acércate a FIEECS por tu recibo)
						</Box>
					)}

					{/* Estado de la orden */}
					{order ? (
						<Box>
							{order.status === 3 ? (
								<Flex align='center' gap={2} color='green.600'>
									<Icon as={FiCheckCircle} boxSize={5} />
									<Text fontWeight='medium'>
										¡Orden Aprobada! Puedes continuar con el proceso
									</Text>
								</Flex>
							) : (
								<Flex align='center' gap={2} color='blue.600'>
									<Icon as={FiCreditCard} boxSize={5} />
									<Text fontWeight='medium'>
										Orden de Pago Generada - Pendiente de Aprobación
									</Text>
								</Flex>
							)}
						</Box>
					) : (
						<Text textAlign='center' color='gray.500'>
							Te notificaremos cuando se genere tu orden de pago
						</Text>
					)}
				</Card.Body>
			</Card.Root>
		);
	};

	const renderRequestPrompt = (purposeName, amount, isAdmision = false) => (
		<Card.Root borderWidth='2px' borderStyle='dashed' w='full'>
			<Card.Body pt={6}>
				<Flex direction='column' align='center' textAlign='center' gap={4}>
					<Flex
						w={12}
						h={12}
						bg='blue.100'
						borderRadius='full'
						align='center'
						justify='center'
					>
						<Icon as={FiFileText} boxSize={6} color='blue.600' />
					</Flex>

					<Box>
						<Heading fontSize='lg' fontWeight='semibold'>
							Solicita tu Orden de Pago: {purposeName}
						</Heading>
						<Text mt={1} color='gray.600'>
							Monto: S/ {amount}
						</Text>
						{isAdmision && (
							<Text mt={2} fontSize='sm' color='orange.600'>
								* Requerido para estudiantes de pre-maestría
							</Text>
						)}
					</Box>

					<Button
						w='full'
						maxW='xs'
						colorScheme='blue'
						onClick={handleRedirect}
					>
						Solicitar Orden de Pago
					</Button>
				</Flex>
			</Card.Body>
		</Card.Root>
	);

	if (isLoadingPaymentRquest) {
		return (
			<Flex
				height='50vh'
				align='center'
				justify='center'
				bg='white' // opcional: color de fondo
			>
				<Spinner size='xl' thickness='4px' speed='0.65s' color='uni.primary' />
			</Flex>
		);
	}

	return (
		<Stack maxW={{ base: 'full', md: '80%' }} spaceY='5' mx={'auto'}>
			<Box bg='white' rounded='lg' shadow='md' p={6}>
				{/* Encabezado */}
				<Box textAlign='center' mb={8}>
					<Heading fontSize='2xl' fontWeight='bold' color='gray.800' mb={2}>
						Gestión de Órdenes de Pago
					</Heading>
					<Text color='gray.600'>Modalidad: {item?.modality_display}</Text>
				</Box>

				{/* Secciones de órdenes */}
				<Stack gap={6}>
					{/* Derecho de Carpeta */}
					{carpetaRequest
						? renderPaymentRequestCard(
								carpetaRequest,
								purposes[1]?.rule,
								carpetaOrder,
								'Derecho de Carpeta',
								purposes[1]?.amount || 50
							)
						: renderRequestPrompt(
								'Derecho de Carpeta',
								purposes[1]?.rule?.amount || 250
							)}

					{/* Admisión (solo para pre-maestría) */}
					{isPreMaestria &&
						(admisionRequest
							? renderPaymentRequestCard(
									admisionRequest,
									purposes[2]?.rule,
									admisionOrder,
									'Admisión - I',
									purposes[2]?.amount || 50
								)
							: renderRequestPrompt(
									'Admisión - I',
									purposes[2]?.rule?.amount || 250,
									true
								))}
				</Stack>

				{/* Resumen del estado */}
				<Card.Root bg='blue.50' mt={8}>
					<Card.Body pt={6} textAlign='center'>
						<Heading fontSize='md' fontWeight='semibold' mb={2}>
							Estado del Proceso
						</Heading>
						{carpetaOrder?.status === 3 &&
						(!isPreMaestria || admisionOrder?.status === 3) ? (
							<Flex justify='center' align='center' gap={2} color='green.600'>
								<Icon as={FiCheckCircle} boxSize={5} />
								<Text fontWeight='medium'>
									¡Todas las órdenes están aprobadas! Puedes continuar.
								</Text>
							</Flex>
						) : (
							<Text color='gray.600'>
								{!carpetaRequest && !admisionRequest
									? 'Debes solicitar las órdenes de pago requeridas'
									: 'Esperando aprobación de órdenes de pago'}
							</Text>
						)}
					</Card.Body>
				</Card.Root>
			</Box>
		</Stack>
	);
};

PaymentApplicant.propTypes = {
	onValidationChange: PropTypes.bool,
};
