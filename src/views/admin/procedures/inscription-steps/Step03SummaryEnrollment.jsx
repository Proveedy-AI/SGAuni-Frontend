import PropTypes from 'prop-types';
import {
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Flex,
	Icon,
	Card,
	Badge,
	Stack,
	SimpleGrid,
} from '@chakra-ui/react';
import {
	FiArrowLeft,
	FiBookOpen,
	FiCheckCircle,
	FiCircle,
	FiGift,
	FiZap,
} from 'react-icons/fi';
import { Button } from '@/components/ui';
import { LuCircleAlert } from 'react-icons/lu';
import { ProcessEnrollmentModal } from '@/components/modals/procedures/ProcessEnrollmentModal';
import TuitionSummaryCard from '@/components/modals/tuition/TuitionSummaryCard';
import {
	useReadMyBenefits,
	useReadMyCredits,
	useReadPaymentRules,
} from '@/hooks';
import { useReadGraduateUni } from '@/hooks/person/useReadGraduateUni';
import { useState } from 'react';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { FaCalendarCheck, FaCircle } from 'react-icons/fa';

export const Step03SummaryEnrollment = ({ selectedGroups, onBack }) => {
	// Calcular totales
	const [paymentPlan, setPaymentPlan] = useState(4);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [numDocCarpeta, setnumDocCarpeta] = useState('');
	const [amountValue, setAmountValue] = useState('');
	const [discountValue, setDiscountValue] = useState('');

	const [description, setDescription] = useState('');
	const [isSelectCaja, setisSelectCaja] = useState(false);
	const { data: studentScholarships } = useReadMyBenefits();
	const { data: globalDiscountsRaw } = useReadGraduateUni();
	const { data: MyCredits } = useReadMyCredits();
	const { data: dataUser } = useReadUserLogged();
	const { data: PaymentRules } = useReadPaymentRules({});
	const totalCourses = selectedGroups?.total_selections;
	// Calcular créditos totales (asumiendo que cada curso tiene una propiedad credits)
	const totalCredits = Array.isArray(selectedGroups?.selections)
		? selectedGroups.selections.reduce((sum, course) => {
				return sum + (course.credits || 0);
			}, 0)
		: 0;
	const DiscountMasterComplete = PaymentRules?.results?.find(
		(rule) => rule.payment_purpose === 5
	);
	const DiscountSemestreComplete = PaymentRules?.results?.find(
		(rule) => rule.payment_purpose === 4
	);

	const PriceCreditsToPay = selectedGroups?.price_credit;
	const semesterBaseAmount = totalCredits * PriceCreditsToPay;
	const fullProgramAmount = MyCredits?.total_credits * PriceCreditsToPay;

	const semesterDiscountAmount =
		semesterBaseAmount * DiscountSemestreComplete.discount_percentage;
	const savingsProgramAmount =
		fullProgramAmount * DiscountMasterComplete.discount_percentage;

	const baseAmount = paymentPlan === 4 ? semesterBaseAmount : fullProgramAmount;

	const totalWeeklyHours = Array.isArray(selectedGroups?.selections)
		? selectedGroups.selections.reduce((sum, course) => {
				if (Array.isArray(course.schedule)) {
					return (
						sum +
						course.schedule.reduce((schSum, sch) => {
							const start = Number.parseInt(sch?.start_time?.split(':')[0]);
							const end = Number.parseInt(sch?.end_time?.split(':')[0]);
							return schSum + (end && start ? end - start : 0);
						}, 0)
					);
				}
				return sum;
			}, 0)
		: 0;

	const rawDiscounts = globalDiscountsRaw ?? {};
	const globalDiscounts = Object.values(rawDiscounts)
		.map((item) => {
			if (typeof item === 'string') {
				try {
					return JSON.parse(item);
				} catch (e) {
					console.error('Error parseando descuento global:', item, e);
					return null;
				}
			}
			return item;
		})
		.filter(Boolean);

	const currentRule = PaymentRules?.results?.find(
		(rule) => rule.payment_purpose === paymentPlan
	);

	const discounts = [
		// 1. Global Discounts válidos para los propósitos seleccionados
		...(Array.isArray(globalDiscounts)
			? globalDiscounts
					.filter(
						(d) =>
							Array.isArray(d.purposeToGlobalDiscountId) &&
							d.purposeToGlobalDiscountId.includes(paymentPlan)
					)
					.filter((d) => !d.requireGraduate || dataUser?.is_uni_graduate)
					.map((d) => ({
						id: `global-${d.id}`,
						label: d.label,
						percentage: Number(d.percentage * 100),
					}))
			: []),
		// 2. Becas válidas para los propósitos seleccionados
		...(Array.isArray(studentScholarships)
			? studentScholarships.map((s) => ({
					id: `scholarship-${s.id}`,
					label: s.label,
					percentage: s.percentage * 100,
				}))
			: []),

		// 3. Descuento de la regla de pago
		...(currentRule?.discount_percentage
			? [
					{
						id: `rule-${currentRule.payment_purpose}`,
						label: `Descuento por pago completo `,
						percentage: currentRule.discount_percentage * 100,
					},
				]
			: []),
	];

	const handlePlanChange = (plan) => {
		setPaymentPlan(plan);
	};
	// Color modes

	return (
		<VStack
			gap={6}
			align='stretch'
			maxW={{ base: 'full', md: '80%' }}
			mx='auto'
		>
			<Card.Root
				bgGradient={'purple.100'}
				border='1px solid'
				borderColor='blue.200'
			>
				<Card.Body p={6}>
					<VStack gap={6}>
						{/* Encabezado */}
						<Box textAlign='center'>
							<Heading size='md' mb={2}>
								Elige tu Plan de Pago
							</Heading>
							<Text fontSize='sm' color='gray.600'>
								Selecciona la opción que mejor se adapte a tus necesidades
							</Text>
						</Box>

						{/* Opciones de Planes */}
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
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
											<Box bg='blue.100' p={2} borderRadius='full'>
												<Icon
													as={FaCalendarCheck}
													boxSize={6}
													color='blue.600'
												/>
											</Box>
											<Box>
												<Text fontWeight='semibold' color='gray.800'>
													Pago por Semestre
												</Text>
												<Text fontSize='sm' color='gray.600'>
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
											<Text
												fontSize={{ base: 'sm', md: 'md' }}
												fontWeight='medium'
											>
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
											<Text color='gray.700'>
												Sin compromisos a largo plazo
											</Text>
										</HStack>
									</VStack>
									<Box borderTop='1px solid' borderColor='gray.200' pt={4}>
										<HStack justify='space-between'>
											<Text fontSize='sm' color='gray.600'>
												Por semestre
											</Text>
											<Box textAlign='right'>
												<Text fontSize='xl' fontWeight='bold' color='gray.800'>
													S/ {semesterBaseAmount.toFixed(2)}
												</Text>
												{semesterDiscountAmount > 0 && (
													<Text
														fontSize='sm'
														color='green.600'
														fontWeight='medium'
													>
														Ahorras S/ {semesterDiscountAmount.toFixed(2)}
													</Text>
												)}
											</Box>
										</HStack>
									</Box>
								</Card.Body>
							</Card.Root>

							<Card.Root
								border='1px solid'
								borderColor='orange.200'
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
								<Badge
									position='absolute'
									top='-3'
									left='50%'
									transform='translateX(-50%)'
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
									top='-2'
									right='-2'
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
											>
												<FiZap size={24} />
											</Box>
											<Box>
												<Text fontWeight='semibold' color='gray.800'>
													Pago Completo
												</Text>
												<Text
													fontSize='sm'
													color='orange.600'
													fontWeight='medium'
												>
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
										<Flex justify='space-between' align='center'>
											<Text fontSize='sm' color='gray.600'>
												Pago único
											</Text>
											<Box textAlign='right'>
												<Text fontSize='xl' fontWeight='bold' color='gray.800'>
													S/ {fullProgramAmount.toFixed(2)}
												</Text>
												{savingsProgramAmount > 0 && (
													<Text
														fontSize='sm'
														color='green.600'
														fontWeight='medium'
													>
														Ahorras S/ {savingsProgramAmount.toFixed(2)}
													</Text>
												)}
											</Box>
										</Flex>
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
											<Box as={FiGift} size='16px' />
											<Text
												fontSize={{ base: 'sm', md: 'md' }}
												fontWeight='medium'
											>
												¡Oferta limitada! Descuento adicional del{' '}
												{DiscountMasterComplete?.discount_percentage * 100}% si
												pagas
											</Text>
										</Flex>
									</Box>
								</Card.Body>
							</Card.Root>
						</SimpleGrid>
					</VStack>
				</Card.Body>
			</Card.Root>
			{paymentPlan === 4 && (
				<Card.Root
					bg='blue.100'
					border='1px solid'
					borderColor='blue.200'
					borderRadius='xl'
				>
					<Card.Header pb={2}>
						<Flex align='center' gap={2} color='blue.800'>
							<Icon as={FiBookOpen} boxSize={5} />
							<Heading fontSize={{ base: 'sm', md: 'lg' }}>
								Resumen de Selección
							</Heading>
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
						<VStack gap={2} align='stretch'>
							<HStack justify='space-between'>
								<Text fontSize='md' color='gray.600'>
									Cursos seleccionados
								</Text>
								<Box
									bg='white'
									color='blue.600'
									px={2}
									py={1}
									rounded='md'
									fontWeight='bold'
									minW='40px'
									textAlign='center'
								>
									{totalCourses}
								</Box>
							</HStack>

							<HStack justify='space-between'>
								<Text fontSize='md' color='gray.600'>
									Créditos Totales
								</Text>
								<Box
									bg='white'
									color='blue.600'
									px={3}
									py={1}
									rounded='md'
									fontWeight='bold'
									minW='40px'
									textAlign='center'
								>
									{totalCredits}
								</Box>
							</HStack>

							<HStack justify='space-between'>
								<Text fontSize='md' color='gray.600'>
									Horas semanales
								</Text>
								<Box
									bg='white'
									color='blue.600'
									px={3}
									py={1}
									rounded='md'
									fontWeight='bold'
									minW='40px'
									textAlign='center'
								>
									{totalWeeklyHours}h
								</Box>
							</HStack>
						</VStack>
					</Card.Body>
				</Card.Root>
			)}

			<TuitionSummaryCard
				title={paymentPlan === 4 ? 'Pago por Semestre' : 'Pago por Maestría'}
				credits={paymentPlan === 4 ? totalCredits : MyCredits?.total_credits}
				pricePerCredit={parseFloat(PriceCreditsToPay)}
				discounts={discounts}
				setDiscountValue={setDiscountValue}
				setDescription={setDescription}
			/>
			<Flex
				mt={24}
				bg={'#FFF1CB'}
				py={4}
				px={4}
				border={'1px'}
				borderRadius={'lg'}
				align='center'
				justify={'center'}
				gap={3}
				borderColor='#FFC830'
			>
				<Icon as={LuCircleAlert} color={'#F86A1E'} boxSize={6} />
				<Text maxW={'75%'}>
					Importante: Para culminar es necesario seleccionar el botón
					&quot;Procesar matrícula&quot;
				</Text>
			</Flex>

			<Flex justify='space-between' pt={4}>
				<Button
					variant='outline'
					leftIcon={<Icon as={FiArrowLeft} />}
					onClick={onBack}
				>
					Regresar
				</Button>

				<ProcessEnrollmentModal
					triggerButton={<Button colorScheme='blue'>Procesar matrícula</Button>}
					onNext={() => {}}
				/>
			</Flex>
		</VStack>
	);
};

Step03SummaryEnrollment.propTypes = {
	selectedGroups: PropTypes.array,
	onBack: PropTypes.func,
};
