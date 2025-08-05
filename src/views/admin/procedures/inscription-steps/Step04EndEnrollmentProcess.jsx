import { GenerateRegistrationPdfModal } from "@/components/modals/procedures"
import { Box, Heading, Text } from "@chakra-ui/react"

export const Step04EndEnrollmentProcess = () => {
  /*
  const {
    data: dataRegistrationInfo,
    isLoading: loadingRegistrationInfo,
  } = useReadRegistrationInfo();
  */

  const registration_info = {
    program_enrollment: "Maestría en Gerencia Pública",
    period_enrollment: "2025-II",
    student_full_name: "John Doe",
    courses_groups: [
      {
        cycle: "2",
        group_code: "PA23",
        course_name: "Gestión de Proyectos",
        credits: 3,
      },
      {
        cycle: "2",
        group_code: "QR30",
        course_name: "Política Pública",
        credits: 4,
      },
      {
        cycle: "2",
        group_code: "GB70",
        course_name: "Ética y Responsabilidad Social",
        credits: 2,
      },
      {
        cycle: "2",
        group_code: "MA10",
        course_name: "Economía Pública",
        credits: 3,
      },
    ],
    total_courses: 4,
    total_credits: 12,
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}></Heading>
      <Text>Aquí irá el resumen de los grupos seleccionados...</Text>
      <GenerateRegistrationPdfModal registration_info={registration_info} />
    </Box>
  )
}