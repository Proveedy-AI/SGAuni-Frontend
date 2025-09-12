import { ReactSelect } from '@/components/select';
import { Checkbox, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useReadCourses } from '@/hooks/courses';
import { Box, Button, IconButton, Input, Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { BsBook } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';

export const AddCoursesToCurriculumMap = ({ item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([
    { course_id: null, is_mandatory: false, cycle: '', credits: '', prerequisite_ids: [] }
  ]);
  const [errors, setErrors] = useState({});

  const { data: dataCourses, isLoading: loadingCourses } = useReadCourses({}, { enabled: open });

  const courseOptions = dataCourses?.results
    ?.filter((course) => !courses.some((c) => c.course_id === course.id))
    ?.map((course) => ({
      value: course.id,
      label: `${course.code} - ${course.name}`,
    })) || [];

  const prerequisiteOptions = dataCourses?.results?.map((course) => ({
    value: course.id,
    label: `${course.code} - ${course.name}`,
  })) || [];

  const handleCourseChange = (idx, field, value) => {
    setCourses((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      )
    );
  };

  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      { course_id: null, is_mandatory: false, cycle: '', credits: '', prerequisite_ids: [] }
    ]);
  };

  const handleRemoveCourse = (idx) => {
    setCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const newErrors = {};
    courses.forEach((c, idx) => {
      const err = {};
      if (!c.course_id) err.course_id = 'Selecciona un curso';
      if (c.cycle === '' || isNaN(Number(c.cycle))) err.cycle = 'Ciclo requerido';
      if (c.credits === '' || isNaN(Number(c.credits))) err.credits = 'Créditos requeridos';
      if (!Array.isArray(c.prerequisite_ids)) err.prerequisite_ids = 'Selecciona los prerrequisitos';
      newErrors[idx] = err;
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => Object.keys(e).length === 0);
  };

  const handleSubmit = () => {
    if (!validate()) {
      toaster.create({
        title: 'Campos requeridos',
        description: 'Completa todos los campos obligatorios',
        type: 'warning',
      });
      return;
    }
    const payload = {
      curriculum_map_id: item.id,
      courses: courses.map((c) => ({
        course_id: c.course_id,
        is_mandatory: c.is_mandatory,
        cycle: Number(c.cycle),
        credits: Number(c.credits),
        prerequisite_ids: c.prerequisite_ids,
      })),
    };
    console.log(payload);
    // Aquí puedes hacer el submit real (API)
    toaster.create({
      title: 'Payload generado',
      description: JSON.stringify(payload, null, 2),
      type: 'success',
    });
  };

  return (
    <Modal
      title="Crear plan de estudio"
      placement="center"
      size="3xl"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onSave={handleSubmit}
      contentRef={contentRef}
      trigger={
        <Box>
          <Tooltip
            content='Agregar cursos'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton colorPalette='blue' size='xs'>
              <BsBook />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Stack gap={4}>
        {courses.map((c, idx) => (
          <Stack key={idx} gap={2} border="1px solid #e2e8f0" borderRadius="md" p={3}>
            <Field
              label="Curso"
              required
              invalid={!!errors[idx]?.course_id}
              errorText={errors[idx]?.course_id}
            >
              <ReactSelect
                options={courseOptions}
                value={courseOptions.find(opt => opt.value === c.course_id) || null}
                onChange={opt => handleCourseChange(idx, 'course_id', opt ? opt.value : null)}
                isLoading={loadingCourses}
                isClearable
                isSearchable
                placeholder="Selecciona un curso"
              />
            </Field>
            <Field label="Obligatorio">
              <Checkbox
                checked={c.is_mandatory}
                onChange={e => handleCourseChange(idx, 'is_mandatory', e.target.checked)}
              >
                Es obligatorio
              </Checkbox>
            </Field>
            <Field
              label="Ciclo"
              required
              invalid={!!errors[idx]?.cycle}
              errorText={errors[idx]?.cycle}
            >
              <Input
                type="number"
                min={1}
                max={20}
                value={c.cycle}
                onChange={e => handleCourseChange(idx, 'cycle', e.target.value)}
                placeholder="Ej: 1"
              />
            </Field>
            <Field
              label="Créditos"
              required
              invalid={!!errors[idx]?.credits}
              errorText={errors[idx]?.credits}
            >
              <Input
                type="number"
                min={1}
                max={50}
                value={c.credits}
                onChange={e => handleCourseChange(idx, 'credits', e.target.value)}
                placeholder="Ej: 4"
              />
            </Field>
            <Field
              label="Prerrequisitos"
              invalid={!!errors[idx]?.prerequisite_ids}
              errorText={errors[idx]?.prerequisite_ids}
            >
              <ReactSelect
                options={prerequisiteOptions.filter(opt => opt.value !== c.course_id)}
                value={prerequisiteOptions.filter(opt => c.prerequisite_ids.includes(opt.value))}
                onChange={opts => handleCourseChange(idx, 'prerequisite_ids', opts ? opts.map(o => o.value) : [])}
                isMulti
                isClearable
                isSearchable
                placeholder="Selecciona uno o varios cursos"
              />
            </Field>
            <Button colorPalette="red" size="xs" onClick={() => handleRemoveCourse(idx)}>
              Eliminar
            </Button>
          </Stack>
        ))}
        <Button leftIcon={<FiPlus />} onClick={handleAddCourse} colorPalette="blue" variant="outline">
          Agregar curso
        </Button>
      </Stack>
    </Modal>
  );
};

AddCoursesToCurriculumMap.propTypes = {
  item: PropTypes.object,
};
