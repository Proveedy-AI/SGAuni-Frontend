import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadEnrollmentById } from "@/hooks/enrollments_proccess";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { useParams } from "react-router";
import { Card, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { MdSchool, MdDateRange, MdEventNote, MdListAlt } from "react-icons/md";

export const ClassMyCoursesByProgramView = () => {
  const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data } = useReadEnrollmentById(decrypted);
  console.log(data);

  /*
  {
    "id": 1,
    "academic_period_name": "2025-1",
    "start_date": "2025-07-10",
    "end_date": "2025-07-11",
    "elective_period": "1"
}
  */

  return (
    <Stack spacing={6} mx="auto">
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
          <Text color="gray.500">Aquí aparecerán los cursos asociados al programa.</Text>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
