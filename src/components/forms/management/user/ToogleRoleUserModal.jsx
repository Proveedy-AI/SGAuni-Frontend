import { Checkbox, ControlledModal, Field, toaster } from '@/components/ui';
import { Stack, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useAssignUserRole, useReadRoles } from '@/hooks';
import { useEffect, useState } from 'react';

export const ToogleRoleUserModal = ({
	fetchUsers,
	selectedUser,
	setSelectedUser,
	handleCloseModal,
	isToogleRoleModalOpen,
	setIsModalOpen,
}) => {
	const { data: rolesData = {} } = useReadRoles(); // rolesData.results = lista de roles
	const { mutateAsync: assignRoles, isPending } = useAssignUserRole();
	const [selectedRoleIds, setSelectedRoleIds] = useState([]);

	// Inicializa los roles seleccionados cuando cambia el usuario
	useEffect(() => {
		if (selectedUser?.roles) {
			setSelectedRoleIds(selectedUser.roles.map((r) => r.id));
		}
	}, [selectedUser]);

	const handleCheckboxChange = (roleId, isChecked) => {
		setSelectedRoleIds((prev) =>
			isChecked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
		);
	};

	// Guarda los cambios
	const handleSave = async () => {
		try {
			await assignRoles({ userId: selectedUser.id, roleIds: selectedRoleIds });

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

	return (
		<Stack css={{ '--field-label-width': '140px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ControlledModal
					title='Asignar rol'
					placement='center'
					size='xl'
					open={isToogleRoleModalOpen}
					onOpenChange={(e) =>
						setIsModalOpen((s) => ({ ...s, toogleRole: e.open }))
					}
					onSave={handleSave}
					loading={isPending}
				>
					<Stack>
						<Field label='Roles'>
							<VStack align='start'>
								{rolesData?.results?.map((role) => (
									<Field key={role.id} orientation='horizontal'>
										<Checkbox
											checked={selectedRoleIds.includes(role.id)}
											onChange={(e) =>
												handleCheckboxChange(role.id, e.target.checked)
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
	fetchUsers: PropTypes.func,
	selectedUser: PropTypes.object,
	setSelectedUser: PropTypes.func,
	handleCloseModal: PropTypes.func,
	isToogleRoleModalOpen: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
};
