import { ConfirmModal, toaster, Tooltip } from '@/components/ui';
import {
    Box,
    IconButton,
    Span,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDeleteEnrollmentsPrograms } from '@/hooks/enrollments_programs';
import { FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const DeleteTuitionProgramsModal = ({ permissions, item, fetchData }) => {
    const { mutate: deleteEnrollmentsPrograms, isPending } = useDeleteEnrollmentsPrograms();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        deleteEnrollmentsPrograms(item.id, {
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
        })
    }

    return (
        <ConfirmModal
            placement='center'
            open={open}
            loading={isPending}
            onOpenChange={(e) => setOpen(e.open)}
            onConfirm={handleDelete}
            positionerProps={{ style: { padding: 40 } }}
            trigger={
                <Box>
                    <Tooltip
                        content='Eliminar'
                        positioning={{ placement: 'bottom-center' }}
                        showArrow
                        openDelay={0}
                    >
                        <IconButton 
                            colorPalette='red' 
                            size='xs'
                            disabled={item.status === 4} // || !permissions?.includes('enrollments.myprograms.delete')}
                        >
                            <FiTrash2 />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
        >
            <Text>
                ¿Estás seguro que quieres eliminar a
                <Span fontWeight='semibold' px='1'>
                    {item?.program_name}
                </Span>
                de la lista de Programa?
            </Text>
        </ConfirmModal>
    );
};

DeleteTuitionProgramsModal.propTypes = {
    permissions: PropTypes.array,
    item: PropTypes.object,
    fetchData: PropTypes.func,
};
