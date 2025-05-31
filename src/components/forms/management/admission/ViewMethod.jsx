import { ControlledModal, Field } from "@/components/ui"
import { Stack, Text } from "@chakra-ui/react"

export const ViewMethod = ({ selectedMethod, isViewModalOpen, setIsModalOpen, handleCloseModal }) => {
  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ControlledModal
          title='Ver Usuario'
          placement='center'
          size='xl'
          open={isViewModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, view: e.open }))}
          onSave={() => handleCloseModal('view')}
          hiddenFooter={true}
        >
          <Stack>
            <Field label='Nombre de la modalidad'>
              <Text
                w='full'
                py={2}
                px={3}
                border={'1px solid #E2E8F0'}
                borderRadius='md'
              >{ selectedMethod?.name }</Text>
            </Field>
            <Field label='Descripción'>
              <Text
                w='full'
                py={2}
                px={3}
                border={'1px solid #E2E8F0'}
                borderRadius='md'
              >{ selectedMethod?.description }</Text>
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}