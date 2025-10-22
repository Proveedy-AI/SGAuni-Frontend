import { Button, ModalSimple } from '@/components/ui';
import { Stack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const CancelSomePaymentOrders = ({ selectedOrderIds, onCancel }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <ModalSimple
        trigger={
          <Button
            disabled={selectedOrderIds.length === 0}
            bg='blue.500'
            color='white'
            size='xs'
            w={{ base: 'full', sm: 'auto' }}
            onClick={() => setOpen(true)}
          >
            Confirmar Cancelación
          </Button>
        }
        title="Cancelar Ordenes de Pago"
        placement="center"
        size="xl"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        onSave={onCancel}
      >
        <Stack spacing={4}>
          <Stack spacing={4} w="full"
          >

            <Text fontSize='md'>
              ¿Estás seguro que quieres cancelar {selectedOrderIds.length} ordenes de pago? 
            </Text>
          </Stack>
        </Stack>
      </ModalSimple>
    </Stack>
  );
}

CancelSomePaymentOrders.propTypes = {
  selectedOrderIds: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
}