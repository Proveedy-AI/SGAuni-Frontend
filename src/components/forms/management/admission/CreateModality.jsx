import CustomSelect from "@/components/select/customSelect";
import { Field, Button, ControlledModal, Radio, RadioGroup, DatePicker, toaster } from "@/components/ui"
import { Flex, HStack, Input, Stack } from "@chakra-ui/react"
import { useState } from "react";
import { HiPlus } from "react-icons/hi2"
import { useCreateModality } from "@/hooks/modalities";

export const CreateModality = ({ setAdmissionMethods, handleOpenModal, isCreateModalOpen, setIsModalOpen, handleCloseModal }) => {
  const { mutateAsync: register, isPending: loading } = useCreateModality();

  const [requieresPreMasterExam, setRequiresPreMasterExam] = useState("true");
  const [requiresEssay, setRequiresEssay] = useState("true");
  const [requiresInterview, setRequiresInterview] = useState("true");
  const [minGrade, setMinGrade] = useState("20");

  const handleCreateMethod = async (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;

    if (!minGrade) return toaster.create({
      title: 'Debe seleccionar un grado mínimo',
      type: 'error',
    })

    const payload = {
      name: elements.namedItem('name')?.value,
      requires_pre_master_exam: requieresPreMasterExam === "true",
      requires_interview: requiresInterview === "true",
      requires_essay: requiresEssay === "true",
      description: elements.namedItem('description')?.value,
      essay_weight: elements.namedItem('essay_weight')?.value || "0.5",
      interview_weight: elements.namedItem('interview_weight')?.value || "0.5",
      min_grade: minGrade, //<- Corregir este campo
    }

    await register(payload, {
			onSuccess: (newMethod) => {
				toaster.create({
					title: 'Modalidad registrado correctamente',
					type: 'success',
				});
        // Desestructuración para eliminar el campo description
        const { description:_, essay_weight:__, interview_weight:___, rules:____, ...methodSaved } = newMethod;
        setAdmissionMethods(prev => [...prev, methodSaved]);
        handleCloseModal('create');
			},
			onError: (error) => {
				toaster.create({
					title: error.message || 'Error al registrar la modalidad',
					type: 'error',
				});
			},
		});
  }

  return (
    <>
      <HStack w="full" justify="flex-end">
        <Button fontSize='16px' minWidth='150px' color='white' background='#711610' borderRadius={8} onClick={() => handleOpenModal('create')}>
          <HiPlus size={12} /> Crear modalidad
        </Button>
      </HStack>

      <Stack css={{ '--field-label-width': '140px' }}>
        <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
          <ControlledModal
            title='Crear Modalidad'
            placement='center'
            size='xl'
            open={isCreateModalOpen}
            onOpenChange={e => setIsModalOpen(s => ({ ...s, create: e.open }))}
            hiddenFooter={true}
          >
            <Stack>
              <form onSubmit={handleCreateMethod}>
                <Field label='Nombre de la modalidad' helperText='Ingrese el nombre de la modalidad de admisión'>
                  <Input required type="text" name="name" placeholder='Ingrese nombres y apellidos' />
                </Field>
                <Field label='Descripción' helperText='Ingrese una breve descripción de la modalidad'>
                  <Input required type="text" name="description" placeholder='Descripción de la modalidad' />
                </Field>
                <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
                  <Field marginBottom="4" label='Requiere pre-maestría'>
                    <RadioGroup
                      name="requiresPreMasterExam"
                      value={requieresPreMasterExam}
                      onChange={(e) => setRequiresPreMasterExam(e.target.value)}
                      direction="row"
                    >
                      <Flex gap="5">
                        <Radio value={"true"}>Sí</Radio>
                        <Radio value={"false"}>No</Radio>
                      </Flex>
                    </RadioGroup>
                  </Field>
                  <Field marginBottom="4" label='Grado mínimo'>
                    <Input
                      required
                      type="number"
                      name="min_grade"
                      placeholder='Ingrese el grado mínimo'
                      value={minGrade}
                      onChange={e => setMinGrade(e.target.value)}
                      min={0}
                      max={20}
                      step={0.5}
                    />
                  </Field>
                </Flex>
                <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
                  <Field label='Requiere ensayo'>
                    <RadioGroup
                      name="requiresEssay"
                      value={requiresEssay}
                      onChange={(e) => setRequiresEssay(e.target.value)}
                      direction="row"
                    >
                      <Flex gap="5">
                        <Radio value={"true"}>Sí</Radio>
                        <Radio value={"false"}>No</Radio>
                      </Flex>
                    </RadioGroup>
                  </Field>
                  {requiresEssay === "true" && (
                    <Field label='Peso del ensayo (0 a 1)'>
                      <Input
                        required
                        type="number"
                        name="essay_weight"
                        placeholder='Ej: 0.5'
                        setValue={0.5}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </Field>
                  )}
                </Flex>
                <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
                  <Field label='Requiere entrevista personal'>
                    <RadioGroup
                      name="requiresInterview"
                      value={requiresInterview}
                      onChange={(e) => setRequiresInterview(e.target.value)}
                      direction="row"
                    >
                      <Flex gap="5">
                        <Radio value={"true"}>Sí</Radio>
                        <Radio value={"false"}>No</Radio>
                      </Flex>
                    </RadioGroup>
                  </Field>
                  {requiresInterview === "true" && (
                    <Field label='Peso de la entrevista (0 a 1)'>
                      <Input
                        required
                        type="number"
                        name="interview_weight"
                        setValue={0.5}
                        placeholder='Ej: 0.5'
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </Field>
                  )}
                </Flex>
                
                <Flex justify='end' mt='6' gap='2'>
                  <Button disabled={loading} variant='outline' colorPalette='red' onClick={() => setIsModalOpen((s) => ({ ...s, create: false }))}>
                    Cancelar
                  </Button>
                  <Button disabled={loading} type='submit' bg='uni.secondary' color='white'>
                    Crear
                  </Button>
                </Flex>
              </form>
            </Stack>
          </ControlledModal>
        </Field>
      </Stack>
    </>
  )
}