import { RemoveAcademicDegreeModal, UpdateAcademicDegreeModal, ViewAcademicDegreeDocumentModal } from '@/components/modals/academic_degrees';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import { Box, Group, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

const Row = memo(
	({ item, fetchData, startIndex, index, sortConfig, data, options }) => {
		console.log(item);
    return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
				<Table.Cell>{item.university}</Table.Cell>
				<Table.Cell>{item.type_degree_display || '-'}</Table.Cell>

				<Table.Cell>
					<HStack justify='space-between'>
						<Group>
							<ViewAcademicDegreeDocumentModal item={item} />
              <UpdateAcademicDegreeModal item={item} fetchData={fetchData} options={options} />
              <RemoveAcademicDegreeModal item={item} fetchData={fetchData} />
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
	options: PropTypes.array,
};

export const AcademicDegreeTable = ({
	data,
	fetchData,
	isLoading,
	options,
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
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Nombre'
									columnKey='code'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='35%'>
								<SortableHeader
									label='Universidad de Procedencia'
									columnKey='name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Tipo'
									columnKey='credits'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={5} />
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
									options={options}
								/>
							))
						) : (
							<Table.Cell colSpan={5} textAlign='center' py={2}>
								No hay datos disponibles.
							</Table.Cell>
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

AcademicDegreeTable.propTypes = {
	data: PropTypes.array.isRequired,
	fetchData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	options: PropTypes.array.isRequired,
};
