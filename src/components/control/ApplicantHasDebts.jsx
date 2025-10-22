import PropTypes from 'prop-types';
import {
	Box,
	Text,
	Button,
	Flex,
	Card,
	Badge,
	Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

export const ApplicantHasDebts = () => {
	const navigate = useNavigate();

	const handleContactSupport = () => {
		navigate('/mypaymentsdebts/debts');
	};

	return (
		<Flex align='center' justify='center' minH='400px' p={4}>
			<Card.Root
				w='full'
				maxW='md'
				bgGradient='linear(to-br, red.50, orange.50)'
				boxShadow='lg'
				border='1px solid'
				borderColor='red.200'
			>
				<Card.Body textAlign='center' p={8}>
					{/* Icon + Badge */}
					<Box position='relative'>
						<Flex
							mx='auto'
							w={16}
							h={16}
							bg='red.100'
							rounded='full'
							align='center'
							justify='center'
							mb={4}
						>
							<FiAlertTriangle size={32} color='#dc2626' />
						</Flex>
						<Badge
							variant='solid'
							colorPalette='red'
							position='absolute'
							top='-2'
							right='-2'
							animation='pulse 2s infinite'
						>
							¡Atención!
						</Badge>
					</Box>

					{/* Mensaje */}
					<Box mb={6}>
						<Heading size='lg' color='red.700' mb={2}>
							Cuenta Suspendida
						</Heading>
						<Text color='gray.700'>
							Tu cuenta se encuentra actualmente suspendida. Esto puede deberse
							a pagos pendientes u otras razones administrativas.
						</Text>
						<Text mt={2} color='gray.700'>
							Si crees que se trata de un error, por favor contacta a nuestro
							equipo de soporte para más información.
						</Text>
					</Box>

					{/* Botón */}
					<Button
						onClick={handleContactSupport}
						w='full'
						size='lg'
						bg='red.600'
						color='white'
						fontWeight='semibold'
						py={6}
						px={6}
						rounded='lg'
						boxShadow='md'
						_hover={{
							bg: 'red.700',
							transform: 'scale(1.05)',
							boxShadow: 'lg',
						}}
					>
						Revisar Deudas <FiArrowRight size={16} />
					</Button>

					{/* Texto adicional */}
					<Text mt={4} fontSize='sm' color='gray.600'>
						Recupera el acceso regularizando tu situación o confirmando tu
						estado con soporte.
					</Text>
				</Card.Body>
			</Card.Root>
		</Flex>
	);
};

ApplicantHasDebts.propTypes = {
	data: PropTypes.object,
};
