import { GeneratePaymentOrderModal } from '@/components/forms/payment_requests';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { InputGroup } from '@/components/ui';
import { useProvideAuth } from '@/hooks/auth';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadPaymentRequest } from '@/hooks/payment_requests';
import {
  Box,
  Heading,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const PaymentOrdersView = () => {
  const { getProfile } = useProvideAuth();
  const profile = getProfile();
  const roles = profile?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);

  const { 
    data: dataPaymentRequests,
    loading: isPaymentRequestsLoading, 
    refetch: fetchPaymentRequests
  } = useReadPaymentRequest();

  const {
    data: dataPaymentOrders,
    loading: loadingPaymentOrders,
    refetch: fetchPaymentOrders,
  } = useReadPaymentOrders();

  const [searchValue, setSearchValue] = useState({
    id_orden: '',
    document_num: '',
    email: ''
  });

  const handleFilterBy = (field, value) => {
    setSearchValue((prev) => ({ ...prev, [field]: value }));
  }
  console.log(dataPaymentOrders)

  const filteredPaymentOrdersByRequest = dataPaymentOrders?.results
    ?.filter((order) =>
    (!searchValue.id_orden || order.id_orden.includes(searchValue.id_orden)) &&
    (!searchValue.document_num || order.document_num.includes(searchValue.document_num)) &&
    (!searchValue.email || order.email.includes(searchValue.email))
  );

  const sortedPaymentOrders = filteredPaymentOrdersByRequest?.sort((a, b) => a.status - b.status);

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
          Ordenes de Pago
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
            placeholder='Buscar por id de orden'
            value={searchValue.id_orden}
            onChange={(e) => handleFilterBy('id_orden', e.target.value)}
          />
        </InputGroup>

        <GeneratePaymentOrderModal
          requests={dataPaymentRequests?.results || []}
          fetchData={fetchPaymentOrders}
        />
      </Stack>
      
      {
        loadingPaymentOrders 
        ? (
          <Spinner />
        ) : (
          <PaymentOrdersTable
            data={sortedPaymentOrders}
            filteredValues={searchValue}
            filter={handleFilterBy}
            refetch={fetchPaymentOrders}
            permissions={permissions}
          />
        )
      }

    </Box>
  );
};
