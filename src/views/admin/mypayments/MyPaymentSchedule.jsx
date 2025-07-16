import { ReactSelect } from '@/components';
import { Field } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
	Table,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText, FiTrash } from 'react-icons/fi';

export const MyPaymentSchedule = () => {
  /*
  {
    id: 1,
    program: 1,
    program_name: '',
    applictaion: 1,
    applicant_name: '',
    total: '',
    is_first_installment: true
    deadline: '',
    status: ''
  }
  */

  /*
  const {
    data: dataInstallments,
    isLoading: isLoadingInstallments,
    refetch: fetchInstallments
  } = useReadInstallmentsUserLogged();
  */

  const dataInstallments = {
    results: [
      {
        id: 1,
        program: 1,
        program_name: 'Maestría en Ingeniería',
        applictaion: 1,
        applicant_name: 'Juan Pérez',
        total: '1500.00',
        is_first_installment: true,
        deadline: '2025-07-15',
        status: 2
      },
      {
        id: 2,
        program: 1,
        program_name: 'Maestría en Ingeniería',
        applictaion: 1,
        applicant_name: 'Juan Pérez',
        total: '2000.00',
        is_first_installment: false,
        deadline: '2025-08-15',
        status: 1
      },
      {
        id: 3,
        program: 1,
        program_name: 'Maestría en Ingeniería',
        applictaion: 1,
        applicant_name: 'Juan Pérez',
        total: '1200.00',
        is_first_installment: false,
        deadline: '2025-09-15',
        status: 1
      }
    ]
  }


  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const hasActiveFilters = selectedDeadline || selectedStatus;

  const clearFilters = () => {
    setSelectedDeadline(null);
    setSelectedStatus(null);
  };

  const StatusOptions = [
    { value: 1, label: 'Pendiente' },
    { value: 2, label: 'Pagado' },
    { value: 3, label: 'Expirado' },
  ];
  const statusColorMap = {
    1: 'blue',
    2: 'green',
    3: 'red',
  };

  const filteredInstallments = dataInstallments?.results?.filter((item) => {
    const matchDeadline = selectedDeadline
      ? item.deadline === selectedDeadline.value
      : true;
    const matchStatus = selectedStatus
      ? item.status === selectedStatus.value
      : true;
    return matchDeadline && matchStatus;
  });

  return (
    <Stack gap={4}>
      <Card.Root>
        <Card.Header>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={2}>
              <Icon as={FiFileText} boxSize={5} color='blue.600' />
              <Heading fontSize='24px'>Mi Cronograma de Pagos</Heading>
            </Flex>
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
          </Flex>
        </Card.Header>
        <Card.Body>
          <Stack gap={4} mb={4}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 2, xl: 2 }} gap={6}>
              <Field label='Fecha límite:'>
                <Input
                  type="date"
                  value={selectedDeadline ? selectedDeadline.value : ''}
                  onChange={e =>
                    setSelectedDeadline(
                      e.target.value
                        ? { value: e.target.value, label: formatDateString(e.target.value) }
                        : null
                    )
                  }
                  style={{ width: '100%', padding: '4px', fontSize: '14px' }}
                />
              </Field>
              <Field label='Estado:'>
                <ReactSelect
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
      <Card.Root>
        <Card.Body>
          <Box overflowX='auto'>
            <Table.Root size='sm' striped>
              <Table.Header></Table.Header>
              <Table.Row>
                <Table.ColumnHeader>N°</Table.ColumnHeader>
                <Table.ColumnHeader w={'20%'}>Programa</Table.ColumnHeader>
                <Table.ColumnHeader w={'15%'}>Monto</Table.ColumnHeader>
                <Table.ColumnHeader>Estado</Table.ColumnHeader>
                <Table.ColumnHeader w={'20%'}>Fecha límite</Table.ColumnHeader>
                <Table.ColumnHeader>Es la 1ra cuota</Table.ColumnHeader>
              </Table.Row>

              <Table.Body>
                {filteredInstallments && filteredInstallments.length > 0 ? (
                  filteredInstallments.map((item, index) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.program_name}</Table.Cell>
                      <Table.Cell>S/ {item.total}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorPalette={statusColorMap[item.status] || 'gray'}
                          variant='solid'
                        >
                          {
                            StatusOptions.find(
                              (opt) => opt.value === item.status
                            )?.label
                          }
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {item.deadline}
                      </Table.Cell>
                      <Table.Cell>
                        {item.is_first_installment ? 'Sí' : 'No'}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} textAlign='center'>
                      No hay cuotas de pago
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
