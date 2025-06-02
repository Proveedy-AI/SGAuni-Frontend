import CustomSelect from "@/components/select/customSelect";
import {
  ControlledModal,
  Field,
  Radio,
  RadioGroup,
  toaster,
} from "@/components/ui";
import { Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { COORDINADORES } from "@/data";

export const EditProgram = ({ setPrograms, selectedProgram, setSelectedProgram, isEditModalOpen, setIsModalOpen, handleCloseModal }) => {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isEditModalOpen && selectedProgram) {
      setSelectedProgram({ ...selectedProgram });
    }
  }, [isEditModalOpen]);

  const handleEditProgram = () => {
    if (!selectedProgram) return;

    const {
      name,
      code,
      duration_months,
      price_credit
    } = selectedProgram

    if ( !name.trim() || !code.trim() || !duration_months || !price_credit) {
      toaster.create({
        title: "Complete los campos obligatorios",
        type: "error",
      });
      return;
    }

    if (!selectedProgram.coordinador_id) {
      toaster.create({
        title: "Seleccione un coordinador",
        type: "error",
      });
      return;
    }

    try {
      setIsPending(true);
      // Simulación de la llamada a la API
      setTimeout(() => {
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === selectedProgram.id
              ? {
                  ...selectedProgram,
                  update_at: new Date().toISOString(),
                }
              : p
          )
        );
        setIsPending(false);
        handleCloseModal("edit");
        setSelectedProgram(null);
        toaster.create({
          title: "Programa actualizado correctamente",
          type: "success",
        });
      }, 1500);
    } catch (error) {
      setIsPending(false);
      toaster.create({
        title: error?.response?.data?.message || "Error al editar programa",
        type: "error",
      });
    }
  };

  // Opciones para el select de coordinadores
  const coordinatorOptions = COORDINADORES.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ControlledModal
          title="Editar Programa"
          placement="center"
          size="xl"
          open={isEditModalOpen}
          onOpenChange={(e) =>
            setIsModalOpen((s) => ({ ...s, edit: e.open }))
          }
          onSave={handleEditProgram}
          isLoading={isPending}
        >
          <Stack spacing={4}>
            <Field label="Código">
              <Input
                value={selectedProgram?.code || ""}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                placeholder="Código del programa"
              />
            </Field>

            <Field label="Nombre">
              <Input
                value={selectedProgram?.name || ""}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Nombre del programa"
              />
            </Field>

            <Field label="Descripción">
              <Textarea
                value={selectedProgram?.description || ""}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción del programa"
              />
            </Field>

            <Flex gap={4} flexDir={{ base: "column", sm: "row" }}>
              <Field label="Duración (meses)">
                <Input
                  type="number"
                  value={selectedProgram?.duration_months || ""}
                  onChange={(e) =>
                    setSelectedProgram((prev) => ({
                      ...prev,
                      duration_months: Number(e.target.value),
                    }))
                  }
                  placeholder="Duración en meses"
                />
              </Field>

              <Field label="Precio por crédito">
                <Input
                  type="number"
                  value={selectedProgram?.price_credit || ""}
                  onChange={(e) =>
                    setSelectedProgram((prev) => ({
                      ...prev,
                      price_credit: Number(e.target.value),
                    }))
                  }
                  placeholder="Precio por crédito"
                />
              </Field>
            </Flex>
            
            <Field label="Tipo de grado">
              <RadioGroup
                value={selectedProgram?.degree_type || "Maestría"}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    degree_type: e.target.value,
                  }))
                }
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
                value={selectedProgram?.type || "Académico"}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                direction="row"
              >
                <Flex gap={5}>
                  <Radio value="Académico">Académico</Radio>
                  <Radio value="Investigación">Investigación</Radio>
                  <Radio value="Profesionalizante">
                    Profesionalizante
                  </Radio>
                </Flex>
              </RadioGroup>
            </Field>

            <Field label="Modalidad">
              <RadioGroup
                value={selectedProgram?.modality || "Presencial"}
                onChange={(e) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    modality: e.target.value,
                  }))
                }
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
                options={coordinatorOptions}
                value={COORDINADORES.find(coordinador => coordinador.id === selectedProgram?.coordinador_id )?.id.toString()}
                onChange={(value) =>
                  setSelectedProgram((prev) => ({
                    ...prev,
                    coordinador_id: Number(value),
                  }))
                }
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name="coordinator"
              />
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  );
};
