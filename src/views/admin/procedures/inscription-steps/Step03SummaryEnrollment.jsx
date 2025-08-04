import PropTypes from "prop-types";
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Flex,
  Icon,
} from "@chakra-ui/react"
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui";
import { LuCircleAlert } from "react-icons/lu";
import { ProcessEnrollmentModal } from "@/components/modals/procedures/ProcessEnrollmentModal";

export const Step03SummaryEnrollment = ({ selectedGroups, onBack }) => {
  // Calcular totales
  const totalCourses = selectedGroups?.total_selections;
  const totalCreditsToPay = selectedGroups?.price_credit;
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

  // Color modes

  return (
    <VStack spacing={6} align="stretch" maxW={"480px"} mx="auto">
      <Box bg="blue.100" p={6} rounded="lg" border="1px" shadow="sm">
        <Heading textAlign="center" as="h2" size="lg" color="blue.600" mb={0} pb={5}>
          Verifica el resumen de tu matrícula
        </Heading>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="md" color="gray.600">
              Cursos seleccionados
            </Text>
            <Box 
              bg="white" 
              color="blue.600" 
              px={2} 
              py={1} 
              rounded="md" 
              fontWeight="bold"
              minW="40px"
              textAlign="center"
            >
              {totalCourses}
            </Box>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="md" color="gray.600">
              Horas semanales seleccionadas
            </Text>
            <Box 
              bg="white" 
              color="blue.600" 
              px={3} 
              py={1} 
              rounded="md" 
              fontWeight="bold"
              minW="40px"
              textAlign="center"
            >
              {totalWeeklyHours}
            </Box>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="md" color="gray.600">
              Créditos seleccionados
            </Text>
            <Box 
              bg="white" 
              color="blue.600" 
              px={3} 
              py={1} 
              rounded="md" 
              fontWeight="bold"
              minW="40px"
              textAlign="center"
            >
              {totalCreditsToPay}
            </Box>
          </HStack>
        </VStack>
        <Flex mt={24} bg={"#FFF1CB"} py={4} px={4} border={"1px"} borderRadius={"lg"} align="center" justify={"center"} gap={3} borderColor="#FFC830">
          <Icon as={LuCircleAlert} color={"#F86A1E"} boxSize={6} />
          <Text maxW={"75%"}>Importante: Para culminar es necesario seleccionar el botón &quot;Procesar matrícula&quot;</Text>
        </Flex>
      </Box>


      <Flex justify="space-between" pt={4}>
        <Button
          variant="outline"
          leftIcon={<Icon as={FiArrowLeft} />}
          onClick={onBack}
        >
          Regresar
        </Button>
        
        <ProcessEnrollmentModal
          triggerButton={
            <Button colorScheme="blue">
              Procesar matrícula
            </Button>
          }
          onNext={() => {}}
        />
      </Flex>
    </VStack>
  )
}

Step03SummaryEnrollment.propTypes = {
  selectedGroups: PropTypes.array,
  onBack: PropTypes.func,
};