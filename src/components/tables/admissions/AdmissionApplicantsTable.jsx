import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import { Box, Table } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const navigate = useNavigate();
	const encrypted = Encryptor.encrypt(item.id);
	const encoded = encodeURIComponent(encrypted);
	const handleRowClick = () => {
		navigate(`/admissions/applicants/programs/${encoded}`);
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
			<Table.Cell>{item.program_name}</Table.Cell>
			<Table.Cell>{item.program_type}</Table.Cell>
			<Table.Cell>{item.admission_process_name}</Table.Cell>
			<Table.Cell>
				{format(parseISO(item.semester_start_date), 'dd/MM/yyyy')}
			</Table.Cell>
			<Table.Cell onClick={(e) => e.stopPropagation()}></Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const AdmissionApplicantsTable = ({
	data,
	fetchData,
	permissions,
	isLoading,
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
				<Table.Root size='sm' w='full'>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader w={'5%'}>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w={'40%'}>
								<SortableHeader
									label='Nombres del programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w={'20%'}>Tipo del programa</Table.ColumnHeader>
							<Table.ColumnHeader w={'20%'}> Proceso de Admisión</Table.ColumnHeader>
							<Table.ColumnHeader w={'10%'}>Fecha</Table.ColumnHeader>
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
									permissions={permissions}
									fetchData={fetchData}
									startIndex={startIndex}
									index={index}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={5} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Pagination
				count={data?.length}
				pageSize={Number(pageSize)}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={(page) => setCurrentPage(page)}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

AdmissionApplicantsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	permissions: PropTypes.array,
	search: PropTypes.object,
	setSearch: PropTypes.func,
};
