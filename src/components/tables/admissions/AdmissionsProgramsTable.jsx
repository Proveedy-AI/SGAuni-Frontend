import { PreviewProgramsPendingModal } from '@/components/forms/admissions';
import { UpdateStatusAdmissionsProccessForm } from '@/components/forms/admissions/UpdateStatusAdmissionsProccessForm';
import { UpdateStatusEnrollmentProcessForm } from '@/components/forms/enrollment_proccess/UpdateStatusEnrollmentProcessForm';
import { ScheduleEnrollmentProgramsReviewModal } from '@/components/modals/tuition';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';

import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		permissions,
		sortConfig,
		data,
		enrollment,
	}) => {
		const statusMap = {
			Borrador: { label: 'Borrador', color: 'gray' },
			'En revision': { label: 'En revisión', color: 'orange.500' },
			Aprobado: { label: 'Aprobado', color: 'green' },
			Rechazado: { label: 'Rechazado', color: 'red' },
		};

		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.program_name}</Table.Cell>
				<Table.Cell>{item.coordinator_name}</Table.Cell>
				<Table.Cell>{formatDateString(item.semester_start_date)}</Table.Cell>
				<Table.Cell>
					{formatDateString(item.registration_start_date)}
				</Table.Cell>
				<Table.Cell>{formatDateString(item.registration_end_date)}</Table.Cell>
				<Table.Cell>
					{(() => {
						const status = statusMap[item.status_display] || {
							label: item.status_display,
							color: 'default',
						};
						return (
							<Badge variant='solid' bg={status.color}>
								{status.label}
							</Badge>
						);
					})()}
				</Table.Cell>
				<Table.Cell>
					<HStack>
						{enrollment && (
							<ScheduleEnrollmentProgramsReviewModal permissions={permissions}  data={item} />
						)}
						<PreviewProgramsPendingModal data={item} />
						{permissions?.includes('admissions.programs.approve') &&
							!enrollment && (
								<UpdateStatusAdmissionsProccessForm
									data={item}
									fetchData={fetchData}
								/>
							)}

						{enrollment && (
							<UpdateStatusEnrollmentProcessForm
								data={item}
								fetchData={fetchData}
								enrollment={enrollment}
							/>
						)}
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
	enrollment: PropTypes.bool,
};

export const AdmissionsProgramsTable = ({
	data,
	fetchData,
	permissions,
	isLoading,
	enrollment = false,
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
							<Table.ColumnHeader>
								<SortableHeader
									label='Programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Coordinador'
									columnKey='coordinator_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Inicio Semestre'
									columnKey='semester_start_date'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Inicio Inscripción'
									columnKey='registration_start_date'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Fin Inscripción'
									columnKey='registration_end_date'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Estado'
									columnKey='status'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
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
									enrollment={enrollment}
									startIndex={startIndex}
									index={index}
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

AdmissionsProgramsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	permissions: PropTypes.array,
	enrollment: PropTypes.bool,
};
