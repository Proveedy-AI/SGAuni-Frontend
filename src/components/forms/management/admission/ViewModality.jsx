import { Field, ModalSimple } from "@/components/ui"
import { Badge, Flex, IconButton, Stack, Text } from "@chakra-ui/react"
import PropTypes from "prop-types";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";

export const ViewModality = ({ item }) => {
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
          title="Ver Modalidad"
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
            <Field label="descripcion">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {item.description}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Activo'>
                <Badge bg={item.enabled ? 'green' : 'red'} color='white'>
                  {item.enabled ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere pre-maestría'>
                <Badge bg={item.requires_pre_master_exam ? 'green' : 'red'} color='white'>
                  {item.requires_pre_master_exam ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere entrevista'>
                <Badge bg={item.requires_interview ? 'green' : 'red'} color='white'>
                  {item.requires_interview ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere ensayo'>
                <Badge bg={item.requires_essay ? 'green' : 'red'} color='white'>
                  {item.requires_essay ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>

            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Ancho ensayo'>
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {item.essay_weight}
                </Text>
              </Field>
              <Field label='Ancho entrevista'>
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {item.interview_weight}
                </Text>
              </Field>
            </Flex>

            <Field label='Nota mínima'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {item.min_grade}
              </Text>
            </Field>
            <Field label='Reglas'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {Array.isArray(item.rules) && item.rules.length > 0
                  ? item.rules.map((rule, idx) => (
                      <span key={idx}>{rule}{idx < item.rules.length - 1 ? ', ' : ''}</span>
                    ))
                  : 'Sin reglas'}
              </Text>
            </Field>
            <Field label='Total de reglas'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {item.total_rules}
              </Text>
            </Field>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ViewModality.propTypes = {
  item: PropTypes.object
};