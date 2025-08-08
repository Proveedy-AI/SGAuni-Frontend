import {
	Card,
	CardBody,
	Button,
	Box,
	Flex,
	Text,
	Heading,
	SimpleGrid,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';
import { FaCalculator } from 'react-icons/fa';
import {
	FiAlertTriangle,
	FiArrowRight,
	FiBookOpen,
	FiCheck,
	FiCreditCard,
	FiInfo,
	FiRefreshCw,
} from 'react-icons/fi';

export default function FailedCoursesCard({
	totalFailedCourses,
	totalFailedCredits,
	repeatedCourses,
	handleRequestPaymentOrder,
	paymentPlan,
}) {
	return (
		<Card.Root position='relative' overflow='hidden' border='0' shadow='lg'>
			{/* Fondos decorativos */}
			<Box position='absolute' inset='0' bg='orange.50' />
			<Box
				position='absolute'
				top='0'
				right='0'
				w='32'
				h='32'
				bg='amber.100'
				borderRadius='full'
				transform='translate(4rem, -4rem)'
			/>
			<Box
				position='absolute'
				bottom='0'
				left='0'
				w='24'
				h='24'
				bg='orange.200'
				borderRadius='full'
				transform='translate(-3rem, 3rem)'
			/>

			<CardBody position='relative' p={8}>
				{/* Header */}
				<Flex align='start' gap={4} mb={6}>
					<Flex
						w={12}
						h={12}
						bg='orange.500'
						borderRadius='full'
						align='center'
						justify='center'
						shadow='lg'
						flexShrink={0}
					>
						<FiAlertTriangle className='w-6 h-6 text-white' color='white' />
					</Flex>
					<Box flex='1'>
						<Heading size='lg' color='gray.800' mb={2}>
							Pago Adicional Requerido
						</Heading>
						<Box w={20} h={1} bg='orange.500' borderRadius='full' />
					</Box>
				</Flex>

				{/* Mensaje principal */}
				<Box
					bg='whiteAlpha.700'
					backdropFilter='blur(4px)'
					borderRadius='xl'
					p={6}
					mb={6}
					border='1px'
					borderColor='amber.200'
				>
					<Flex align='start' gap={3}>
						<FiInfo className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
						<Box>
							<Text mb={3}>
								<Text as='span' fontWeight='semibold' color='amber.700'>
									Tu maestría está completamente pagada
								</Text>
								, sin embargo, hemos detectado que tienes cursos desaprobados
								que requieren repetición.
							</Text>
							<Text>
								Para poder cursar nuevamente estas materias, necesitas generar
								una orden de pago adicional correspondiente a los créditos de
								los cursos a repetir.
							</Text>
						</Box>
					</Flex>
				</Box>

				{/* Estadísticas */}
				<SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
					<StatCard
						icon={
							<FiBookOpen className='w-5 h-5 text-red-600' color='red.600' />
						}
						bg='red.100'
						value={totalFailedCourses}
						label='Cursos a repetir'
						valueColor='red.600'
					/>
					<StatCard
						icon={
							<FaCalculator
								className='w-5 h-5 text-purple-600'
								color='purple.500'
							/>
						}
						bg='purple.100'
						value={totalFailedCredits}
						label='Créditos adicionales'
						valueColor='purple.600'
					/>
					<StatCard
						icon={
							<FiCreditCard
								className='w-5 h-5 text-amber-600'
								color='amber.500'
							/>
						}
						bg='amber.100'
						value='Pago requerido'
						label='Estado'
						valueColor='amber.700'
						small
					/>
				</SimpleGrid>

				{/* Lista de cursos */}
				<Box mb={6}>
					<Heading
						size='md'
						color='gray.800'
						mb={4}
						display='flex'
						alignItems='center'
						gap={2}
					>
						<FiRefreshCw className='w-5 h-5 text-amber-600' />
						Cursos que requieren repetición
					</Heading>

					<Box display='grid' gap={3}>
						{repeatedCourses.map((course) => (
							<Box
								key={course.id}
								bg='whiteAlpha.800'
								backdropFilter='blur(4px)'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='amber.200'
							>
								<Flex justify='space-between' align='center'>
									<Flex align='center' gap={4}>
										<Box
											w={10}
											h={10}
											bg='gray.100'
											borderRadius='lg'
											display='flex'
											alignItems='center'
											justifyContent='center'
										>
											<Text fontSize='sm' fontWeight='bold' color='gray.600'>
												{course.cycle}
											</Text>
										</Box>
										<Box>
											<Text fontWeight='semibold' color='gray.800'>
												{course.course_name}
											</Text>
											<Text fontSize='sm' color='gray.500'>
												Código: {course.course_code} • Intentos:{' '}
												{course.attempts}
											</Text>
										</Box>
									</Flex>
									<Box
										as='span'
										px={3}
										py={1}
										bg='red.100'
										color='red.700'
										borderRadius='full'
										fontSize='sm'
										fontWeight='medium'
									>
										{course.credits} créditos
									</Box>
								</Flex>
							</Box>
						))}
					</Box>
				</Box>

				{/* Acción */}
				<Box
					bg='orange.50'
					p={6}
					borderRadius='xl'
					border='1px'
					borderColor='amber.200'
					textAlign='center'
					mb={6}
				>
					<Heading size='md' mb={2}>
						¿Listo para continuar?
					</Heading>
					<Text fontSize='sm' color='gray.600' mb={4}>
						Genera tu orden de pago para poder matricular los cursos que
						necesitas repetir
					</Text>

					<Button
						onClick={handleRequestPaymentOrder}
						leftIcon={
							paymentPlan === 9 ? (
								<FiCheck className='w-5 h-5' />
							) : (
								<FiCreditCard className='w-5 h-5' />
							)
						}
						rightIcon={
							paymentPlan !== 9 && <FiArrowRight className='w-4 h-4' />
						}
						bg={paymentPlan === 9 ? 'green.500' : 'orange.500'}
						_hover={
							paymentPlan === 9
								? {
										bg: 'green.600',
										transform: 'translateY(-2px)',
										shadow: 'xl',
									}
								: {
										bgGradient: 'linear(to-r, amber.600, orange.700)',
										transform: 'translateY(-2px)',
										shadow: 'xl',
									}
						}
						color='white'
						px={8}
						py={3}
						rounded='lg'
						fontWeight='medium'
						transition='all 0.2s'
						shadow='lg'
					>
						{paymentPlan === 9 ? 'Aceptado' : 'Aceptar Generar Orden de Pago'}
					</Button>

					<Text fontSize='xs' color='gray.500' mt={4}>
						El monto será calculado automáticamente basado en los{' '}
						{totalFailedCredits} créditos adicionales requeridos
					</Text>
                    <Text fontSize='xs' color='gray.500' mt={4}>
						Continua con Procesar Orden
					</Text>
				</Box>

				{/* Info adicional */}
				<Box
					bg='blue.50'
					p={4}
					borderRadius='lg'
					border='1px'
					borderColor='blue.200'
				>
					<Flex align='start' gap={2}>
						<FiInfo className='w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0' />
						<Box fontSize='sm' color='blue.700'>
							<Text fontWeight='medium' mb={1}>
								Información importante:
							</Text>
							<Text fontSize='xs'>
								• El pago de tu maestría principal ya está completo
							</Text>
							<Text fontSize='xs'>
								• Solo pagarás por los créditos de los cursos a repetir
							</Text>
							<Text fontSize='xs'>
								• Una vez realizado el pago, podrás matricular estos cursos
							</Text>
						</Box>
					</Flex>
				</Box>
			</CardBody>
		</Card.Root>
	);
}
export function StatCard({ icon, bg, value, label, valueColor, small }) {
	return (
		<Box
			bg='whiteAlpha.800'
			backdropFilter='blur(4px)'
			p={4}
			borderRadius='lg'
			border='1px'
			borderColor='amber.200'
		>
			<Flex align='center' gap={3}>
				<Box
					w={10}
					h={10}
					bg={bg}
					borderRadius='lg'
					display='flex'
					alignItems='center'
					justifyContent='center'
				>
					{icon}
				</Box>
				<Box>
					<Text
						fontSize={small ? 'sm' : '2xl'}
						fontWeight='bold'
						color={valueColor}
					>
						{value}
					</Text>
					<Text fontSize='sm' color='gray.600'>
						{label}
					</Text>
				</Box>
			</Flex>
		</Box>
	);
}

StatCard.propTypes = {
	icon: PropTypes.element.isRequired,
	bg: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.string.isRequired,
	valueColor: PropTypes.string.isRequired,
	small: PropTypes.bool,
};

FailedCoursesCard.propTypes = {
	totalFailedCourses: PropTypes.number,
	totalFailedCredits: PropTypes.number,
	repeatedCourses: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			cycle: PropTypes.string,
			course_name: PropTypes.string,
			course_code: PropTypes.string,
			attempts: PropTypes.number,
			credits: PropTypes.number,
		})
	),
	handleRequestPaymentOrder: PropTypes.func,
    paymentPlan: PropTypes.number,
};
