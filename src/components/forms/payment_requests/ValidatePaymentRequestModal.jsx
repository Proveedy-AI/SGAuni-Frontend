import { Button, Field, ModalSimple, Tooltip } from "@/components/ui";
import { Box, Flex, IconButton, Span, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

export const ValidatePaymentRequestModal = ({ item }) => {
  const [open, setOpen] = useState(false);

  //const { mutateAsync: validatePaymentRequest, isSaving } = useValidatePaymentRequest();
  // Simular el isSaving
  const [isSaving, setIsSaving] = useState(false);

  const handleValidate = async () => {
    /*
    await validatePaymentRequest({ id: item.id }, {
      onSuccess: () => {
        toaster.create({
          title: "Solicitud de pago validada correctamente",
          type: "success",
        });
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

    // Simulación de validación
    setIsSaving(true);
    console.log("Validando solicitud de pago:", item.id);
    setTimeout(() => {
      console.log("Solicitud de pago validada correctamente");
      setIsSaving(false);
      setOpen(false);
    }, 1000);
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Validar Solicitud de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='green' size='xs'>
                  <HiCheck />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Validar Solicitud de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction='column'
              spacing={4}
              w="full"
            >
              <Span fontSize={16} fontWeight={'semibold'} display='block'>Estás seguro que quieres validar la solicitud {`#${item.id}`}?</Span>
              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  size='sm'
                  bg='red'
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  bg='green'
                  isLoading={isSaving}
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

ValidatePaymentRequestModal.propTypes = {
  item: PropTypes.object
};