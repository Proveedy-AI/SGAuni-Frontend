import { ControlledModal, Field } from "@/components/ui"
import { Stack, Input } from "@chakra-ui/react"

export const EditUserModal = ({ setUsers, selectedUser, setSelectedUser, isEditModalOpen, setIsModalOpen,  handleCloseModal }) => {
  const handleEditUser = () => {
    if (!selectedUser.username || !selectedUser.email) return;

    setUsers(prev =>
      prev.map(user =>
        user.id === selectedUser.id ? { ...user, ...selectedUser } : user
      )
    );
    handleCloseModal('edit');
  }

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
      >
        <ControlledModal
          title='Editar Usuario'
          placement='center'
          size='xl'
          open={isEditModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, edit: e.open }))}
          onSave={() => handleEditUser()}
        >
          <Stack>
            <Field label='Nombres y apellidos'>
              <Input
                defaultValue={selectedUser?.username}
                placeholder='Ingrese nombres y apellidos'
                onChange={e => setSelectedUser(prev => ({ ...prev, username: e.target.value }))}
              />
            </Field>
            <Field label='Correo'>
              <Input
                defaultValue={selectedUser?.email}
                placeholder='Ingrese correo electrónico'
                onChange={e => setSelectedUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}