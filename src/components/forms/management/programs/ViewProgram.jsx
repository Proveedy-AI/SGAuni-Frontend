import { Field, ModalSimple } from "@/components/ui";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";

export const ViewProgram = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <IconButton colorPalette='blue' size='xs'>
              <HiEye />
            </IconButton>
          }
          title="Ver Programa"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Field label="Nombre">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {item.name}
              </Text>
            </Field>

            <Field label="Tipo">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {item.type_detail.name}
              </Text>
            </Field>

            <Field label="Coordinador">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {item.coordinator_name}
              </Text>
            </Field>

            <Field label="Precio por crédito">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {item.price_credit}
              </Text>
            </Field>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}