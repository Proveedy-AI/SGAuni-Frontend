import PropTypes from 'prop-types';
import { Button, Field, Modal, toaster } from "@/components/ui";
import { useCreateCourse } from "@/hooks/courses";
import { useRef, useState } from "react";
import { FiPlus } from 'react-icons/fi';
import { Input, Stack } from '@chakra-ui/react';
import { ReactSelect } from '@/components/select';

export const AddCourseModal = ({ data, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [type, setType] = useState('');
  const [preRequisite, setPreRequisite] = useState(null);

  const preRequisiteOptions = data
    .map((course) => ({
      value: course.id,
      label: `${course.code} - ${course.name}`,
    }));

  const { mutate: register, isPending: loading } = useCreateCourse();

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!name || !code || !credits || !type) {
        toaster.create({
          title: 'Por favor, completa todos los campos requeridos',
          type: 'warning',
        });
        return;
    }

    if (data.find((course) => course.code === code)) {
      toaster.create({
        title: 'Ya existe un curso con ese código',
        type: 'warning',
      });
      return;
    }

    const payload = {
      name: name,
      code: code,
      credits: credits,
      type: type,
      preRequisite: preRequisite ? preRequisite.value : null,
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
      // size='lg'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Agregar curso
        </Button>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Código del curso:'
        >
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Nombre del curso:'
        >
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Créditos:'
        >
          <Input
            value={credits}
            onChange={(event) => setCredits(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Tipo de curso:'
        >
          <Input
            value={type}
            onChange={(event) => setType(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Curso pre-requisito:'
        >
          <ReactSelect
            value={preRequisite}
            onChange={(option) => setPreRequisite(option)}
            options={preRequisiteOptions}
            placeholder='Selecciona un curso pre-requisito'
            isClearable
            isSearchable
            size='xs'
          />
        </Field>
      </Stack>
    </Modal>
  );
};
  
AddCourseModal.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};