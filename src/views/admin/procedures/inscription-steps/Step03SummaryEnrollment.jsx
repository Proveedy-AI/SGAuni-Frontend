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
	Center,
} from '@chakra-ui/react';
import {
	FiAlertCircle,
	FiArrowLeft,
	FiArrowRight,
	FiBookOpen,
	FiCheckCircle,
	FiClock,
	FiCreditCard,
} from 'react-icons/fi';
import { Button, toaster } from '@/components/ui';
import { ProcessEnrollmentModal } from '@/components/modals/procedures/ProcessEnrollmentModal';
import TuitionSummaryCard from '@/components/modals/tuition/TuitionSummaryCard';
import {
	useReadMyBenefits,
	useReadMyCredits,
	useReadPaymentRules,
} from '@/hooks';
import { useReadGraduateUni } from '@/hooks/person/useReadGraduateUni';
import { useEffect, useState } from 'react';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { OptionsPlans } from './OptionsPlans';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useConfirmCourseSelection } from '@/hooks/course-selections';
import { LuGraduationCap } from 'react-icons/lu';
import { HiSparkles } from 'react-icons/hi2';

export const Step03SummaryEnrollment = ({
	selectedGroups,
	onBack,
	onNext,
	isSomeRequestPending,
}) => {
	// Calcular totales
	const [paymentPlan, setPaymentPlan] = useState(0);
	const [discountValue, setDiscountValue] = useState('');
	const [description, setDescription] = useState('');
	const [enrollmentItem, setEnrollmentItem] = useState(null);

	const { data: studentScholarships } = useReadMyBenefits();
	const { data: globalDiscountsRaw } = useReadGraduateUni();
	const { data: MyCredits } = useReadMyCredits();
	const { data: dataUser } = useReadUserLogged();
	const { data: PaymentRules } = useReadPaymentRules({});

	const { mutate: confirmCourses } = useConfirmCourseSelection();
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
		semesterBaseAmount * DiscountSemestreComplete?.discount_percentage;
	const savingsProgramAmount =
		fullProgramAmount * DiscountMasterComplete?.discount_percentage;

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

	const handleConfirmEnrollment = () => {
		confirmCourses({
			onSuccess: () => {
				toaster.create({
					title: 'Matricula confirmada exitosamente',
					type: 'success',
				});
				onNext();
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
	};

	const handlePlanChange = (plan) => {
		setPaymentPlan(plan);
	};
	// Color modes

	useEffect(() => {
		const stored = EncryptedStorage.load('selectedEnrollmentProccess');
		setEnrollmentItem(stored);
	}, []);

	return (
		<VStack
			gap={6}
			align='stretch'
			maxW={{ base: 'full', md: '80%' }}
			mx='auto'
		>
			{isSomeRequestPending ? (
				<Card.Root position='relative' overflow='hidden' border='0' shadow='lg'>
					{/* Fondos decorativos */}
					<Box position='absolute' inset='0' bg='orange.50' zIndex={0} />
					<Box
						position='absolute'
						top='0'
						right='0'
						w='8rem'
						h='8rem'
						bg='orange.200'
						rounded='full'
						transform='translate(4rem, -4rem)'
						zIndex={0}
					/>
					<Box
						position='absolute'
						bottom='0'
						left='0'
						w='6rem'
						h='6rem'
						bg='alpha(orange.200, 0.3)'
						rounded='full'
						transform='translate(-3rem, 3rem)'
						zIndex={0}
					/>

					<Card.Body position='relative' p={8} zIndex={1}>
						<VStack spacing={6} textAlign='center'>
							{/* Icono principal */}
							<Box position='relative'>
								<Box
									w={20}
									h={20}
									rounded='full'
									bg='orange.500'
									display='flex'
									alignItems='center'
									justifyContent='center'
									shadow='lg'
								>
									<FiClock size={40} color='white' />
								</Box>
								<Box
									position='absolute'
									top={-1}
									right={-1}
									w={6}
									h={6}
									bg='orange.500'
									rounded='full'
									display='flex'
									alignItems='center'
									justifyContent='center'
								>
									<FiAlertCircle size={16} color='white' />
								</Box>
							</Box>

							{/* Contenido principal */}
							<VStack spacing={4} maxW='md'>
								<VStack spacing={2}>
									<HStack justify='center' spacing={2}>
										<FiCreditCard size={24} color='#F97316' />
										<Heading size='md' color='gray.800'>
											Solicitud en proceso
										</Heading>
									</HStack>
									<Box
										w={16}
										h={1}
										rounded='full'
										bgGradient='linear(to-r, orange.400, amber.500)'
									/>
								</VStack>

								<VStack spacing={1}>
									<Text color='gray.600'>
										Ya has iniciado una solicitud de pago que está pendiente de
										completar.
									</Text>
									<Text color='gray.600'>
										Finaliza el proceso o espera a que sea procesado antes de
										elegir un nuevo plan.
									</Text>
								</VStack>
							</VStack>
						</VStack>
					</Card.Body>
				</Card.Root>
			) : selectedGroups?.paid_complete_master ? (
				<Card.Root
					position='relative'
					overflow='hidden'
					border='0'
					boxShadow='lg'
				>
					{/* Fondos decorativos */}
					<Box position='absolute' inset='0' bg='green.50' />
					<Box
						position='absolute'
						top='-20'
						right='-20'
						w='40'
						h='40'
						bg='green.200'
						opacity={0.3}
						rounded='full'
					/>
					<Box
						position='absolute'
						bottom='-16'
						left='-16'
						w='32'
						h='32'
						bg='emerald.200'
						opacity={0.2}
						rounded='full'
					/>

					{/* Iconos decorativos */}
					<Box position='absolute' top='4' left='4'>
						<Icon
							as={HiSparkles}
							boxSize={6}
							color='green.300'
							className='animate-pulse'
						/>
					</Box>
					<Box position='absolute' top='8' right='8'>
						<Icon
							as={HiSparkles}
							boxSize={4}
							color='emerald.300'
							className='animate-pulse'
						/>
					</Box>

					<Card.Body position='relative' p={8}>
						<VStack spacing={6} align='center' textAlign='center'>
							{/* Icono principal */}
							<Box position='relative'>
								<Center w='20' h='20' bg='green.400' rounded='full' shadow='lg'>
									<Icon as={LuGraduationCap} boxSize={10} color='white' />
								</Center>
								<Center
									position='absolute'
									top={-1}
									right={-1}
									w='6'
									h='6'
									bg='green.500'
									rounded='full'
								>
									<Icon as={FiCheckCircle} boxSize={4} color='white' />
								</Center>
							</Box>

							{/* Texto principal */}
							<Stack spacing={4} maxW='md'>
								<Box>
									<Heading
										size='md'
										color='gray.800'
										display='flex'
										alignItems='center'
										justifyContent='center'
										gap={2}
									>
										<Icon as={FiCheckCircle} boxSize={6} color='green.500' />
										Maestría pagada completamente
									</Heading>
									<Box
										w='20'
										h='1'
										bgGradient='linear(to-r, emerald.400, green.500)'
										rounded='full'
										mx='auto'
										mt={2}
									/>
								</Box>

								<Text fontSize='sm' color='gray.600'>
									Ya realizaste el pago completo de la maestría. No necesitas
									generar nuevas solicitudes de pago.
								</Text>
								<Text fontSize='sm' color='gray.600'>
									Puedes continuar con tu matrícula sin inconvenientes.
								</Text>

								<Badge
									colorPalette='green'
									rounded='full'
									px={4}
									py={1}
									fontSize='sm'
									fontWeight='medium'
									alignSelf='center'
								>
									<Icon as={FiCheckCircle} boxSize={4} mr={1} />
									Pago completado
								</Badge>
							</Stack>
						</VStack>
					</Card.Body>
				</Card.Root>
			) : discountValue >= 100 ? (
				<Card.Root
					position='relative'
					overflow='hidden'
					border='0'
					boxShadow='lg'
				>
					{/* Fondos decorativos */}
					<Box position='absolute' inset='0' bg='green.50' />
					<Box
						position='absolute'
						top='-20'
						right='-20'
						w='40'
						h='40'
						bg='green.200'
						opacity={0.3}
						rounded='full'
					/>
					<Box
						position='absolute'
						bottom='-16'
						left='-16'
						w='32'
						h='32'
						bg='emerald.200'
						opacity={0.2}
						rounded='full'
					/>

					{/* Iconos decorativos */}
					<Box position='absolute' top='4' left='4'>
						<Icon
							as={HiSparkles}
							boxSize={6}
							color='green.300'
							className='animate-pulse'
						/>
					</Box>
					<Box position='absolute' top='8' right='8'>
						<Icon
							as={HiSparkles}
							boxSize={4}
							color='emerald.300'
							className='animate-pulse'
						/>
					</Box>

					<Card.Body position='relative' p={8}>
						<VStack spacing={6} align='center' textAlign='center'>
							{/* Icono principal */}
							<Box position='relative'>
								<Center w='20' h='20' bg='green.400' rounded='full' shadow='lg'>
									<Icon as={LuGraduationCap} boxSize={10} color='white' />
								</Center>
								<Center
									position='absolute'
									top={-1}
									right={-1}
									w='6'
									h='6'
									bg='green.500'
									rounded='full'
								>
									<Icon as={FiCheckCircle} boxSize={4} color='white' />
								</Center>
							</Box>

							{/* Texto principal */}
							<Stack spacing={4} maxW='md'>
								<Box>
									<Heading
										size='md'
										color='gray.800'
										display='flex'
										alignItems='center'
										justifyContent='center'
										gap={2}
									>
										<Icon as={FiCheckCircle} boxSize={6} color='green.500' />
										Beca completa Asignada
									</Heading>
									<Box
										w='20'
										h='1'
										bgGradient='linear(to-r, emerald.400, green.500)'
										rounded='full'
										mx='auto'
										mt={2}
									/>
								</Box>

								<Text fontSize='sm' color='gray.600'>
									Se le ha asignado una beca completa para su matrícula. No
									necesita generar nuevas solicitudes de pago.
								</Text>
								<Text fontSize='sm' color='gray.600'>
									Puedes continuar con tu matrícula sin inconvenientes.
								</Text>

								<Badge
									colorPalette='green'
									rounded='full'
									px={4}
									py={1}
									fontSize='sm'
									fontWeight='medium'
									alignSelf='center'
								>
									<Icon as={FiCheckCircle} boxSize={4} mr={1} />
									Beca completa Asignada
								</Badge>
							</Stack>
						</VStack>
					</Card.Body>
				</Card.Root>
			) : (
				<Card.Root bg={'blue.50'} border='1px solid' borderColor='blue.200'>
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
							<OptionsPlans
								enrollmentItem={enrollmentItem}
								paymentPlan={paymentPlan}
								handlePlanChange={handlePlanChange}
								semesterDiscountAmount={semesterDiscountAmount}
								semesterBaseAmount={semesterBaseAmount}
								savingsProgramAmount={savingsProgramAmount}
								DiscountSemestreComplete={DiscountSemestreComplete}
								fullProgramAmount={fullProgramAmount}
								DiscountMasterComplete={DiscountMasterComplete}
							/>
						</VStack>
					</Card.Body>
				</Card.Root>
			)}
			{(paymentPlan === 4 || paymentPlan === 999) && (
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

			{(paymentPlan === 4 || paymentPlan === 5 || paymentPlan === 999) && (
				<TuitionSummaryCard
					title={
						paymentPlan === 4
							? 'Pago por Semestre'
							: paymentPlan === 5
								? 'Pago por Maestría'
								: 'Pago en Armadas'
					}
					credits={
						paymentPlan === 4
							? totalCredits
							: paymentPlan === 5
								? MyCredits?.total_credits
								: totalCredits
					}
					pricePerCredit={parseFloat(PriceCreditsToPay)}
					discounts={discounts}
					setDiscountValue={setDiscountValue}
					setDescription={setDescription}
				/>
			)}

			<Flex justify='space-between' pt={4}>
				<Button
					variant='outline'
					leftIcon={<Icon as={FiArrowLeft} />}
					onClick={onBack}
				>
					Regresar
				</Button>
				{isSomeRequestPending && (
					<Button colorPalette='blue' onClick={onNext}>
						Siguiente <Icon as={FiArrowRight} />
					</Button>
				)}
				{(selectedGroups?.paid_complete_master || discountValue >= 100) && (
					<Button colorPalette='blue' onClick={handleConfirmEnrollment}>
						Procesar Matricula <Icon as={FiArrowRight} />
					</Button>
				)}

				{!isSomeRequestPending && !selectedGroups?.paid_complete_master && (
					<ProcessEnrollmentModal
						paymentPlan={paymentPlan}
						discountValue={discountValue}
						baseAmount={baseAmount}
						amountCredits={
							paymentPlan === 4 ? totalCredits : MyCredits?.total_credits
						}
						description={description}
						onNext={onNext}
						enrollmentItem={enrollmentItem}
					/>
				)}
			</Flex>
		</VStack>
	);
};

Step03SummaryEnrollment.propTypes = {
	selectedGroups: PropTypes.object,
	onBack: PropTypes.func,
	onNext: PropTypes.func,
	isSomeRequestPending: PropTypes.bool,
};
