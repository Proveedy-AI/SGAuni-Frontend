import { ControlledModal, Field } from "@/components/ui";
import { Badge, Flex, Stack, Text } from "@chakra-ui/react";
import { COORDINADORES } from "@/data";

export const ViewProgram = ({ selectedProgram, isViewModalOpen, setIsModalOpen, handleCloseModal }) => {
  
  const coordinatorList = COORDINADORES;
  const coordinatorName = coordinatorList.find(
    (c) => c.id === selectedProgram?.coordinador_id
  )?.name;

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ControlledModal
          title="Ver Programa"
          placement="center"
          size="xl"
          open={isViewModalOpen}
          onOpenChange={(e) =>
            setIsModalOpen((s) => ({ ...s, view: e.open }))
          }
          onSave={() => handleCloseModal("view")}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Field label="Código">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {selectedProgram?.code}
              </Text>
            </Field>

            <Field label="Nombre">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {selectedProgram?.name}
              </Text>
            </Field>

            <Field label="Descripción">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {selectedProgram?.description}
              </Text>
            </Field>

            <Flex gap={6} flexDir={{ base: "column", sm: "row" }}>
              <Field label="Duración (meses)">
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {selectedProgram?.duration_months}
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
                  S/ {selectedProgram?.price_credit}
                </Text>
              </Field>
            </Flex>

            <Flex gap={6} flexDir={{ base: "column", sm: "row" }}>
              <Field label="Tipo de grado">
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {selectedProgram?.degree_type}
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
                  {selectedProgram?.type}
                </Text>
              </Field>
            </Flex>

            <Flex gap={6} flexDir={{ base: "column", sm: "row" }}>
              <Field label="Modalidad">
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {selectedProgram?.modality}
                </Text>
              </Field>

              <Field label="Estado">
                <Badge
                  bg={
                    selectedProgram?.status === "Activo"
                      ? "green"
                      : "red"
                  }
                  color="white"
                >
                  {selectedProgram?.status}
                </Badge>
              </Field>
            </Flex>

            <Field label="Coordinador">
              <Text
                w="full"
                py={2}
                px={3}
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                {coordinatorName || "-"}
              </Text>
            </Field>

            <Flex gap={6} flexDir={{ base: "column", sm: "row" }}>
              <Field label="Creado">
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {selectedProgram?.create_at
                    ? new Date(selectedProgram.create_at).toLocaleString()
                    : ""}
                </Text>
              </Field>

              <Field label="Actualizado">
                <Text
                  w="full"
                  py={2}
                  px={3}
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  {selectedProgram?.update_at
                    ? new Date(selectedProgram.update_at).toLocaleString()
                    : ""}
                </Text>
              </Field>
            </Flex>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  );
};
