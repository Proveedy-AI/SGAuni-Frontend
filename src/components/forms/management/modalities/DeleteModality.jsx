import { ConfirmModal, toaster, Tooltip } from '@/components/ui';
import { useDeleteModality } from '@/hooks';
import { Box, IconButton, Span, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

export const DeleteModality = ({ item, fetchData }) => {
	const [open, setOpen] = useState(false);
	const { mutateAsync: remove, isPending: loadingDelete } = useDeleteModality();

	const handleDelete = async (id) => {
		try {
			await remove(id);
			toaster.create({
				title: 'Modalidad eliminada correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<ConfirmModal
			title='Eliminar Modalidad'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Eliminar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='red' size='xs'>
							<FiTrash2 />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onConfirm={() => handleDelete(item.id)}
			loading={loadingDelete}
		>
			<Text>
				¿Estás seguro que quieres eliminar el
				<Span fontWeight='semibold' px='1'>
					{item.name}
				</Span>
				de la lista de modalidades?
			</Text>
		</ConfirmModal>
	);
};

DeleteModality.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
};
