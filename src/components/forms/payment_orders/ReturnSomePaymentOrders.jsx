import { Button, ModalSimple } from '@/components/ui';
import { Stack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const ReturnSomePaymentOrders = ({ selectedOrderIds, onReturn }) => {
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
            Confirmar Devolución
          </Button>
        }
        title="Devolver Ordenes de Pago"
        placement="center"
        size="xl"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        onSave={onReturn}
      >
        <Stack spacing={4}>
          <Stack spacing={4} w="full"
          >

            <Text fontSize='md'>
              ¿Estás seguro que quieres devolver {selectedOrderIds.length} ordenes de pago? 
            </Text>
          </Stack>
        </Stack>
      </ModalSimple>
    </Stack>
  );
}

ReturnSomePaymentOrders.propTypes = {
  selectedOrderIds: PropTypes.array.isRequired,
  onReturn: PropTypes.func.isRequired,
}