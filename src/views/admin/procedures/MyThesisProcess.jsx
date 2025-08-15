import { Alert } from '@/components/ui';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { 
  //Badge, 
  Box, 
  Heading, 
  HStack, 
  Icon, 
  SimpleGrid, 
  Text, 
  VStack, 
  Card,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {
  //FiBookOpen,
  FiFileText,
  FiClock,
  //FiUser,
  FiAward,
  FiAlertTriangle,
  FiInfo,
  FiTarget,
  //FiTrendingUp,
  FiCheck,
  FiStar,
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

// Componente para felicitaciones de graduación
const GraduationCongratulations = ({ programs, studentName }) => {

  return (
    <VStack spacing={4} mb={6}>
      {programs.length > 0 ? 
        programs.map((program, index) => (
          <Card.Root 
            key={index} 
            bg="green.50" 
            border="2px solid" 
            borderColor="green.300"
            boxShadow="md"
            overflow="hidden"
          >
            <Card.Header>
              <HStack spacing={3}>
                <Icon as={FiStar} boxSize={8} color="green.600" />
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="green.700">
                    ¡Felicitaciones {studentName}!
                  </Heading>
                  <Text color="green.600" fontSize="sm" fontWeight="medium">
                    Has completado exitosamente tu programa académico
                  </Text>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <Icon as={FiCheck} color="green.500" />
                  <Text fontWeight="bold">
                    Programa: {program.program_name || `Programa ID: ${program.program}`}
                  </Text>
                </HStack>
                
                <Text color="gray.700">
                  Te invitamos a acercarte a la <strong>Facultad de Ingeniería Económica, 
                  Estadística y Ciencias Sociales (FIEECS)</strong> para consultar sobre tu 
                  <strong> titulación con tesis</strong> y los siguientes beneficios disponibles:
                </Text>

                <VStack align="start" spacing={2} pl={4}>
                  {program.applies_diploma && (
                    <HStack spacing={2}>
                      <Icon as={FiAward} color="blue.500" />
                      <Text fontSize="sm">
                        <strong>Diploma:</strong> Tienes derecho a obtener tu diploma de graduación
                      </Text>
                    </HStack>
                  )}
                  
                  {program.applies_certificate && (
                    <HStack spacing={2}>
                      <Icon as={FiFileText} color="purple.500" />
                      <Text fontSize="sm">
                        <strong>Certificado:</strong> Puedes solicitar tu certificado de estudios
                      </Text>
                    </HStack>
                  )}
                  
                  {!program.applies_diploma && !program.applies_certificate && (
                    <HStack spacing={2}>
                      <Icon as={FiInfo} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        Consulta en la facultad sobre los documentos disponibles para tu programa
                      </Text>
                    </HStack>
                  )}
                </VStack>

                <Alert 
                  status="success" 
                  borderRadius="md"
                  title="Próximos pasos"
                  icon={<FiTarget />}
                >
                  Dirígete a la oficina de la FIEECS para iniciar tu proceso de titulación 
                  y conocer los requisitos específicos para tu programa.
                </Alert>
              </VStack>
            </Card.Body>
          </Card.Root>
        )
      ) : (
        <Box
          w="full"
          bg="gray.100"
          border="2px solid"
          borderColor="gray.200"
          borderRadius={5}
          boxShadow="md"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={6}
          overflow="hidden"
        >
          <Icon as={FiInfo} boxSize={12} color="gray.600" />
          <Text textAlign="center" color="gray.600" fontSize="sm" fontWeight="medium">
            NO HAY PROGRAMAS GRADUADOS
          </Text>
          <Text textAlign="center" color="gray.600" fontSize="sm" fontWeight="medium">
            No has completado ningún programa académico.
          </Text>
        </Box>
      )}
    </VStack>
  );
};

GraduationCongratulations.propTypes = {
  programs: PropTypes.array.isRequired,
  studentName: PropTypes.string.isRequired,
};


export const MyThesisProcess = () => {
  // Pasos para Título Profesional
  // const professionalSteps = [
  //   {
  //     number: 1,
  //     title: "Plan de Tesis",
  //     description: "Registro y aprobación del plan de tesis",
  //     icon: FiTarget,
  //   },
  //   {
  //     number: 2,
  //     title: "Asignación de Asesor",
  //     description: "Designación de asesor especializado",
  //     icon: FiUser,
  //   },
  //   {
  //     number: 3,
  //     title: "Elaboración de Tesis",
  //     description: "Desarrollo individual de la tesis",
  //     icon: FiBookOpen,
  //   },
  //   {
  //     number: 4,
  //     title: "Evaluación Externa",
  //     description: "Revisión por especialista externo",
  //     icon: FiTrendingUp,
  //   },
  //   {
  //     number: 5,
  //     title: "Sustentación Final",
  //     description: "Presentación y defensa de la tesis",
  //     icon: FiAward,
  //   }
  // ];

  const { data: dataUser } = useReadUserLogged();
  console.log(dataUser)
  console.log(dataUser?.student?.admission_programs)

  const admissionPrograms = dataUser?.student?.admission_programs || [];
  console.log(admissionPrograms);

  const filteredGraduatePrograms = admissionPrograms ? admissionPrograms.filter(
    (program) => program.academic_status === 2 //academic_type: graduated 
  ) : [];

  console.log(filteredGraduatePrograms);

  const studentName = dataUser?.first_name || dataUser?.user?.first_name || '';

  return (
    <Box p={6} maxW="full" mx="auto">
      {/* Header */}
      <VStack spacing={6} align="stretch" overflow="hidden">
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
          py={4}
        >
          Para iniciar el proceso de tesis, el estudiante debe tener al menos un programa académico <strong>egresado</strong>, 
          habiendo cumplido con el total de créditos aprobados de dicho programa.
        </Alert>

        {/* Felicitaciones por programas graduados */}
        <GraduationCongratulations 
          programs={filteredGraduatePrograms}
          studentName={studentName}
        />

        {/* Opciones de modalidad */}
        {/* <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} py={2}>
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
        </SimpleGrid> */}

        {/* Proceso Título Profesional */}
        {/* <Box>
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
        </Box> */}

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