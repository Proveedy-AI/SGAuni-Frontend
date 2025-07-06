import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { ConfirmModal, Modal, Pagination, Tooltip } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { Badge, Box, Button, IconButton, Span, Stack, Table, Text } from '@chakra-ui/react';
import { memo, useRef, useState } from 'react';
import {
	EditTuitionProcessModal,
	ViewTuitionProcessModal,
	ObservationTuitionProcessModal,
	ApproveTuitionProcessModal,
	DeleteTuitionProcessModal,
} from '@/components/modals/tuition';
import { useNavigate } from 'react-router';
import { FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';
import PropTypes from 'prop-types';

const Row = memo(({
	item,
	fetchData,
	startIndex,
	index,
	permissions,
	sortConfig,
	data,
	setIsModalOpen,
	setModalData,
	setActionType
}) => {
		const [open, setOpen] = useState(false);
		const contentRef = useRef();
		const navigate = useNavigate();
		const encrypted = Encryptor.encrypt(item.id);
		const encoded = encodeURIComponent(encrypted);

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

		const handleDelete = () => {
			// deleteAdmisions(item.id, {
			// 	onSuccess: () => {
			// 		toaster.create({
			// 			title: 'Proceso eliminado correctamente',
			// 			type: 'success',
			// 		});
			// 		fetchData();
			// 		setOpen(false);
			// 	},
			// 	onError: (error) => {
			// 		toaster.create({
			// 			title: error.message,
			// 			type: 'error',
			// 		});
			// 	},
			// });
		};

		const handleRowClick = () => {
			if (permissions?.includes('enrollments.programs.view')) {
				navigate(`/enrollments/programs/${encoded}`);
			}
		};

		// console.log(item);

		return (
			<Table.Row
				onClick={(e) => {
					if (e.target.closest('button') || e.target.closest('a')) return;
					handleRowClick();
				}}
				key={item.id}
				bg={index % 2 === 0 ? 'gray.100' : 'white'}
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
				<Table.Cell>{item.academic_period_name}</Table.Cell>
				<Table.Cell>{item.start_date}</Table.Cell>
				<Table.Cell>{item.end_date}</Table.Cell>
				{/* <Table.Cell>
					<Badge
						bg={getStatusColor(item.status)}
						color='white'
						fontWeight='semibold'
					>
						{item.status}
					</Badge>
				</Table.Cell> */}
				<Table.Cell onClick={(e) => e.stopPropagation()}>
					<Box css={{ display: 'flex' }} gap={2}>
						{/* <ViewTuitionProcessModal data={item} /> */}
						{/* <EditTuitionProcessModal data={item} permissions={permissions} fetchData={fetchData} /> */}
						<Tooltip
							content='Editar'
							positioning={{ placement: 'bottom-center' }}
							showArrow
							openDelay={0}
						>
							<IconButton 
								size='xs' 
								colorPalette='green'
								disabled={!permissions?.includes('enrollments.proccess.edit')}
								onClick={() => {
									setModalData(item);
									setIsModalOpen(true);
									setActionType('edit');
								}}
							>
								<FiEdit2 />
							</IconButton>
						</Tooltip>

						<DeleteTuitionProcessModal permissions={permissions} item={item} fetchData={fetchData} />
						{/* <ObservationTuitionProcessModal data={item} /> */}
						{/* <ApproveTuitionProcessModal data={item} /> */}
						{/* {item.status.toLowerCase() === 'approved' && 
							permissions?.includes('enrollments.proccess.double') && (
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
							)
						} */}
					</Box>
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
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
	setActionType: PropTypes.func,
};

export const TuitionListTable = ({
	data,
	fetchData,
	permissions,
	isLoading,
	setIsModalOpen,
	setModalData,
	setActionType,
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
							<Table.ColumnHeader minW={'200px'}>Período académico</Table.ColumnHeader>
							<Table.ColumnHeader minW={'200px'}>Fecha Inicio</Table.ColumnHeader>
							<Table.ColumnHeader minW={'200px'}>Fecha Fin</Table.ColumnHeader>
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
									permissions={permissions}
									fetchData={fetchData}
									setIsModalOpen={setIsModalOpen}
									setModalData={setModalData}
									setActionType={setActionType}
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

TuitionListTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	permissions: PropTypes.array,
	isLoading: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
	setActionType: PropTypes.func,
};
