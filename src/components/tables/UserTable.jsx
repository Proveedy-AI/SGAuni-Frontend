import { Button, Pagination, toaster, Tooltip } from '@/components/ui';
import { Badge, Box, HStack, Switch, Table, Text } from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useToggleUser } from '@/hooks/users/useToggleUser';
import { ViewUserModal } from '../forms/management/user/ViewUserModal';
import { usePaginationSettings } from '../navigation/usePaginationSettings';
import { SortableHeader } from '../ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '../ui/SkeletonTable';
import { useState } from 'react';

export const UserTable = ({ 
	fetchUsers, 
	data, 
	allUsersData,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	handleOpenModal, 
	isLoading 
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [currentPage, setCurrentPage] = useState(1);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const [sortConfig, setSortConfig] = useState(null);
	const sortedData = useSortedData(data, sortConfig);
	const visibleRows = sortedData?.slice(startIndex, endIndex);

	// Calcular el total de usuarios de todas las páginas
	const totalUsers = allUsersData?.pages?.[0]?.count || data?.length || 0;

	// Lógica para precargar datos automáticamente
	const handlePageChange = (page) => {
		setCurrentPage(page);
		// Si la página solicitada requiere más datos y hay más páginas disponibles
		const requiredUsers = page * pageSize;
		const currentUsers = data?.length || 0;
		const buffer = pageSize * 2; // Precarga cuando estamos a 2 páginas del final
		
		if (requiredUsers + buffer > currentUsers && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const handlePageSizeChange = (size) => {
		setPageSize(size);
		setCurrentPage(1);
		// Verificar si necesitamos cargar más datos para el nuevo tamaño de página
		const requiredUsers = size * 3; // Precarga 3 páginas del nuevo tamaño
		const currentUsers = data?.length || 0;
		
		if (requiredUsers > currentUsers && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

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
							{isLoading ? (
								<SkeletonTable columns={6} />
							) : visibleRows?.length > 0 ? (
								visibleRows.map((item, idx) => (
									<Table.Row key={idx}>
										<Table.Cell>
											{sortConfig?.key === 'index' &&
											sortConfig?.direction === 'desc'
												? data.length - (startIndex + idx)
												: startIndex + idx + 1}
										</Table.Cell>
										<Table.Cell>{item.full_name}</Table.Cell>
										<Table.Cell>{item.uni_email || '-'}</Table.Cell>
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
															onClick={() =>
																handleOpenModal('toogleRole', item)
															}
															_hover={{
																background: {
																	base: '#6c32a6',
																	_dark: '#6b46c1',
																},
															}}
														>
															<FiUserPlus />
														</Button>
													</Tooltip>
												</Box>
											</HStack>
										</Table.Cell>
									</Table.Row>
								))
							) : (
								<Table.Row>
									<Table.Cell colSpan={6} textAlign='center' py={2}>
										No hay datos disponibles.
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
				
				{/* Indicador de carga y botón para cargar más */}
				{hasNextPage && (
					<Box textAlign="center" py={4}>
						{isFetchingNextPage ? (
							<Text color="gray.500">Cargando más usuarios...</Text>
						) : (
							<Button
								variant="outline"
								size="sm"
								onClick={fetchNextPage}
								colorScheme="blue"
							>
								Cargar más usuarios
							</Button>
						)}
					</Box>
				)}
				
				<Pagination
					count={totalUsers}
					pageSize={pageSize}
					currentPage={currentPage}
					pageSizeOptions={pageSizeOptions}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			</Box>
		</HStack>
	);
};

UserTable.propTypes = {
	data: PropTypes.array,
	allUsersData: PropTypes.object,
	setUsers: PropTypes.func,
	handleOpenModal: PropTypes.func,
	loading: PropTypes.bool,
	fetchUsers: PropTypes.func,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	isLoading: PropTypes.bool,
};
