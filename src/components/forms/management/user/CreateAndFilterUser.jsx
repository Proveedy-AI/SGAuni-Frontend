import {
	Button,
	ControlledModal,
	Field,
	InputGroup,
	toaster,
} from '@/components/ui';
import { Flex, Grid, HStack, Input, Stack } from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useCreateUser } from '@/hooks/users';
import { useState } from 'react';
import { ReactSelect } from '@/components/select';
import { useReadRoles } from '@/hooks';

export const CreateAndFilterUser = ({
	search,
	setSearch,
	handleOpenModal,
	isCreateModalOpen,
	setIsModalOpen,
	fetchUsers,
}) => {
	const { mutateAsync: createUser, isPending } = useCreateUser();
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [selectedTypeDoc, setSelectedTypeDoc] = useState(null);
	const { data: rolesData } = useReadRoles(); // rolesData.results = lista de roles

	const rolesOptions =
		rolesData?.results?.map((role) => ({
			label: role.name,
			value: role.id,
		})) || [];

  const documentTypeOptions = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'Carné de Extranjería' },
		{ value: 4, label: 'Cédula de Identidad' },
	];

	const handleCreateUser = async (e) => {
		e.preventDefault();
		const { elements } = e.currentTarget;

		const username = elements.namedItem('username').value.trim();
		const first_name = elements.namedItem('first_name').value.trim();
		const last_name = elements.namedItem('last_name').value.trim();
    const num_doc = elements.namedItem('num_doc')?.value.trim();

    if (!username || !first_name || !last_name || !num_doc) {
			toaster.create({
				title: 'Por favor complete todos los campos requeridos',
				type: 'warning',
			});
			return;
		}

    if(selectedRoles.length === 0) {
      toaster.create({
        title: 'Por favor seleccione al menos un rol',
        type: 'warning',
      });
      return;
    }

		const payload = {
			user: {
				username,
				first_name,
				last_name,
			},
      num_doc,
      type_doc: selectedTypeDoc?.value || null,
			roles_ids: selectedRoles.map((r) => r.value),
		};

		const optionalFields = ['uni_email', 'phone'];
		optionalFields.forEach((field) => {
			const value = elements.namedItem(field)?.value.trim();
			if (value) {
				payload[field] = value;
			}
		});

		try {
			await createUser(payload);
			toaster.create({
				title: 'Usuario creado correctamente',
				type: 'success',
			});
			fetchUsers();
			setSelectedRoles([]);
			setIsModalOpen((s) => ({ ...s, create: false }));
		} catch (error) {
			const errorData = error.response?.data;

			if (errorData && typeof errorData === 'object') {
				Object.entries(errorData).forEach(([field, messages]) => {
					if (Array.isArray(messages)) {
						messages.forEach((message) => {
							const readableField =
								field === 'non_field_errors'
									? 'Error general'
									: field.replaceAll('_', ' ');

							toaster.create({
								title: `${readableField}: ${message}`,
								type: 'error',
							});
						});
					}
				});
			} else {
				toaster.create({
					title: 'Error al registrar el Programa',
					type: 'error',
				});
			}
		}
	};

	return (
		<>
			<HStack justify='space-between' w='full' align='stretch' flexWrap='wrap'>
				<InputGroup
					minWidth={{ base: 'full', md: '250px' }}
					w='2/5'
					endElement={<HiMagnifyingGlass size={24} />}
				>
					<Input
						background={{ base: 'white', _dark: 'gray.700' }}
						placeholder='Buscar usuario'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						_focus={{ border: 'none', boxShadow: 'none' }}
					/>
				</InputGroup>
				<Button
					fontSize='16px'
					minWidth='150px'
					color='white'
					background='#711610'
					borderRadius={8}
					onClick={() => handleOpenModal('create')}
				>
					<HiPlus size={12} /> Crear usuario
				</Button>
			</HStack>

			<Stack css={{ '--field-label-width': '140px' }}>
				<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
					<ControlledModal
						title='Crear Usuario'
						placement='center'
						size='xl'
						open={isCreateModalOpen}
						onOpenChange={(e) =>
							setIsModalOpen((s) => ({ ...s, create: e.open }))
						}
						hiddenFooter={true}
					>
						<Stack>
							<form onSubmit={handleCreateUser}>
								<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
									<Field label='Correo/Usuario'>
										<Input required name='username' placeholder='Correo' />
									</Field>

									<Field label='Nombres'>
										<Input required name='first_name' placeholder='Nombres' />
									</Field>

									<Field label='Apellidos'>
										<Input required name='last_name' placeholder='Apellidos' />
									</Field>

                  <Field label='Teléfono'>
										<Input name='phone' placeholder='Opcional' />
									</Field>

                  <Field label='Tipo de Documento'>
                    <ReactSelect
                    label='Tipo de Documento'
                    options={documentTypeOptions}
                    value={selectedTypeDoc}
                    onChange={(value) => setSelectedTypeDoc(value)}
                    placeholder='Tipo de documento'
                  />
                  </Field>

									<Field label='Documento'>
										<Input disabled={!selectedTypeDoc} required name='num_doc' placeholder='Documento' />
									</Field>

									<Field label='Correo UNI'>
										<Input
											name='uni_email'
											type='email'
											placeholder='Opcional'
										/>
									</Field>

								</Grid>
								<Field label='Rol' mt={4}>
									<ReactSelect
										value={selectedRoles}
										onChange={(select) => {
											setSelectedRoles(select);
										}}
										variant='flushed'
										size='xs'
										isClea
										isClearable={true}
										isSearchable={true}
										isMulti
										name='paises'
										options={rolesOptions}
									/>
								</Field>

								<Flex justify='end' mt='6' gap='2'>
									<Button
										variant='outline'
										colorPalette='red'
										onClick={() =>
											setIsModalOpen((s) => ({ ...s, create: false }))
										}
									>
										Cancelar
									</Button>
									<Button
										type='submit'
										bg='uni.secondary'
										color='white'
										loading={isPending}
									>
										Crear
									</Button>
								</Flex>
							</form>
						</Stack>
					</ControlledModal>
				</Field>
			</Stack>
		</>
	);
};

CreateAndFilterUser.propTypes = {
	search: PropTypes.string,
	setSearch: PropTypes.func,
	handleOpenModal: PropTypes.func,
	isCreateModalOpen: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
	setUsers: PropTypes.func,
	handleCloseModal: PropTypes.func,
	fetchUsers: PropTypes.func,
};
