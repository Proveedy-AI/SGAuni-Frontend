import { ReactSelect } from "@/components";
import { CommitmentLettersTable } from "@/components/tables/commitment_letters";
import { Field } from "@/components/ui";
import { useReadPrograms } from "@/hooks";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Button, Card, Flex, Heading, Icon, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FiFileText, FiTrash } from "react-icons/fi";

export const CommitmentLetters = () => {
  const { data: profile } = useReadUserLogged();
  const roles = profile?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);
  
  /*
  const {
    data: dataFractionationRequests,
    refetch: fetchFractionationRequests,
    isLoading: loadingFractionationRequests,
    fetchNextPage: fetchNextPageFractionationRequests,
		hasNextPage: hasNextPageFractionationRequests,
		isFetchingNextPage: isFetchingNextPageFractionationRequests,
  } = useReadDebtRequests();
  */
  const dataFractionationRequests = {
     results: [
     {
       id: 1,
       request_date: '2023-10-01',
       status: 1,
       amount: 1000,
       program: 1,
       program_name: 'Program A',
       applicant_name: 'John Doe',
       document_num: 'DOC12345',
       request_path: '/path/to/request/1'
     },
     {
       id: 2,
       request_date: '2023-10-02',
       status: 1,
       amount: 2000,
       program: 2,
       program_name: 'Program B',
       applicant_name: 'Jane Smith',
       document_num: 'DOC67890',
       request_path: '/path/to/request/2'
     },
     {
       id: 3,
       request_date: '2023-10-03',
       status: 1,
       amount: 1500,
       program: 1,
       program_name: 'Program A',
       applicant_name: 'Alice Johnson',
       document_num: 'DOC54321',
       request_path: '/path/to/request/3'
     }
    ]
  };

  const {
    data: dataPrograms,
    isLoading: loadingPrograms,
  } = useReadPrograms();

  const ProgramOptions = dataPrograms?.results?.map((program) => ({
    value: program.id,
    label: program.name,
  })) || [];

  const StatusOptions = [
		{ value: 1, label: 'Pendiente' },
		{ value: 2, label: 'Validado' },
		{ value: 3, label: 'Expirado' },
	];

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [applicantName, setApplicantName] = useState('');

  const hasActiveFilters = selectedProgram || selectedStatus || applicantName;

  const clearFilters = () => {
		setSelectedProgram(null);
		setSelectedStatus(null);
		setApplicantName('');
	};

  const filteredRequests = dataFractionationRequests?.results?.filter((request) => {
    const matchProgram = selectedProgram ? request.program === selectedProgram.value : true;
    const matchStatus = selectedStatus ? request.status === selectedStatus.value : true;
    const matchApplicantName = applicantName
      ? request.applicant_name.toLowerCase().includes(applicantName.toLowerCase())
      : true;
    return matchProgram && matchStatus && matchApplicantName;
  });


  return (
    <Stack gap={4}>
      <Card.Root>
        <Card.Header>
          <Flex
            justify='space-between'
            align='center'
            direction={{ base: 'column', sm: 'row' }}
            gap={4} // Espacio entre filas en pantallas pequeñas
          >
            {/* Izquierda */}
            <Flex align='center' gap={2}>
              <Icon as={FiFileText} boxSize={5} color='blue.600' />
              <Heading fontSize='24px'>Solicitudes de Fraccionamiento</Heading>
            </Flex>

            {/* Derecha */}
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
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={6}>
              <Field label='Programa:'>
                <ReactSelect
                  placeholder='Seleccionar programa'
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={ProgramOptions}
                  isLoading={loadingPrograms}
                />
              </Field>
              <Field label='Estado:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedStatus}
                  onChange={(selected) => setSelectedStatus(selected)}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={StatusOptions}
                />
              </Field>
              <Field label='Nombre del postulante:'>
                <Input
                  placeholder='Buscar por nombre del postulante'
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </Field>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>
      
      <CommitmentLettersTable
        isLoading={false}
	      data={filteredRequests}
        refetch={() => {}}
        permissions={permissions}
        fetchNextPage={() => {}}
        hasNextPage={false}
        isFetchingNextPage={false}
      />

    </Stack>
  )
}