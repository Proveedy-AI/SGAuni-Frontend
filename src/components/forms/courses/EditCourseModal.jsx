import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from "@/components/ui";
import { useUpdateCourse } from "@/hooks/courses";
import { useRef, useState } from "react";
import { Box, Card, Flex, Icon, IconButton, Input, Stack, Textarea } from '@chakra-ui/react';
import { HiPencil } from 'react-icons/hi2';
import { FiBookOpen } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';

export const EditCourseModal = ({ data, item, fetchData, levelOptions }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [code, setCode] = useState(item?.code || '');
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [defaultCredits, setDefaultCredits] = useState(item?.default_credits || '');
  const [level, setLevel] = useState(levelOptions.find(option => option.value === item?.level) || null);

  const { mutate: update, isPending: loading } = useUpdateCourse();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (!code) newErrors.code = 'El código del curso es requerido';
    if (!defaultCredits) newErrors.credits = 'Los créditos son requeridos';
    if (!level) newErrors.level = 'El tipo de curso es requerido';
    if (!description) newErrors.description = 'La descripción es requerida';

    if (data.find((course) => course.code === code && course.id !== item.id)) newErrors.code = 'El código ya fue registrado';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) {
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
      level: level?.value,
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
        <Card.Root>
          <Card.Header>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='lg'
            >
              <Icon as={FiBookOpen} boxSize={5} color='blue.600' />
              Campos para para editar curso
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Flex flexDirection='column' gap={3}>
              <Field
                label='Código del curso:'
                invalid={!!errors.code}
                errorText={errors.code}
                required
              >
                <Input
                  type='text'
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </Field>
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
              <Field
                label='Descripción:'
                invalid={!!errors.description}
                errorText={errors.description}
                required
              >
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  size='xs'
                  placeholder='Descripción del curso'
                  css={{ height: '100px', resize: 'none', overflowY: 'auto' }}
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{ borderColor: 'gray.300', boxShadow: 'none' }}
                
                />
              </Field>
              <Flex flexDirection={{ base:'column', md: 'row' }} gap={3}>
              <Field
                label='Créditos:'
                invalid={!!errors.credits}
                errorText={errors.credits}
                required  
              >
                <Input
                  type='number'
                  min={0}
                  value={defaultCredits}
                  onChange={(event) => setDefaultCredits(event.target.value)}
                  size='xs'
                />
              </Field>
              <Field
                label='Nivel de curso:'
                invalid={!!errors.level}
                errorText={errors.level}
                required
              >
                <ReactSelect
                  name='level'
                  options={levelOptions}
                  placeholder='Selecciona el nivel'
                  value={level}
                  onChange={setLevel}
                  isClearable
                  size='sm'
                />
              </Field>
            </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};
  
EditCourseModal.propTypes = {
  data: PropTypes.array,
  item: PropTypes.object,
  fetchData: PropTypes.func,
  levelOptions: PropTypes.array,
};