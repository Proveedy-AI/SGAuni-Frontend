import { ReactSelect } from "@/components";
import { ClassMyProgramsTable } from "@/components/tables/myclasses";
import { Button, Field } from "@/components/ui";
import { useReadEnrollments } from "@/hooks/enrollments_proccess";
import { useReadEnrollmentsPrograms } from "@/hooks/enrollments_programs";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Card, Flex, Heading, Icon, Input, InputGroup, SimpleGrid, Stack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiSearch, FiTrash } from "react-icons/fi";

export const ClassMyProgramView = () => {
  const [selectedAcademicPeriod, setSelectedAcademicPeriod] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);

  const hasActiveFilters = selectedName || selectedStatus;

  const clearFilters = () => {
    setSelectedName('');
    setSelectedStatus(null);
  }

  const {
    data: dataEnrollments,
    isLoading: loadingEnrollments,
  } = useReadEnrollments();

  const { data: profile } = useReadUserLogged();
    const roles = profile?.roles || [];
    const permissions = roles
      .flatMap((r) => r.permissions || [])
      .map((p) => p.guard_name);

  const filterParams = useMemo(() => {
    const params = {};
    if (selectedAcademicPeriod) params.academic_period = selectedAcademicPeriod.value;
    if (profile) params.coordinator = profile.id;
    //params.status = 4; programas aprobados
    return params;
  }, [selectedAcademicPeriod, profile]);

  /*
    {
      "id": 0,
      "program": 0,
      "enrollment_period": 0,
      "enrollment_period_name": "string",
      "program_name": "string",
      "registration_start_date": "2025-07-22",
      "registration_end_date": "2025-07-22",
      "examen_start_date": "2025-07-22",
      "examen_end_date": "2025-07-22",
      "semester_start_date": "2025-07-22",
      "credits": 2147483647,
      "status": 1,
      "status_display": "string",
      "schedule_excel_url": "string",
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  */

  const StatusOptions = [
    { value: 1, label: 'Por Empezar' },
    { value: 2, label: 'En Curso' },
  ]

  const {
      data: dataEnrollmentsPrograms,
      isLoading: loadingEnrollmentsPrograms,
    } = useReadEnrollmentsPrograms(filterParams);

  const filteredEnrollmentsPrograms = dataEnrollmentsPrograms?.results?.filter((program) => {
    const dateNow = new Date();
    const semesterStartDate = new Date(program.semester_start_date);
    
    const matchesName = !selectedName || program.program_name.toLowerCase().includes(selectedName.toLowerCase());
    // trabajar con ,
    const matchesStatus = !selectedStatus || (
      (selectedStatus.value === 1 && dateNow < semesterStartDate) || // Por Empezar
      (selectedStatus.value === 2 && semesterStartDate <= dateNow) // En Curso
    );
    return matchesName && matchesStatus;
  }) || [];

  const AcademicPeriodOptions = dataEnrollments?.results?.map((item) => ({
    value: item.id,
    label: item.academic_period_name,
  }));

  useEffect(() => {
    if (dataEnrollments) {
      setSelectedAcademicPeriod(AcademicPeriodOptions[0]);
    }
  }, [dataEnrollments]);

  return (
    <Stack gap={4}>
      <Card.Root>
        <Card.Header>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={2}>
              <Icon as={FiBookOpen} boxSize={5} color='blue.600' />
              <Heading fontSize='24px'>Programas</Heading>
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
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
              <Field label='Periodo Académico:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedAcademicPeriod}
                  onChange={setSelectedAcademicPeriod}
                  isLoading={loadingEnrollments}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  options={AcademicPeriodOptions}
                />
              </Field>
              <Field label='Nombre del curso'>
                <InputGroup flex='1' startElement={<FiSearch />}>
                  <Input
                    ml='1'
                    size='sm'
                    bg={'white'}
                    maxWidth={'550px'}
                    placeholder='Buscar por nombre de curso'
                    value={selectedName}
                    onChange={(e) =>
                      setSelectedName(e.target.value)
                    }
                  />
                </InputGroup>
              </Field>
              <Field label='Estado:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={StatusOptions}
                />
              </Field>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>

      <ClassMyProgramsTable
        isLoading={loadingEnrollmentsPrograms}
        data={filteredEnrollmentsPrograms}
        permissions={permissions}
      />
    </Stack>
  )
}