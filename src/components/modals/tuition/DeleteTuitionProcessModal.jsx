import { ConfirmModal, toaster, Tooltip } from '@/components/ui';
import {
	Box,
	IconButton,
	Span,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDeleteEnrollments } from '@/hooks/enrollments_proccess/useDeleteEnrollments';
import { FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const DeleteTuitionProcessModal = ({ permissions, item, fetchData }) => {
    const { mutate: deleteEnrollments, isPending } = useDeleteEnrollments();
	const [open, setOpen] = useState(false);

    const handleDelete = () => {
        deleteEnrollments(item.id, {
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
                            disabled={!permissions?.includes('enrollments.proccessEnrollments.delete')}
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
					{item?.academic_period_name}
				</Span>
				de la lista de Procesos?
			</Text>
		</ConfirmModal>
	);
};

DeleteTuitionProcessModal.propTypes = {
    permissions: PropTypes.array,
    item: PropTypes.object,
    fetchData: PropTypes.func,
};
