import { ViewAdmissionEvaluatorsProgramExams } from '@/components/forms/admissions';
import { UpdateQualificationEvaluatorsModal } from '@/components/forms/admissions/evaluations';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination, toaster, Tooltip } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { useUpdateAdmissionEvaluationGrade } from '@/hooks/admissions_evaluations';
import useSortedData from '@/utils/useSortedData';
import { Badge, Box, HStack, IconButton, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const Row = memo(({ item, fetchData, isLoading, startIndex, index, data, sortConfig }) => {
    const hasEvaluations = item.evaluations && item.evaluations.length > 0;
    const isEvaluated = hasEvaluations && item.evaluations.every((e) => e.status_qualification_display === 'Completed');
    const averageScore = hasEvaluations ? (item.evaluations.reduce((sum, evalItem) => sum + parseFloat(evalItem.qualification || 0), 0) / item.evaluations.length).toFixed(2) : null;

    const [openModal, setOpenModal] = useState(null);
    const [selectedEvaluations, setSelectedEvaluations] = useState({});
    
    const { mutate: updateExamGrade } = useUpdateAdmissionEvaluationGrade();
    
    const onOpenQualification = (data) => {
        setSelectedEvaluations(data);
        setOpenModal('ver')
    }

    const onSubmitQualification = ({ qualification, feedback, setError, setIsSaving }) => {
        const validNote = /^(\d{1,2})(\.\d{1,2})?$/.test(qualification) && parseFloat(qualification) >= 0 && parseFloat(qualification) <= 20;
 
        if (!validNote) return setError(true)
        
        setIsSaving(true)
        
        updateExamGrade(
            { uuid: selectedEvaluations.uuid, payload: { qualification, feedback } },
            { 
                onSuccess: () => {
                    fetchData();
                    setError(false);
                    setIsSaving(false);
                    setOpenModal('calificar')
                    toaster.create({
                        title: 'Calificación actualizada correctamente',
                        type: 'success',
                    });
                },
                onError: (error) => {
                    setIsSaving(false);
                    toaster.create({
                        title: error?.message || 'Error al actualizar la calificación',
                        type: 'error',
                    });
                }
            }
        );
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
            <Table.Cell>{item.person_full_name}</Table.Cell>
            <Table.Cell>
                <Badge
                    bg={isEvaluated ? '#D0EDD0' : '#AEAEAE'}
                    color={isEvaluated ? '#2D9F2D' : '#F5F5F5'}
                    fontWeight='semibold'
                >
                    {isEvaluated ? 'Calificado' : 'Pendiente'}
                </Badge>
            </Table.Cell>
            <Table.Cell>{averageScore !== null ? averageScore : '-'}</Table.Cell>
            <Table.Cell onClick={(e) => e.stopPropagation()}>
                <HStack>
                    {hasEvaluations ? (
                        <>
                            <Box>
                                <Tooltip
                                    content='Ver exámenes'
                                    positioning={{ placement: 'bottom-center' }}
                                    showArrow
                                    openDelay={0}
                                >
                                    <IconButton
                                        size='xs'
                                        colorPalette='blue'
                                        css={{ _icon: { width: '5', height: '5' } }}
                                        onClick={() => setOpenModal('calificar')}
                                    >
                                        <FiCheckCircle />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <ViewAdmissionEvaluatorsProgramExams 
                                item={item} 
                                isLoading={isLoading} 
                                isOpen={openModal === 'calificar'} 
                                onClose={() => setOpenModal(null)} 
                                onOpenQualification={onOpenQualification}
                            />
                            <UpdateQualificationEvaluatorsModal
                                data={selectedEvaluations}
                                isLoading={isLoading}
                                isOpen={openModal === 'ver'}
                                onClose={() => setOpenModal('calificar')} 
                                onSubmit={onSubmitQualification}
                            />
                        </>
                    ) : (
                        <Tooltip
                            content='No tienes evaluaciones asignadas'
                            positioning={{ placement: 'bottom-center' }}
                            showArrow
                            openDelay={0}
                        >
                            <IconButton
                                size='xs'
                                colorPalette='gray'
                                css={{ _icon: { width: '5', height: '5' } }}
                                isDisabled
                            >
                                <FiEdit2 />
                            </IconButton>
                        </Tooltip>
                    )}
                </HStack>
            </Table.Cell>
        </Table.Row>
    );
});

Row.displayName = 'Row';

Row.propTypes = {
    item: PropTypes.object,
    fetchData: PropTypes.func,
    startIndex: PropTypes.number,
    isLoading: PropTypes.bool,
    index: PropTypes.number,
    sortConfig: PropTypes.object,
    data: PropTypes.array,
};

export const AdmissionEvaluatorsByProgramTable = ({ data, fetchData, isLoading }) => {
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
                            <Table.ColumnHeader>Nombres del postulante</Table.ColumnHeader>
                            <Table.ColumnHeader>Estado de calificación</Table.ColumnHeader>
                            <Table.ColumnHeader>Promedio</Table.ColumnHeader>
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
                                    item={item}
                                    data={data}
                                    sortConfig={sortConfig}
                                    isLoading={isLoading}
                                    fetchData={fetchData}
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
    );
};

AdmissionEvaluatorsByProgramTable.propTypes = {
    data: PropTypes.array,
    fetchData: PropTypes.func,
    isLoading: PropTypes.bool,
};
