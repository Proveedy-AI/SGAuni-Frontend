import { Field, ModalSimple } from '@/components/ui';
import { Card, IconButton, InputGroup, Input, Stack, Text, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { HiBookOpen, HiCurrencyDollar, HiEye, HiInformationCircle, HiUser } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { FiFile, FiType } from 'react-icons/fi';

export const ViewProgram = ({ item }) => {
	const [open, setOpen] = useState(false);
  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ModalSimple
          trigger={
            <IconButton colorPalette='blue' size='xs'>
              <HiEye />
            </IconButton>
          }
          title='Ver Programa'
          placement='center'
          size='2xl'
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={6}>
            <Card.Root>
              <Card.Header display='flex' flexDirection='row' alignItems='center' gap={2} color='blue.500'>
                <HiBookOpen size={24} />
                <Text fontSize='lg' fontWeight='semibold'>Información del Programa</Text>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Field label='Nombre'>
                    <InputGroup flex='1' startElement={<FiFile />} >
                      <Input
                        readOnly
                        value={item.name || 'No asignado'}
                      />
                    </InputGroup>
                  </Field>
                  <Field label='Tipo'>
                    <InputGroup flex='1' startElement={<FiType />} >
                      <Input
                        readOnly
                        value={item.type_detail?.name || 'No asignado'}
                      />
                    </InputGroup>
                  </Field>
                  <Field label='Coordinador'>
                    <InputGroup flex='1' startElement={<HiUser />} >
                      <Input
                        readOnly
                        value={item.coordinator_name || 'No asignado'}
                      />
                    </InputGroup>
                  </Field>
                  <Field label='Precio por crédito (S/.)'>
                    <InputGroup flex='1' startElement={<HiCurrencyDollar />} >
                      <Input
                        readOnly
                        value={item.price_credit || 'No asignado'}
                      />
                    </InputGroup>
                  </Field>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header display='flex' flexDirection='row' alignItems='center' gap={2} color="green.500">
                <HiInformationCircle size={24} />
                <Text fontSize='lg' fontWeight='semibold'>Información del condición de deuda</Text>
              </Card.Header>
              <Card.Body>
                {item?.has_debt_condition ? (
                  <Stack spacing={4}>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                      <Field label='Porcentaje mínimo de pago'>
                        <Input
                          readOnly
                          value={
                            item?.debt_condition?.min_payment_percentage !== undefined
                              ? `${item.debt_condition.min_payment_percentage}%`
                              : 'No asignado'
                          }
                        />
                      </Field>
                      <Field label='Máximo de cuotas'>
                        <Input
                          readOnly
                          value={
                            item?.debt_condition?.max_installments !== undefined
                              ? item.debt_condition.max_installments
                              : 'No asignado'
                          }
                        />
                      </Field>
                    </SimpleGrid>
                  </Stack>
                ) : (
                  <Text color='gray.500'>No hay condición de deuda.</Text>
                )}
              </Card.Body>
            </Card.Root>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
};

ViewProgram.propTypes = {
	item: PropTypes.object,
};
