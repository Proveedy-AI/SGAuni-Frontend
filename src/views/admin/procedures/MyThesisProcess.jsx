import { Alert } from '@/components/ui';
import { 
  Badge, 
  Box, 
  Heading, 
  HStack, 
  Icon, 
  SimpleGrid, 
  Text, 
  VStack, 
  Card,
  Separator
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {
  FiBookOpen,
  FiFileText,
  FiUsers,
  FiClock,
  FiUser,
  FiEdit,
  FiAward,
  FiAlertTriangle,
  FiInfo,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';

// Componente para mostrar pasos del proceso
const StepCard = ({ number, title, description, icon }) => {
  return (
    <Card.Root mb={4} border="1px solid" borderColor="gray.200">
      <Card.Body>
        <HStack spacing={4} align="start">
          <Icon as={icon} boxSize={7} color="blue.500" />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="md">{number}. {title}</Text>
            <Text color="gray.600" fontSize="sm">{description}</Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

StepCard.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};


export const MyThesisProcess = () => {
  // Pasos para Grado de Bachiller
  const bachelorSteps = [
    {
      number: 1,
      title: "Plan de Trabajo de Investigación",
      description: "Elaboración y presentación del plan inicial",
      icon: FiFileText,
    },
    {
      number: 2,
      title: "Asignación de Asesor",
      description: "Designación de asesor y registro oficial",
      icon: FiUser,
    },
    {
      number: 3,
      title: "Elaboración del Trabajo",
      description: "Desarrollo del trabajo de investigación",
      icon: FiEdit,
    },
    {
      number: 4,
      title: "Conformación de Jurado",
      description: "Formación del jurado evaluador",
      icon: FiUsers,
    },
    {
      number: 5,
      title: "Sustentación",
      description: "Defensa del trabajo de investigación",
      icon: FiAward,
    }
  ];

  // Pasos para Título Profesional
  const professionalSteps = [
    {
      number: 1,
      title: "Plan de Tesis",
      description: "Registro y aprobación del plan de tesis",
      icon: FiTarget,
    },
    {
      number: 2,
      title: "Asignación de Asesor",
      description: "Designación de asesor especializado",
      icon: FiUser,
    },
    {
      number: 3,
      title: "Elaboración de Tesis",
      description: "Desarrollo individual de la tesis",
      icon: FiBookOpen,
    },
    {
      number: 4,
      title: "Evaluación Externa",
      description: "Revisión por especialista externo",
      icon: FiTrendingUp,
    },
    {
      number: 5,
      title: "Sustentación Final",
      description: "Presentación y defensa de la tesis",
      icon: FiAward,
    }
  ];

  return (
    <Box p={6} maxW="full" mx="auto">
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" color="blue.700" mb={2}>
            Proceso de Tesis - FIEECS UNI
          </Heading>
          <Text color="gray.600">
            Facultad de Ingeniería Económica, Estadística y Ciencias Sociales
          </Text>
        </Box>

        {/* Alerta de prerequisito */}
        <Alert 
          status="info" 
          borderRadius="lg"
          title="Requisito Previo Importante"
          icon={<FiInfo />}
        >
          Para iniciar el proceso de tesis, el estudiante debe tener el estado de <strong>egresado</strong>, 
          habiendo cumplido con el total de créditos aprobados de su programa académico.
        </Alert>

        {/* Opciones de modalidad */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Card.Root bg="green.50" border="1px solid" borderColor="green.200">
            <Card.Header>
              <HStack spacing={3}>
                <Icon as={FiAward} boxSize={6} color="green.600" />
                <Text fontWeight="bold" color="green.700">
                  Grado de Bachiller
                </Text>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Trabajo de Investigación
                </Text>
                <Badge colorScheme="green" variant="subtle">
                  Mínimo 50 páginas
                </Badge>
                <Badge colorScheme="blue" variant="outline">
                  Desde 9no ciclo
                </Badge>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg="blue.50" border="1px solid" borderColor="blue.200">
            <Card.Header>
              <HStack spacing={3}>
                <Icon as={FiBookOpen} boxSize={6} color="blue.600" />
                <Text fontWeight="bold" color="blue.700">
                  Título Profesional
                </Text>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Tesis Individual
                </Text>
                <Badge colorScheme="blue" variant="subtle">
                  Mínimo 70 páginas
                </Badge>
                <Badge colorScheme="purple" variant="outline">
                  10mo ciclo
                </Badge>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg="orange.50" border="1px solid" borderColor="orange.200">
            <Card.Header>
              <HStack spacing={3}>
                <Icon as={FiTrendingUp} boxSize={6} color="orange.600" />
                <Text fontWeight="bold" color="orange.700">
                  Suficiencia Profesional
                </Text>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Modalidad Alternativa
                </Text>
                <Badge colorScheme="orange" variant="subtle">
                  3+ años experiencia
                </Badge>
                <Badge colorScheme="gray" variant="outline">
                  Solo egresados
                </Badge>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Separator />

        <Box>
          <Heading size="md" color="green.700" mb={4}>
            <HStack spacing={3}>
              <Icon as={FiAward} boxSize={6} />
              <Text>Proceso para Grado de Bachiller</Text>
            </HStack>
          </Heading>
          {bachelorSteps.map((step, index) => (
            <StepCard 
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              details={step.details}
            />
          ))}
        </Box>


        {/* Proceso Título Profesional */}
        <Box>
          <Heading size="md" color="blue.700" mb={4}>
            <HStack spacing={3}>
              <Icon as={FiBookOpen} boxSize={6} />
              <Text>Proceso para Título Profesional por Tesis</Text>
            </HStack>
          </Heading>
          {professionalSteps.map((step, index) => (
            <StepCard 
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              details={step.details}
            />
          ))}
        </Box>

        <Separator />

        {/* Requisitos y documentación */}
        <Box>
          <Heading size="md" color="purple.700" mb={4}>
            <HStack spacing={3}>
              <Icon as={FiFileText} boxSize={6} />
              <Text>Requisitos Generales y Documentación</Text>
            </HStack>
          </Heading>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            
          </SimpleGrid>
        </Box>

        {/* Alertas importantes */}
        <VStack spacing={4}>
          <Alert 
            status="warning" 
            borderRadius="lg"
            title="Trabajo de Suficiencia Profesional"
            icon={<FiAlertTriangle />}
          >
            Modalidad alternativa disponible para egresados con al menos 3 años de experiencia laboral 
            en su especialidad. Requiere presentación, asignación de asesor y evaluación similar a la tesis.
          </Alert>

          <Alert 
            status="info" 
            borderRadius="lg"
            title="Plazos Importantes"
            icon={<FiClock />}
          >
            Todos los procesos tienen plazos determinados. La sustentación se anuncia con al menos 
            2 días hábiles de anticipación y se conceden máximo 2 meses para subsanaciones si es necesario.
          </Alert>
        </VStack>
      </VStack>
    </Box>
  );
};

export default MyThesisProcess;