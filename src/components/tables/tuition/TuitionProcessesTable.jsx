import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { Badge, Box, Button, Table } from '@chakra-ui/react';
import { memo, useState } from 'react';
import {
	EditTuitionProcessModal,
	ViewTuitionProcessModal,
	ObservationTuitionProcessModal,
	ApproveTuitionProcessModal,
} from '@/components/modals/tuition';
import { FiCopy } from 'react-icons/fi';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';
import PropTypes from 'prop-types';

const Row = memo(
	({
		item,
		startIndex,
		index,
		sortConfig,
		data,
		setIsModalOpen,
		setModalData,
	}) => {
		const getStatusColor = (status) => {
			switch (status.toLowerCase()) {
				case 'pending approval':
					return '#F86A1E';
				case 'configuration':
					return '#AEAEAE';
				case 'approved':
					return '#2D9F2D';
				default:
					return 'gray';
			}
		};

		return (
			<Table.Row key={item.id} bg={index % 2 === 0 ? 'gray.100' : 'white'}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.academicPeriod}</Table.Cell>
				<Table.Cell>{item.schedule}</Table.Cell>
				<Table.Cell>
					<Badge
						bg={getStatusColor(item.status)}
						color='white'
						fontWeight='semibold'
					>
						{item.status}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					<Box css={{ display: 'flex' }} gap={2}>
						<ViewTuitionProcessModal data={item} />
						<EditTuitionProcessModal data={item} />
						<ObservationTuitionProcessModal data={item} />
						<ApproveTuitionProcessModal data={item} />

						{item.status.toLowerCase() === 'approved' && (
							<Button
								size='xs'
								colorPalette='purple'
								borderRadius='md'
								onClick={() => {
									const duplicatedData = {
										...item,
										academicPeriod: `${item.academicPeriod}-Copia`,
									};
									setModalData(duplicatedData);
									setIsModalOpen(true);
								}}
							>
								<FiCopy /> Duplicar
							</Button>
						)}
					</Box>
				</Table.Cell>
			</Table.Row>
		);
	}
);

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
};

export const TuitionProcessesTable = ({
	data,
	isLoading,
	setIsModalOpen,
	setModalData,
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
							<Table.ColumnHeader w='5%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader minW={'200px'}>
								Período académico
							</Table.ColumnHeader>
							<Table.ColumnHeader minW={'200px'}>Cronograma</Table.ColumnHeader>
							<Table.ColumnHeader minW={'200px'}>Estado</Table.ColumnHeader>
							<Table.ColumnHeader minW={'10px'}>Acciones</Table.ColumnHeader>
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
									startIndex={startIndex}
									index={index}
									setIsModalOpen={setIsModalOpen}
									setModalData={setModalData}
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

TuitionProcessesTable.propTypes = {
	data: PropTypes.array,
	isLoading: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
};
