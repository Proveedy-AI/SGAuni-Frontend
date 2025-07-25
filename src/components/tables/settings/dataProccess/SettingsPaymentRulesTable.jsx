//import { UpdateSettingsCountryForm } from '@/components/forms';
import { UpdatePaymentRules } from '@/components/forms/management/dataProccess/UpdatePaymentRules';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';

import { Box, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

const Row = memo(
	({
		item,
		fetchData,
		startIndex,
		index,
		sortConfig,
		data,
		PurposeOptions,
	}) => {
		return (
			<Table.Row key={item?.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data?.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{item?.payment_purpose_name ?? ''}</Table.Cell>
				<Table.Cell>
					{Array.isArray(item?.process_types)
						? item.process_types.join(', ')
						: ''}
				</Table.Cell>
				<Table.Cell>
					{item?.applies_to_students === true ? 'Sí' : 'No'}
				</Table.Cell>
				<Table.Cell>
					{item?.applies_to_applicants === true ? 'Sí' : 'No'}
				</Table.Cell>
				<Table.Cell>{item?.amount_type ?? ''}</Table.Cell>
				<Table.Cell>{item?.amount ?? ''}</Table.Cell>
				<Table.Cell>
					{item?.use_credits_from === 'enrollment_program'
						? 'Matrícula del programa'
						: item?.use_credits_from === 'program'
							? 'Programa'
							: 'No aplica'}
				</Table.Cell>
				<Table.Cell>{item?.discount_percentage ?? ''}</Table.Cell>
				<Table.Cell>
					<HStack>
						<UpdatePaymentRules
							item={item}
							PurposeOptions={PurposeOptions}
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
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	PurposeOptions: PropTypes.array,
};

export const SettingsPaymentRulesTable = ({
	data,
	fetchData,
	isLoading,
	PurposeOptions,
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
									label='Próposito'
									columnKey='payment_purpose_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Tipos de Procesamiento'
									columnKey='process_types'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Estudiantes'
									columnKey='applies_to_students'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Postulantes'
									columnKey='applies_to_applicants'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Tipo de monto'
									columnKey='amount_type'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Monto'
									columnKey='amount'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Usar créditos'
									columnKey='use_credits_from'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>
								<SortableHeader
									label='Descuento (%)'
									columnKey='discount_percentage'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader w='10%'>Acciones</Table.ColumnHeader>
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
									PurposeOptions={PurposeOptions}
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

SettingsPaymentRulesTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	loading: PropTypes.bool,
	isLoading: PropTypes.bool,
	PurposeOptions: PropTypes.array,
};
