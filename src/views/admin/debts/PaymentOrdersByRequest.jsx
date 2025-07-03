import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GeneratePaymentOrderModal } from '@/components/forms/payment_requests';
import { PaymentOrdersByRequestTable } from '@/components/tables/payment_orders';
import { InputGroup } from '@/components/ui';
import { useProvideAuth } from '@/hooks/auth';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadPaymentRequestById } from '@/hooks/payment_requests';
import {
  Box,
  Breadcrumb,
  Heading,
  HStack,
  Input,
  Span,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { LiaSlashSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const PaymentOrdersByRequest = () => {
  const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);
  const { getProfile } = useProvideAuth();
  const profile = getProfile();
  const roles = profile?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);

  const {
    data: dataRequestPayment,
    loading: loadingRequestPayment,
    refetch: fetchRequestPayment
  } = useReadPaymentRequestById(decrypted);

  const {
    data: dataPaymentOrders,
    loading: loadingPaymentOrders,
    refetch: fetchPaymentOrders,
  } = useReadPaymentOrders();

  const filteredPaymentOrdersByRequest = dataPaymentOrders?.results
    ?.filter((order) => order.request === decrypted);

  const sortedPaymentOrders = filteredPaymentOrdersByRequest?.sort((a, b) => a.status - b.status);

  const [searchIdOrden, setSearchIdOrden] = useState('');

  return (
    <Box spaceY='5'>
      <Stack
        Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Breadcrumb.Root size='lg'>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link as={RouterLink} to='/debts/payment-requests'>
                Solicitudes de Pago
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>
              <LiaSlashSolid />
            </Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>
                Solicitud de Pago de {dataRequestPayment?.num_document}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Stack>

      <Stack
        Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Heading
          w={'100%'}
          size={{
            xs: 'xs',
            sm: 'md',
            md: 'xl',
          }}
          color={'uni.secondary'}
        >
           <HStack w={'100%'} justifyContent={'space-between'} alignItems='center'>
            <Box>
              <Text>Concepto de pago</Text>
              <Span fontSize='md' color='gray.500'>
                {loadingRequestPayment
                  ? 'Cargando...'
                  : dataRequestPayment?.purpose_display}
              </Span>
            </Box>
          </HStack>
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
            placeholder='Buscar por número de orden'
            value={searchIdOrden}
            onChange={(e) => setSearchIdOrden(e.target.value)}
          />
        </InputGroup>

        <GeneratePaymentOrderModal
          item={dataRequestPayment}
          paymentOrders={filteredPaymentOrdersByRequest}
          fetchPaymentRequests={fetchRequestPayment}
          fetchPaymentOrders={fetchPaymentOrders}
        />
      </Stack>
      
      {
        loadingPaymentOrders 
        ? (
          <Spinner />
        ) : (
          <PaymentOrdersByRequestTable
            data={sortedPaymentOrders}
            refetch={fetchPaymentOrders}
            permissions={permissions}
          />
        )
      }

    </Box>
  );
};
