import { Modal, Tooltip } from '@/components/ui';
import { Badge, Box, IconButton, Spinner, Stack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export const ViewAdmissionEvaluatorsProgramExams = ({ item, isLoading, isOpen, onClose, onOpenQualification }) => {
    const contentRef = useRef();
    return (
        <Modal
            scrollBehavior='outside'
            title='Ver exámenes'
            placement='center'
            size='4xl'
            hiddenFooter={true}
            role='alertdialog'
            contentRef={contentRef}
            open={isOpen}
            onOpenChange={onClose}
            positionerProps={{
                style: {
                    padding: '40px',
                }
            }}
        >
            <Stack>
                <Table.Root size='sm' striped>
                    <Table.Header>
                        <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                            <Table.ColumnHeader>N°</Table.ColumnHeader>
                            <Table.ColumnHeader minW='150px'>Fecha</Table.ColumnHeader>
                            <Table.ColumnHeader minW='170px'>Examenes realizados</Table.ColumnHeader>
                            <Table.ColumnHeader minW='120px'>Estado</Table.ColumnHeader>
                            <Table.ColumnHeader>Calificación</Table.ColumnHeader>
                            <Table.ColumnHeader minW='200px'>Observaciones</Table.ColumnHeader>
                            <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading && <Spinner />}
                        {!isLoading && item?.evaluations?.length > 0 ? (
                            item?.evaluations?.map((evaluation, index) => (
                                <Table.Row key={evaluation.id}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{evaluation.start_date} {evaluation.evaluation_time}</Table.Cell>
                                    <Table.Cell>{evaluation.type_application_display}</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            bg={evaluation.status_qualification_display === 'Completed' ? '#D0EDD0' : '#AEAEAE'}
                                            color={evaluation.status_qualification_display === 'Completed' ? '#2D9F2D' : '#F5F5F5'}
                                            fontWeight='semibold'
                                        >
                                            {evaluation.status_qualification_display === 'Completed' ? 'Calificado' : 'Pendiente'}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{evaluation.qualification ?? '-'}</Table.Cell>
                                    <Table.Cell
                                        css={{
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '20px',
                                            }}
                                        >
                                            {evaluation.feedback ? evaluation.feedback : '-'}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Box>
                                            <Tooltip
                                                content='Calificar examen'
                                                positioning={{ placement: 'bottom-center' }}
                                                showArrow
                                                openDelay={0}
                                            >
                                                <IconButton
                                                    size='xs'
                                                    colorPalette='green'
                                                    css={{ _icon: { width: '5', height: '5' } }}
                                                    onClick={() => onOpenQualification(evaluation)}
                                                >
                                                    <FiCheckCircle />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={7} textAlign='center'>
                                    No hay evaluaciones asignadas.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Modal>
    );
}

ViewAdmissionEvaluatorsProgramExams.propTypes = {
    item: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onOpenQualification: PropTypes.func
}