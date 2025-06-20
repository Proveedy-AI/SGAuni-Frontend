import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";

export const ViewPaymentRequestModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  console.log(item)
  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          title="Ver Detalles de Solicitud de Pago"
          placement="center"
          trigger={
            <Box>
              <Tooltip
                content='Ver Detalles de Solicitud de Pago'
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
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              w="full"
            >
              <Stack flex={1} spacing={4}>
                <Field label="Propósito de la solicitud">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.purpose_display}
                  </Text>
                </Field>
                 <Field label="Tipo de documento">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.document_type_display}
                  </Text>
                </Field>
                <Field label="DNI del postulante">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.num_document}
                  </Text>
                </Field>
              </Stack>
              <Stack flex={1} spacing={4}>
                <Field label="Método de pago">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.payment_method_display}
                  </Text>
                </Field>
                <Field label="Pago (En soles S/.)">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.amount}
                  </Text>
                </Field>
                <Field label="Estado">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.status_display}
                  </Text>
                </Field>
              </Stack>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ViewPaymentRequestModal.propTypes = {
  item: PropTypes.object
};