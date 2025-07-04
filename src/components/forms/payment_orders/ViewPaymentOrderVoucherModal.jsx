import { ControlledModal, Field, Modal, ModalSimple, Tooltip, Button } from "@/components/ui";
import { Box, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";

const ConfirmValidateVoucherModal = ({ open, setOpen }) => {
  //const { mutateAsync: validateVoucher, isSaving } = useValidatePaymentOrderVoucherMutation();

  const onSave = () => {
    // Aquí puedes agregar la lógica para validar el voucher
    console.log("Voucher validado");
    setOpen(false);
  };

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ControlledModal
          title="Validar Voucher"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Text>¿Estás seguro de que deseas validar este voucher?</Text>
            <Flex justifyContent={"flex-end"} gap={3}>
                <Button variant='outline' colorPalette='red' onClick={() => setOpen(false)}>
                  No, regresar
                </Button>
                <Button
                  onClick={onSave}
                  bg='uni.secondary'
                  color='white'
                  loadingText='Guardando...'
                >
                  Si, verificar
                </Button>
              </Flex>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  );
}

ConfirmValidateVoucherModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};


export const ViewPaymentOrderVoucherModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
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
            onSave={() => setConfirmOpen(true)}
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

      <ConfirmValidateVoucherModal open={confirmOpen} setOpen={setConfirmOpen} />
    </>
  );
}

ViewPaymentOrderVoucherModal.propTypes = {
  item: PropTypes.object
};