import { Button, Pagination, toaster, Tooltip } from '@/components/ui';
import { Badge, Box, HStack, Switch, Table } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useToggleUser } from '@/hooks/users/useToggleUser';
import { ViewUserModal } from '../forms/management/user/ViewUserModal';
import { usePaginationSettings } from '../navigation/usePaginationSettings';
import { SortableHeader } from '../ui/SortableHeader';

export const UserTable = ({ fetchUsers, data, handleOpenModal }) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [currentPage, setCurrentPage] = useState(1);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const [sortConfig, setSortConfig] = useState(null);

	const sortedData = useMemo(() => {
		if (!sortConfig) return data;

		const sorted = [...data];

		if (sortConfig.key === 'index') {
			return sortConfig.direction === 'asc' ? sorted : sorted.reverse();
		}
		return sorted.sort((a, b) => {
			const aVal = a[sortConfig.key];
			const bVal = b[sortConfig.key];

			if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}, [data, sortConfig]);

	const visibleRows = sortedData?.slice(startIndex, endIndex);

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
			<Box w='full' overflowX='auto' p='3'>
				<Table.ScrollArea>
					<Table.Root size='sm' width='full' striped>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader w='5%'>
									<SortableHeader
										label='N°'
										columnKey='index'
										sortConfig={sortConfig}
										onSort={setSortConfig}
									/>
								</Table.ColumnHeader>
								<Table.ColumnHeader>
									<SortableHeader
										label='Nombre'
										columnKey='full_name'
										sortConfig={sortConfig}
										onSort={setSortConfig}
									/>
								</Table.ColumnHeader>
								<Table.ColumnHeader>
									<SortableHeader
										label='Correo Institucional'
										columnKey='uni_email'
										sortConfig={sortConfig}
										onSort={setSortConfig}
									/>
								</Table.ColumnHeader>
								<Table.ColumnHeader>Rol</Table.ColumnHeader>
								<Table.ColumnHeader>
									<SortableHeader
										label='Estado'
										columnKey='is_active'
										sortConfig={sortConfig}
										onSort={setSortConfig}
									/>
								</Table.ColumnHeader>
								<Table.ColumnHeader>Acciones</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{visibleRows.map((item, idx) => (
								<Table.Row key={idx}>
									<Table.Cell>
										{sortConfig?.key === 'index' &&
										sortConfig?.direction === 'desc'
											? data.length - (startIndex + idx)
											: startIndex + idx + 1}
									</Table.Cell>
									<Table.Cell>{item.full_name}</Table.Cell>
									<Table.Cell>{item.uni_email}</Table.Cell>
									<Table.Cell>
										{item.roles.length > 0 ? (
											<HStack spacing={1} wrap='wrap'>
												<Badge
													bg='uni.secondary'
													color='white'
													fontSize='0.8em'
												>
													{item.roles[0].name}
												</Badge>
												{item.roles.length > 1 && (
													<Badge
														bg='uni.secondary'
														color='white'
														fontSize='0.8em'
													>
														{' ...'}
													</Badge>
												)}
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
											<ViewUserModal selectedUser={item} />
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
											<Box>
												<Tooltip
													content='Asignar rol'
													positioning={{ placement: 'bottom-center' }}
													showArrow
													openDelay={0}
												>
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
												</Tooltip>
											</Box>
										</HStack>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
				<Pagination
					count={data?.length}
					pageSize={pageSize}
					currentPage={currentPage}
					pageSizeOptions={pageSizeOptions}
					onPageChange={setCurrentPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setCurrentPage(1);
					}}
				/>
			</Box>
		</HStack>
	);
};

UserTable.propTypes = {
	data: PropTypes.array,
	setUsers: PropTypes.func,
	handleOpenModal: PropTypes.func,
	loading: PropTypes.bool,
	fetchUsers: PropTypes.func,
};
