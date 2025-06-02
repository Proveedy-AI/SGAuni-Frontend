import { ControlledModal, Field } from "@/components/ui"
import { Badge, Flex, Stack, Text } from "@chakra-ui/react"

export const ViewMethod = ({ selectedMethod, isViewModalOpen, setIsModalOpen, handleCloseModal }) => {
  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ControlledModal
          title='Ver Modalidad'
          placement='center'
          size='xl'
          open={isViewModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, view: e.open }))}
          onSave={() => handleCloseModal('view')}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Field label='Nombre de la modalidad'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.name}
              </Text>
            </Field>
            <Field label='Descripción'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.description}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Activo'>
                <Badge bg={selectedMethod?.is_active ? 'green' : 'red'} color='white'>
                  {selectedMethod?.is_active ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere pre-maestría'>
                <Badge bg={selectedMethod?.requires_pre_master_exam ? 'green' : 'red'} color='white'>
                  {selectedMethod?.requires_pre_master_exam ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere entrevista'>
                <Badge bg={selectedMethod?.requires_interview ? 'green' : 'red'} color='white'>
                  {selectedMethod?.requires_interview ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere ensayo'>
                <Badge bg={selectedMethod?.requires_essay ? 'green' : 'red'} color='white'>
                  {selectedMethod?.requires_essay ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Field label='Fechas de examen'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.exam_start_date
                  ? new Date(selectedMethod.exam_start_date).toLocaleDateString()
                  : ''}{" "}
                -{" "}
                {selectedMethod?.exam_end_date
                  ? new Date(selectedMethod.exam_end_date).toLocaleDateString()
                  : ''}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere documento'>
                <Badge bg={selectedMethod?.requires_document ? 'green' : 'red'} color='white'>
                  {selectedMethod?.requires_document ? 'Sí' : 'No'}
                </Badge>
              </Field>
              {selectedMethod?.requires_document && (
                <Field label='Nombre del documento'>
                  <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                    {selectedMethod?.document_name}
                  </Text>
                </Field>
              )}
            </Flex>
            <Field label='Campo obligatorio'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.required_field}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Ancho ensayo'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.essay_width}
                </Text>
              </Field>
              <Field label='Ancho entrevista'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.interview_width}
                </Text>
              </Field>
            </Flex>
            <Field label='Nota mínima'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.min_grade}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Creado'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.created_at
                    ? new Date(selectedMethod.created_at).toLocaleString()
                    : ''}
                </Text>
              </Field>
              <Field label='Actualizado'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.updated_at
                    ? new Date(selectedMethod.updated_at).toLocaleString()
                    : ''}
                </Text>
              </Field>
            </Flex>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}