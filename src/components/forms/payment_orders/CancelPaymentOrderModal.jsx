import { Field, ModalSimple, toaster, Tooltip } from "@/components/ui";
import { Box, Button, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUpdatePaymentOrder } from "@/hooks/payment_orders";

export const CancelPaymentOrderModal = ({ item, fetchPaymentOrders }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updatePaymentOrder, isSaving } = useUpdatePaymentOrder();

  const handleValidate = async () => {
    const payload = {
      status: 4
    }
    updatePaymentOrder({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: "Orden de pago cancelada correctamente",
          type: 'success',
        });
        setOpen(false);
        fetchPaymentOrders();
      },
      onError: (error) => {
        toaster.create({
          title: error ? error.message : "Error al validar la orden de pago",
          type: "error",
        });
      }
    })
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Rechazar Orden de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='red' size='xs'>
                  <FaTimes />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Rechazar Orden de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack spacing={4} w="full"
            >
              <Text fontSize='md'>
                ¿Estás seguro de que deseas rechazar esta orden de pago <strong>{item?.id_orden}</strong> de postulante <strong>{item?.name?.toUpperCase()}</strong>? 
              </Text>

              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  colorPalette={'green'}
                  variant={'solid'}
                  isLoading={isSaving}
                  size='sm'
                  onClick={handleValidate}
                >
                  <FaCheck />
                  Si, rechazar
                </Button>
                <Button
                  colorPalette={'red'}
                  variant={'solid'}
                  size='sm'
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

CancelPaymentOrderModal.propTypes = {
  item: PropTypes.object,
  fetchPaymentOrders: PropTypes.func
};