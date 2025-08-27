import { Field, Modal, ModalSimple, Tooltip } from "@/components/ui";
import { Box, IconButton, SimpleGrid, Span, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { HiPencil } from "react-icons/hi2";
import PropTypes from "prop-types";
import { ReactSelect } from "@/components/select";

export const UpdatePaymentRequestModal = ({ item, fetchPaymentRequests, statusOptions }) => {
  const [open, setOpen] = useState(false);

  const [currentStatus, setCurrentStatus] = useState({
    value: item.status,
    label: statusOptions.find((status) => status.id === item.status)?.label
  });

  const handleChangeStatus = (Selectedstatus) => {
    setCurrentStatus({
      value: Selectedstatus?.value,
      label: statusOptions.find((status) => status.id === Selectedstatus.id)?.label
    })
  }

  //const { mutateAsync: updatePaymentRequest, isSaving } = useUpdatePaymentRequest();
  const handleUpdate = async () => {
    const payload = {
      status: currentStatus.value
    }

    /*
    await validatePaymentRequest({ id: item.id, payload: payload }, {
      onSuccess: () => {
        toaster.create({
          title: "Solicitud de pago validada correctamente",
          type: "success",
        });
        fetchPaymentRequests();
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error.message || "Error al validar la solicitud de pago",
          type: "error",
        });
      },
    });
    */
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <Modal
          trigger={
            <Box>
              <Tooltip
                content='Editar Solicitud de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='yellow' color='white' size='xs'>
                  <HiPencil />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Editar Solicitud de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          //onSave={handleUpdate}
        >
          <Stack spacing={4}>
            <Stack
              direction='column'
              spacing={4}
              w="full"
            >
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Field label="ID de Solicitud de Pago" isRequired>
                  <Span>{item.id}</Span>
                </Field>
                <Field label="Monto Solicitado" isRequired>
                  <Span>{item.amount}</Span>
                </Field>
                <Field label="Estado Actual" isRequired>
                  <Span>{item.status}</Span>
                </Field>
                <Field label="Cambiar estado de solicitud" isRequired>
                  <ReactSelect
                    options={statusOptions}
                    value={currentStatus}
                    onChange={(option) => { handleChangeStatus(option) }}
                  />
                </Field>
              </SimpleGrid>
            </Stack>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  );
}

UpdatePaymentRequestModal.propTypes = {
  item: PropTypes.object,
  fetchPaymentRequests: PropTypes.func,
  statusOptions: PropTypes.arrayOf(PropTypes.object)
};