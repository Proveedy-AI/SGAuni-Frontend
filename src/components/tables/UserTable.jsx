import { Button, Pagination, toaster } from '@/components/ui';
import { Badge, Box, HStack, Switch, Table } from '@chakra-ui/react';
import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { HiEye, HiPencil } from 'react-icons/hi2';
import { RowsPerPageSelect } from '../select';
import PropTypes from 'prop-types';
import { useToggleUser } from '@/hooks/users/useToggleUser';

export const UserTable = ({ fetchUsers, users, handleOpenModal }) => {
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);

	const rowsPerPageOptions = [
		{ label: '5', value: '5' },
		{ label: '10', value: '10' },
		{ label: '20', value: '20' },
		{ label: '50', value: '50' },
	];

	const handleRowsPerPageChange = (option) => {
		setRowsPerPage(Number(option.value));
		setCurrentPage(1);
	};

	const paginatedData = users.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	const { mutateAsync: toggleUser, isPending: isPendingToggle } =
		useToggleUser();

	const handleStatusChange = async (userId) => {
		try {
			// Realizas la acción de toggle en el usuario
			await toggleUser(userId);

			toaster.create({
				title: `Usuario actualizado correctamente`,
				type: 'success',
			});

			fetchUsers(); // Vuelves a traer la lista de usuarios actualizada
		} catch (error) {
			toaster.create({
				title:
					error?.message || 'Ocurrió un error al cambiar el estado del usuario',
				type: 'error',
			});
		}
	};
	return (
		<HStack
			w='full'
			background={{ base: 'white', _dark: 'gray.800' }}
			border='1px solid'
			borderColor={{ base: '#E2E8F0', _dark: 'gray.700' }}
			borderRadius='lg'
			px={2}
			overflow='hidden'
			boxShadow='md'
		>
			<Box w='full' overflowX='auto'>
				<Table.Root size='sm' width='full' striped>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>Nº</Table.ColumnHeader>
							<Table.ColumnHeader>Nombre</Table.ColumnHeader>
							<Table.ColumnHeader>Correo UNI</Table.ColumnHeader>
							<Table.ColumnHeader>Rol</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{paginatedData.map((item, idx) => (
							<Table.Row key={idx}>
								<Table.Cell>
									{(currentPage - 1) * rowsPerPage + idx + 1}
								</Table.Cell>
								<Table.Cell>{item.full_name}</Table.Cell>
								<Table.Cell>{item.uni_email}</Table.Cell>
								<Table.Cell>
									{item.roles.length > 0 ? (
										<HStack spacing={1} wrap='wrap'>
											{item.roles.map((role) => (
												<Badge
													key={role.id}
													bg={'uni.secondary'}
													color={'white'}
													fontSize='0.8em'
												>
													{role.name}
												</Badge>
											))}
										</HStack>
									) : (
										<Badge colorScheme='gray' fontSize='0.8em'>
											Sin rol
										</Badge>
									)}
								</Table.Cell>
								<Table.Cell>
									<Switch.Root
										checked={item.is_active}
										display='flex'
										justifyContent='space-between'
										onCheckedChange={() => handleStatusChange(item.id)}
										disabled={isPendingToggle}
									>
										{' '}
										<Switch.Label>
											{item.is_active ? 'Activo' : 'Inactivo'}
										</Switch.Label>
										<Switch.HiddenInput />
										<Switch.Control
											_checked={{
												bg: 'uni.secondary',
											}}
											bg='uni.red.400'
										/>
									</Switch.Root>
								</Table.Cell>
								<Table.Cell>
									<HStack>
										<Button
											background={{ base: '#0661D8', _dark: '#3182ce' }}
											color='white'
											width='1'
											variant='outline'
											size='xs'
											borderRadius='md'
											onClick={() => handleOpenModal('view', item)}
											_hover={{
												background: { base: '#054ca6', _dark: '#2563eb' },
											}}
										>
											<HiEye />
										</Button>
										<Button
											background={{ base: '#2D9F2D', _dark: '#38a169' }}
											color='white'
											width='1'
											variant='outline'
											size='xs'
											borderRadius='md'
											onClick={() => handleOpenModal('edit', item)}
											_hover={{
												background: { base: '#217821', _dark: '#276749' },
											}}
										>
											<HiPencil />
										</Button>
										<Button
											background={{ base: '#9049DB', _dark: '#805ad5' }}
											color='white'
											width='1'
											variant='outline'
											size='xs'
											borderRadius='md'
											onClick={() => handleOpenModal('toogleRole', item)}
											_hover={{
												background: { base: '#6c32a6', _dark: '#6b46c1' },
											}}
										>
											<FiUserPlus />
										</Button>
									</HStack>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>

					<Table.Footer>
						<Table.Row>
							<Table.ColumnHeader colSpan={1}>
								{/* Aquí va la paginación */}
								<HStack spacing={2}>
									<RowsPerPageSelect
										options={rowsPerPageOptions}
										onChange={(value) => handleRowsPerPageChange({ value })}
									/>
								</HStack>
							</Table.ColumnHeader>
							<Table.ColumnHeader colSpan={4}>
								<Pagination
									count={users.length}
									pageSize={rowsPerPage}
									currentPage={currentPage}
									onPageChange={setCurrentPage}
								/>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			</Box>
		</HStack>
	);
};

UserTable.propTypes = {
	users: PropTypes.array,
	setUsers: PropTypes.func,
	handleOpenModal: PropTypes.func,
	loading: PropTypes.bool,
	fetchUsers: PropTypes.func,
};
