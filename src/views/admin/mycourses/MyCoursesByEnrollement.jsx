import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadMyEnrolledCourses } from "@/hooks";
import { useParams } from "react-router";
import { 
  Box, 
  Heading, 
  Text, 
  //Spinner, 
  Badge, 
  Flex, 
  Card, 
  SimpleGrid,
  Icon,
  HStack,
  VStack
} from "@chakra-ui/react";
import { FiBook, FiUser, FiUsers, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';

// Componente para la tarjeta de curso
const CourseCard = ({ course }) => {
  return (
    <Card.Root
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg"
      }}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
    >
      <Card.Header bg="blue.50" py={4}>
        <VStack align="start" spacing={2}>
          <Flex justify="space-between" w="full" align="center">
            <Badge colorScheme="blue" variant="solid" fontSize="xs">
              {course.course_code}
            </Badge>
            <Badge colorScheme="green" variant="outline" fontSize="xs">
              Grupo {course.group_code}
            </Badge>
          </Flex>
          <Heading as="h3" size="md" color="gray.800" lineHeight="shorter">
            {course.course_name}
          </Heading>
        </VStack>
      </Card.Header>
      
      <Card.Body pt={4}>
        <VStack align="start" spacing={3}>
          <HStack spacing={3}>
            <Icon as={FiUser} color="gray.500" />
            <Text fontSize="sm" color="gray.700" fontWeight="medium">
              {course.teacher_name}
            </Text>
          </HStack>
          
          <HStack spacing={3}>
            <Icon as={FiUsers} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              Capacidad: {course.capacity} estudiantes
            </Text>
          </HStack>
          
          {/* <HStack spacing={3}>
            <Icon as={FiCalendar} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              Período: {course.enrollment_period_program_course}
            </Text>
          </HStack> */}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    course_code: PropTypes.string.isRequired,
    group_code: PropTypes.string.isRequired,
    enrollment_period_program_course: PropTypes.number.isRequired,
    teacher: PropTypes.number.isRequired,
    teacher_name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired
  }).isRequired
};

export const MyCoursesByEnrollement = () => {
  const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const {
    //data: myEnrolledCourses,
    isLoading: isLoadingEnrolledCourses
  } = useReadMyEnrolledCourses(decrypted);

  const myLocalEnrollments = [
    {
      id: 1,
      course_name: "Mathematics I",
      course_code: "MATH101",
      group_code: "A1",
      enrollment_period_program_course: 202401,
      teacher: 101,
      teacher_name: "Dr. Alice Smith",
      capacity: 40
    },
    {
      id: 2,
      course_name: "Physics II",
      course_code: "PHYS202",
      group_code: "B2",
      enrollment_period_program_course: 202401,
      teacher: 102,
      teacher_name: "Dr. Bob Johnson",
      capacity: 35
    },
    {
      id: 3,
      course_name: "Chemistry",
      course_code: "CHEM100",
      group_code: "C3",
      enrollment_period_program_course: 202401,
      teacher: 103,
      teacher_name: "Dr. Carol Lee",
      capacity: 30
    },
    {
      id: 4,
      course_name: "Programming Fundamentals",
      course_code: "CS110",
      group_code: "D4",
      enrollment_period_program_course: 202401,
      teacher: 104,
      teacher_name: "Dr. David Kim",
      capacity: 50
    }
  ];

  return (
    <Box p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
      <VStack align="start" spacing={6} mb={8}>
        <HStack spacing={3}>
          <Icon as={FiBook} boxSize={6} color="blue.500" />
          <Heading as="h1" size="lg" color="gray.800">
            Mis Cursos por Inscripción
          </Heading>
        </HStack>
        
        <Box 
          bg="blue.50" 
          px={4} 
          py={3} 
          borderRadius="md" 
          border="1px solid" 
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            ID de Inscripción: {decrypted}
          </Text>
        </Box>
      </VStack>

      <Text fontSize="sm" color="gray.600" mb={4}>
        {myLocalEnrollments.length} curso{myLocalEnrollments.length !== 1 ? 's' : ''} encontrado{myLocalEnrollments.length !== 1 ? 's' : ''}
      </Text>
      
      <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 3 }} 
        spacing={{ base: 4, md: 6 }}
        gap={6}
      >
        {myLocalEnrollments.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </SimpleGrid>

      {/* {isLoadingEnrolledCourses ? (
        <Flex justify="center" align="center" py={12}>
          <Spinner size="lg" color="blue.500" />
        </Flex>
      ) : (
        <>
          
        </>
      )} */}
    </Box>
  );
}