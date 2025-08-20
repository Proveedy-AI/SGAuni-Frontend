
import {
  FiFileText,
  //FiCheckCircle,
  //FiLogIn,
  //FiBook,
  //FiTrendingUp,
  //FiCreditCard,
  FiUserX,
  FiAward,
  FiUserPlus,
  FiArrowRight
} from "react-icons/fi";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { toaster, useColorModeValue } from "@/components/ui";
import { Box, Card, Flex, Heading, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { useGetProfile } from "@/hooks/auth";

const ProcedureCard = ({ procedure, onClick }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("blue.50", "blue.900");

  return (
    <Card.Root
      cursor="pointer"
      onClick={() => onClick(procedure)}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      transition="all 0.3s ease"
      _hover={{
        bg: hoverBg,
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "blue.300"
      }}
      p={0}
      overflow="hidden"
    >
      <Card.Body p={6}>
        <Flex justify="space-between" align="center">
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
              <Icon as={procedure.icon} boxSize={6} color="blue.600" />
            </Box>
            <Box flex="1">
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="gray.800"
                mb={1}
                lineHeight="shorter"
              >
                {procedure.label}
              </Text>
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {procedure.description}
              </Text>
            </Box>
          </Flex>
          <Icon
            as={FiFileText}
            boxSize={5}
            color="blue.500"
            transform="rotate(90deg)"
          />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

ProcedureCard.propTypes = {
  procedure: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export const MyProceduresView = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("blue.50", "blue.900");

  const { data: profile } = useGetProfile();
  console.log(profile)

  const proceduresData = [
  {
    id: 1,
    label: "Proceso de matrícula",
    href: "/myprocedures/enrollment-process",
    icon: FiFileText,
    description: "Gestiona tu proceso de matrícula académica",
    isActive: true,
  },
  // {
  //   id: 2,
  //   label: "Constancia de matrícula",
  //   href: "/myprocedures/enrollment-certificate",
  //   icon: FiCheckCircle,
  //   description: "Solicita tu constancia de matrícula",
  //   isActive: false,
  // },
  // {
  //   id: 3,
  //   label: "Constancia de ingreso",
  //   href: "/myprocedures/admission-certificate",
  //   icon: FiLogIn,
  //   description: "Obtén tu constancia de ingreso",
  //   isActive: false,
  // },
  // {
  //   id: 4,
  //   label: "Retiro de curso",
  //   href: "/myprocedures/course-withdrawal",
  //   icon: FiBook,
  //   description: "Solicita el retiro de un curso",
  //   isActive: false,
  // },
  // {
  //   id: 5,
  //   label: "Constancia de promedio ponderado",
  //   href: "/myprocedures/gpa-certificate",
  //   icon: FiTrendingUp,
  //   description: "Constancia de tu promedio académico",
  //   isActive: false,
  // },
  // {
  //   id: 6,
  //   label: "Constancia de no adeudo",
  //   href: "/myprocedures/no-debt-certificate",
  //   icon: FiCreditCard,
  //   description: "Certificado de no tener deudas pendientes",
  //   isActive: false,
  // },
  {
    id: 7,
    label: "Proceso de Tesis y Sustentación",
    href: "/myprocedures/thesis-process ",
    icon: FiAward,
    description: "Gestiona tu proceso de tesis",
    isActive: true,
  },
  {
    id: 8,
    label: "Postergar matrícula",
    href: "/myprocedures/postpone-process",
    icon: FiUserX,
    description: "Solicita postergar tu matrícula",
    isActive: true,
  },
  {
    id: 9,
    label: "Proceso de Reincorporación",
    href: "/myprocedures/reintegration-process",
    icon: FiUserPlus,
    description: "Solicita tu proceso de reincorporación",
    isActive: true,
  },
  {
    id: 10,
    label: "Proceso de traslado interno",
    href: "/myprocedures/internal-transfer-process",
    icon: FiArrowRight,
    description: "Gestiona tu traslado interno entre maestrías",
    isActive: true,
  }
];

  const handleProcedureClick = (procedure) => {
    console.log("Navegando a:", procedure.href);
    if (procedure.isActive) {
      navigate(procedure.href);
    }
    else {
      toaster.create({
        title: "Función en desarrollo",
        description: "Esta función aún no está disponible.",
        type: "warning",
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
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
          Trámites
        </Heading>
        <Text color="blue.600" fontSize="lg">
          Gestiona todos tus trámites académicos de manera fácil y rápida
        </Text>
      </Box>

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        maxW="5xl"
        mx="auto"
        gap={6}
      >
        {proceduresData.map((procedure) => (
          <ProcedureCard
            key={procedure.id}
            procedure={procedure}
            onClick={handleProcedureClick}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}