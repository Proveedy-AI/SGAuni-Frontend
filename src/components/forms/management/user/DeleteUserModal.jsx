import { ControlledModal, Field } from "@/components/ui"
import { Stack, Text } from "@chakra-ui/react"

export const DeleteUserModal = ({ selectedUser, setUsers, handleCloseModal, isDeleteModalOpen, setIsModalOpen }) => {
  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    handleCloseModal('delete');
  }

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
      >
        <ControlledModal
          title='Eliminar Usuario'
          placement='center'
          size='xl'
          confirmLabel='Eliminar'
          open={isDeleteModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, delete: e.open }))}
          onSave={() => handleDeleteUser(selectedUser?.id)}
        >
          <Text>¿Quieres eliminar el Usuario {selectedUser?.username}?</Text>
        </ControlledModal>
      </Field>
    </Stack>
  )
}