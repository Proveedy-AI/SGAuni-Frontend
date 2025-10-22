import {
	Field,
	toaster,
  Modal,
} from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useUpdateModalityRule } from '@/hooks';
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi2';

export const EditModalityRule = ({ fetchData, item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending: loadingUpdate } = useUpdateModalityRule();
  const [modalityEditable, setModalityEditable] = useState(item);

  const handleUpdate = async () => {
    // Compara si no hubo cambios
    if (JSON.stringify(modalityEditable) === JSON.stringify(item)) 
      return toaster.create({
        title: 'No se efectuaron cambios',
        type: 'info',
      });

    const payload = {
      field_name: modalityEditable.field_name,
    };

    if (!payload.field_name) return;

    await update({ id: item?.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Programa actualizado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
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
    <Modal
      title='Editar Regla de Modalidad'
      placement='center'
      trigger={
        <IconButton colorPalette='green' size='xs'>
          <HiPencil />
        </IconButton>
      }
      size='xl'
      onSave={handleUpdate}
      loading={loadingUpdate}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4}>
        <Field label='Nombre'>
          <Input
            value={modalityEditable.field_name}
            onChange={(e) =>
              setModalityEditable((prev) => ({
                ...prev,
                field_name: e.target.value,
              }))
            }
          />
        </Field>
      </Stack>
    </Modal>
	);
};

EditModalityRule.propTypes = {
  fetchData: PropTypes.func,
  item: PropTypes.object,
};
