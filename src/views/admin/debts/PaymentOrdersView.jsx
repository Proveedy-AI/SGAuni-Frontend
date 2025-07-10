import { GeneratePaymentOrderModal } from '@/components/forms/payment_orders';
import { PaymentOrdersTable } from '@/components/tables/payment_orders';
import { Field } from '@/components/ui';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { useReadPaymentRequest } from '@/hooks/payment_requests';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Card, Flex, Heading, Icon, Input, SimpleGrid, Spinner, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';

export const PaymentOrdersView = () => {
  const [ordenId, setOrdenId] = useState('');
  const [documentNum, setDocumentNum] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState(null);

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const { data: dataPaymentRequests, isLoading: isPaymentRequestsLoading } =
		useReadPaymentRequest();

	const {
		data: dataPaymentOrders,
		isLoading: loadingPaymentOrders,
		refetch: fetchPaymentOrders,
	} = useReadPaymentOrders();

  const filteredPaymentOrders = dataPaymentOrders?.results?.filter((request) => {
    const matchOrdenId = ordenId
      ? request?.id_orden.toString().includes(ordenId)
      : true;
    const matchDocumentNum = documentNum
      ? request.document_num.toString().includes(documentNum)
      : true;
    const matchEmail = email ? request.email.includes(email) : true;
    const matchDueDate = dueDate ? request.due_date === dueDate : true;

    return (
      matchOrdenId &&
      matchDocumentNum &&
      matchEmail &&
      matchDueDate
    );
  });

	const sortedPaymentOrders = filteredPaymentOrders?.sort(
		(a, b) => a.status - b.status
	);

	return (
		<Stack gap={4}>
      <Card.Root>
        <Card.Header>
          <Flex align='center' gap={2}>
            <Icon as={FiFileText} boxSize={5} color='blue.600' />
            <Heading fontSize='24px'>Ordenes de Pago</Heading>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack gap={4} mb={4}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
              <Field label='Id de orden:'>
                <Input
                  placeholder='Buscar por id de orden'
                  size='xs'
                  value={ordenId}
                  onChange={(e) => setOrdenId(e.target.value)}
                />
              </Field>
              <Field label='Documento de identidad:'>
                <Input
                  placeholder='Buscar por documento de identidad'
                  size='xs'
                  value={documentNum}
                  onChange={(e) => setDocumentNum(e.target.value)}
                />
              </Field>
              <Field label='Correo Electrónico:'>
                <Input
                  placeholder='Buscar por correo electrónico'
                  size='xs'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label='Fecha de Vencimiento:'>
                <Input
                  type='date'
                  placeholder='Buscar por fecha de vencimiento'
                  size='xs'
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='flex-end'
			>
        {isPaymentRequestsLoading ? (
					<Spinner />
				) : (
					<GeneratePaymentOrderModal
						requests={dataPaymentRequests?.results || []}
						fetchData={fetchPaymentOrders}
					/>
				)}
			</Stack>

			<PaymentOrdersTable
        isLoading={loadingPaymentOrders}
        data={sortedPaymentOrders}
        refetch={fetchPaymentOrders}
        permissions={permissions}
      />
		</Stack>
	);
};
