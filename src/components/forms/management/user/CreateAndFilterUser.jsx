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
	const [username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [numDoc, setNumDoc] = useState('');
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [selectedTypeDoc, setSelectedTypeDoc] = useState(null);
	const { data: rolesData } = useReadRoles(); // rolesData.results = lista de roles

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		if (username.trim() === '') newErrors.username = 'El correo es requerido';
		if (firstName.trim() === '')
			newErrors.first_name = 'El nombre es requerido';
		if (lastName.trim() === '')
			newErrors.last_name = 'El apellido es requerido';
		if (numDoc.trim() === '')
			newErrors.num_doc = 'El número de documento es requerido';
		if (numDoc.trim() && Number(numDoc) < 0)
			newErrors.num_doc = 'El número de documento no puede ser negativo';

		if (!selectedTypeDoc)
			newErrors.document_type = 'El tipo de documento es requerido';
		if (selectedRoles.length === 0)
			newErrors.roles_ids = 'Debe seleccionar al menos un rol';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const errorMessagesMap = {
		num_doc: 'El número de documento ya está registrado.',
		phone: 'El teléfono ya está en uso.',
		uni_email: 'El correo institucional ya está registrado.',
	};

	const reset = () => {
		setUsername('');
		setFirstName('');
		setLastName('');
		setNumDoc('');
		setSelectedRoles([]);
		setSelectedTypeDoc(null);
		setErrors({});
	};

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

		if (!validate()) return;

		if (!username || !firstName || !lastName || !numDoc) {
			toaster.create({
				title: 'Por favor complete todos los campos requeridos',
				type: 'warning',
			});
			return;
		}

		if (selectedRoles.length === 0) {
			toaster.create({
				title: 'Por favor seleccione al menos un rol',
				type: 'warning',
			});
			return;
		}

		const payload = {
			user: {
				username: username,
				first_name: firstName,
				last_name: lastName,
			},
			num_doc: numDoc,
			document_type: selectedTypeDoc?.value || null,
			roles_ids: selectedRoles.map((r) => r.value),
		};

		const optionalFields = ['uni_email', 'phone'];
		optionalFields.forEach((field) => {
			const value = elements.namedItem(field)?.value.trim();
			if (value) {
				payload[field] = value;
			}
		});

		createUser(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Usuario creado correctamente',
					type: 'success',
				});
				fetchUsers();
				reset();
				setSelectedRoles([]);
				setSelectedTypeDoc(null);
				setIsModalOpen((s) => ({ ...s, create: false }));
			},
			onError: (error) => {
				if (error.response?.data) {
					const errors = error.response.data;

					// Reemplazar mensajes según el mapa
					const messages = Object.entries(errors)
						.map(([field, msgs]) => {
							return errorMessagesMap[field] || msgs.join(', ');
						})
						.join('\n');

					toaster.create({
						title: 'Error de validación',
						description: messages,
						type: 'error',
					});
				} else {
					toaster.create({
						title: 'Error inesperado',
						description: error.message,
						type: 'error',
					});
				}
			},
		});

		// try {
		// 	await createUser(payload);
		// 	toaster.create({
		// 		title: 'Usuario creado correctamente',
		// 		type: 'success',
		// 	});
		// 	fetchUsers();
		// 	setSelectedRoles([]);
		//   setSelectedTypeDoc(null);
		// 	setIsModalOpen((s) => ({ ...s, create: false }));
		// } catch (error) {
		// 	const errorData = error.response?.data;

		// 	if (errorData && typeof errorData === 'object') {
		// 		Object.entries(errorData).forEach(([field, messages]) => {
		// 			if (Array.isArray(messages)) {
		// 				messages.forEach((message) => {
		// 					const readableField =
		// 						field === 'non_field_errors'
		// 							? 'Error general'
		// 							: field.replaceAll('_', ' ');

		// 					toaster.create({
		// 						title: `${readableField}: ${message}`,
		// 						type: 'error',
		// 					});
		// 				});
		// 			}
		// 		});
		// 	} else {
		// 		toaster.create({
		// 			title: 'Error al registrar el Programa',
		// 			type: 'error',
		// 		});
		// 	}
		// }
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
									<Field
										label='Correo del usuario'
										invalid={!!errors.username}
										errorText={errors.username}
									>
										<Input
											type='email'
											name='username'
											placeholder='Correo'
											value={username}
											onChange={(e) => setUsername(e.target.value)}
										/>
									</Field>

									<Field
										label='Nombres'
										invalid={!!errors.first_name}
										errorText={errors.first_name}
									>
										<Input
											name='first_name'
											placeholder='Nombres'
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
										/>
									</Field>

									<Field
										label='Apellidos'
										invalid={!!errors.last_name}
										errorText={errors.last_name}
									>
										<Input
											name='last_name'
											placeholder='Apellidos'
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
										/>
									</Field>

									<Field label='Celular'>
										<Input name='phone' placeholder='Opcional' />
									</Field>

									<Field
										label='Tipo de Documento'
										invalid={!!errors.document_type}
										errorText={errors.document_type}
									>
										<ReactSelect
											label='Tipo de Documento'
											options={documentTypeOptions}
											value={selectedTypeDoc}
											onChange={(value) => setSelectedTypeDoc(value)}
											placeholder='Tipo de documento'
										/>
									</Field>

									<Field
										label='Documento'
										invalid={!!errors.num_doc}
										errorText={errors.num_doc}
									>
										<Input
											disabled={!selectedTypeDoc}
											name='num_doc'
											placeholder='Documento'
											value={numDoc}
											onChange={(e) => setNumDoc(e.target.value)}
										/>
									</Field>

									<Field label='Correo UNI'>
										<Input
											name='uni_email'
											type='email'
											placeholder='Opcional'
										/>
									</Field>
								</Grid>
								<Field
									label='Rol'
									mt={4}
									invalid={!!errors.roles_ids}
									errorText={errors.roles_ids}
								>
									<ReactSelect
										value={selectedRoles}
										onChange={(select) => {
											setSelectedRoles(select);
										}}
										variant='flushed'
										size='xs'
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
