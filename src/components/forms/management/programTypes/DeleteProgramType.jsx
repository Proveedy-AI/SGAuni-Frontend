import { ConfirmModal, toaster } from "@/components/ui";
import { useDeleteProgramType } from "@/hooks";
import { IconButton, Span, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export const DeleteProgramType = ({ item, fetchData }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: remove, isPending: loadingDelete } = useDeleteProgramType();

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toaster.create({
        title: 'Tipo de Programa eliminado correctamente',
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
      title='Eliminar Tipo de Programa'
      placement='center'
      trigger={
        <IconButton colorPalette='red' size='xs'>
          <FiTrash2 />
        </IconButton>
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
        de la lista de tipos de programas?
      </Text>
    </ConfirmModal>
  )
}

DeleteProgramType.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func
};
