import CustomSelect from "@/components/select/customSelect";
import {
  Field,
  Button,
  ControlledModal,
  Radio,
  RadioGroup,
  toaster,
} from "@/components/ui";
import { Flex, HStack, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { COORDINADORES } from "@/data"; // Asume que COORDINADORES está estructurado como [[{ id, name }, ...]]

export const CreateProgram = ({
  setPrograms,
  handleOpenModal,
  isCreateModalOpen,
  setIsModalOpen,
  handleCloseModal,
}) => {
  // Para elegir coordinador: CustomSelect maneja objetos { value, label }
  const [selectedCoordinator, setSelectedCoordinator] = useState(COORDINADORES[0].id);
  const [degreeType, setDegreeType] = useState("Maestría");
  const [programType, setProgramType] = useState("Académico");
  const [modality, setModality] = useState("Presencial");
  const [isPending, setIsPending] = useState(false);

  const handleCoordinatorChange = (option) => {
    setSelectedCoordinator(option);
  };

  const handleCreateProgram = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;

    const newProgram = {
      id: Math.random().toString(36).substring(2, 15),
      code: elements.namedItem("code").value,
      name: elements.namedItem("name").value,
      description: elements.namedItem("description").value,
      duration_months: Number(elements.namedItem("duration").value),
      degree_type: degreeType,
      type: programType,
      modality: modality,
      status: "Activo",
      coordinador_id: Number(selectedCoordinator),
      price_credit: Number(elements.namedItem("priceCredit").value),
      create_uid: 1, // Si tuvieras usuario autenticado, se podría asignar aquí
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    try {
      setIsPending(true);
      // Simulación de llamada a la API
      setTimeout(() => {
        setPrograms((prev) => [...prev, newProgram]);
        setIsPending(false);
        handleCloseModal("create");

        toaster.create({
          title: "Programa creado correctamente",
          type: "success",
        });
      }, 1500);
    } catch (error) {
      toaster.create({
        title: error?.response?.data?.message || "Error al crear programa",
        type: "error",
      });
    }
  };

  // Preparar opciones para el select de coordinadores
  const coordinatorOptions = COORDINADORES.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  return (
    <>
      <HStack w="full" justify="flex-end">
        <Button
          fontSize="16px"
          minWidth="150px"
          color="white"
          background="#711610"
          borderRadius={8}
          onClick={() => handleOpenModal("create")}
        >
          <HiPlus size={12} /> Crear programa
        </Button>
      </HStack>

      <Stack css={{ "--field-label-width": "140px" }} mt="2">
        <Field orientation={{ base: "vertical", sm: "horizontal" }}>
          <ControlledModal
            title="Crear Programa"
            placement="center"
            size="xl"
            open={isCreateModalOpen}
            onOpenChange={(e) =>
              setIsModalOpen((s) => ({ ...s, create: e.open }))
            }
            hiddenFooter={true}
          >
            <Stack spacing={4}>
              <form onSubmit={handleCreateProgram}>
                <Field
                  label="Código"
                  helperText="Por ejemplo: MCC-2025"
                >
                  <Input
                    required
                    type="text"
                    name="code"
                    placeholder="Código del programa"
                  />
                </Field>

                <Field
                  label="Nombre"
                  helperText="Nombre completo del programa"
                >
                  <Input
                    required
                    type="text"
                    name="name"
                    placeholder="Nombre del programa"
                  />
                </Field>

                <Field
                  label="Descripción"
                  helperText="Breve descripción del contenido"
                >
                  <Input
                    required
                    type="text"
                    name="description"
                    placeholder="Descripción del programa"
                  />
                </Field>

                <Flex gap={4} flexDir={{ base: "column", sm: "row" }}>
                  <Field label="Duración (meses)">
                    <Input
                      required
                      type="number"
                      name="duration"
                      placeholder="Duración en meses"
                    />
                  </Field>
                  <Field label="Precio por crédito">
                    <Input
                      required
                      type="number"
                      name="priceCredit"
                      placeholder="Precio por crédito"
                    />
                  </Field>
                </Flex>
                <Field label="Tipo de grado">
                  <RadioGroup
                    name="degreeType"
                    value={degreeType}
                    onChange={(e) => setDegreeType(e.target.value)}
                    direction="row"
                  >
                    <Flex gap={5}>
                      <Radio value="Maestría">Maestría</Radio>
                      <Radio value="Doctorado">Doctorado</Radio>
                    </Flex>
                  </RadioGroup>
                </Field>

                <Field label="Tipo">
                  <RadioGroup
                    name="programType"
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
                    direction="row"
                  >
                    <Flex gap={5}>
                      <Radio value="Académico">Académico</Radio>
                      <Radio value="Investigación">Investigación</Radio>
                    </Flex>
                  </RadioGroup>
                </Field>

                <Field label="Modalidad">
                  <RadioGroup
                    name="modality"
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    direction="row"
                  >
                    <Flex gap={5}>
                      <Radio value="Presencial">Presencial</Radio>
                      <Radio value="Virtual">Virtual</Radio>
                      <Radio value="Semipresencial">Semipresencial</Radio>
                    </Flex>
                  </RadioGroup>
                </Field>

                <Field label="Coordinador">
                  <CustomSelect
                    required
                    options={coordinatorOptions}
                    value={selectedCoordinator.toString()}
                    onChange={handleCoordinatorChange}
                    isDisabled={false}
                    isLoading={false}
                    isSearchable={true}
                    name="coordinator"
                  />
                </Field>

                <Flex justify="end" mt="6" gap="2">
                  <Button
                    variant="outline"
                    colorPalette="red"
                    onClick={() =>
                      setIsModalOpen((s) => ({ ...s, create: false }))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    bg="uni.secondary"
                    color="white"
                    isLoading={isPending}
                  >
                    Crear
                  </Button>
                </Flex>
              </form>
            </Stack>
          </ControlledModal>
        </Field>
      </Stack>
    </>
  );
};
