import PropTypes from "prop-types";
import { ConfirmModal, toaster, Tooltip } from "@/components/ui";
import { useDeleteAcademicDegree } from "@/hooks/academic_degrees";
import { useState } from "react";
import { Box, IconButton, Span, Text } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";

export const RemoveAcademicDegreeModal = ({ item, fetchData }) => {
	const [open, setOpen] = useState(false);
	const { mutateAsync: remove, isPending: loadingDelete } = useDeleteAcademicDegree();

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
			title='Eliminar Modalidad de Admisión'
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
				¿Estás seguro que quieres eliminar
				<Span fontWeight='semibold' px='1'>
					{item.name}
				</Span>
				de la lista de tus títulos académicos?
			</Text>
		</ConfirmModal>
	);
};

RemoveAcademicDegreeModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func,
};
