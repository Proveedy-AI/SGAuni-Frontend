import { Field, ModalSimple } from "@/components/ui"
import { Badge, Flex, IconButton, Stack, Text } from "@chakra-ui/react"
import PropTypes from "prop-types";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";

export const ViewModalityRule = ({ item }) => {
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
          title="Ver Regla de Modalidad"
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
                {item.field_name}
              </Text>
            </Field>
            
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Activo'>
                <Badge bg={item.is_required ? 'green' : 'red'} color='white'>
                  {item.is_required ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere pre-maestría'>
                <Badge bg={item.is_visible ? 'green' : 'red'} color='white'>
                  {item.is_visible ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ViewModalityRule.propTypes = {
  item: PropTypes.object
};