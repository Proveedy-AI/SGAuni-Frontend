import { ControlledModal, Field } from "@/components/ui"
import { Stack, Text } from "@chakra-ui/react"

export const ViewUserModal = ({ selectedUser, isViewModalOpen, setIsModalOpen, handleCloseModal}) => {
  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
      >
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
            <Field label='Nombres y apellidos'>
              <Text
                w='full'
                py={2}
                px={3}
                border={'1px solid #E2E8F0'}
                borderRadius='md'
              >{ selectedUser?.username }</Text>
            </Field>
            <Field label='Correo'>
              <Text
                w='full'
                py={2}
                px={3}
                border={'1px solid #E2E8F0'}
                borderRadius='md'
              >{ selectedUser?.email }</Text>
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}