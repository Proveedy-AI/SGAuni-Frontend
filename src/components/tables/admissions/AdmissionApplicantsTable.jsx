import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { UpdateAdmissionsProccessForm } from '@/components/forms/admissions';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { ReactSelect } from '@/components/select';
import { Pagination } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useReadProgramTypes } from '@/hooks';
import { useReadAdmissions } from '@/hooks/admissions_proccess';
import { Box, HStack, Input, Stack, Table, Text } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const navigate = useNavigate();
	const encrypted = Encryptor.encrypt(item.id);
	const encoded = encodeURIComponent(encrypted);
	const handleRowClick = () => {
		// if (permissions?.includes('admissions.myapplicants.view')) {
		//   navigate(`/admissions/myapplicants/${item.id}`);
		// }
		// if (permissions?.includes('admissions.applicants.view')) {
		//   navigate(`/admissions/applicants/${item.id}`);
		// }
		// Por ahora, sin permisos para ver los postulantes por programa
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
	search,
	setSearch,
}) => {
	const { data: dataProgramTypes, loading: loadingProgramTypes } =
		useReadProgramTypes();
	const { data: dataAdmissions, loading: loadingAdmissions } =
		useReadAdmissions();

	const programTypeOptions = useMemo(() => {
		if (loadingProgramTypes) return [];
		const options =
			dataProgramTypes?.results?.map((item) => ({
				label: item.name,
				value: item.id,
			})) || [];
		return [{ label: 'Todos', value: null }, ...options];
	}, [dataProgramTypes, loadingProgramTypes]);

	const admissionOptions = useMemo(() => {
		if (loadingAdmissions) return [];
		const options =
			dataAdmissions?.results?.map((item) => ({
				label: item.admission_process_name,
				value: item.id,
			})) || [];
		return [{ label: 'Todos', value: null }, ...options];
	}, [dataAdmissions, loadingAdmissions]);

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
				<Table.Root size='sm' w='full'>
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
									label='Nombres del programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Stack direction='column' w='150px'>
									<Text>Tipo del programa</Text>
									{/*<ReactSelect
										label='programType'
										value={search?.program_type}
										options={programTypeOptions}
										isLoading={loadingProgramTypes}
										onChange={(value) =>
											setSearch({ ...search, program_type: value })
										}
									/>*/}
								</Stack>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Stack direction='column' w='150px'>
									<Text>Proceso de Admisión</Text>
									{/*<ReactSelect
										label='admissionProcess'
										value={search?.admission_process}
										options={admissionOptions}
										isLoading={loadingAdmissions}
										onChange={(value) =>
											setSearch({ ...search, admission_process: value })
										}
									/>*/}
								</Stack>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Stack direction='column' w='150px'>
									<Text>Fecha</Text>
									{/*<Input
										type='date'
										value={search?.date}
										onChange={(e) =>
											setSearch({ ...search, date: e.target.value })
										}
									/>*/}
								</Stack>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
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
						))}
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
	loading: PropTypes.bool,
	permissions: PropTypes.array,
	search: PropTypes.object,
	setSearch: PropTypes.func,
};
