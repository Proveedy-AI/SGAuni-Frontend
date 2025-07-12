//import { UpdateSettingsCountryForm } from '@/components/forms';
import { HistoryStatusEnrollmentProgramsView } from '@/components/forms/enrollment_proccess/HistoryStatusEnrollmentProgramsView';
import { DeleteTuitionProgramsModal } from '@/components/modals/tuition';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination, toaster, Tooltip } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import { SendConfirmationModal } from '@/components/ui/SendConfirmationModal';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useCreateEnrollmentsProgramsReview } from '@/hooks/enrollments_programs/useCreateEnrollmentsProgramsReview';

import useSortedData from '@/utils/useSortedData';
import { Box, HStack, IconButton, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		sortConfig,
		data,
		permissions,
		setIsModalOpen,
		setModalData,
		setActionType,
	}) => {
		const [openSend, setOpenSend] = useState(false);

		const statusMap = {
			Borrador: { label: 'Borrador', color: 'gray' },
			Pendiente: { label: 'Pendiente', color: 'orange.500' },
			Aprobado: { label: 'Aprobado', color: 'green' },
			Rechazado: { label: 'Rechazado', color: 'red' },
		};
		const { mutate: createProgramsReview, isPending: LoadingProgramsReview } =
			useCreateEnrollmentsProgramsReview();

		const handleSend = () => {
			createProgramsReview(item.id, {
				onSuccess: () => {
					toaster.create({
						title: 'Programa enviado correctamente',
						type: 'success',
					});
					fetchData();
					setOpenSend(false);
				},
				onError: (error) => {
					console.log(error);
					toaster.create({
						title: error.message,
						type: 'error',
					});
				},
			});
		};

		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.program_name}</Table.Cell>
				<Table.Cell>{formatDateString(item.semester_start_date)}</Table.Cell>
				<Table.Cell>
					{formatDateString(item.registration_start_date)}
				</Table.Cell>
				<Table.Cell>{formatDateString(item.registration_end_date)}</Table.Cell>
				<Table.Cell>
					<HistoryStatusEnrollmentProgramsView
						data={item}
						statusMap={statusMap}
						fetchData={fetchData}
					/>
				</Table.Cell>
				<Table.Cell>
					<HStack>
						<SendConfirmationModal
							item={item}
							onConfirm={handleSend}
							openSend={openSend}
							setOpenSend={setOpenSend}
							loading={LoadingProgramsReview}
						/>

						<Tooltip
							content='Editar'
							positioning={{ placement: 'bottom-center' }}
							showArrow
							openDelay={0}
						>
							<IconButton
								size='xs'
								colorPalette='cyan'
								// disabled={!permissions?.includes('enrollments.myprograms.edit')}
								disabled={
									item.status === 4 ||
									item.status_display === 'Aprobado' ||
									item.status === 2
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
						{/* )} */}
						<DeleteTuitionProgramsModal
							permissions={permissions}
							item={item}
							fetchData={fetchData}
						/>
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
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
	setActionType: PropTypes.func,
};

export const EnrollmentsMyProgramsTable = ({
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
				<Table.Root size='sm' w='full' striped>
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
							<Table.ColumnHeader>Programa</Table.ColumnHeader>
							<Table.ColumnHeader>Inicio Semestre</Table.ColumnHeader>
							<Table.ColumnHeader>Inicio de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Fin de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={8} />
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
									setIsModalOpen={setIsModalOpen}
									setModalData={setModalData}
									setActionType={setActionType}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={8} textAlign='center' py={2}>
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

EnrollmentsMyProgramsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	permissions: PropTypes.array,
	setIsModalOpen: PropTypes.func,
	setModalData: PropTypes.func,
	setActionType: PropTypes.func,
};
