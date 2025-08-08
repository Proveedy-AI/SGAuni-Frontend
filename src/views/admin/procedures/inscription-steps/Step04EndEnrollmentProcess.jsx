import PropTypes from "prop-types";
import { GenerateRegistrationPdfModal } from "@/components/modals/procedures"
import { Box, Heading, Text } from "@chakra-ui/react"
import { useReadEnrollmentReceipt } from "@/hooks/students/enrollment";

export const Step04EndEnrollmentProcess = ({ step, id }) => {
  
  const {
    data: dataRegistrationInfo,
    isLoading: loadingRegistrationInfo,
  } = useReadEnrollmentReceipt(
    id,
    {},
    { enabled: !!id && step === 4 }
  );

  const courses_groups = dataRegistrationInfo?.data?.map((course_group) => {
    return {
      cycle: course_group.cycle,
      group_code: course_group.group_code,
      course_name: course_group.course_name,
      credits: course_group.credits,
    }
  })

  const total_credits = dataRegistrationInfo?.data?.reduce((acc, group) => acc + group.credits, 0);

  const registration_info = {
    program_enrollment: dataRegistrationInfo?.program,
    period_enrollment: dataRegistrationInfo?.period_enrollment,
    student_full_name: dataRegistrationInfo?.student_name,
    courses_groups,
    total_courses: courses_groups?.length,
    total_credits,
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}></Heading>
      <Text>Aquí irá el resumen de los grupos seleccionados...</Text>
      <GenerateRegistrationPdfModal loading={loadingRegistrationInfo} registration_info={registration_info} />
    </Box>
  )
}

Step04EndEnrollmentProcess.propTypes = {
  step: PropTypes.number,
  id: PropTypes.number,
};
