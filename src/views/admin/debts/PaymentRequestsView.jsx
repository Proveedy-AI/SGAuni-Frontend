import { PaymentRequestsTable } from "@/components/tables/payment_requests";
import { useProvideAuth } from "@/hooks/auth";
import { useReadPaymentRequest } from "@/hooks/payment_requests/useReadPaymentRequest";
import { Heading, InputGroup, Input, Stack, Spinner, Card, Flex, Icon, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText, FiSearch } from "react-icons/fi";
//import { format, parseISO } from 'date-fns';
import { GenerateMasivePaymentOrders } from "@/components/forms/payment_requests";
import { Field } from "@/components/ui";
import { ReactSelect } from "@/components";
import { useReadMethodPayment } from "@/hooks/method_payments";
import { useReadPurposes } from "@/hooks/purposes";
import { useReadPrograms } from "@/hooks";

export const PaymentRequestsView = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [selectedPurpose, setSelectedPurpose] = useState(null);
	const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  //const [selectedRequestedAt, setSelectedRequestedAt] = useState(null);
  const [selectedApplicantDocumentNumber, setSelectedApplicantDocumentNumber] = useState('');

  const { data: dataPaymentRequests, isLoading: isPaymentRequestsLoading } = useReadPaymentRequest();

  const { getProfile } = useProvideAuth();
  const profile = getProfile();
  const roles = profile?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);

  const { data: dataPurposes, isLoading: isLoadingPurposes } = useReadPurposes();
  const { data: dataMethodsPayment, isLoading: isLoadingMethodsPayment } = useReadMethodPayment();
  const { data: dataPrograms, isLoading: isLoadingPrograms } = useReadPrograms();

  const PurposeOptions = dataPurposes?.results?.map((item) => ({
    label: item.name,
    value: item.id,
  })) || [];

  const MethodsPaymentOptions = dataMethodsPayment?.results?.map((method) => ({
    value: method.id,
    label: method.name,
  })) || [];

  const ProgramsOptions = dataPrograms?.results?.map((program) => ({
    label: program.name,
    value: program.id,
  })) || [];

  const TypeOptions = [
		{ value: 1, label: 'Boleta' },
		{ value: 2, label: 'Factura' },
	];

  const statusOptions = [
    { id: 1, label: 'Pendiente', value: 1},
    { id: 2, label: 'Disponible', value: 2},
    { id: 3, label: 'Verificado', value: 3},
    { id: 4, label: 'Expirado', value: 4}
  ];

  const filteredPaymentRequests = dataPaymentRequests?.results?.filter((item) => {
    const matchProgram = selectedProgram
      ? item.admission_process_program === selectedProgram.value
      : true;
    
    const matchStatus = selectedStatus
      ? item.status === selectedStatus.value
    : true;

    const matchMethod = selectedMethod
      ? item.payment_method === selectedMethod.value
      : true;

    const matchPurpose = selectedPurpose
      ? item.purpose === selectedPurpose.value
      : true;

    const matchDocumentType = selectedDocumentType
      ? item.document_type === selectedDocumentType.value
      : true;

    // const matchRequestedAt = selectedRequestedAt
    //   ? format(parseISO(item.requested_at), 'yyyy-MM-dd') === format(selectedRequestedAt, 'yyyy-MM-dd')
    //   : true;

    const  matchApplicantDocumentNumber = selectedApplicantDocumentNumber
      ? item.num_document.toLowerCase().includes(selectedApplicantDocumentNumber.toLowerCase())
      : true;

    return (
      matchProgram && matchStatus && matchMethod && matchPurpose && matchDocumentType /*&& matchRequestedAt*/ && matchApplicantDocumentNumber
    )
  })

  console.log(filteredPaymentRequests);

  return (
    <Stack gap={4}>
      <Card.Root>
        <Card.Header>
          <Flex align='center' gap={2}>
            <Icon as={FiFileText} boxSize={5} color='blue.600' />
            <Heading fontSize='24px'>Solicitudes de Pago</Heading>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack gap={4} mb={4}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
              <Field label='Programa Académico:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  isLoading={isLoadingPrograms}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={ProgramsOptions}
                />
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
                  options={statusOptions}
                />
              </Field>
              <Field label='Métodos de Pago:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  
                  value={selectedMethod}
                  onChange={setSelectedMethod}
                  isLoading={isLoadingMethodsPayment}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={MethodsPaymentOptions}
                />
              </Field>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
              <Field label='Propósito:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedPurpose}
                  onChange={setSelectedPurpose}
                  isLoading={isLoadingPurposes}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={PurposeOptions}
                />
              </Field>
              <Field label='Tipo de Recibo:'>
                <ReactSelect
                  placeholder='Seleccionar'
                  value={selectedDocumentType}
                  onChange={setSelectedDocumentType}
                  variant='flushed'
                  size='xs'
                  isSearchable
                  isClearable
                  options={TypeOptions}
                />
              </Field>
              {/* <Field label='Fecha de Solicitud:'>
                <CustomDatePicker
                  selectedDate={selectedRequestedAt}
                  onDateChange={setSelectedRequestedAt}
                  buttonSize='xs'
                  size={{ base: '330px', md: '470px' }}
                />
              </Field> */}
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
        <InputGroup flex='1' startElement={<FiSearch />}>
          <Input
            ml='1'
            size='sm'
            bg={'white'}
            maxWidth={'550px'}
            placeholder='Buscar por DNI de postulante...'
            value={selectedApplicantDocumentNumber}
            onChange={(e) => setSelectedApplicantDocumentNumber(e.target.value)}
          />
        </InputGroup>
        <GenerateMasivePaymentOrders data={dataPaymentRequests?.results} />
      </Stack>

      {isPaymentRequestsLoading ? (
        <Spinner />
      ) : (
        <>
          { filteredPaymentRequests?.length > 0 ? (
            <PaymentRequestsTable
              data={filteredPaymentRequests}
              permissions={permissions}
            />
          ) : (
            <Heading size='sm' color='gray.500' textAlign={'center'}>
              No se encontraron Solicitudes de Pago
            </Heading>
          )}
        </>
      )}

    </Stack>
  );
}