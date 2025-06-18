import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import {
	Box,
	Group,
	HStack,
	IconButton,
	Span,
	Table,
	Text,
} from '@chakra-ui/react';
import {
	ClipboardRoot,
	ClipboardText,
	ConfirmModal,
	Pagination,
	toaster,
} from '@/components/ui';
import { FiTrash2 } from 'react-icons/fi';
import { UpdateSettingsPermissionForm } from '@/components/forms/settings';
import { useDeletePermission } from '@/hooks';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';

const Row = memo(({ item, fetchData, startIndex, index, sortConfig, data }) => {
	const [open, setOpen] = useState(false);

	const { mutateAsync: remove, loading } = useDeletePermission();

	const handleDelete = async (id) => {
		try {
			await remove(id);
			toaster.create({
				title: 'Permiso eliminado correctamente',
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
				<HStack>
					<ClipboardRoot value={item.guard_name}>
						<ClipboardText>{item.guard_name}</ClipboardText>
					</ClipboardRoot>
				</HStack>
			</Table.Cell>
			<Table.Cell>
				<HStack justify='space-between'>
					<Group>
						<UpdateSettingsPermissionForm data={item} fetchData={fetchData} />

						<ConfirmModal
							placement='center'
							trigger={
								<IconButton colorPalette='red' size='xs'>
									<FiTrash2 />
								</IconButton>
							}
							open={open}
							onOpenChange={(e) => setOpen(e.open)}
							onConfirm={() => handleDelete(item.id)}
							loading={loading}
						>
							<Text>
								¿Estás seguro que quieres eliminar el
								<Span fontWeight='semibold' px='1'>
									{item.name}
								</Span>
								de la lista de permisos?
							</Text>
						</ConfirmModal>
					</Group>
				</HStack>
			</Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const SettingsPermissionsTable = ({ data, fetchData }) => {
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
							<Table.ColumnHeader w='5%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='30%'>
								<SortableHeader
									label='Nombre del permiso'
									columnKey='name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='35%'>
								<SortableHeader
									label='Permiso'
									columnKey='guard_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
							<Row
								key={item.id}
								item={item}
								data={data}
								sortConfig={sortConfig}
								fetchData={fetchData}
								startIndex={startIndex}
								index={index}
							/>
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
	);
};

SettingsPermissionsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
};
