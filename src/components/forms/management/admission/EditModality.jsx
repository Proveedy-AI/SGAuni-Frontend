import CustomSelect from "@/components/select/customSelect";
import { ControlledModal, Field, Radio, RadioGroup, toaster } from "@/components/ui";
import { Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OPTIONS } from "@/data/"; // Asegúrate de que este archivo exista y contenga las opciones
import { useReadOneModality, useUpdateModality } from "@/hooks/modalities";

export const EditModality = ({ setMethods, selectedMethod, setSelectedMethod, isEditModalOpen, setIsModalOpen, handleCloseModal }) => {
  const { data: dataModality, refetch: fetchModality } = useReadOneModality({
    id: selectedMethod?.id,
    enabled: false
  });

  const [modalityEditable, setModalityEditable] = useState(null);
  useEffect(() => {
    if (isEditModalOpen && selectedMethod) {
      fetchModality();
      setModalityEditable(dataModality);
    }

  }, [dataModality, isEditModalOpen, selectedMethod?.id, fetchModality])

  const { mutateAsync: updateMethod, isPending } = useUpdateModality();

  const handleEditMethod = async () => {
    if (modalityEditable === dataModality) return;

    const {
      name,
      description,
      essay_weight,
      interview_weight,
      min_grade,
    } = modalityEditable

    if (!name && !description && !essay_weight && !interview_weight && !min_grade) return;

    const { id:_, rules:__, total_rules:___, enabled:____,...payload} = modalityEditable;

    await updateMethod({ id: selectedMethod.id, payload }, {
			onSuccess: (newMethod) => {
				toaster.create({
					title: 'Modalidad actualizada correctamente',
					type: 'success',
				});
        // Desestructuración para eliminar el campo description
        const { description:_, essay_weight:__, interview_weight:___, rules:____, ...methodSaved } = newMethod;
        setMethods(prev => [...prev.filter(m => m.id !== methodSaved.id), methodSaved]);
        handleCloseModal('edit');
			},
			onError: (error) => {
				toaster.create({
					title: error.message || 'Error al actualizar la modalidad',
					type: 'error',
				});
			},
		});

  }

  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ControlledModal
          title='Editar Modalidad'
          placement='center'
          size='xl'
          open={isEditModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, edit: e.open }))}
          onSave={() => handleEditMethod()}
          isLoading={isPending}
        >
          <Stack spacing={4}>
            <Field label='Nombre de la modalidad'>
              <Input
                disabled={!dataModality}
                value={modalityEditable?.name || ''}
                onChange={(e) => setModalityEditable(prev => ({ ...prev, name: e.target.value }))}
              />
            </Field>
            <Field label='Descripción'>
              <Textarea
                disabled={!dataModality}
                value={modalityEditable?.description || ''}
                onChange={(e) => setModalityEditable(prev => ({ ...prev, description: e.target.value }))}
              />
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere pre-maestría'>
                <RadioGroup
                  value={modalityEditable?.requires_pre_master_exam ? "true" : "false"}
                  onChange={(e) => setModalityEditable(prev => ({ ...prev, requires_pre_master_exam: e.target.value === "true" }))}
                  direction="row"
                >
                  <Flex gap="5">
                    <Radio value={"true"}>Sí</Radio>
                    <Radio value={"false"}>No</Radio>
                  </Flex>
                </RadioGroup>
              </Field>
              <Field label='Grado mínimo'>
                <Input
                  disabled={!dataModality}
                  type="number"
                  value={modalityEditable?.min_grade || ''}
                  onChange={(e) => setModalityEditable(prev => ({ ...prev, min_grade: e.target.value }))}
                  placeholder='Ingrese el grado mínimo'
                />
              </Field>
            </Flex>
            <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
               <Field label='Requiere ensayo'>
                <RadioGroup
                  value={modalityEditable?.requires_essay ? "true" : "false"}
                  onChange={(e) => setModalityEditable(prev => ({ ...prev, requires_essay: e.target.value === "true" }))}
                  direction="row"
                >
                  <Flex gap="5">
                    <Radio value={"true"}>Sí</Radio>
                    <Radio value={"false"}>No</Radio>
                  </Flex>
                </RadioGroup>
              </Field>
              {modalityEditable?.requires_essay && (
                <Field label='Peso del ensayo (0 a 1)'>
                  <Input
                    required
                    type="number"
                    name="essay_weight"
                    placeholder='Ej: 0.5'
                    value={modalityEditable?.essay_weight || '' }
                    onChange={(e) => setModalityEditable(prev => ({ ...prev, essay_weight: e.target.value}))}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </Field>
              )}
            </Flex>
            <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
              <Field label='Requiere entrevista personal'>
                <RadioGroup
                  value={modalityEditable?.requires_interview ? "true" : "false"}
                  onChange={(e) => setModalityEditable(prev => ({ ...prev, requires_interview: e.target.value === "true" }))}
                  direction="row"
                >
                  <Flex gap="5">
                    <Radio value={"true"}>Sí</Radio>
                    <Radio value={"false"}>No</Radio>
                  </Flex>
                </RadioGroup>
              </Field>
              {modalityEditable?.requires_interview && (
                <Field label='Peso de la entrevista (0 a 1)'>
                  <Input
                    required
                    type="number"
                    value={modalityEditable?.interview_weight || ''}
                    onChange={(e) => setModalityEditable(prev => ({ ...prev, interview_weight: e.target.value}))}
                    placeholder='Ej: 0.5'
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </Field>
              )}
            </Flex>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}