//import { UpdateSettingsCountryForm } from '@/components/forms';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { UpdateAdmissionsProccessForm } from '@/components/forms/admissions';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { ConfirmModal, Pagination, toaster } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useDeleteAdmissions } from '@/hooks/admissions_proccess';
import useSortedData from '@/utils/useSortedData';
import { Box, HStack, IconButton, Span, Table, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const Row = memo(
	({ item, fetchData, startIndex, index, permissions, sortConfig, data }) => {
		const [open, setOpen] = useState(false);
		const navigate = useNavigate();
		const encrypted = Encryptor.encrypt(item.id);
		const encoded = encodeURIComponent(encrypted);
		const handleRowClick = () => {
			if (permissions?.includes('admissions.myprograms.view')) {
				navigate(`/admissions/myprograms/${encoded}`);
			}
			if (permissions?.includes('admissions.programs.view')) {
				navigate(`/admissions/programs/${encoded}`);
			}
		};

		const { mutate: deleteAdmisions, isPending } = useDeleteAdmissions();

		const handleDelete = () => {
			deleteAdmisions(item.id, {
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
				<Table.Cell>{item.admission_process_name}</Table.Cell>
				<Table.Cell>{item.admission_level_display}</Table.Cell>
				<Table.Cell>{formatDateString(item.start_date)}</Table.Cell>
				<Table.Cell>{formatDateString(item.end_date)}</Table.Cell>
				<Table.Cell>
					<a
						href={`${import.meta.env.VITE_DOMAIN_MAIN}${item.uri_url}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						{`${import.meta.env.VITE_DOMAIN_MAIN}${item.uri_url}`}
					</a>
				</Table.Cell>
				<Table.Cell onClick={(e) => e.stopPropagation()}>
					<HStack>
						{permissions?.includes('admissions.proccess.edit') && (
							<UpdateAdmissionsProccessForm data={item} fetchData={fetchData} />
						)}
						{permissions?.includes('admissions.proccess.delete') && (
							<ConfirmModal
								placement='center'
								trigger={
									<IconButton colorPalette='red' size='xs'>
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
										{item.admission_process_name}
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

export const AdmissionsListTable = ({
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

	console.log(data);
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
						<Table.Row>
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
									label='Nombre'
									columnKey='admission_process_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Nivel'
									columnKey='admission_level_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Fecha Inicio</Table.ColumnHeader>
							<Table.ColumnHeader>Fecha Fin</Table.ColumnHeader>
							<Table.ColumnHeader>Url</Table.ColumnHeader>
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

AdmissionsListTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	permissions: PropTypes.array,
};
