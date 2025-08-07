import { Encryptor } from "@/components/CrytoJS/Encryptor";
import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { useReadCourseGroupById } from "@/hooks/course_groups";
import { useReadEnrollmentById } from "@/hooks/enrollments_proccess";
import { useReadCourseEnrollmentReport } from "@/hooks/enrollments_programs/reports";
import { Box, Card, Flex, Heading, Icon, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { Button, InputGroup, Field } from "@/components/ui";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FiSearch, FiTrash, FiUsers, FiFileText } from "react-icons/fi";
import { useParams } from "react-router";
import { EnrolledStudentsTable } from "@/components/tables/tuition/enrolled/EnrolledStudentsTable";
import { EnrolledStudentsByCourseDocument } from "@/components/pdf/EnrolledStudentsByCourseDocument";

export const EnrolledStudentsView = () => {
  const { id, courseGroupId } = useParams();

  const decodedId = decodeURIComponent(id);
  const decryptedId = Encryptor.decrypt(decodedId);
  const decodedCourseGroupId = decodeURIComponent(courseGroupId);
  const decryptedCourseGroupId = Encryptor.decrypt(decodedCourseGroupId);

  // Estados para filtros
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchDocument, setSearchDocument] = useState('');

  const {
    data: dataEnrollmentProcess,
    isLoading: isLoadingEnrollmentProcess
  } = useReadEnrollmentById(decryptedId);

  const {
    data: dataCourseGroup,
    isLoading: isLoadingCourseGroup
  } = useReadCourseGroupById(decryptedCourseGroupId);

  const {
    data: dataEnrollmentReport,
    isLoading: isLoadingEnrollmentReport,
  } = useReadCourseEnrollmentReport(
    decryptedCourseGroupId,
    {},
    {}
  );

  console.log(dataEnrollmentReport);

  const enrollmentProcessName = !isLoadingEnrollmentProcess ? dataEnrollmentProcess?.academic_period_name : 'Cargando...';
  const courseGroupName = !isLoadingCourseGroup ? dataCourseGroup?.course_name : 'Cargando...';

  // Filtrar estudiantes
  const filteredStudents = dataEnrollmentReport?.[0]?.enrolled_students?.filter(
    (student) =>
      (!searchName ||
        student.full_name
          .toLowerCase()
          .includes(searchName.toLowerCase())
      ) && 
      (!searchEmail ||
        student.email
          .toLowerCase()
          .includes(searchEmail.toLowerCase())
      ) &&
      (!searchDocument ||
        student.document
          ?.toLowerCase()
          .includes(searchDocument.toLowerCase())
      )
  ) || [];

  const hasActiveFilters = searchName || searchEmail || searchDocument;

  const clearFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchDocument('');
  };

  const courseInfo = dataEnrollmentReport?.[0];
  const totalStudents = dataEnrollmentReport?.[0]?.enrolled_students?.length || 0;
  const filteredCount = filteredStudents.length;

  // Estados para el modal PDF
  const [showPDF, setShowPDF] = useState(false);

  // Formatear datos para el PDF
  const pdfData = {
    period: courseInfo?.period || dataEnrollmentProcess?.academic_period_name,
    program: courseInfo?.program,
    course_name: courseInfo?.course_name,
    course_code: courseInfo?.course_code,
    group_code: courseInfo?.group_code,
    teacher_name: courseInfo?.teacher_name,
  };

  const pdfStudents = filteredStudents.map(student => ({
    code: student.code || '',
    document: student.document || '',
    full_name: student.full_name || '',
    email: student.email || '',
  }));

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW="8xl" mx="auto">
      <ResponsiveBreadcrumb
        items={[
          { label: 'Matriculados',  to: '/enrollments/enrolled' },
          { label: enrollmentProcessName, to: `/enrollments/programs/${id}/course-groups` },
          { label: courseGroupName }
        ]}
      />

      {/* Header con información del curso */}
      {courseInfo && (
        <Card.Root p={6} bg="blue.50" borderLeft="4px solid" borderColor="blue.500">
          <Flex align="center" gap={4} wrap="wrap">
            <Icon as={FiUsers} boxSize={6} color="blue.600" />
            <Box>
              <Heading as="h2" size="lg" color="blue.800">
                {courseInfo.course_name} - {courseInfo.group_code}
              </Heading>
              <Box fontSize="sm" color="blue.600" mt={1}>
                <strong>Código:</strong> {courseInfo.course_code} | 
                <strong> Docente:</strong> {courseInfo.teacher_name} | 
                <strong> Programa:</strong> {courseInfo.program} | 
                <strong> Periodo:</strong> {courseInfo.period}
              </Box>
            </Box>
          </Flex>
        </Card.Root>
      )}

      <Card.Root>
        <Card.Header>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={2}>
              <Icon as={FiUsers} boxSize={5} color='blue.600' />
              <Heading fontSize='24px'>Estudiantes</Heading>
              <Box fontSize="sm" color="gray.600" ml={2} px={2} py={1} bg="gray.100" rounded="md">
                {hasActiveFilters 
                  ? `${filteredCount} de ${totalStudents} estudiantes`
                  : `${totalStudents} estudiantes`
                }
              </Box>
            </Flex>

            <Stack direction='row' spacing={2} align='center'>
              <DialogRoot 
                open={showPDF} 
                onOpenChange={(e) => setShowPDF(e.open)}
                size="full"
              >
                <DialogTrigger asChild>
                  <Button
                    colorPalette='blue'
                    size='sm'
                    leftIcon={<FiFileText />}
                    disabled={!filteredStudents.length}
                  >
                    Generar PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Lista de Estudiantes Matriculados - {courseInfo?.course_name} {courseInfo?.group_code}
                    </DialogTitle>
                  </DialogHeader>
                  <Box height="80vh" width="100%">
                    <EnrolledStudentsByCourseDocument 
                      data={pdfData}
                      students={pdfStudents}
                    />
                  </Box>
                </DialogContent>
              </DialogRoot>

              {hasActiveFilters && (
                <Button
                  variant='outline'
                  colorPalette='red'
                  size='sm'
                  onClick={clearFilters}
                >
                  <FiTrash />
                  Limpiar Filtros
                </Button>
              )}
            </Stack>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack gap={4} mb={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              <Field label="Buscar por nombre">
                <InputGroup w='100%' startElement={<FiSearch />}>
                  <Input
                    placeholder="Nombre del estudiante..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </InputGroup>
              </Field>

              <Field label="Buscar por correo">
                <InputGroup w='100%' startElement={<FiSearch />}>
                  <Input
                    placeholder="Correo electrónico..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                </InputGroup>
              </Field>

              <Field label="Buscar por documento">
                <InputGroup w='100%' startElement={<FiSearch />}>
                  <Input
                    placeholder="Número de documento..."
                    value={searchDocument}
                    onChange={(e) => setSearchDocument(e.target.value)}
                  />
                </InputGroup>
              </Field>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>

      <EnrolledStudentsTable 
        data={courseInfo}
        students={filteredStudents}
        isLoading={isLoadingEnrollmentReport}
        isDownloadable={false}
      />
    </Box>
  )
}
