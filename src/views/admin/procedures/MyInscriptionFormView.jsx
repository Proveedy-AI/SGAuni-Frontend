import { Encryptor } from '@/components/CrytoJS/Encryptor';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import {
	Box,
	Heading,
	Flex,
	Text,
	HStack,
	VStack,
	Icon,
} from '@chakra-ui/react';
import {
	FiCheckCircle,
	FiCalendar,
	FiArrowLeft,
	FiArrowRight,
} from 'react-icons/fi';
import { TfiFile, TfiMenuAlt } from 'react-icons/tfi';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Step02ShowSchedule } from './inscription-steps/Step02ShowSchedule';
import { Step03SummaryEnrollment } from './inscription-steps/Step03SummaryEnrollment';
import { Step04EndEnrollmentProcess } from './inscription-steps/Step04EndEnrollmentProcess';
import { Step01CourseList } from './inscription-steps/Step01CourseList';
import { Button } from '@/components/ui';
import {
	useReadAvailableCourses,
	useReadMySelections,
} from '@/hooks/course-selections';
import { useReadMyPaymentRequest } from '@/hooks/payment_requests';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';

const STEPS = [
	{
		id: 1,
		title: 'Cursos',
		icon: TfiMenuAlt,
	},
	{
		id: 2,
		title: 'Horarios',
		icon: FiCalendar,
	},
	{
		id: 3,
		title: 'Pago',
		icon: TfiFile,
	},
	{
		id: 4,
		title: 'Finalizar',
		icon: FiCheckCircle,
	},
];

// Componente para el stepper
const StepIndicator = ({ steps, currentStep }) => {
	return (
		<HStack justify='center' gap={8} mb={8}>
			{steps.map((step) => {
				const isActive = step.id === currentStep;
				const isCompleted = step.id < currentStep;

				return (
					<VStack key={step.id} spacing={2}>
						<Box
							w={12}
							h={12}
							borderRadius='full'
							bg={
								isActive ? 'green.500' : isCompleted ? 'gray.300' : 'gray.100'
							}
							color={isActive ? 'white' : 'gray.600'}
							display='flex'
							alignItems='center'
							justifyContent='center'
							border={isActive ? 'none' : '2px solid'}
							borderColor='gray.300'
						>
							<Icon as={step.icon} boxSize={5} />
						</Box>
						<Text
							fontSize='sm'
							fontWeight={isActive ? 'bold' : 'normal'}
							color={isActive ? 'green.600' : 'gray.600'}
						>
							{step.title}
						</Text>
					</VStack>
				);
			})}
		</HStack>
	);
};

StepIndicator.propTypes = {
	steps: PropTypes.array.isRequired,
	currentStep: PropTypes.number.isRequired,
};

export const MyInscriptionFormView = () => {
	const { id } = useParams(); //id de la matrícula (enrollment)
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const [enrollmentItem, setEnrollmentItem] = useState(null);
	const { data: PaymentRequest } = useReadMyPaymentRequest();

	const masterRequest = PaymentRequest?.find(
		(req) => req.enrollment === enrollmentItem?.id && req.purpose === 5
	);

	const semesterRequest = PaymentRequest?.find(
		(req) => req.enrollment === enrollmentItem?.id && req.purpose === 4
	);

	const isSomeRequestPending = [masterRequest, semesterRequest].some(
		(req) => req?.status === 1 || req?.status === 2
	);

	useEffect(() => {
		const stored = EncryptedStorage.load('selectedEnrollmentProccess');
		setEnrollmentItem(stored);
	}, []);

	const [currentStep, setCurrentStep] = useState(1);
	const [selectedCourse, setSelectedCourse] = useState(null);

  const currentEnrollment = EncryptedStorage.load('selectedEnrollmentProccess');

	const { data: coursesToEnroll, isLoading: isLoadingCoursesToEnroll } =
		useReadAvailableCourses(
      currentEnrollment?.uuid,
      {},
      {}
    );

	const {
		data: mySelections,
		isLoading: isLoadingMySelections,
		refetch: refetchMySelections,
	} = useReadMySelections(
    currentEnrollment?.uuid,
    {},
    {}
  );

	// Loading state
	if (isLoadingCoursesToEnroll || isLoadingMySelections) {
		return (
			<Box textAlign='center' py={10}>
				<Text>Cargando...</Text>
			</Box>
		);
	}
	console.log(decrypted);
	// Handlers
	const handleRefreshSelections = () => {
		refetchMySelections();
	};

	return (
		<Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Trámites', to: '/myprocedures' },
					{
						label: 'Proceso de matrícula',
						to: '/myprocedures/enrollment-process',
					},
					{ label: id ? id : 'Cargando...' },
				]}
			/>

			<Box textAlign='center' py={6}>
				<Heading as='h1' size='lg' mb={2}>
					Proceso de Matrícula
				</Heading>
			</Box>

			<StepIndicator steps={STEPS} currentStep={currentStep} />

			{(currentStep === 1 || currentStep === 2) && (
				<Flex
					justify='space-between'
					mt={8}
					py={6}
					borderY='1px solid'
					borderColor='gray.200'
				>
					<Button
						variant='outline'
						disabled={currentStep === 1}
						onClick={() => {
							setCurrentStep(currentStep - 1);
						}}
					>
						<FiArrowLeft /> Anterior
					</Button>

					<Button
						bg='blue.600'
						onClick={() => setCurrentStep(currentStep + 1)}
						disabled={!mySelections || mySelections.selections.length === 0}
					>
						Siguiente <FiArrowRight />
					</Button>
				</Flex>
			)}

			<Box>
				{currentStep === 1 && (
					<Step01CourseList
						currentEnrollment={currentEnrollment}
						courses={coursesToEnroll?.available_courses}
						mySelections={mySelections?.selections}
						selectedCourse={selectedCourse}
						setSelectedCourse={setSelectedCourse}
						onRefreshSelections={handleRefreshSelections}
						isSomeRequestPending={isSomeRequestPending}
					/>
				)}

				{currentStep === 2 && (
					<Step02ShowSchedule selectedGroups={mySelections?.selections} />
				)}

				{currentStep === 3 && (
					<Step03SummaryEnrollment
            currentEnrollment={currentEnrollment}
						isSomeRequestPending={isSomeRequestPending}
						selectedGroups={mySelections}
						onBack={() => setCurrentStep(currentStep - 1)}
						onNext={() => setCurrentStep(currentStep + 1)}
					/>
				)}

				{currentStep === 4 && (
					<Step04EndEnrollmentProcess
						currentEnrollment={currentEnrollment}
						step={currentStep}
						mySelections={mySelections?.selections}
					/>
				)}
			</Box>
		</Box>
	);
};
