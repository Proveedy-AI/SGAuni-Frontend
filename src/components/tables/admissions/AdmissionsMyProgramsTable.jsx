//import { UpdateSettingsCountryForm } from '@/components/forms';

import {
	AssignEvaluatorProgramModal,
	PreviewAdmissionsProgramsModal,
	UpdateAdmissionsProgramsForm,
} from '@/components/forms/admissions';
import { AssignModalityToProgramForm } from '@/components/forms/admissions/AssignModalityProgramsForm';
import { HistoryStatusProgramsView } from '@/components/forms/admissions/HistoryStatusProgramsView';
import { SendAdmissionProgramtoConfirmForm } from '@/components/forms/admissions/SendAdmissionProgramtoConfirmForm';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { ConfirmModal, Pagination, toaster } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useDeleteAdmissionsPrograms } from '@/hooks/admissions_programs';
import useSortedData from '@/utils/useSortedData';
import { Box, HStack, IconButton, Span, Table, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

const Row = memo(
	({ item, fetchData, startIndex, index, permissions, sortConfig, data }) => {
		const [open, setOpen] = useState(false);

		const { mutate: deleteAdmisionsPrograms, isPending } =
			useDeleteAdmissionsPrograms();

		const handleDelete = () => {
			deleteAdmisionsPrograms(item.id, {
				onSuccess: () => {
					toaster.create({
						title: 'Proceso eliminado correctamente',
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
				<Table.Cell>{formatDateString(item.semester_start_date)}</Table.Cell>
				<Table.Cell>
					{formatDateString(item.registration_start_date)}
				</Table.Cell>
				<Table.Cell>{formatDateString(item.registration_end_date)}</Table.Cell>
				<Table.Cell>
					<HistoryStatusProgramsView
						data={item}
						statusMap={statusMap}
						fetchData={fetchData}
					/>
				</Table.Cell>
				<Table.Cell>
					<HStack>
						{(permissions?.includes('admissions.programs.send') ||
							permissions?.includes('admissions.programs.admin')) && (
							<SendAdmissionProgramtoConfirmForm
								fetchData={fetchData}
								item={item}
							/>
						)}
						<PreviewAdmissionsProgramsModal statusMap={statusMap} data={item} />
						{(permissions?.includes('admissions.programs.assignmodality') ||
							permissions?.includes('admissions.programs.admin')) && (
							<AssignModalityToProgramForm
								data={item}
								fetchData={fetchData}
								permissions={permissions}
							/>
						)}

						{(permissions?.includes('admissions.myprograms.assignevaluator') ||
							permissions?.includes('admissions.programs.admin')) && (
							<AssignEvaluatorProgramModal
								data={item}
								fetchData={fetchData}
								permissions={permissions}
							/>
						)}
						{(permissions?.includes('admissions.myprograms.edit') ||
							permissions?.includes('admissions.programs.admin')) && (
							<UpdateAdmissionsProgramsForm
								data={item}
								fetchData={fetchData}
								permissions={permissions}
							/>
						)}
						{(permissions?.includes('admissions.myprograms.delete') ||
							permissions?.includes('admissions.programs.admin')) && (
							<ConfirmModal
								placement='center'
								trigger={
									<IconButton
										disabled={
											!permissions?.includes('admissions.programs.admin') &&
											item.status === 4
										}
										colorPalette='red'
										size='xs'
									>
										<FiTrash2 />
									</IconButton>
								}
								open={open}
								onOpenChange={(e) => setOpen(e.open)}
								onConfirm={() => handleDelete(item.id)}
								loading={isPending}
							>
								<Text>
									¿Estás seguro que quieres eliminar a
									<Span fontWeight='semibold' px='1'>
										{item.program_name}
									</Span>
									de la lista de Procesos?
								</Text>
							</ConfirmModal>
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
};

export const AdmissionsMyProgramsTable = ({
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
							<Table.ColumnHeader w={'20%'}>
								<SortableHeader
									label='Programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Inicio Semestre</Table.ColumnHeader>
							<Table.ColumnHeader>Inicio de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Fin de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={7} />
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
								<Table.Cell colSpan={7} textAlign='center' py={2}>
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

AdmissionsMyProgramsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	permissions: PropTypes.array,
};
