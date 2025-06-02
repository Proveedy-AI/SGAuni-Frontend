import CustomSelect from "@/components/select/customSelect";
import { Field, Button, ControlledModal, Radio, RadioGroup, DatePicker, toaster } from "@/components/ui"
import { Flex, HStack, Input, Stack } from "@chakra-ui/react"
import { useState } from "react";
import { HiPlus } from "react-icons/hi2"
import { OPTIONS } from "@/data"; // Asegúrate de que este archivo exista y contenga las opciones

export const CreateMethod = ({ setAdmissionMethods, handleOpenModal, isCreateModalOpen, setIsModalOpen, handleCloseModal }) => {
  const [requiresEssay, setRequiresEssay] = useState("true");
  const [requiresInterview, setRequiresInterview] = useState("true");
  const [requiresDocument, setRequiresDocument] = useState("true");
  const [examDates, setExamDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedField, setSelectedField] = useState(null);

  const handleExamDateChange = (range) => setExamDates(range);

  const handleFieldChange = (value) => {
    setSelectedField(value);
  }

  //const { mutateAsync: createMethod, isPending } = useCreateMethod();
  const [isPending, setIsPending] = useState(false);

  const handleCreateMethod = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;

    const newMethod = {
      id: Math.random().toString(36).substring(2, 15),
      name: elements.namedItem('name').value,
      is_active: true,
      requires_pre_master_exam: true, //<- Campo no incluido en el formulario por el momento
      requires_interview: requiresInterview === "true",
      requires_essay: requiresEssay === "true",
      description: elements.namedItem('description').value,
      exam_start_date: examDates.startDate,
      exam_end_date: examDates.endDate,
      requires_document: requiresDocument === "true",
      document_name: requiresDocument === "true" ? elements.documentName.value : null,
      required_field: selectedField ? selectedField.value : null,
      essay_width: 500, //<- Campo no incluido en el formulario por el momento
      interview_width: 300, //<- Campo no incluido en el formulario por el momento
      min_grade: 75, //<- Campo no incluido en el formulario por el momento
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      setIsPending(true);
      console.log/newMethod
      //await createMethod(newMethod); // Cuando la API esté lista,

      setTimeout(() => {
        setAdmissionMethods(prevMethods => [...prevMethods, newMethod]);
        
        setIsPending(false);
        handleCloseModal('create');

        toaster.create({
          title: 'Modalidad creada correctamente',
          type: 'success',
        });
      }, 1500); // Simulación de la API
      
    } catch (error) {
      toaster.create({
        title: error?.response?.data?.message || 'Error al crear modalidad',
        type: 'error',
      });
    }
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
                <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
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
                </Flex>
                <Field label='Fechas de examen'>
                  <DatePicker
                    startDate={examDates.startDate}
                    endDate={examDates.endDate}
                    onDateChange={handleExamDateChange}
                    buttonSize="sm"
                  />
                </Field>
                <Flex alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
                  <Field label='Requiere subir documento'>
                    <RadioGroup
                      name="requiresDocument"
                      value={requiresDocument}
                      onChange={(e) => setRequiresDocument(e.target.value)}
                      direction="row"
                    >
                      <Flex gap="5">
                        <Radio value={"true"}>Sí</Radio>
                        <Radio value={"false"}>No</Radio>
                      </Flex>
                    </RadioGroup>
                  </Field>
                  {
                    requiresDocument === "true" && (
                      <Field label='Nombre del documento'>
                        <Input required type="text" name="documentName" placeholder='Ingrese el tipo de documento' />
                      </Field>
                    )
                  }
                </Flex>
                <Field label='Seleccionar campos obligatorios'>
                  <CustomSelect
                    options={OPTIONS}
                    value={selectedField}
                    onChange={(value) => handleFieldChange(value)}
                    isDisabled={false}
                    isLoading={false}
                    isSearchable={true}
                    name="requiredField"
                  />
                </Field>
                
                <Flex justify='end' mt='6' gap='2'>
									<Button
										variant='outline'
										colorPalette='red'
										onClick={() =>
											setIsModalOpen((s) => ({ ...s, create: false }))
										}
									>
										Cancelar
									</Button>
									<Button type='submit' bg='uni.secondary' color='white'>
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