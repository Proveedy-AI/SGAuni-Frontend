import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from "@/components/ui";
import { useUpdateCourse } from "@/hooks/courses";
import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { HiPencil } from 'react-icons/hi2';
import { ReactSelect } from '@/components/select';

export const EditCourseModal = ({ data, item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(null);
  const [type, setType] = useState(null);
  const [preRequisite, setPreRequisite] = useState(null);

  useEffect(() => {
    if(item?.pre_requisite) {
      const foundCourse = data.find((course) => course.code === item?.pre_requisite);
      setPreRequisite({
        value: foundCourse?.id || null,
        label: foundCourse ? `${foundCourse.code} - ${foundCourse.name}` : '',
      });
    } else {
      setPreRequisite(null);
    }
  }, [data, item])

  const preRequisiteOptions = data
    .filter((course) => course.id !== item.id)
    .map((course) => ({
      value: course.id,
      label: `${course.code} - ${course.name}`,
    }));

  const { mutate: update, isPending: loading } = useUpdateCourse();

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

    update(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Curso actualizado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
        setName('');
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
      // size='lg'
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
  
EditCourseModal.propTypes = {
  data: PropTypes.array,
  item: PropTypes.object,
  fetchData: PropTypes.func,
};