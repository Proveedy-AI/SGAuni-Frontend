import { Checkbox, ControlledModal, Field, toaster } from '@/components/ui';
import { Stack, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useAssignUserRole, useReadRoles } from '@/hooks';

export const ToogleRoleUserModal = ({
  users,
  fetchUsers,
  selectedUser,
  setSelectedUser,
  handleCloseModal,
  isToogleRoleModalOpen,
  setIsModalOpen,
}) => {
  const { data: roles = [] } = useReadRoles(); // Asume que roles es un array plano
  const { mutateAsync: assignRoles, isPending } = useAssignUserRole();

  const handleToogleRole = async () => {
    const selectedRoleObjects = roles?.results?.filter((role) =>
      selectedUser.role?.includes(role.name)
    );
    const roleIds = selectedRoleObjects.map((r) => r.id);

    try {
      await assignRoles({ userId: selectedUser.id, roleIds });

      toaster.create({
        title: 'Roles actualizados correctamente',
        type: 'success',
      });

      fetchUsers();
      setSelectedUser(null);
      handleCloseModal('toogleRole');
    } catch (error) {
      toaster.create({
        title: error?.message || 'Error al asignar roles',
        type: 'error',
      });
    }
  };

  const handleChangeRole = (role, isChecked) => {
    setSelectedUser((prev) => {
      const currentRoles = Array.isArray(prev.role) ? prev.role : [];

      const newRoles = isChecked
        ? [...currentRoles, role.name]
        : currentRoles.filter((r) => r !== role.name);

      return { ...prev, role: newRoles };
    });
  };

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ControlledModal
          title="Asignar rol"
          placement="center"
          size="xl"
          open={isToogleRoleModalOpen}
          onOpenChange={(e) =>
            setIsModalOpen((s) => ({ ...s, toogleRole: e.open }))
          }
          onSave={handleToogleRole}
          loading={isPending}
        >
          <Stack>
            <Field label="Roles">
              <VStack align="start">
                {roles?.results?.map((role) => (
                  <Field key={role.id} orientation="horizontal">
                    <Checkbox
                      onChange={(e) =>
                        handleChangeRole(role, e.target.checked)
                      }
                      checked={
                        Array.isArray(selectedUser?.role) &&
                        selectedUser.role.includes(role.name)
                      }
                    >
                      <Text>{role.name}</Text>
                    </Checkbox>
                  </Field>
                ))}
              </VStack>
            </Field>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  );
};

ToogleRoleUserModal.propTypes = {
  users: PropTypes.array,
  fetchUsers: PropTypes.func,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isToogleRoleModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};
