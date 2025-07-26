import PropTypes from 'prop-types';
import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadEnrollmentById } from "@/hooks/enrollments_proccess";
//import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { useNavigate, useParams } from "react-router";
import { Card, Stack, Heading, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import { MdSchool, MdDateRange, MdEventNote, MdListAlt } from "react-icons/md";
import { useReadCourseGroups } from '@/hooks/course_groups';

export const CourseCard = ({ course, goTo }) => {
  const ColorsByEnrollmentPeriod = [
    "blue.100",
    "green.100",
    "yellow.100",
    "red.100",
    "purple.100",
    "orange.100",
    "teal.100",
    "pink.100",
  ]

  return (
    <Card.Root 
      boxShadow="md" 
      borderRadius="lg" 
      overflow="hidden"
      onClick={() => goTo(course.id)}
      cursor={"pointer"}
    >
      <Card.Header bg={ColorsByEnrollmentPeriod[course.enrollment_period_program_course]} minH={36}></Card.Header>
      <Card.Body px={4} py={2}>
        <Stack gap={1}>
          <Heading size="sm" color="gray.800" fontWeight="bold" whiteSpace={"nowrap"} overflow={"hidden"} textOverflow={"ellipsis"}>
            {course.course_name}
          </Heading>
          <Text fontSize="xs" color="gray.600" fontWeight="semibold">
            {course.course_code}
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}

CourseCard.propTypes = {
  course: PropTypes.object,
  goTo: PropTypes.func
} 

export const ClassMyCoursesByProgramView = () => {
  const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data } = useReadEnrollmentById(decrypted);

  const navigate = useNavigate();
  const handleCardClick = (courseId) => {
    const encrypted = Encryptor.encrypt(courseId);
    const encoded = encodeURIComponent(encrypted);
    navigate(`${window.location.pathname}/course/${encoded}`, { replace: false });
  }

  const { 
    data: dataCourseGroups,
    isLoading: loadingCourseGroups,
  } = useReadCourseGroups(
    {},
    {}
  );

  return (
    <Stack spacing={6} mx="auto">
      <Heading size="lg">Gestión de cursos</Heading>
      <Card.Root>
        <Card.Header>
          <Flex align="center" gap={2}>
            <MdSchool size={24} color="#3182ce" />
            <Heading size="md">Información del Programa</Heading>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack spacing={3}>
            <Flex align="center" gap={2}>
              <MdEventNote />
              <Text>
                <b>Periodo académico:</b> {data?.academic_period_name || "-"}
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <MdDateRange />
              <Text>
                <b>Inicio:</b> {data?.start_date || "-"}
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <MdDateRange />
              <Text>
                <b>Fin:</b> {data?.end_date || "-"}
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <MdListAlt />
              <Text>
                <b>Periodo electivo:</b> {data?.elective_period || "-"}
              </Text>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Flex align="center" gap={2}>
            <MdListAlt size={24} color="#3182ce" />
            <Heading size="md">Cursos</Heading>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack spacing={4}>
            {loadingCourseGroups ? (
              <Text>Cargando cursos...</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={4}>
                {dataCourseGroups?.results?.map(course => (
                  <CourseCard key={course.id} course={course} goTo={handleCardClick} />
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
