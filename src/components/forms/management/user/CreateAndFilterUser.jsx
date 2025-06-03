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

export const CreateAndFilterUser = ({
	search,
	setSearch,
	handleOpenModal,
	isCreateModalOpen,
	setIsModalOpen,
	fetchUsers,
}) => {
	const { mutateAsync: createUser, isPending } = useCreateUser();
	const handleCreateUser = async (e) => {
		e.preventDefault();
		const { elements } = e.currentTarget;

		const username = elements.namedItem('username').value.trim();
		const first_name = elements.namedItem('first_name').value.trim();
		const last_name = elements.namedItem('last_name').value.trim();

		const payload = {
			user: {
				username,
				first_name,
				last_name,
			},
		};

		const optionalFields = ['num_doc', 'uni_email', 'phone'];
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
			fetchUsers(); // Assuming fetchUsers is defined to refresh the user list
			setIsModalOpen((s) => ({ ...s, create: false }));
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.response?.data?.error ||
				error?.message ||
				'Error al crear usuario';

			toaster.create({
				title: message,
				type: 'error',
			});
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
									<Field label='Usuario'>
										<Input required name='username' placeholder='Usuario' />
									</Field>

									<Field label='Nombres'>
										<Input required name='first_name' placeholder='Nombres' />
									</Field>

									<Field label='Apellidos'>
										<Input required name='last_name' placeholder='Apellidos' />
									</Field>

									<Field label='Documento'>
										<Input name='num_doc' placeholder='Opcional' />
									</Field>

									<Field label='Correo UNI'>
										<Input
											name='uni_email'
											type='email'
											placeholder='Opcional'
										/>
									</Field>

									<Field label='Teléfono'>
										<Input name='phone' placeholder='Opcional' />
									</Field>
								</Grid>

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
