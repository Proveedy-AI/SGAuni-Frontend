import CustomSelect from "@/components/select/customSelect";
import { Field, Button, ControlledModal, Radio, RadioGroup, DatePicker } from "@/components/ui"
import { Flex, HStack, Input, Stack } from "@chakra-ui/react"
import { useState } from "react";
import { HiPlus } from "react-icons/hi2"

const OPTIONS = [
  {
    id: 1,
    label: 'Todos los campos',
    value: 'all',
  },
  {
    id: 2,
    label: 'Campo 1',
    value: 'field1',
  },
  {
    id: 3,
    label: 'Campo 2',
    value: 'field2',
  },
  {
    id: 4,
    label: 'Campo 3',
    value: 'field3',
  },
  {
    id: 5,
    label: 'Campo 4',
    value: 'field4',
  }
]

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
    console.log(value);
    setSelectedField(value);
  }

  const handleCreateMethod = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;

    const newMethod = {
      id: Math.random().toString(36).substring(2, 15),
      name: elements.namedItem('name').value,
      isActive: true,
      requiresPreMasterExam: true, //<- Campo no incluido en el formulario por el momento
      requiresInterview: requiresInterview === "true",
      requiresEssay: requiresEssay === "true",
      description: elements.namedItem('description').value,
      examStartDate: examDates.startDate,
      examEndDate: examDates.endDate,
      requiresDocument: requiresDocument === "true",
      documentName: requiresDocument === "true" ? elements.documentName.value : null,
      requiredField: selectedField ? selectedField.value : null,
      essayWidth: 500, //<- Campo no incluido en el formulario por el momento
      interviewWidth: 300, //<- Campo no incluido en el formulario por el momento
      min_grade: 75, //<- Campo no incluido en el formulario por el momento
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setAdmissionMethods(prevMethods => [...prevMethods, newMethod]);

    //await createAdmissionMethod(newMethod); // Cuando la API esté lista,

    handleCloseModal('create');
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