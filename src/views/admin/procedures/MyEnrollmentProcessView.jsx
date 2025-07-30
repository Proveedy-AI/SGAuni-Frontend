import { useReadMyEnrollments } from '@/hooks';
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  Text,
  Icon,
  Flex,
  Badge,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import {
  FiBook,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import PropTypes from "prop-types";
import { useColorModeValue } from '@/components/ui';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { StartEnrollmentProcessModal } from '@/components/modals/procedures';
import { useNavigate } from 'react-router';
import { Encryptor } from '@/components/CrytoJS/Encryptor';

const EnrollmentCard = ({ enrollment, onStartEnrollment }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const StatusColor = [
    { id: 1, status: 2, bg:"orange.100", color: "orange", label: "Pago pendiente" },
    { id: 2, status: 4, bg:"green.100", color: "green", label: "Elegible" }
  ]

  return (
    <Card.Root
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={0}
      overflow="hidden"
    >
      <Card.Body p={6}>
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Flex align="center" flex="1">
            <Box
              p={3}
              borderRadius="md"
              bg="blue.100"
              mr={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiBook} boxSize={6} color="blue.600" />
            </Box>
            <VStack align="start" spacing={1} flex="1">
              <Heading
                as="h3"
                size="md"
                color="gray.800"
                lineHeight="shorter"
                noOfLines={2}
              >
                {enrollment.program_name}
              </Heading>
              <Badge
                bg={StatusColor.find(s => s.status === enrollment.status)?.bg || "gray.100"}
                color={StatusColor.find(s => s.status === enrollment.status)?.color || "gray.100"}
                variant="subtle"
                fontSize="xs"
              >
                {enrollment.status_display}
              </Badge>
            </VStack>
          </Flex>
          <StartEnrollmentProcessModal enrollment={enrollment} onStartEnrollment={onStartEnrollment} />
        </Flex>

        <VStack align="start" spacing={3} mt={4}>
          <HStack spacing={3} w="full">
            <Box>
              <HStack spacing={3} w="full">
                <Icon as={FiCalendar} color="gray.500" boxSize={4} />
                <Text fontSize="sm" color="gray.600">
                  Período: <Text as="span" fontWeight="medium">{enrollment.program_period}</Text>
                </Text>
              </HStack>
            </Box>
            <Box display="flex" alignItems="center" gapX={2}>
              <Icon as={FiCreditCard} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600">
                Pago verificado: 
                <Icon 
                  as={enrollment.payment_verified ? FiCheckCircle : FiClock} 
                  color={enrollment.payment_verified ? "green.500" : "orange.500"}
                  ml={2}
                  boxSize={4}
                />
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

EnrollmentCard.propTypes = {
  enrollment: PropTypes.object.isRequired,
  onStartEnrollment: PropTypes.func.isRequired
};

export const MyEnrollmentProcessView = () => {
  const navigate = useNavigate();
	const {
		data: myEnrollments,
		isLoading: isLoadingEnrollments
	} = useReadMyEnrollments();

  const eligibleEnrollments = myEnrollments?.filter(enrollment => enrollment.status === 4);

  const bgColor = useColorModeValue("blue.50", "blue.900");

  const handleStartEnrollment = (enrollment) => {
    const encrypted = Encryptor.encrypt(enrollment.id); // id enrollment
    const encoded = encodeURIComponent(encrypted);
    navigate(`/myprocedures/enrollment-process/${encoded}`);
  };

	return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
      <ResponsiveBreadcrumb
        items={[
          { label: 'Mis Trámites', to: '/myprocedures' },
          { label: 'Proceso de Matrícula' },
        ]}
      />
      <Box
        bg={bgColor}
        borderRadius="xl"
        p={{ base: 6, md: 8 }}
        mb={8}
      >
        <Heading
          as="h1"
          size="xl"
          color="blue.800"
          mb={2}
          fontWeight="bold"
        >
          Proceso de Matrícula
        </Heading>
        <Text color="blue.600" fontSize="lg">
          Gestiona tus inscripciones y procesos de matrícula académica
        </Text>
      </Box>

      {isLoadingEnrollments ? (
        <Flex justify="center" align="center" py={12}>
          <Spinner size="lg" color="blue.500" />
          <Text ml={4} color="gray.600">Cargando inscripciones...</Text>
        </Flex>
      ) : (
        <>
          {eligibleEnrollments && eligibleEnrollments.length > 0 ? (
            <>
              <Text fontSize="sm" color="gray.600" mb={6}>
                {eligibleEnrollments.length} inscripción{eligibleEnrollments.length !== 1 ? 'es' : ''} encontrada{eligibleEnrollments.length !== 1 ? 's' : ''}
              </Text>
              
              <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                mx="auto"
              >
                {eligibleEnrollments.map((enrollment) => (
                  <EnrollmentCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    onStartEnrollment={handleStartEnrollment}
                  />
                ))}
              </SimpleGrid>
            </>
          ) : (
            <Box
              textAlign="center"
              py={12}
              px={6}
              bg="gray.50"
              borderRadius="lg"
              border="2px dashed"
              borderColor="gray.300"
            >
              <Icon as={FiBook} boxSize={12} color="gray.400" mb={4} />
              <Heading as="h3" size="md" color="gray.600" mb={2}>
                No hay inscripciones disponibles
              </Heading>
              <Text color="gray.500">
                No tienes inscripciones pendientes en este momento.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
