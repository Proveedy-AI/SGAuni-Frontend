import { ControlledModal, Field, toaster } from '@/components/ui';
import { useUpdateUser, useReadUserById } from '@/hooks/users';
import { Stack, Input, Grid, InputGroup } from '@chakra-ui/react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiHash, FiMail, FiPhone, FiUser, FiUserCheck } from 'react-icons/fi';

export const EditUserModal = ({
	selectedUser,
	setSelectedUser,
	isEditModalOpen,
	setIsModalOpen,
	handleCloseModal,
	fetchUsers,
}) => {
	const { mutateAsync: updateUser, isPending } = useUpdateUser();

	const { data: userDetail } = useReadUserById({
		id: selectedUser?.id,
	});

	useEffect(() => {
		if (userDetail && isEditModalOpen) {
			setSelectedUser((prev) => ({ ...prev, ...userDetail }));
		}
	}, [userDetail, isEditModalOpen]);

	const handleEditUser = async () => {
		const { id, first_name, last_name, num_doc, uni_email, phone } =
			selectedUser;

		if (!first_name || !last_name) return;

		const payload = {
			user: {
				first_name,
				last_name,
			},
			num_doc,
			uni_email,
			phone,
		};

		try {
			await updateUser({ id, payload });

			toaster.create({
				title: 'Usuario actualizado correctamente',
				type: 'success',
			});

			fetchUsers();
			handleCloseModal('edit');
		} catch (error) {
			toaster.create({
				title: error?.response?.data?.message || 'Error al editar usuario',
				type: 'error',
			});
		}
	};

	return (
		<Stack css={{ '--field-label-width': '140px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ControlledModal
					title='Editar Usuario'
					placement='center'
					size='xl'
					open={isEditModalOpen}
					onOpenChange={(e) => setIsModalOpen((s) => ({ ...s, edit: e.open }))}
					onSave={handleEditUser}
					loading={isPending}
				>
					<Stack spacing={6} p={2} mt={2}>
						<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
							<Field label='Correo/Usuario'>
								<InputGroup startElement={<FiUserCheck />}>
									<Input
										value={selectedUser?.user?.username || ''}
										placeholder='Nombre de usuario'
										isDisabled
										bg='gray.50'
										_disabled={{ opacity: 1, color: 'gray.500' }}
									/>
								</InputGroup>
							</Field>

							<Field label='Nombres'>
								<InputGroup startElement={<FiUser />}>
									<Input
										value={selectedUser?.first_name || ''}
										placeholder='Ingrese nombres'
										onChange={(e) =>
											setSelectedUser((prev) => ({
												...prev,
												first_name: e.target.value,
											}))
										}
									/>
								</InputGroup>
							</Field>

							<Field label='Apellidos'>
								<InputGroup startElement={<FiUser />}>
									<Input
										value={selectedUser?.last_name || ''}
										placeholder='Ingrese apellidos'
										onChange={(e) =>
											setSelectedUser((prev) => ({
												...prev,
												last_name: e.target.value,
											}))
										}
									/>
								</InputGroup>
							</Field>

							<Field label='Correo institucional'>
								<InputGroup startElement={<FiMail />}>
									<Input
										value={selectedUser?.uni_email || ''}
										placeholder='Ingrese correo institucional'
										type='email'
										onChange={(e) =>
											setSelectedUser((prev) => ({
												...prev,
												uni_email: e.target.value,
											}))
										}
									/>
								</InputGroup>
							</Field>

							<Field label='Número de documento'>
								<InputGroup startElement={<FiHash />}>
									<Input
										value={selectedUser?.num_doc || ''}
										placeholder='Ingrese número de documento'
										onChange={(e) =>
											setSelectedUser((prev) => ({
												...prev,
												num_doc: e.target.value,
											}))
										}
									/>
								</InputGroup>
							</Field>

							<Field label='Teléfono'>
								<InputGroup startElement={<FiPhone />}>
									<Input
										value={selectedUser?.phone || ''}
										placeholder='Ingrese número de teléfono'
										type='tel'
										onChange={(e) =>
											setSelectedUser((prev) => ({
												...prev,
												phone: e.target.value,
											}))
										}
									/>
								</InputGroup>
							</Field>
						</Grid>
					</Stack>
				</ControlledModal>
			</Field>
		</Stack>
	);
};

EditUserModal.propTypes = {
	setUsers: PropTypes.func,
	selectedUser: PropTypes.object,
	setSelectedUser: PropTypes.func,
	isEditModalOpen: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
	handleCloseModal: PropTypes.func,
	fetchUsers: PropTypes.func,
};
