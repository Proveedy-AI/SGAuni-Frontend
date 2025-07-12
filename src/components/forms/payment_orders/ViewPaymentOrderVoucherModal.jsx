import { Field, Modal, Tooltip, toaster } from "@/components/ui";
import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";
import { useUpdatePaymentOrder } from "@/hooks/payment_orders";

export const ViewPaymentOrderVoucherModal = ({ item, fetchPaymentOrders }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updatePaymentOrder, isSaving } = useUpdatePaymentOrder();

  const handleValidate = () => {
    const payload = {
      status: 3,
    }

    updatePaymentOrder({
      id: item.id,
      payload
    }, {
      onSuccess: () => {
        setOpen(false);
        fetchPaymentOrders();
        toaster.create({
          title: "Orden de pago validada correctamente",
          type: 'success',
        });
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
        <Modal
          trigger={
            <Box>
              <Tooltip
                content='Verificar manualmente el voucher de pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='blue' size='xs'>
                  <HiEye />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Verificar manualmente el voucher de pago"
          placement="center"
          size="5xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={handleValidate}
          isSaving={isSaving}
          saveLabel="Validar voucher"
        >
          <Stack spacing={4}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              w="full"
            >
              {
                item?.voucher?.file_path ? (
                  <Box w='full' h='600px'>
                    <iframe
                      src={item?.voucher?.file_path}
                      width="100%"
                      height="100%"
                      title="Payment Voucher"
                      style={{ border: 'none' }}
                    />
                  </Box>
                ) : (
                  <Box w='full' h='600px' display='flex' alignItems='center' justifyContent='center'>
                    <Text>No hay voucher disponible.</Text>
                  </Box>
                )
              }
            </Stack>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  );
}

ViewPaymentOrderVoucherModal.propTypes = {
  item: PropTypes.object,
  fetchPaymentOrders: PropTypes.func,
};