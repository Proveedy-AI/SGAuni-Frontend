import PropTypes from 'prop-types';
import { Button, Field, Modal, toaster } from "@/components/ui";
import { useRef, useState } from "react";
import { FiPlus } from 'react-icons/fi';
import { Box, Input, Stack } from '@chakra-ui/react';

export const AddScheduleTypeModal = ({ data, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState('');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (data.find((scheduleType) => scheduleType?.name === name)) newErrors.name = 'El nombre ya fue registrado';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  //const { mutate: register, isPending: loading } = useCreateScheduleType();
  const register = () => {};
  const loading = false;

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: name,
    };

    register(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Curso creado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
        setName('');
      },
      onError: (error) => {
        toaster.create({
          title: error.message || 'Error al crear el curso',
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Agregar nuevo curso'
      placement='center'
      size='xl'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Agregar Tipo de Horario
        </Button>
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
  
AddScheduleTypeModal.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};