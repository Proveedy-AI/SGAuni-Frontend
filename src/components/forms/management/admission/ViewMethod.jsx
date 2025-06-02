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
                <Badge colorScheme={selectedMethod?.isActive ? 'green' : 'red'}>
                  {selectedMethod?.isActive ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere pre-maestría'>
                <Badge colorScheme={selectedMethod?.requiresPreMasterExam ? 'green' : 'red'}>
                  {selectedMethod?.requiresPreMasterExam ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere entrevista'>
                <Badge colorScheme={selectedMethod?.requiresInterview ? 'green' : 'red'}>
                  {selectedMethod?.requiresInterview ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere ensayo'>
                <Badge colorScheme={selectedMethod?.requiresEssay ? 'green' : 'red'}>
                  {selectedMethod?.requiresEssay ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Field label='Fechas de examen'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.examStartDate
                  ? new Date(selectedMethod.examStartDate).toLocaleDateString()
                  : ''}{" "}
                -{" "}
                {selectedMethod?.examEndDate
                  ? new Date(selectedMethod.examEndDate).toLocaleDateString()
                  : ''}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere documento'>
                <Badge colorScheme={selectedMethod?.requiresDocument ? 'green' : 'red'}>
                  {selectedMethod?.requiresDocument ? 'Sí' : 'No'}
                </Badge>
              </Field>
              {selectedMethod?.requiresDocument && (
                <Field label='Nombre del documento'>
                  <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                    {selectedMethod?.documentName}
                  </Text>
                </Field>
              )}
            </Flex>
            <Field label='Campo obligatorio'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {selectedMethod?.requiredField}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Ancho ensayo'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.essayWidth}
                </Text>
              </Field>
              <Field label='Ancho entrevista'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.interviewWidth}
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
                  {selectedMethod?.createdAt
                    ? new Date(selectedMethod.createdAt).toLocaleString()
                    : ''}
                </Text>
              </Field>
              <Field label='Actualizado'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {selectedMethod?.updatedAt
                    ? new Date(selectedMethod.updatedAt).toLocaleString()
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