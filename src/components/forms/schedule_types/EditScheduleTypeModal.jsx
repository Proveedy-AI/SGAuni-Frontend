import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { HiPencil } from 'react-icons/hi2';
import { useUpdateScheduleType } from '@/hooks/schedule_types';
import { ReactSelect } from '@/components/select';

export const EditScheduleTypeModal = ({ data, item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(item?.name || '');
  const [isSingle, setIsSingle] = useState(item?.is_single ? { label: 'Sí', value: true } : { label: 'No', value: false });

  const isSingleOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  const [errors, setErrors] = useState({});

  const { mutate: update, isPending: loading } = useUpdateScheduleType();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (data.find((scheduleType) => scheduleType?.name === name && scheduleType.id !== item.id)) newErrors.name = 'El nombre ya fue registrado';
    if (isSingle === null) newErrors.isSingle = 'El campo es único es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: name,
      is_single: isSingle?.value,
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
      title='Editar tipo de horario'
      placement='center'
      size='xl'
      trigger={
        <Box>
          <Tooltip
            content='Editar tipo de horario'
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
            label='Nombre del tipo de horario:'
            invalid={!!errors.name}
            errorText={errors.name}
            required
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field
            label='¿Es único?:'
            invalid={!!errors.isSingle}
            errorText={errors.isSingle}
            required
          >
            <ReactSelect
              options={isSingleOptions}
              value={isSingle}
              onChange={setIsSingle}
              isClearable
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