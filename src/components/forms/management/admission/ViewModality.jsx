import { ControlledModal, Field } from "@/components/ui"
import { useReadOneModality } from "@/hooks/modalities"
import { Badge, Flex, Stack, Text } from "@chakra-ui/react"
import { useEffect } from "react";

export const ViewModality = ({ selectedMethod, isViewModalOpen, setIsModalOpen, handleCloseModal }) => {
  const { data: dataModality, refetch: fetchModality } = useReadOneModality({
    id: selectedMethod?.id,
    enabled: false
  });

  useEffect(() => {
    if (isViewModalOpen && selectedMethod?.id) {
      fetchModality();
    }
    
  }, [isViewModalOpen, selectedMethod?.id, fetchModality])

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
                {dataModality?.name}
              </Text>
            </Field>
            <Field label='Descripción'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {dataModality?.description}
              </Text>
            </Field>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Activo'>
                <Badge bg={dataModality?.enabled ? 'green' : 'red'} color='white'>
                  {dataModality?.enabled ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere pre-maestría'>
                <Badge bg={dataModality?.requires_pre_master_exam ? 'green' : 'red'} color='white'>
                  {dataModality?.requires_pre_master_exam ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Requiere entrevista'>
                <Badge bg={dataModality?.requires_interview ? 'green' : 'red'} color='white'>
                  {dataModality?.requires_interview ? 'Sí' : 'No'}
                </Badge>
              </Field>
              <Field label='Requiere ensayo'>
                <Badge bg={dataModality?.requires_essay ? 'green' : 'red'} color='white'>
                  {dataModality?.requires_essay ? 'Sí' : 'No'}
                </Badge>
              </Field>
            </Flex>
            <Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
              <Field label='Ancho ensayo'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {dataModality?.essay_weight}
                </Text>
              </Field>
              <Field label='Ancho entrevista'>
                <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                  {dataModality?.interview_weight}
                </Text>
              </Field>
            </Flex>
            <Field label='Nota mínima'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {dataModality?.min_grade}
              </Text>
            </Field>
            <Field label='Reglas'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {Array.isArray(dataModality?.rules) && dataModality.rules.length > 0
                  ? dataModality.rules.map((rule, idx) => (
                      <span key={idx}>{rule}{idx < dataModality.rules.length - 1 ? ', ' : ''}</span>
                    ))
                  : 'Sin reglas'}
              </Text>
            </Field>
            <Field label='Total de reglas'>
              <Text w='full' py={2} px={3} border='1px solid #E2E8F0' borderRadius='md'>
                {dataModality?.total_rules}
              </Text>
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}