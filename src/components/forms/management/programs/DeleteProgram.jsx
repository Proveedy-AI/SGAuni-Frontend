import { ControlledModal, Field } from "@/components/ui";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";

export const DeleteProgram = ({ selectedProgram, setPrograms, handleCloseModal, isDeleteModalOpen, setIsModalOpen }) => {
  const handleDeleteProgram = () => {
    if (!selectedProgram) return;
    setPrograms((prev) =>
      prev.filter((program) => program.id !== selectedProgram.id)
    );
    handleCloseModal("delete");
  };

  return (
    <Stack css={{ "--field-label-width": "140px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ControlledModal
          title="Eliminar Programa"
          placement="center"
          size="xl"
          open={isDeleteModalOpen}
          onOpenChange={(e) =>
            setIsModalOpen((s) => ({ ...s, delete: e.open }))
          }
          hiddenFooter={true}
        >
          <Text>
            ¿Deseas eliminar el programa{" "}
            <b>{selectedProgram?.name || ""}</b>?
          </Text>
          <Flex justify="end" mt="6" gap="2">
            <Button
              variant="outline"
              colorPalette="red"
              onClick={() =>
                setIsModalOpen((s) => ({ ...s, delete: false }))
              }
            >
              Cancelar
            </Button>
            <Button onClick={handleDeleteProgram} bg="uni.secondary" color="white">
              Eliminar
            </Button>
          </Flex>
        </ControlledModal>
      </Field>
    </Stack>
  );
};
