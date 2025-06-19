import { Field, ModalSimple } from "@/components/ui";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import PropTypes from "prop-types";

export const ValidatePaymentOrderModal = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <IconButton colorPalette='green' size='xs'>
              <HiCheck />
            </IconButton>
          }
          title="Validar Manualmente Orden de Pago"
          placement="center"
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
              
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ValidatePaymentOrderModal.propTypes = {
  item: PropTypes.object
};