import { Checkbox, ControlledModal, Field } from "@/components/ui"
import { ROLES } from "@/data";
import { Stack, Text, VStack } from "@chakra-ui/react"

export const ToogleRoleUserModal = ({ users, setUsers, selectedUser, setSelectedUser, handleCloseModal, isToogleRoleModalOpen, setIsModalOpen }) => {
  const handleToogleRole = () => {
    const user = users.find(u => u.id === selectedUser.id);

    const updatedUser = {
      ...user,
      role: selectedUser.role || []
    }
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setSelectedUser(null);
    handleCloseModal('toogleRole');
  }

  const handleChangeRole = (role, isChecked) => {
    setSelectedUser(prev => {
      const newRoles = isChecked
        ? [...prev.role, role.label]
        : prev.role.filter(r => r !== role.label);
      return { ...prev, role: newRoles };
    });
  }

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ControlledModal
          title='Asignar rol'
          placement='center'
          size='xl'
          open={isToogleRoleModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, toogleRole: e.open }))}
          onSave={() => handleToogleRole()}
        >
          <Stack>
            <Field label='Roles'>
              <VStack align='start'>
                {/* Checkboxes para agregar o quitar roles */}
                {ROLES.map((role, index) => (
                  <Field key={index} orientation='horizontal'>
                    <Checkbox
                      onChange={(e) => handleChangeRole(role, e.target.checked)}
                      checked={selectedUser?.role?.includes(role.label)}
                    >
                      <Text>{role.label}</Text>
                    </Checkbox>
                  </Field>
                ))}
              </VStack>
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}