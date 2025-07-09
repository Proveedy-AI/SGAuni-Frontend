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
  
  const [code, setCode] = useState(item?.code || '');
  const [name, setName] = useState(item?.name || '');
  const [defaultCredits, setDefaultCredits] = useState(item?.default_credits || '');
  const [level, setLevel] = useState(item?.level || '');
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

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (!code) newErrors.code = 'El código del curso es requerido';
    if (!defaultCredits) newErrors.defaultCredits = 'Los créditos son requeridos';
    if (!level) newErrors.level = 'El tipo de curso es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!name || !code || !defaultCredits || !level) {
        toaster.create({
          title: 'Por favor, completa todos los campos requeridos',
          type: 'warning',
        });
        return;
    }

    if (data.find((course) => course.code === code && course.id !== item.id)) {
      toaster.create({
        title: 'Ya existe un curso con ese código',
        type: 'warning',
      });
      return;
    }

    const payload = {
      name: name,
      code: code,
      default_credits: defaultCredits,
      level: level,
    };

    update({ id: item.id, payload}, {
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
          orientation='vertical'
          label='Código del curso:'
          invalid={!!errors.code}
          errorText={errors.code}
        >
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation='vertical'
          label='Nombre del curso:'
          invalid={!!errors.name}
          errorText={errors.name}
        >
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation='vertical'
          label='Créditos:'
          invalid={!!errors.defaultCredits}
          errorText={errors.defaultCredits}
        >
          <Input
            value={defaultCredits}
            onChange={(event) => setDefaultCredits(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation='vertical'
          label='Nivel de curso:'
          invalid={!!errors.level}
          errorText={errors.level}
        >
          <Input
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            size='xs'
          />
        </Field>
        <Field
          orientation='vertical'
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