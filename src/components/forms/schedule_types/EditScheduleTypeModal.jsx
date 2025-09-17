import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { HiPencil } from 'react-icons/hi2';

export const EditScheduleTypeModal = ({ data, item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(item?.name || '');

  const [errors, setErrors] = useState({});

  //const { mutate: update, isPending: loading } = useUpdateCourse();
  const update = () => {};
  const loading = false;

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (data.find((scheduleType) => scheduleType?.name === name)) newErrors.name = 'El nombre ya fue registrado';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: name,
    };

    update({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Curso actualizado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: error.message || 'Error al actualizar el curso',
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Editar curso'
      placement='center'
      size='xl'
      trigger={
        <Box>
          <Tooltip
            content='Editar curso'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton colorPalette='green' size='xs'>
              <HiPencil />
            </IconButton>
          </Tooltip>
        </Box>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack
          gap={2}
          pb={6}
          maxH={{ base: 'full', md: '65vh' }}
          overflowY='auto'
          sx={{
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: 'full',
            },
          }}
        >
        <Box>
          <Field
            label='Nombre del curso:'
            invalid={!!errors.name}
            errorText={errors.name}
            required
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
        </Box>
      </Stack>
    </Modal>
  );
};
  
EditScheduleTypeModal.propTypes = {
  data: PropTypes.array,
  item: PropTypes.object,
  fetchData: PropTypes.func,
};