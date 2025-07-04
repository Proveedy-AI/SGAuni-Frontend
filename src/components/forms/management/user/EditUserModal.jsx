import { ControlledModal, Field, toaster } from '@/components/ui';
import { useUpdateUser, useReadUserById } from '@/hooks/users';
import { Stack, Input, Grid, InputGroup } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiHash, FiMail, FiPhone, FiUser, FiUserCheck } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';

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
	}, [userDetail, isEditModalOpen, setSelectedUser]);

  const documentTypeOptions = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'Carné de Extranjería' },
		{ value: 4, label: 'Cédula de Identidad' },
	];

  const [errors, setErrors] = useState({});

  const reset = () => {
    setSelectedUser({
      first_name: '',
      last_name: '',
      num_doc: '',
      uni_email: '',
      phone: '',
      document_type: null,
      user: { username: '' },
    });
    setErrors({});
  }
  
  const validate = () => {
    const newErrors = {};
    if (!selectedUser.first_name?.trim()) newErrors.first_name = 'El nombre es requerido';
    if (!selectedUser.last_name?.trim()) newErrors.last_name = 'El apellido es requerido';
    if (!selectedUser.document_type) newErrors.document_type = 'Seleccione un tipo de documento';
    if (!selectedUser.num_doc?.trim()) newErrors.num_doc = 'El número de documento es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

	const handleEditUser = async () => {
    if (!validate()) return;

		const { id, first_name, last_name, num_doc, uni_email, phone } = selectedUser;

		if (!first_name || !last_name) return;

		const payload = {
			user: {
				first_name,
				last_name,
			},
			num_doc,
			uni_email,
			phone,
      document_type: selectedUser.document_type?.value,
		};

    await updateUser({ id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Usuario actualizado correctamente',
          type: 'success',
        });
        fetchUsers();
        reset();
        handleCloseModal('edit');
      },
      onError: (error) => {
        toaster.create({
          title: error?.response?.data?.message || 'Error al editar usuario',
          type: 'error',
        });
      },
    });
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

							<Field
                label='Nombres'
                invalid={!!errors.first_name}
					      errorText={errors.first_name}
              >
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

							<Field
                label='Apellidos'
                invalid={!!errors.last_name}
                errorText={errors.last_name}
              >
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
										placeholder='Opcional'
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

              <Field
                label='Tipo de documento'
                invalid={!!errors?.document_type}
                errorText={errors?.document_type}
              >
                 <ReactSelect
                    options={documentTypeOptions}
                    value={documentTypeOptions.find(
                      (option) => option.value === selectedUser?.document_type
                    )}
                    onChange={(option) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        document_type: option,
                      }))
                    }
                    placeholder='Seleccione tipo de documento'
                    isClearable
                    isSearchable
                  />
              </Field>

							<Field
                label='Número de documento'
                invalid={!!errors.num_doc}
                errorText={errors.num_doc}
              >
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
										placeholder='Opcional'
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
