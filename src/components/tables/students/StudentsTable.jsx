import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { Badge, Box, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';

import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { useNavigate } from 'react-router';
import { Encryptor } from '@/components/CrytoJS/Encryptor';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const navigate = useNavigate();
	const statusDisplay = [
		{ id: 1, label: 'Activo', bg: '#D0EDD0', color: '#2D9F2D' },
		{ id: 2, label: 'Suspendido', bg: '#d0daedff', color: '#2d689fff' },
		{ id: 3, label: 'Graduado', bg: '#F7CDCE', color: '#E0383B' },
		{ id: 4, label: 'Retirado', bg: '#D0EDD0', color: '#2D9F2D' },
	];
	const encrypted = Encryptor.encrypt(item.id);
	const encoded = encodeURIComponent(encrypted);

	const matchStatus = statusDisplay.find((status) => status.id === item.status);
	const handleRowClick = () => {
		navigate(`/students/${encoded}`);
	};
	return (
		<Table.Row
			onClick={(e) => {
				if (e.target.closest('button') || e.target.closest('a')) return;
				handleRowClick();
			}}
			key={item.id}
			bg={index % 2 === 0 ? 'gray.100' : 'white'} // tu color alternado aquí
			_hover={{
				bg: 'blue.100',
				cursor: 'pointer',
			}}
		>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{item.student_name}</Table.Cell>
			<Table.Cell>{item.admission_program_name}</Table.Cell>
			<Table.Cell>{item.admission_year}</Table.Cell>
			<Table.Cell>
				{item.has_scholarship ? (
					<Badge colorPalette='green'>Sí</Badge>
				) : (
					<Badge colorPalette='red'>No</Badge>
				)}
			</Table.Cell>
			<Table.Cell>
				<Badge bg={matchStatus?.bg} color={matchStatus?.color}>
					{matchStatus?.label || 'N/A'}
				</Badge>
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

export const StudentsTable = ({
	data,
	fetchData,
	isLoading,
	totalCount,
	isFetchingNextPage,
	fetchNextPage,
	hasNextPage,
	resetPageTrigger,
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [sortConfig, setSortConfig] = useState(null);

	const sortedData = useSortedData(data, sortConfig);

	const {
		currentPage,
		startIndex,
		visibleRows,
		loadUntilPage,
		setCurrentPage,
	} = usePaginatedInfiniteData({
		data: sortedData,
		pageSize,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [resetPageTrigger]);

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='3'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<Table.ScrollArea>
				<Table.Root size='sm' w='full'>
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
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Estudiante'
									columnKey='student_full_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Admisión'
									columnKey='admission_program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Año de Admisión'
									columnKey='admission_year'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Beca'
									columnKey='has_scholarship'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Estado'
									columnKey='status_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading || (isFetchingNextPage && hasNextPage) ? (
							<SkeletonTable columns={6} />
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
								<Table.Cell colSpan={6} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Pagination
				count={totalCount}
				pageSize={pageSize}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={loadUntilPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

StudentsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	resetPageTrigger: PropTypes.func,
	totalCount: PropTypes.number,
};
