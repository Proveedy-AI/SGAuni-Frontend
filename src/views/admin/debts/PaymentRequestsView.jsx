import { PaymentRequestsTable } from "@/components/tables/payment_requests";
import { LinkButton } from "@/components/ui/link-button";
import { useProvideAuth } from "@/hooks/auth";
import { useReadPaymentOrders } from "@/hooks/payment_orders";
import { useReadPaymentRequest } from "@/hooks/payment_requests/useReadPaymentRequest";
import { Box, Heading, InputGroup, Input, Stack, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from "react-icons/fi";

export const PaymentRequestsView = () => {
  const { data: dataPaymentRequests, loading: isPaymentRequestsLoading, refetch: fetchPaymentRequets } = useReadPaymentRequest();
  const { data: dataPaymentOrders, loading: isPaymentOrdersLoading, refetch: fetchPaymentOrders } = useReadPaymentOrders();

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
    date: '',
    document_type: documentTypeOptions[0],
    payment_method: paymentMethodOptions[0],
    status: statusOptions[0],
  });
  const filteredPaymentRequests = dataPaymentRequests?.results?.filter((item) =>
    (!searchValue.purpose_display || item?.purpose_display.toLowerCase().includes(searchValue.purpose_display.toLowerCase())) &&
    (searchValue.document_type.value === 0 || item?.document_type === searchValue.document_type.value) &&
    (searchValue.payment_method.value === 0 || item?.payment_method === searchValue.payment_method.value) &&
    (searchValue.status.id === 0 || item?.status === searchValue.status.value) &&
    (!searchValue.date || item?.date === searchValue.date)
  );

  useEffect(() => {
    if (loading && filteredPaymentRequests) {
      setInitialLoading(false);
    }
  }, [loading, filteredPaymentRequests, isPaymentOrdersLoading]);

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
        <LinkButton bg='#711610' href="./downloads/plantilla_cobranzas_demo.xlsx" download={''}>
          Descargar Plantilla
        </LinkButton>
      </Stack>

      { isPaymentRequestsLoading && <Spinner /> }
      { (
        <>
        { !loading && dataPaymentRequests?.results?.length > 0 ? (
            <PaymentRequestsTable
              data={filteredPaymentRequests}
              fetchData={fetchPaymentRequets}
              fetchPaymentRequests={fetchPaymentRequets}
              fetchPaymentOrders={fetchPaymentOrders}
              paymentOrders={dataPaymentOrders?.results}
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