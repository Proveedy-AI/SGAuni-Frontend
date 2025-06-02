import CustomSelect from "@/components/select/customSelect";
import { ControlledModal, DatePicker, Field, Radio, RadioGroup, toaster } from "@/components/ui";
import { Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OPTIONS } from "@/data/"; // Asegúrate de que este archivo exista y contenga las opciones
import { se } from "date-fns/locale";

export const EditMethodModal = ({ setMethods, selectedMethod, setSelectedMethod, isEditModalOpen, setIsModalOpen, handleCloseModal }) => {
  //const { mutateAsync: updateMethod, isPending } = useUpdateMethod();
  const [isPending, setIsPending] = useState(false);
  //const { data: methoDetail } = useReadMethodById({ id: selectedMethod?.id });
  
  /*useEffect(() => {
      if (methoDetail && isEditModalOpen) {
        selectedMethod((prev) => ({ ...prev, ...methoDetail }));
      }
    }, [methoDetail, isEditModalOpen]);
  */

  const handleEditMethod = async () => {
    const {
      id,
      name,
      requires_pre_master_exam,
      requires_interview,
      requires_essay,
      requires_document,
      document_name,
      description,
      essay_width,
      interview_width,
      min_grade,
    } = selectedMethod

    if (!name && !description && !essay_width && !interview_width && !min_grade) return;
    if (requires_document && document_name.length === 0) return;

    const payload = { /*Construir según endpoint*/ }
    // Hacer try/catch para await updateMethod({ id: selectedMethod.id, payload });
  
    try {
      // Simulación de la API
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
        setMethods(prevMethods =>
          prevMethods.map(method => 
            method.id === selectedMethod?.id 
            ? {
              ...selectedMethod,
                requires_document: selectedMethod?.requires_document,
                document_name: selectedMethod?.requires_document ? selectedMethod?.document_name : "",
                updated_at: new Date()
              }
            : method
          ));
          handleCloseModal('edit');
          setSelectedMethod(null);
          toaster.create({
            title: 'Modalidad actualizada correctamente',
            type: 'success',
          });
      }, 1500)
    } catch (error) {
      toaster.create({
        title: error?.response?.data?.message || 'Error al editar modalidad',
        type: 'error',
      });
    }
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
                value={selectedMethod?.name || ''}
                onChange={(e) => setSelectedMethod(prev => ({ ...prev, name: e.target.value }))}
              />
            </Field>
            <Field label='Descripción'>
              <Textarea
                value={selectedMethod?.description}
                onChange={(e) => setSelectedMethod(prev => ({ ...prev, description: e.target.value }))}
              />
            </Field>
            <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
              <Field label='Requiere ensayo'>
                <RadioGroup
                  value={selectedMethod?.requires_essay ? "true" : "false"}
                  onChange={(e) => setSelectedMethod(prev => ({ ...prev, requires_essay: e.target.value === "true" }))}
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
                  value={selectedMethod?.requires_interview ? "true" : "false"}
                  onChange={(e) => setSelectedMethod(prev => ({ ...prev, requires_interview: e.target.value === "true" }))}
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
                startDate={selectedMethod?.exam_start_date ? new Date(selectedMethod.exam_start_date) : new Date()} 
                endDate={selectedMethod?.exam_end_date ? new Date(selectedMethod.exam_end_date) : new Date()}
                onDateChange={(dates) => setSelectedMethod(prev => ({
                  ...prev,
                  exam_start_date: dates.startDate,
                  exam_end_date: dates.endDate
                }))}
                buttonSize="sm"
              />
            </Field>
            <Flex alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
              <Field label='Requiere subir documento'>
                <RadioGroup
                  value={selectedMethod?.requires_document ? "true" : "false"}
                  onChange={(e) => setSelectedMethod(prev => ({ ...prev, requires_document: e.target.value === "true" }))}
                  direction="row"
                >
                  <Flex gap="5">
                    <Radio value={"true"}>Sí</Radio>
                    <Radio value={"false"}>No</Radio>
                  </Flex>
                </RadioGroup>
              </Field>
              {
                selectedMethod?.requires_document && (
                  <Field label='Nombre del documento'>
                    <Input 
                      value={selectedMethod?.requires_document ? selectedMethod?.document_name : ''}
                      onChange={e => setSelectedMethod(prev => ({ ...prev, document_name: e.target.value }))}
                      required 
                      type="text"
                      placeholder='Ingrese el tipo de documento'
                    />
                  </Field>
                )
              }
            </Flex>
            <Field label='Seleccionar campos obligatorios'>
              <CustomSelect
                options={OPTIONS}
                value={selectedMethod?.required_field}
                onChange={(value) => setSelectedMethod(prev => ({ ...prev, required_field: value }))}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name="requiredField"
              />
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}