import { ReactSelect } from "@/components";
import { CommitmentLettersTable } from "@/components/tables/commitment_letters";
import { Field } from "@/components/ui";
import { useReadPrograms } from "@/hooks";
import { useReadFractionationRequests } from "@/hooks/fractionation_requests";
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
  
  
  const {
    //data: dataFractionationRequests,
    refetch: fetchFractionationRequests,
    //isLoading: loadingFractionationRequests,
    fetchNextPage: fetchNextPageFractionationRequests,
		hasNextPage: hasNextPageFractionationRequests,
		isFetchingNextPage: isFetchingNextPageFractionationRequests,
  } = useReadFractionationRequests();
  
  const dataFractionationRequests = {
    results: [
      {
        id: 1,
        enrollment: 101,
        enrollment_name: '2024-I',
        plan_type_display: 'Cuotas',
        total_amount: '1200.00',
        total_amortization: '400.00',
        total_balance: '800.00',
        upfront_percentage: '33%',
        number_of_installments: 3,
        approved_by: 2,
        approved_at: '2024-05-10T10:00:00.000Z',
        payment_document_type: 1,
        payment_document_type_display: 'Boleta',
        path_commitment_letter: 'https://example.com/doc/54asd6s4asdas4d89asd4as',
        num_document_person: '12345678',
        status_review: 1
      },
      {
        id: 2,
        enrollment: 2,
        enrollment_name: '2024-I',
        plan_type_display: 'Cuotas',
        total_amount: '1500.00',
        total_amortization: '500.00',
        total_balance: '1000.00',
        upfront_percentage: '33%',
        number_of_installments: 3,
        approved_by: 3,
        approved_at: '2024-05-12T11:30:00.000Z',
        payment_document_type: 2,
        payment_document_type_display: 'Factura',
        path_commitment_letter: 'https://example.com/doc/uibwqunp1ndwi3151d465s',
        num_document_person: '87654321',
        status_review: 2
      },
      {
        id: 3,
        enrollment: 3,
        enrollment_name: '2024-I',
        plan_type_display: 'Cuotas',
        total_amount: '900.00',
        total_amortization: '300.00',
        total_balance: '600.00',
        upfront_percentage: '33%',
        number_of_installments: 3,
        approved_by: null,
        approved_at: null,
        payment_document_type: 1,
        payment_document_type_display: 'Boleta',
        path_commitment_letter: 'https://example.com/doc/54asd6s4asdas4d89asd4as',
        num_document_person: '11223344',
        status_review: 3
      },
      {
        id: 4,
        enrollment: 4,
        enrollment_name: '2024-I',
        plan_type_display: 'Especial',
        total_amount: '2000.00',
        total_amortization: '500.00',
        total_balance: '1500.00',
        upfront_percentage: '25%',
        number_of_installments: 4,
        approved_by: null,
        approved_at: null,
        payment_document_type: 2,
        payment_document_type_display: 'Factura',
        path_commitment_letter: 'https://example.com/doc/1ojnd1on1in1inpknca',
        num_document_person: '55667788',
        status_review: 1
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
		{ value: 1, label: 'En revisión' },
		{ value: 2, label: 'Aprobado' },
		{ value: 3, label: 'Rechazado' },
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
        refetch={fetchFractionationRequests}
        permissions={permissions}
        fetchNextPage={fetchNextPageFractionationRequests}
        hasNextPage={hasNextPageFractionationRequests}
        isFetchingNextPage={isFetchingNextPageFractionationRequests}
      />

    </Stack>
  )
}