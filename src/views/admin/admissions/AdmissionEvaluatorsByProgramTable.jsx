import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { CreateProgramExamToAdmissionProgram } from '@/components/forms/admissions/createProgramExamToAdmissionProgram';
import { ViewAdmissionProgramExams } from '@/components/forms/admissions/ViewAdmissionProgramExams';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(({ item, startIndex, index, permissions, sortConfig, data }) => {
    return (
        <Table.Row>
            <Table.Cell>1</Table.Cell>
        </Table.Row>
    )
});

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

export const AdmissionEvaluatorsByProgramTable = () => {
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
									// columnKey='index'
									// sortConfig={sortConfig}
									// onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Nombres del postulante'
									// columnKey='applicant_name'
									// sortConfig={sortConfig}
									// onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Estado de postulación'
									// columnKey='status_display'
									// sortConfig={sortConfig}
									// onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Estado de calificación'
									// columnKey='status_qualification_display'
									// sortConfig={sortConfig}
									// onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader textAlign='center'>
								<SortableHeader
									label='Calificación'
									// columnKey='calification'
									// sortConfig={sortConfig}
									// onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Row />
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    )
}

AdmissionEvaluatorsByProgramTable.propTypes = {
    programId: PropTypes.number,
    data: PropTypes.array,
    fetchData: PropTypes.func,
    permissions: PropTypes.array,
    isLoading: PropTypes.bool,
};
