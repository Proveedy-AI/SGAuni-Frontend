import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import {
	Box,
	Group,
	HStack,
	IconButton,
	Span,
	Table,
	Text,
} from '@chakra-ui/react';
import { ConfirmModal, Pagination, toaster, Tooltip } from '@/components/ui';
import { FiTrash2 } from 'react-icons/fi';
import { useDeleteRole } from '@/hooks/roles';
import {
	AssignSettingsRolePermissionsForm,
	UpdateSettingsRoleForm,
} from '@/components/forms/settings';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		sortConfig,
		data,
		dataPermissions,
	}) => {
		const [open, setOpen] = useState(false);

		const { mutateAsync: remove, isPending: loadingDelete } = useDeleteRole();

		const handleDelete = async (id) => {
			try {
				await remove(id);
				toaster.create({
					title: 'Rol eliminado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
			} catch (error) {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			}
		};

		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
				<Table.Cell>
					<HStack justify='space-between'>
						<Group>
							<UpdateSettingsRoleForm data={item} fetchData={fetchData} />

							<AssignSettingsRolePermissionsForm
								dataPermissions={dataPermissions}
								data={item}
								fetchData={fetchData}
							/>

							<ConfirmModal
								title='Eliminar rol'
								placement='center'
								trigger={
									<Box>
										<Tooltip
											content='Eliminar'
											positioning={{ placement: 'bottom-center' }}
											showArrow
											openDelay={0}
										>
											<IconButton colorPalette='red' size='xs'>
												<FiTrash2 />
											</IconButton>
										</Tooltip>
									</Box>
								}
								open={open}
								onOpenChange={(e) => setOpen(e.open)}
								onConfirm={() => handleDelete(item.id)}
								loading={loadingDelete}
							>
								<Text>
									¿Estás seguro que quieres eliminar el
									<Span fontWeight='semibold' px='1'>
										{item.name}
									</Span>
									de la lista de roles?
								</Text>
							</ConfirmModal>
						</Group>
					</HStack>
				</Table.Cell>
			</Table.Row>
		);
	}
);

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	dataPermissions: PropTypes.array,
};

export const SettingsRolesTable = ({
	data,
	fetchData,
	isLoading,
	dataPermissions,
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [currentPage, setCurrentPage] = useState(1);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const [sortConfig, setSortConfig] = useState(null);
	const sortedData = useSortedData(data, sortConfig);
	const visibleRows = sortedData?.slice(startIndex, endIndex);

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='3'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<Table.ScrollArea>
				<Table.Root size='sm' w='full' striped>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='75%'>
								<SortableHeader
									label='Rol'
									columnKey='name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							{/* <Table.ColumnHeader>Funciones asignadas</Table.ColumnHeader> */}
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={3} />
						) : visibleRows?.length > 0 ? (
							visibleRows.map((item, index) => (
								<Row
									key={item.id}
									item={item}
									data={data}
									dataPermissions={dataPermissions}
									sortConfig={sortConfig}
									fetchData={fetchData}
									startIndex={startIndex}
									index={index}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={3} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
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
	);
};

SettingsRolesTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	dataPermissions: PropTypes.array,
};
