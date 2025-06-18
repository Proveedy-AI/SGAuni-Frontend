import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import { Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { ViewProgram } from '../forms/management/programs/ViewProgram';
import { DeleteProgram } from '../forms/management/programs/DeleteProgram';
import { EditProgram } from '../forms/management/programs/EditProgram';
import { AssignDebtConditionProgram } from '../forms/management/programs';
import { SortableHeader } from '../ui/SortableHeader';
import { usePaginationSettings } from '../navigation/usePaginationSettings';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		programTypesOptions,
		coordinatorsOptions,
		loadingProgramTypes,
		loadingCoordinators,
		sortConfig,
		data,
	}) => {
		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
				<Table.Cell>{item.type_detail.name}</Table.Cell>
				<Table.Cell>
					<HStack justify='space-between'>
						<Group>
							<ViewProgram item={item} />
							<EditProgram
								fetchData={fetchData}
								item={item}
								programTypesOptions={programTypesOptions}
								coordinatorsOptions={coordinatorsOptions}
								loadingProgramTypes={loadingProgramTypes}
								loadingCoordinators={loadingCoordinators}
							/>
							<AssignDebtConditionProgram item={item} fetchData={fetchData} />
							<DeleteProgram item={item} fetchData={fetchData} />
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
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const ProgramTable = ({
	data,
	fetchData,
	programTypesOptions,
	coordinatorsOptions,
	loadingProgramTypes,
	loadingCoordinators,
}) => {
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
							<Table.ColumnHeader w='50%'>
								<SortableHeader
									label='Nombre del Programa'
									columnKey='name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='30%'>Tipo</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>Acciones</Table.ColumnHeader>
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
								programTypesOptions={programTypesOptions}
								coordinatorsOptions={coordinatorsOptions}
								loadingProgramTypes={loadingProgramTypes}
								loadingCoordinators={loadingCoordinators}
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

ProgramTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
};
