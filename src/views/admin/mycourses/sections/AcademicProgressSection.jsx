import PropTypes from 'prop-types';
import { Badge, Box, Card, Flex, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { FiBookOpen } from "react-icons/fi";

export const AcademicProgressSection = ({ academicProgress, isLoading }) => {
  if (isLoading || !academicProgress) {
    return (
      <Card.Root mx='auto' bg='white' borderRadius='lg'>
        <Card.Header
          py={4}
          bg='blue.50'
          borderBottom='1px solid'
          borderColor='blue.200'
        >
          <Flex align='center' gapX={3}>
            <Icon as={FiBookOpen} boxSize={5} />
            <Text fontSize='lg' fontWeight='bold' color='blue.700'>
              Resumen Académico
            </Text>
          </Flex>
        </Card.Header>
        <Card.Body p={6}>
          <Text color='gray.500'>Cargando información académica...</Text>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card.Root>
    );
  }

  const {
    program,
    credits,
    averages,
    milestones,
    admission_year,
    program_start_date,
    current_cycle,
  } = academicProgress;

  return (
    <Card.Root mx='auto' bg='white' borderRadius='lg'>
      <Card.Header
        py={4}
        bg='blue.50'
        borderBottom='1px solid'
        borderColor='blue.200'
      >
        <Flex align='center' gapX={3}>
          <Icon as={FiBookOpen} boxSize={5} />
          <Text fontSize='lg' fontWeight='bold' color='blue.700'>
            Resumen Académico
          </Text>
        </Flex>
      </Card.Header>

      <Card.Body p={4} gap={4}>

        <Card.Root p={4}  borderRadius='md' overflow='hidden'>
          <SimpleGrid columns={{ base: 1, lg: 2 }} fontSize={'sm'}>
            <Text color='gray.500'>Programa: <b>{program?.name}</b></Text>
            <Text color='gray.500'>Año de admisión: <b>{admission_year}</b></Text>
            <Text color='gray.500'>Ciclo actual: <b>{current_cycle}</b></Text>
            <Text color='gray.500'>Inicio de programa: <b>{program_start_date}</b></Text>
          </SimpleGrid>
        </Card.Root>

        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>

          <Card.Root flex={1} p={6} align='stretch' maxW='33%' borderRadius='md'>
            <Card.Header p={0} align='stretch'><b>Resumen de créditos</b></Card.Header>
            <Card.Body p={0} spacing={2} align='stretch' gapY={2} py={3}>
              <HStack justify='space-between' align='center'>
                <Text fontSize='sm' color='blue.600'>
                  Aprobados
                </Text>
                <Badge bg='blue.400' variant='solid' fontSize='sm' justifyContent={'center'} boxSize={7}>
                  {credits.total_approved}
                </Badge>
              </HStack>
              <HStack justify='space-between'>
                <Text fontSize='sm' color='blue.600'>
                  Matriculados totales
                </Text>
                <Badge bg='blue.400' variant='solid' fontSize='sm' justifyContent={'center'} boxSize={7}>
                  {credits.total_enrolled}
                </Badge>
              </HStack>
              <HStack justify='space-between'>
                <Text fontSize='sm' color='blue.600'>
                  Matriculados ciclo actual
                </Text>
                <Badge bg='blue.400' variant='solid' fontSize='sm' justifyContent={'center'} boxSize={7}>
                  {credits.current_cycle_enrolled}
                </Badge>
              </HStack>
              <HStack justify='space-between' align='center'>
              <Text fontSize='sm' color='blue.600'>
                Restantes para Diploma
              </Text>
              <Badge bg='blue.400' variant='solid' fontSize='sm' justifyContent={'center'} boxSize={7}>
                {milestones.credits_to_diploma}
              </Badge>
            </HStack>
            <HStack justify='space-between' align='center'>
              <Text fontSize='sm' color='blue.600'>
                Restante para Egresar
              </Text>
              <Badge bg='blue.400' variant='solid' fontSize='sm' justifyContent={'center'} boxSize={7}>
                {milestones.credits_to_graduate}
              </Badge>
            </HStack>
            </Card.Body>

            {/* <Card.Footer
              borderTop='1px solid'
              borderColor='gray.200'
              p={0} spacing={2} align='stretch' gapY={2} py={3}
            >
              <HStack justify='space-between'>
                <Text fontSize='lg' fontWeight='bold' color='green.600'>
                  Promedio Ponderado
                </Text>
                <Badge bg='green' variant='solid' fontSize='lg' px={4} py={2}>
                  {averages.cumulative_weighted_average}
                </Badge>
              </HStack>
              <HStack justify='space-between'>
                <Text fontSize='md' fontWeight='semibold' color='green.600'>
                  Promedio Ciclo Actual
                </Text>
                <Badge bg='green.200' variant='solid' fontSize='md' px={3} py={1}>
                  {averages.current_cycle_average}
                </Badge>
              </HStack>
            </Card.Footer> */}
          </Card.Root>

          <Card.Root flex={1} spacing={3} align='stretch' maxW='full'>
            <Text>CANVAS POR DESARROLLAR</Text>
          </Card.Root>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

AcademicProgressSection.propTypes = {
  academicProgress: PropTypes.object,
  isLoading: PropTypes.bool,
};
