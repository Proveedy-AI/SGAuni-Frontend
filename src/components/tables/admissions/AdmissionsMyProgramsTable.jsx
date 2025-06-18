//import { UpdateSettingsCountryForm } from '@/components/forms';

import {
	AssignEvaluatorProgramModal,
	PreviewAdmissionsProgramsModal,
	UpdateAdmissionsProgramsForm,
} from '@/components/forms/admissions';
import { AssignModalityToProgramForm } from '@/components/forms/admissions/AssignModalityProgramsForm';
import { HistoryStatusProgramsView } from '@/components/forms/admissions/HistoryStatusProgramsView';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import {
	ConfirmModal,
	SendModal,
	Pagination,
	toaster,
	Tooltip,
} from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useDeleteAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useCreateProgramsReview } from '@/hooks/admissions_review_programs/useCreateProgramsReview';
import { Box, HStack, IconButton, Span, Table, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';

const Row = memo(
	({ item, fetchData, startIndex, index, permissions, sortConfig, data }) => {
		const [open, setOpen] = useState(false);
		const [openSend, setOpenSend] = useState(false);

		const { mutate: deleteAdmisionsPrograms, isPending } =
			useDeleteAdmissionsPrograms();

		const { mutate: createProgramsReview, isPending: LoadingProgramsReview } =
			useCreateProgramsReview();

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
		const statusMap = {
			Draft: { label: 'Borrador', color: 'gray' },
			Pending: { label: 'Pendiente', color: 'orange.500' },
			Approved: { label: 'Aprobado', color: 'green' },
			Rejected: { label: 'Rechazado', color: 'red' },
		};
		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item.program_name}</Table.Cell>
				<Table.Cell>
					{format(new Date(item.semester_start_date), 'dd/MM/yyyy')}
				</Table.Cell>
				<Table.Cell>
					{format(new Date(item.registration_start_date), 'dd/MM/yyyy')}
				</Table.Cell>
				<Table.Cell>
					{format(new Date(item.registration_end_date), 'dd/MM/yyyy')}
				</Table.Cell>
				<Table.Cell>
					<HistoryStatusProgramsView
						data={item}
						statusMap={statusMap}
						fetchData={fetchData}
					/>
				</Table.Cell>
				<Table.Cell>
					<HStack>
						{permissions?.includes('admissions.myprograms.send') && (
							<SendModal
								placement='center'
								trigger={
									<Box>
										<Tooltip
											content='Enviar para aprobación'
											positioning={{ placement: 'bottom-center' }}
											showArrow
											openDelay={0}
										>
											<IconButton
												disabled={item.status === 4}
												colorPalette='green'
												size='xs'
											>
												<FiSend />
											</IconButton>
										</Tooltip>
									</Box>
								}
								open={openSend}
								onOpenChange={(e) => setOpenSend(e.open)}
								onConfirm={() => handleSend(item.id)}
								loading={LoadingProgramsReview}
								icon={'FiSend'}
								loadingText={'Enviando'}
							>
								<Text>
									¿Estás seguro que quieres enviar a
									<Span fontWeight='semibold' px='1'>
										{item.program_name}
									</Span>
									para aprobación de cronograma?
								</Text>
							</SendModal>
						)}
						<PreviewAdmissionsProgramsModal data={item} />
						{permissions?.includes('admissions.myprograms.assignmodality') && (
							<AssignModalityToProgramForm data={item} fetchData={fetchData} />
						)}

						{permissions?.includes('admissions.myprograms.assignevaluator') && (
							<AssignEvaluatorProgramModal item={item} fetchData={fetchData} />
						)}
						{permissions?.includes('admissions.myprograms.edit') && (
							<UpdateAdmissionsProgramsForm data={item} fetchData={fetchData} />
						)}
						{permissions?.includes('admissions.myprograms.delete') && (
							<ConfirmModal
								placement='center'
								trigger={
									<IconButton
										disabled={item.status === 4}
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

export const AdmissionsMyProgramsTable = ({ data, fetchData, permissions }) => {
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
							<Table.ColumnHeader>
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
							<Table.ColumnHeader>Inicio Semestre</Table.ColumnHeader>
							<Table.ColumnHeader>Inicio de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Fin de Inscripciones</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.length > 0 ? (
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
								<Table.Cell colSpan={7} textAlign='center'>
									Sin datos disponibles
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
	loading: PropTypes.bool,
	permissions: PropTypes.array,
};
