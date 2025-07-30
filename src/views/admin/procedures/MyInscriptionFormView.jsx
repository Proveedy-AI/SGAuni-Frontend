import { Encryptor } from "@/components/CrytoJS/Encryptor";
import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { useReadCoursesToEnroll } from "@/hooks";
import { 
  Box, 
  Heading, 
  Flex, 
  Text,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { 
  FiCheckCircle, 
  FiCalendar,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { TfiFile, TfiMenuAlt } from "react-icons/tfi";
import { useParams } from "react-router";
import { useState } from "react";
import PropTypes from "prop-types";
import { Step02ShowSchedule } from "./inscription-steps/Step02ShowSchedule";
import { Step03SummaryEnrollment } from "./inscription-steps/Step03SummaryEnrollment";
import { Step04EndEnrollmentProcess } from "./inscription-steps/Step04EndEnrollmentProcess";
import { Step01CourseList } from "./inscription-steps/Step01CourseList";
import { Button } from "@/components/ui";

const STEPS = [
  {
    id: 1,
    title: 'Lista cursos',
    icon: TfiMenuAlt,
  },
  {
    id: 2,
    title: 'Horarios',
    icon: FiCalendar,
  },
  {
    id: 3,
    title: 'Resumen',
    icon: TfiFile,
  },
  {
    id: 4,
    title: 'Finalizar',
    icon: FiCheckCircle
  }
];

// Componente para el stepper
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <HStack justify="center" spacing={8} mb={8}>
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <VStack key={step.id} spacing={2}>
            <Box
              w={12}
              h={12}
              borderRadius="full"
              bg={isActive ? "green.500" : isCompleted ? "gray.300" : "gray.100"}
              color={isActive ? "white" : "gray.600"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={isActive ? "none" : "2px solid"}
              borderColor="gray.300"
            >
              <Icon as={step.icon} boxSize={5} />
            </Box>
            <Text fontSize="sm" fontWeight={isActive ? "bold" : "normal"} color={isActive ? "green.600" : "gray.600"}>
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
  currentStep: PropTypes.number.isRequired
};


export const MyInscriptionFormView = () => {
  const { id } = useParams(); //id de la matrícula (enrollment)
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  // Estados del componente
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const {
    data: coursesToEnroll,
    isLoading: isLoadingCoursesToEnroll
  } = useReadCoursesToEnroll(
    decrypted, //programa asociado
    { status:  1 }, //Todos los que están disponibles
    { enabled: !!decrypted }
  );
  
  // Para testing usamos data local, después se puede usar coursesToEnroll del hook
  console.log('coursesToEnroll from API:', coursesToEnroll);
  console.log('isLoading:', isLoadingCoursesToEnroll);

  // Simulación de cursos para matricularse según criterios
  const localCoursesToEnroll = [
    {
      id: 1,
      name: "Matemática Básica",
      cycle: "1",
      credits: 3,
      failedPreviously: false,
      status: 1,
      status_display: "habilitado",
      groups: [
        {
          id: 1,
          course_group: 3,
          course_group_code: "A1",
          teacher: "Prof. Juan Pérez",
          day_of_week: 1,
          start_time: "08:00:00",
          end_time: "10:00:00",
        },
        {
          id: 2,
          course_group: 3,
          course_group_code: "A2",
          teacher: "Prof. Ana Gómez",
          day_of_week: 2,
          start_time: "14:00:00",
          end_time: "16:00:00",
        },
      ]
    },
    {
      id: 2,
      name: "Química General I",
      cycle: "1",
      credits: 2,
      failedPreviously: false,
      status: 1,
      status_display: "habilitado",
      groups: [
        {
          id: 3,
          course_group: 4,
          course_group_code: "B1",
          teacher: "Prof. Luis Fernández",
          day_of_week: 3,
          start_time: "10:00:00",
          end_time: "12:00:00",
        },
        {
          id: 4,
          course_group: 4,
          course_group_code: "B2",
          teacher: "Prof. María López",
          day_of_week: 4,
          start_time: "16:00:00",
          end_time: "18:00:00",
        },
      ]
    },
    {
      id: 3,
      name: "Programación I",
      cycle: "1",
      credits: 4,
      failedPreviously: false,
      status: 1,
      status_display: "habilitado",
      groups: [
        {
          id: 5,
          course_group: 5,
          course_group_code: "C1",
          teacher: "Prof. Carlos Ruiz",
          day_of_week: 1,
          start_time: "08:00:00",
          end_time: "10:00:00",
        },
        {
          id: 6,
          course_group: 5,
          course_group_code: "C2",
          teacher: "Prof. Laura Torres",
          day_of_week: 5,
          start_time: "14:00:00",
          end_time: "16:00:00",
        },
      ]      
    },
    {
      id: 4,
      name: "Cálculo I",
      cycle: "1",
      credits: 3,
      failedPreviously: false,
      status: 1,
      status_display: "habilitado",
      groups: [
        {
          id: 7,
          course_group: 6,
          course_group_code: "D1",
          teacher: "Prof. Andrés Martínez",
          day_of_week: 3,
          start_time: "10:00:00",
          end_time: "12:00:00",
        },
        {
          id: 8,
          course_group: 6,
          course_group_code: "D2",
          teacher: "Prof. Elena Sánchez",
          day_of_week: 3,
          start_time: "16:00:00",
          end_time: "18:00:00",
        },
      ]
    }
  ];

  // Handlers
  const handleSelectGroup = (group, course, action) => {
    if (action === 'add') {
      const newSelection = {
        ...group,
        courseName: course.name,
        courseId: course.id,
        credits: course.credits,
      };
      setSelectedGroups(prev => [...prev, newSelection]);
    } else if (action === 'remove') {
      setSelectedGroups(prev => prev.filter(sg => sg.id !== group.id));
    }
  };

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
      <ResponsiveBreadcrumb
        items={[
          { label: 'Trámites', to: '/myprocedures' },
          { label: 'Proceso de matrícula', to: '/myprocedures/enrollment-process' },
          { label: id ? id : 'Cargando...' },
        ]}
      />

      <Box textAlign="center" py={6}>
        <Heading as="h1" size="lg" mb={2}>
          Proceso de Matrícula
        </Heading>
      </Box>

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Box>
        {currentStep === 1 && (
          <Step01CourseList
            courses={localCoursesToEnroll}
            selectedGroups={selectedGroups}
            onSelectGroup={handleSelectGroup}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
        )}

        {currentStep === 2 && (
          <Step02ShowSchedule selectedGroups={selectedGroups} />
        )}

        {currentStep === 3 && (
          <Step03SummaryEnrollment
            selectedGroups={selectedGroups}
            onBack={() => setCurrentStep(currentStep - 1)}
            onNext={() => setCurrentStep(currentStep + 1)} 
          />
        )}

        {currentStep === 4 && (
          <Step04EndEnrollmentProcess />
        )}
      </Box>

      {(currentStep === 1 || currentStep === 2) && (

        <Flex justify="space-between" mt={8} pt={6} borderTop="1px solid" borderColor="gray.200">
        <Button
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => {setCurrentStep(currentStep - 1);}}
          >
          <FiArrowLeft /> Anterior
        </Button>
        
        <Button
          bg="blue.600"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={selectedGroups.length === 0}
          >
          Siguiente <FiArrowRight />
        </Button>
      </Flex>
    )}
    </Box>
  );
};
