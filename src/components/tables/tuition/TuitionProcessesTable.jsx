import { ViewAdmissionEvaluatorsProgramExams } from '@/components/forms/admissions';
import { UpdateQualificationEvaluatorsModal } from '@/components/forms/admissions/evaluations';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination, toaster, Tooltip } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useUpdateAdmissionEvaluationGrade } from '@/hooks/admissions_evaluations';
import { Badge, Box, HStack, IconButton, Table } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiEye, FiMessageCircle, FiSend } from 'react-icons/fi';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';
import PropTypes from 'prop-types';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending approval':
                return '#F86A1E'
            case 'configuration':
                return '#AEAEAE'
            case 'approved':
                return '#2D9F2D'
            default:
                return 'gray'
        }
    }

    return (
        <Table.Row 
            key={item.id} 
            bg={index % 2 === 0 ? 'gray.100' : 'white'}
        >
            <Table.Cell>
                {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
                    ? data.length - (startIndex + index)
                    : startIndex + index + 1}
            </Table.Cell>
            <Table.Cell>{item.academicPeriod}</Table.Cell>
            <Table.Cell>{item.schedule}</Table.Cell>
            <Table.Cell>
                <Badge
                    bg={getStatusColor(item.status)}
                    color='white'
                    fontWeight="semibold"
                >
                    {item.status}
                </Badge>
            </Table.Cell>
            <Table.Cell>
                <Box css={{ display: 'flex' }} gap={2}>
                    <Tooltip
                        content='Ver detalle'
                        positioning={{ placement: 'bottom-center' }}
                        showArrow
                        openDelay={0}
                    >
                        <IconButton
                            size='xs'
                            colorPalette='blue'
                            css={{ _icon: { width: '5', height: '5' } }}
                        >
                            <FiEye />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        content='Editar'
                        positioning={{ placement: 'bottom-center' }}
                        showArrow
                        openDelay={0}
                    >
                        <IconButton
                            size='xs'
                            colorPalette='green'
                            css={{ _icon: { width: '5', height: '5' } }}
                        >
                            <FiEdit2 />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        content='Observaciones'
                        positioning={{ placement: 'bottom-center' }}
                        showArrow
                        openDelay={0}
                    >
                        <IconButton
                            size='xs'
                            colorPalette='cyan'
                            css={{ _icon: { width: '5', height: '5' } }}
                        >
                            <FiMessageCircle />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        content='Solicitar aprobación'
                        positioning={{ placement: 'bottom-center' }}
                        showArrow
                        openDelay={0}
                    >
                        <IconButton
                            size='xs'
                            colorPalette='yellow'
                            css={{ _icon: { width: '5', height: '5' } }}
                        >
                            <FiSend />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Table.Cell>
        </Table.Row>
    )
})

Row.displayName = "Row"

Row.propTypes = {
    item: PropTypes.object,
    startIndex: PropTypes.number,
    index: PropTypes.number,
    sortConfig: PropTypes.object,
    data: PropTypes.array
}

export const TuitionProcessesTable = ({ data, isLoading }) => {
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
                <Table.Root size="sm" w="full">
                    <Table.Header>
                        <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                            <Table.ColumnHeader w="5%">
                                <SortableHeader
                                    label='N°'
                                    columnKey='index'
                                    sortConfig={sortConfig}
                                    onSort={setSortConfig}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minW={'200px'}>Período académico</Table.ColumnHeader>
                            <Table.ColumnHeader minW={'200px'}>Cronograma</Table.ColumnHeader>
                            <Table.ColumnHeader minW={'200px'}>Estado</Table.ColumnHeader>
                            <Table.ColumnHeader minW={'10px'}>Acciones</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <SkeletonTable columns={5} />
                        ) : visibleRows?.length > 0 ? (
                            visibleRows.map((item, index) => (
                                <Row
                                    key={item.id}
                                    item={item}
                                    data={data}
                                    sortConfig={sortConfig}
                                    startIndex={startIndex}
                                    index={index}
                                />
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={5} textAlign='center' py={2}>
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
    )
}

TuitionProcessesTable.propTypes = {
    data: PropTypes.array,
    isLoading: PropTypes.bool
}
