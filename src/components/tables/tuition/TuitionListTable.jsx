import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { ConfirmModal, Pagination, toaster, Tooltip } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import {
	Badge,
	Box,
	Button,
	IconButton,
	Span,
	Table,
	Text,
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FiCheckCircle, FiCopy, FiEdit2 } from 'react-icons/fi';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';
import PropTypes from 'prop-types';
import { formatDateString } from '@/components/ui/dateHelpers';
import { useCompleteEnrollment } from '@/hooks/enrollments_proccess';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		permissions,
		sortConfig,
		data,
		setIsModalOpen,
		setModalData,
		setActionType,
	}) => {
		const navigate = useNavigate();
		const encrypted = Encryptor.encrypt(item.id);
		const encoded = encodeURIComponent(encrypted);
		const [open, setOpen] = useState(false);
		const { mutate: completeEnrollment, isPending } = useCompleteEnrollment();

		const handleRowClick = () => {
			if (permissions?.includes('enrollments.myprogramsEnrollments.view')) {
				navigate(`/enrollments/myprograms/${encoded}`);
			} else if (
				permissions?.includes('enrollments.proccessEnrollments.view')
			) {
				navigate(`/enrollments/programs/${encoded}`);
			}
		};

		const getStatusColor = (status) => {
			switch (status) {
				case 1: // Activo
					return 'green';
				case 2: // Cancelado
					return 'red';
				case 3: // Completado
					return 'blue';
				case 4: // Borrador
					return 'gray';
				default:
					return 'gray';
			}
		};

		const handleComplete = (uuid) => {
			completeEnrollment(uuid, {
				onSuccess: () => {
					toaster.create({
						title: 'Proceso completado correctamente',
						type: 'success',
					});
					fetchData();
					setOpen(false);
				},
				onError: (error) => {
					toaster.create({
						title: error.message,
						type: 'error',
					});
				},
			});
		};

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
				<Table.Cell>{formatDateString(item.start_date)}</Table.Cell>
				<Table.Cell>{formatDateString(item.end_date)}</Table.Cell>
				<Table.Cell>
					{' '}
					<Badge
						colorPalette={getStatusColor(item.status_enrollment_period)}
						variant='subtle'
						px={2}
						py={1}
						borderRadius='md'
					>
						{item.status_enrollment_period_display}
					</Badge>
				</Table.Cell>

				<Table.Cell onClick={(e) => e.stopPropagation()}>
					<Box css={{ display: 'flex' }} gap={2}>
						{permissions?.includes(
							'enrollments.proccessEnrollments.complete'
						) && (
							<ConfirmModal
								placement='center'
								trigger={
									<Box>
										<IconButton px={2} colorPalette='blue' size='xs' disabled={item.status_enrollment_period === 3}>
											<FiCheckCircle />
											Completar
										</IconButton>
									</Box>
								}
								open={open}
								onOpenChange={(e) => setOpen(e.open)}
								onConfirm={() => handleComplete(item.uuid)}
								loading={isPending}
								confirmLabel={'Si, Finalizar'}
							>
								<Text textAlign={'center'}>
									¿Estás seguro que quieres finalizar el proceso de Matrícula
									<Span fontWeight='semibold' px='1'>
										{item.academic_period_name}
									</Span>
									y completar el periodo?
								</Text>
							</ConfirmModal>
						)}

						<Tooltip
							content='Editar'
							positioning={{ placement: 'bottom-center' }}
							showArrow
							openDelay={0}
						>
							<IconButton
								size='xs'
								colorPalette='green'
								disabled={
									!permissions?.includes('enrollments.proccessEnrollments.edit')
								}
								onClick={() => {
									setModalData(item);
									setIsModalOpen(true);
									setActionType('edit');
								}}
							>
								<FiEdit2 />
							</IconButton>
						</Tooltip>
						{permissions?.includes(
							'enrollments.proccessEnrollments.double'
						) && (
							<Button
								size='xs'
								colorPalette='purple'
								borderRadius='md'
								onClick={() => {
									setModalData(item);
									setActionType('duplicate');
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
							<Table.ColumnHeader minW={'30%'}>
								<SortableHeader
									label='Período Académico'
									columnKey='academic_period_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader minW={'30%'}>Fecha Inicio</Table.ColumnHeader>
							<Table.ColumnHeader minW={'30%%'}>Fecha Fin</Table.ColumnHeader>
							<Table.ColumnHeader minW={'30%%'}>
								<SortableHeader
									label='Estado'
									columnKey='status_enrollment_period_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader minW={'20%'}>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={6} />
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
								<Table.Cell colSpan={6} textAlign='center' py={2}>
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
