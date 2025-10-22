import { Field, ModalSimple, toaster, Tooltip } from "@/components/ui";
import { Box, Button, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";
import { useUpdatePaymentOrder } from "@/hooks/payment_orders";

export const ValidatePaymentOrderModal = ({ item, fetchPaymentOrders }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updatePaymentOrder, isLoading } = useUpdatePaymentOrder();

  const handleValidate = async () => {
    const payload = {
      status: 3
    }
    updatePaymentOrder({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: "Orden de pago validada correctamente",
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
                content='Validar Voucher de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton disabled={item.status === 3 || item.status === 5} colorPalette='green' size='xs'>
                  <HiCheck />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Validar Voucher de Pago"
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
                ¿Estás seguro de que deseas <strong>validar</strong> esta orden de pago <strong>{item?.id_orden}</strong> del postulante <strong>{item?.name?.toUpperCase()}</strong>? 
              </Text>

              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  bg={'uni.secondary'}
                  variant={'solid'}
                  size='sm'
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  colorPalette={'green'}
                  variant={'solid'}
                  loading={isLoading}
                  size='sm'
                  onClick={handleValidate}
                >
                  <FaCheck />
                  Validar
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ValidatePaymentOrderModal.propTypes = {
  item: PropTypes.object,
  fetchPaymentOrders: PropTypes.func
};