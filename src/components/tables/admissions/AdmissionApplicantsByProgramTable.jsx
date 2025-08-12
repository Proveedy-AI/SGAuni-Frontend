import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { ViewRegistrationDocumentModal } from '@/components/forms/admissions';
import { CreateProgramExamToAdmissionProgram } from '@/components/forms/admissions/createProgramExamToAdmissionProgram';
import { ViewAdmissionProgramExams } from '@/components/forms/admissions/ViewAdmissionProgramExams';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(
	({
		programId,
		item,
		fetchData,
		startIndex,
		index,
		permissions,
		data,
		sortConfig,
	}) => {
		const navigate = useNavigate();
		const encrypted = Encryptor.encrypt(item.id);
		const encoded = encodeURIComponent(encrypted);

		const encryptedProgram = Encryptor.encrypt(programId);
		const encodedProgram = encodeURIComponent(encryptedProgram);

		const handleRowClick = () => {
			if (permissions?.includes('admissions.applicants.view')) {
				navigate(
					`/admissions/applicants/programs/${encodedProgram}/estudiante/${encoded}`
				);
			}
		};

		const statusEnum = [
			{
				id: 1,
				label: 'Incompleto',
				value: 'Incompleto',
				color: 'orange',
			},
			{
				id: 2,
				label: 'Completado',
				value: 'Completado',
				color: 'blue',
			},
			{
				id: 4,
				label: 'Aprobado',
				value: 'Aprobado',
				color: 'green',
			},
			{
				id: 3,
				label: 'Evaluado',
				value: 'Evaluado',
				color: 'purple',
			},
			{
				id: 5,
				label: 'Rechazado',
				value: 'Rechazado',
				color: 'red',
			},
		];

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
				<Table.Cell>{item.person_full_name}</Table.Cell>
				<Table.Cell>
					<Badge
						colorPalette={
							statusEnum.find((status) => status.value === item.status_display)
								?.color
						}
						fontWeight='semibold'
					>
						{
							statusEnum.find((status) => status.value === item.status_display)
								?.label
						}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					<Badge
						bg={
							statusEnum.find(
								(status) => status.value === item.status_qualification_display
							)?.bg
						}
						color={
							statusEnum.find(
								(status) => status.value === item.status_qualification_display
							)?.color
						}
						fontWeight='semibold'
					>
						{
							statusEnum.find(
								(status) => status.value === item.status_qualification_display
							)?.label
						}
					</Badge>
				</Table.Cell>
				<Table.Cell textAlign='center'>
					{item.qualification_average || '-'}
				</Table.Cell>
				<Table.Cell onClick={(e) => e.stopPropagation()}>
					<HStack>
						<ViewAdmissionProgramExams item={item} fetchData={fetchData} />
						{permissions?.includes('admissions.create.evaluation') && (
							<CreateProgramExamToAdmissionProgram
								item={item}
								fetchData={fetchData}
							/>
						)}
						<ViewRegistrationDocumentModal data={item} />
					</HStack>
				</Table.Cell>
			</Table.Row>
		);
	}
);

Row.displayName = 'Row';

Row.propTypes = {
	programId: PropTypes.number,
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const AdmissionApplicantsByProgramTable = ({
	programId,
	data,
	fetchData,
	permissions,
	isLoading,
	isFetchingNextPage,
	totalCount,
	fetchNextPage,
	hasNextPage,
	resetPageTrigger,
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [sortConfig, setSortConfig] = useState(null);
	const sortedData = useSortedData(data, sortConfig);

	const {
		currentPage,
		startIndex,
		visibleRows,
		loadUntilPage,
		setCurrentPage,
	} = usePaginatedInfiniteData({
		data: sortedData,
		pageSize,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [resetPageTrigger]);

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
									label='Nombres del postulante'
									columnKey='applicant_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Estado de postulación'
									columnKey='status_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Estado de calificación'
									columnKey='status_qualification_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Calificación'
									columnKey='calification'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={6} />
						) : visibleRows?.length > 0 ? (
							visibleRows.map((item, index) => (
								<Row
									key={item.id}
									programId={programId}
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
								<Table.Cell colSpan={6} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Pagination
				count={totalCount}
				pageSize={pageSize}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={loadUntilPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

AdmissionApplicantsByProgramTable.propTypes = {
	programId: PropTypes.number,
	data: PropTypes.array,
	fetchData: PropTypes.func,
	permissions: PropTypes.array,
	isLoading: PropTypes.bool,
	totalCount: PropTypes.number,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	resetPageTrigger: PropTypes.string,
};
