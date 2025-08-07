import {
	Badge,
	Box,
	Card,
	Flex,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FaCalendarCheck, FaCircle } from 'react-icons/fa';
import {
	FiCheckCircle,
	FiCircle,
	FiCreditCard,
	FiGift,
	FiZap,
} from 'react-icons/fi';
import PropTypes from 'prop-types';

export const OptionsPlans = ({
	paymentPlan,
	handlePlanChange,
	savingsProgramAmount,
	semesterBaseAmount,
	semesterDiscountAmount,
	DiscountSemestreComplete,
	DiscountMasterComplete,
	fullProgramAmount,
	enrollmentItem,
}) => {
	return (
		<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
			<Card.Root
				cursor='pointer'
				transition='all 0.3s'
				position='relative'
				border={paymentPlan === 999 ? '2px solid' : '1px solid'}
				borderColor={paymentPlan === 999 ? 'purple.500' : 'purple.200'}
				transform={paymentPlan === 999 ? 'scale(1.02)' : undefined}
				boxShadow={paymentPlan === 999 ? 'lg' : 'md'}
				ring={paymentPlan === 999 ? 2 : 0}
				ringColor='purple.500'
				onClick={() => handlePlanChange(999)}
				_hover={{ boxShadow: 'lg' }}
			>
				<Card.Body p={{ base: 3, md: 6 }}>
					{/* Encabezado con ícono y estado */}
					<HStack justify='space-between' mb={4}>
						<HStack gap={3}>
							<Box
								bg='purple.100'
								p={2}
								borderRadius='full'
								display={{ base: 'none', md: 'block' }}
							>
								<Icon as={FiCreditCard} boxSize={6} color='purple.600' />
							</Box>
							<Box>
								<Text fontWeight='semibold' color='gray.800'>
									Pago en Armadas
								</Text>
								<Text fontSize='sm' color='purple.600'>
									Hasta {enrollmentItem?.max_installments} armadas sin intereses
								</Text>
							</Box>
						</HStack>

						<Box color={paymentPlan === 999 ? 'purple.500' : 'gray.300'}>
							<Icon
								as={paymentPlan === 999 ? FiCheckCircle : FaCircle}
								boxSize={6}
							/>
						</Box>
					</HStack>

					{/* Descripción */}
					<Text fontSize='sm' color='gray.600' mb={4}>
						Divide tu pago del semestre en hasta{' '}
						{enrollmentItem?.max_installments} armadas mensuales.
					</Text>

					{/* Beneficios */}
					<VStack align='start' gap={2} mb={4}>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='purple.500' />
							<Text fontWeight='medium'>
								Hasta {enrollmentItem?.max_installments} armadas mensuales.
							</Text>
						</HStack>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='purple.500' />
							<Text color='gray.700'>Pago inicial del {enrollmentItem?.min_payment_percentage * 100}%</Text>
						</HStack>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='purple.500' />
							<Text color='gray.700'>Acceso inmediato tras el primer pago</Text>
						</HStack>
					</VStack>
					<Box borderTop='1px solid' borderColor='gray.200' pt={4}>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'flex-start', md: 'center' }}
							spacing={4}
						>
							<Text fontSize='sm' color='gray.600'>
								Costo Total
							</Text>
							<Box textAlign={{ base: 'left', md: 'right' }}>
								<Text
									fontSize={{ base: 'lg', md: 'xl' }}
									fontWeight='bold'
									color='gray.800'
								>
									S/ {semesterBaseAmount?.toFixed(2)}
								</Text>
							</Box>
						</Stack>
					</Box>
				</Card.Body>
			</Card.Root>
			<Card.Root
				cursor='pointer'
				transition='all 0.3s'
				position='relative'
				border={paymentPlan === 4 ? '2px solid' : '1px solid'}
				borderColor={paymentPlan === 4 ? 'blue.500' : 'gray.200'}
				transform={paymentPlan === 4 ? 'scale(1.02)' : undefined}
				boxShadow={paymentPlan === 4 ? 'lg' : 'md'}
				ring={paymentPlan === 4 ? 2 : 0}
				ringColor='blue.500'
				onClick={() => handlePlanChange(4)}
				_hover={{ boxShadow: 'lg' }}
			>
				<Card.Body p={{ base: 3, md: 6 }}>
					{/* Encabezado con ícono y estado */}
					<HStack justify='space-between' mb={4}>
						<HStack gap={3}>
							<Box
								bg='blue.100'
								p={2}
								borderRadius='full'
								display={{ base: 'none', md: 'block' }}
							>
								<Icon as={FaCalendarCheck} boxSize={6} color='blue.600' />
							</Box>
							<Box>
								<Text fontWeight='semibold' color='gray.800'>
									Pago por Semestre
								</Text>
								<Text fontSize='sm' color='blue.600'>
									Flexibilidad de pago
								</Text>
							</Box>
						</HStack>

						<Box color={paymentPlan === 4 ? 'blue.500' : 'gray.300'}>
							<Icon
								as={paymentPlan === 4 ? FiCheckCircle : FaCircle}
								boxSize={6}
							/>
						</Box>
					</HStack>

					{/* Descripción */}
					<Text fontSize='sm' color='gray.600' mb={4}>
						Paga solo el semestre actual
					</Text>

					{/* Beneficios */}
					<VStack align='start' gap={2} mb={4}>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='green.500' />
							<Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
								Descuento adicional del{' '}
								{DiscountSemestreComplete?.discount_percentage * 100}%
							</Text>
						</HStack>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='green.500' />
							<Text color='gray.700'>Mayor flexibilidad</Text>
						</HStack>
						<HStack gap={2} fontSize='sm'>
							<Icon as={FiCheckCircle} boxSize={4} color='green.500' />
							<Text color='gray.700'>Sin compromisos a largo plazo</Text>
						</HStack>
					</VStack>
					<Box borderTop='1px solid' borderColor='gray.200' pt={4}>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'flex-start', md: 'center' }}
							spacing={4}
						>
							<Text fontSize='sm' color='gray.600'>
								Por semestre
							</Text>
							<Box textAlign={{ base: 'left', md: 'right' }}>
								<Text
									fontSize={{ base: 'lg', md: 'xl' }}
									fontWeight='bold'
									color='gray.800'
								>
									S/ {semesterBaseAmount?.toFixed(2)}
								</Text>
								{semesterDiscountAmount > 0 && (
									<Text fontSize='sm' color='green.600' fontWeight='medium'>
										Ahorras S/ {semesterDiscountAmount?.toFixed(2)}
									</Text>
								)}
							</Box>
						</Stack>
					</Box>
				</Card.Body>
			</Card.Root>

			<Card.Root
				border={paymentPlan === 5 ? '2px solid' : '1px solid'}
				borderColor={paymentPlan === 5 ? 'orange.500' : 'orange.200'}
				position='relative'
				cursor='pointer'
				transition='all 0.3s'
				transform={paymentPlan === 5 ? 'scale(1.05)' : 'scale(1.0)'}
				boxShadow={paymentPlan === 5 ? 'lg' : 'md'}
				ring={paymentPlan === 5 ? 2 : 0}
				ringColor='orange.500'
				onClick={() => handlePlanChange(5)}
				_hover={{ boxShadow: 'lg' }}
			>
				{/* Badge Popular */}
				{/* Badge Más Popular */}
				<Badge
					position='absolute'
					top={{ base: '-2', md: '-3' }}
					left='50%'
					transform={{
						base: 'translateX(-100%) rotate(-12deg)',
						md: 'translateX(-50%)',
					}}
					bg='orange.500'
					color='white'
					px='3'
					py='1'
					fontSize='xs'
					fontWeight='bold'
					animation='pulse 2s infinite'
					borderRadius='md'
					zIndex='1'
				>
					¡MÁS POPULAR!
				</Badge>

				{/* Badge Descuento */}
				<Badge
					position='absolute'
					top={{ base: '-1', md: '-2' }}
					right={{ base: '-6', md: '-2' }}
					bg='red.500'
					color='white'
					px='2'
					py='1'
					fontSize='xs'
					fontWeight='bold'
					transform='rotate(12deg)'
					boxShadow='lg'
					borderRadius='md'
				>
					{DiscountMasterComplete?.discount_percentage * 100}% OFF EXTRA
				</Badge>

				<Card.Body p={6}>
					{/* Encabezado */}
					<Flex justify='space-between' mb={4}>
						<Flex gap={3} align='center'>
							<Box
								p={2}
								bgGradient='linear(to-r, orange.100, red.100)'
								borderRadius='full'
								color='orange.600'
								display={{ base: 'none', md: 'block' }}
							>
								<FiZap size={24} />
							</Box>
							<Box>
								<Text fontWeight='semibold' color='gray.800'>
									Pago Completo
								</Text>
								<Text fontSize='sm' color='orange.600' fontWeight='medium'>
									¡Máximo ahorro!
								</Text>
							</Box>
						</Flex>

						<Box color={paymentPlan === 5 ? 'orange.500' : 'gray.300'}>
							{paymentPlan === 5 ? (
								<FiCheckCircle size={24} />
							) : (
								<FiCircle size={24} />
							)}
						</Box>
					</Flex>

					<Text fontSize='sm' color='gray.600' mb={4}>
						Paga toda la maestría y ahorra más
					</Text>

					{/* Beneficios */}
					<Stack gap={2} mb={4}>
						{[
							`Descuento adicional del ${DiscountMasterComplete?.discount_percentage * 100}%`,
							'Sin preocupaciones futuras',
							'Precio fijo garantizado',
							'Acceso prioritario a recursos',
						].map((benefit, idx) => (
							<Flex key={idx} align='center' gap={2} fontSize='sm'>
								<FiCheckCircle size={16} color='orange' />
								<Text color='gray.700'>{benefit}</Text>
							</Flex>
						))}
					</Stack>

					{/* Total */}
					<Box borderTop='1px' borderColor='gray.200' pt={4}>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'flex-start', md: 'center' }}
							spacing={4}
						>
							<Text fontSize='sm' color='gray.600'>
								Pago único
							</Text>
							<Box textAlign={{ base: 'left', md: 'right' }}>
								<Text
									fontSize={{ base: 'lg', md: 'xl' }}
									fontWeight='bold'
									color='gray.800'
								>
									S/ {fullProgramAmount?.toFixed(2)}
								</Text>
								{savingsProgramAmount > 0 && (
									<Text fontSize='sm' color='green.600' fontWeight='medium'>
										Ahorras S/ {savingsProgramAmount?.toFixed(2)}
									</Text>
								)}
							</Box>
						</Stack>
					</Box>

					{/* Mensaje Promocional */}
					<Box
						mt={4}
						p={{ base: 3, md: 4 }}
						bg='orange.100'
						borderRadius='lg'
						border='1px'
						borderColor='orange.200'
					>
						<Flex
							direction={{ base: 'column', sm: 'row' }}
							align={{ base: 'flex-start', sm: 'center' }}
							gap={2}
							color='orange.700'
						>
							<Box as={FiGift} size='40px' />
							<Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
								¡Oferta limitada! Descuento adicional del{' '}
								{DiscountMasterComplete?.discount_percentage * 100}% si pagas
							</Text>
						</Flex>
					</Box>
				</Card.Body>
			</Card.Root>
		</SimpleGrid>
	);
};

OptionsPlans.propTypes = {
	paymentPlan: PropTypes.number,
	handlePlanChange: PropTypes.func,
	savingsProgramAmount: PropTypes.number,
	semesterBaseAmount: PropTypes.number,
	DiscountSemestreComplete: PropTypes.object,
	fullProgramAmount: PropTypes.number,
	semesterDiscountAmount: PropTypes.number,
	DiscountMasterComplete: PropTypes.object,
	enrollmentItem: PropTypes.object,
};
