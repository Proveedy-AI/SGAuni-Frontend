import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Box, Group, HStack, Table, Switch } from '@chakra-ui/react';
import { Pagination, toaster } from '@/components/ui';
import {
	AssignModalityRules,
	DeleteModality,
	EditModality,
	ViewModality,
} from '../forms/management/modalities';
import { useToggleModality } from '@/hooks';
import { usePaginationSettings } from '../navigation/usePaginationSettings';
import { SortableHeader } from '../ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';

const Row = memo(({ item, fetchData, startIndex, index, sortConfig, data }) => {
	const { mutateAsync: toggleModalityRule, isPending: isPendingToggle } =
		useToggleModality();

	const handleStatusChange = async (id) => {
		try {
			await toggleModalityRule(id);
			// Realiza la acción de toggle en el rol
			toaster.create({
				title: `Estado del rol actualizado correctamente`,
				type: 'success',
			});

			fetchData(); // Refetch data after toggling status
		} catch (error) {
			toaster.create({
				title:
					error?.message || 'Ocurrió un error al cambiar el estado del rol',
				type: 'error',
			});
		}
	};

	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
				<Table.Cell>
					<Switch.Root
						checked={item.enabled}
						onCheckedChange={() => handleStatusChange(item.id)}
						disabled={isPendingToggle}
					>
						<Switch.Label mr={10}>
							{item.enabled ? 'Activo' : 'Inactivo'}
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
					<HStack justify='space-between'>
						<Group>
							<ViewModality item={item} />
							<EditModality fetchData={fetchData} item={item} />
							<AssignModalityRules item={item} fetchData={fetchData} />
							<DeleteModality item={item} fetchData={fetchData} />
						</Group>
					</HStack>
				</Table.Cell>
			</>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	modalityRules: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	isLoading: PropTypes.bool,
};

export const AdmissionModalitiesTable = ({ isLoading, data, fetchData }) => {
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
							<Table.ColumnHeader w='5%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='50%'>
								<SortableHeader
									label='Modalidad'
									columnKey='name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='30%'>Estado</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={4} rows={5} />
						) : visibleRows?.length > 0 ? (
							visibleRows.map((item, index) => (
								<Row
									key={item.id}
									item={item}
									data={data}
									sortConfig={sortConfig}
									fetchData={fetchData}
									startIndex={startIndex}
									index={index}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={4} textAlign='center' py={2}>
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

AdmissionModalitiesTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
};
