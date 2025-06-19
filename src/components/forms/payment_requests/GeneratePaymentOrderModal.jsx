import { Field, ModalSimple } from "@/components/ui";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiArrowUp } from "react-icons/hi2";
import PropTypes from "prop-types";

export const GeneratePaymentOrderModal = ({ item, fetchData }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <IconButton colorPalette='purple' size='xs'>
              <HiArrowUp />
            </IconButton>
          }
          title="Generar Orden de Pago"
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

GeneratePaymentOrderModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func
};