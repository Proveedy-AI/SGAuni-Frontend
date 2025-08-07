import { ReactSelect } from "@/components";
import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { GenerateStudentEnrolledListPdfModal } from "@/components/modals/tuition/enrolled";
import { EnrolledCourseGroupsTable } from "@/components/tables/tuition/enrolled";
import { Button, InputGroup, Field } from "@/components/ui";
import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { useReadEnrollmentById } from "@/hooks/enrollments_proccess";
import { useReadEnrollmentsPrograms } from "@/hooks/enrollments_programs";
import { useReadEnrollmentProgramCourses } from "@/hooks/enrollments_programs/courses";
import { useReadEnrollmentReport } from "@/hooks/enrollments_programs/reports";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Box, Card, Flex, Heading, Icon, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FiBookOpen, FiSearch, FiTrash } from "react-icons/fi";
import { useParams } from "react-router";

export const EnrolledCourseGroupsView = () => {
  const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const { data: profile } = useReadUserLogged();
    const roles = profile?.roles || [];
    const permissions = roles
      .flatMap((r) => r.permissions || [])
      .map((p) => p.guard_name);

  const {
    data: dataCourseGroups,
		fetchNextPage: fetchNextCourseGroups,
		hasNextPage: hasNextPageCourseGroups,
		isFetchingNextPage: isFetchingNextCourseGroups,
		refetch: fetchCourseGroups,
		isLoading,
  } = useReadEnrollmentProgramCourses(
    {},
    {}
  );

  const {
    data: dataEnrollmentProgram,
    //isLoading: isLoadingEnrollmentProgram, //<-- Para el ReactSelect
  } = useReadEnrollmentsPrograms(
    { enrollment_period: decrypted },
    { enabled: !!decrypted }
  );

  const EnrollmentProgramOptions = dataEnrollmentProgram?.results?.map(
    (item) => (
      {
        value: item.program,
        label: item.program_name,
      }
    )
  );

  const [searchName, setSearchName] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);

  const allCourseGroups =
		dataCourseGroups?.pages?.flatMap((page) => page.results) ?? [];

  const filteredCourseGroupsByEnrollmentPeriod = allCourseGroups
    .filter((group) => group.enrollment_period === decrypted) ?? [];

  const filteredCourseGroups = filteredCourseGroupsByEnrollmentPeriod.filter(
    (group) =>
    (!searchName ||
      group.course_group_name
        .toLowerCase()
        .includes(searchName.toLowerCase())
    ) && 
    (!selectedProgram ||
      group.enrollment_program === selectedProgram?.value
    )
  );

  const hasActiveFilters = searchName || selectedProgram;

  const clearFilters = () => {
    setSearchName('');
    setSelectedProgram(null);
  }

  const {
    data: dataEnrollmentProcess,
    isLoading: isLoadingEnrollmentProcess
  } = useReadEnrollmentById(decrypted)

  
  const {
    data: dataEnrolledStudents,
    isLoading: isLoadingEnrolledStudents,
  } = useReadEnrollmentReport();

  console.log(dataEnrolledStudents)

  const totalCount = hasActiveFilters
    ? filteredCourseGroups.length
    : (allCourseGroups?.length ?? 0);

  const isDownloadable = !isLoadingEnrolledStudents && dataEnrolledStudents.length > 0;

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW="8xl" mx="auto">
      <ResponsiveBreadcrumb
        items={[
          { label: 'Matriculados', to: '/enrollments/enrolled' },
          { label: !isLoadingEnrollmentProcess ? dataEnrollmentProcess?.academic_period_name : 'Cargando...' },
        ]}
      />

      <Card.Root>
        <Card.Header>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={2}>
              <Icon as={FiBookOpen} boxSize={5} color='blue.600' />
              <Heading fontSize='24px'>Grupos de Cursos</Heading>
            </Flex>

            <Stack direction='row' spacing={2} align='center'>
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
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
              <Field label='Nombre del curso:'>
                <InputGroup w='100%' startElement={<FiSearch />}>
                  <Input
                    ml='1'
                    size='sm'
                    bg={'white'}
                    placeholder='Buscar por nombre del curso...'
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value) }
                    />
                </InputGroup>
              </Field>
              <Field label='Buscar por programa:'>
                <ReactSelect
                  placeholder='Buscar por programa...'
                  options={EnrollmentProgramOptions}
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  isClearable
                />
              </Field>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Stack
        Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'center', sm: 'center' }}
        justify='space-between'
      >
        <GenerateStudentEnrolledListPdfModal 
          isDownloadable={isDownloadable}
          students={dataEnrolledStudents}
          options={EnrollmentProgramOptions}
        />
      </Stack>

      <EnrolledCourseGroupsTable
        data={filteredCourseGroups}
        fetchData={fetchCourseGroups}
        isLoading={isLoading}
        hasNextPage={hasNextPageCourseGroups}
        fetchNextPage={fetchNextCourseGroups}
        isFetchingNextPage={isFetchingNextCourseGroups}
        totalCount={totalCount}
        permissions={permissions}
      />
    </Box>
  )
}