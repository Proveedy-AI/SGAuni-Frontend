import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import {
	Box,
	createListCollection,
	Group,
	HStack,
	IconButton,
	Span,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import {
	ClipboardRoot,
	ClipboardText,
	ConfirmModal,
	Pagination,
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
	toaster,
} from '@/components/ui';
import { FiArrowDown, FiArrowUp, FiTrash2 } from 'react-icons/fi';
import { UpdateSettingsPermissionForm } from '@/components/forms/settings';
import { useDeletePermission, useReorderPermission } from '@/hooks';

const Row = memo(({ item, fetchData, startIndex, index }) => {
	const [open, setOpen] = useState(false);

	const { mutateAsync: remove, loading } = useDeletePermission();
	const { mutateAsync: reorder, loading: loadingReorder } =
		useReorderPermission();

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

	const handleReorder = async (id, direction) => {
		try {
			await reorder({ id, direction });
			fetchData();
			toaster.create({
				title: 'Permiso reordenado correctamente',
				type: 'success',
			});
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>{startIndex + index + 1}</Table.Cell>
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

					<Group attached>
						<IconButton
							colorPalette='blue'
							size='xs'
							onClick={() => handleReorder(item.id, 'arriba')}
							disabled={loadingReorder}
							variant='surface'
						>
							<FiArrowUp />
						</IconButton>

						<IconButton
							colorPalette='blue'
							size='xs'
							onClick={() => handleReorder(item.id, 'abajo')}
							disabled={loadingReorder}
							variant='surface'
						>
							<FiArrowDown />
						</IconButton>
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
};

export const SettingsPermissionsTable = ({ data, fetchData }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState('10');

	const startIndex = (currentPage - 1) * parseInt(pageSize);
	const endIndex = startIndex + parseInt(pageSize);
	const visibleRows = data?.slice(startIndex, endIndex);

	const handlePageSizeChange = (newPageSize) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
	};

	const pageSizeOptions = [
		{ label: '5 filas', value: '5' },
		{ label: '10 filas', value: '10' },
		{ label: '15 filas', value: '15' },
		{ label: '20 filas', value: '20' },
		{ label: '25 filas', value: '25' },
	];

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
							<Table.ColumnHeader>N°</Table.ColumnHeader>
							<Table.ColumnHeader>Nombre del permiso</Table.ColumnHeader>
							<Table.ColumnHeader>Permiso</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
							<Row
								key={item.id}
								item={item}
								fetchData={fetchData}
								startIndex={startIndex}
								index={index}
							/>
						))}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Stack
				w='full'
				direction={{ base: 'column', sm: 'row' }}
				justify={{ base: 'center', sm: 'space-between' }}
				pt='2'
			>
				<SelectRoot
					collection={createListCollection({
						items: pageSizeOptions,
					})}
					size='xs'
					w='150px'
					display={{ base: 'none', sm: 'block' }}
					defaultValue={pageSize}
					onChange={(event) => handlePageSizeChange(event.target.value)}
				>
					<SelectTrigger>
						<SelectValueText placeholder='Seleccionar filas' />
					</SelectTrigger>
					<SelectContent bg={{ base: 'white', _dark: 'its.gray.500' }}>
						{pageSizeOptions.map((option) => (
							<SelectItem
								_hover={{
									bg: {
										base: 'its.100',
										_dark: 'its.gray.400',
									},
								}}
								key={option.value}
								item={option}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

				<Pagination
					count={data?.length}
					pageSize={pageSize}
					currentPage={currentPage}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</Stack>
		</Box>
	);
};

SettingsPermissionsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
};
