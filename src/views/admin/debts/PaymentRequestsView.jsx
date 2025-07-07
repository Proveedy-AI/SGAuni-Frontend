import { PaymentRequestsTable } from "@/components/tables/payment_requests";
import { useProvideAuth } from "@/hooks/auth";
import { useReadPaymentRequest } from "@/hooks/payment_requests/useReadPaymentRequest";
import { Box, Heading, InputGroup, Input, Stack, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { format, parseISO } from 'date-fns';
import { GenerateMasivePaymentOrders } from "@/components/forms/payment_requests";

export const PaymentRequestsView = () => {
  const { data: dataPaymentRequests, loading: isPaymentRequestsLoading } = useReadPaymentRequest();

  const { getProfile } = useProvideAuth();
  const profile = getProfile();
  const roles = profile?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);

  const documentTypeOptions = [
    { value: 0, label: 'Todos los tipos' },
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'Carné de Extranjería' },
		{ value: 4, label: 'Cédula de Identidad' },
	];
  const paymentMethodOptions = [
    { value: 0, label: 'Todos los métodos' },
    { value: 1, label: 'BCP' },
    { value: 2, label: 'Caja UNI' },
    { value: 3, label: 'Niubiz' },
    { value: 4, label: 'Scotiabank' },
  ]
  const statusOptions = [
    { id: 0, label: 'Todos', value: 0},
    { id: 1, label: 'Pendiente', value: 1},
    { id: 2, label: 'Disponible', value: 2},
    { id: 3, label: 'Verificado', value: 3},
    { id: 4, label: 'Expirado', value: 4}
  ];

  const [loading, setInitialLoading] = useState(true);
  const [searchValue, setSearchValue] = useState({
    purpose_display: '',
    requested_at: '',
    document_type: documentTypeOptions[0],
    payment_method: paymentMethodOptions[0],
    admission_program: '',
    status: statusOptions[0],
  });
  const filteredPaymentRequests = dataPaymentRequests?.results?.filter((item) =>
    (!searchValue.purpose_display || item?.purpose_display.toLowerCase().includes(searchValue.purpose_display.toLowerCase())) &&
    (searchValue.document_type.value === 0 || item?.document_type === searchValue.document_type.value) &&
    (searchValue.payment_method.value === 0 || item?.payment_method === searchValue.payment_method.value) &&
    (!searchValue.admission_program || item?.admission_process_program_name.toLowerCase().includes(searchValue.admission_program.toLowerCase())) &&
    (searchValue.status.id === 0 || item?.status === searchValue.status.value) &&
    (!searchValue.requested_at || 
      format(parseISO(item?.requested_at), 'yyyy-MM-dd') === format(parseISO(searchValue.requested_at), 'yyyy-MM-dd')
    )
  );

  useEffect(() => {
    if (loading && filteredPaymentRequests) {
      setInitialLoading(false);
    }
  }, [loading, filteredPaymentRequests]);

  return (
    <Box spaceY='5'>
      <Stack
        Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Heading
          size={{
            xs: 'xs',
            sm: 'sm',
            md: 'md',
          }}
        >
          Solicitudes de Pago
        </Heading>
      </Stack>

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
            placeholder='Buscar por nombre...'
            value={searchValue.purpose_display}
            onChange={(e) => setSearchValue({ purpose_display: e.target.value })}
          />
        </InputGroup>
        <GenerateMasivePaymentOrders data={dataPaymentRequests?.results} />
      </Stack>

      { isPaymentRequestsLoading && <Spinner /> }
      { (
        <>
        { !loading && dataPaymentRequests?.results?.length > 0 ? (
            <PaymentRequestsTable
              data={filteredPaymentRequests}
              permissions={permissions}
              documentTypeOptions={documentTypeOptions}
              paymentMethodOptions={paymentMethodOptions}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              statusOptions={statusOptions}
            />
          ) : (
            <Heading size='sm' color='gray.500'>
              No se encontraron Ordenes de Pago
            </Heading>
          )}
        </>
      )}

    </Box>
  );
}