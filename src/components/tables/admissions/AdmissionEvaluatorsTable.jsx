import { usePaginationSettings } from "@/components/navigation/usePaginationSettings"
import { SortableHeader } from "@/components/ui/SortableHeader"
import useSortedData from "@/utils/useSortedData"
import { Box, Table } from "@chakra-ui/react"
import { memo, useState } from 'react'
import PropTypes from 'prop-types';
import SkeletonTable from "@/components/ui/SkeletonTable"
import { useNavigate } from "react-router"
import { Encryptor } from "@/components/CrytoJS/Encryptor"
import { Pagination } from "@/components/ui"

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
    const navigate = useNavigate();
	const encrypted = Encryptor.encrypt(item.id);
	const encodedId = encodeURIComponent(encrypted);

    const handleRowClick = () => {
        navigate(`/admissions/evaluators/programs/${encodedId}?uuid=${item.uuid}`);
    }
    
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
            <Table.Cell>{item.admission_process_name}</Table.Cell>
            <Table.Cell>{item.role_display}</Table.Cell>
        </Table.Row>
    )
})

Row.displayName = 'Row'

Row.propTypes = {
    item: PropTypes.object,
    startIndex: PropTypes.number,
    index: PropTypes.number,
    sortConfig: PropTypes.object,
    data: PropTypes.array,
}

export const AdmissionEvaluatorsTable = ({ data, fetchData, isLoading }) => {
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
                            <Table.ColumnHeader minW={'200px'}>Proceso de Admisión</Table.ColumnHeader>
                            <Table.ColumnHeader minW={'200px'}>Tipo de Evaluación</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <SkeletonTable columns={3} />
                        ) : visibleRows?.length > 0 ? (
                            visibleRows.map((item, index) => (
                                <Row
                                    key={item.id}
                                    item={item}
                                    data={data}
                                    sortConfig={sortConfig}
									fetchData={fetchData}
                                    startIndex={startIndex}
                                    index={index}
                                />
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={3} textAlign='center' py={2}>
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

AdmissionEvaluatorsTable.propTypes = {
    data: PropTypes.array,
    fetchData: PropTypes.func,
    isLoading: PropTypes.bool,
}
