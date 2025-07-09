import PropTypes from 'prop-types';
import { Button, Checkbox, Field, Modal, toaster } from "@/components/ui";
import { useCreateCourse } from "@/hooks/courses";
import { useRef, useState } from "react";
import { FiPlus } from 'react-icons/fi';
import { CheckboxGroup, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import { ReactSelect } from '@/components/select';

export const AddCourseModal = ({ data, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [type, setType] = useState('');
  const [preRequisite, setPreRequisite] = useState([]);

  const preRequisiteOptions = data
    ?.filter((course) => 
      !preRequisite.some((selected) => selected.value === course.id)
    )
    .map((course) => ({
      value: course.id,
      label: `${course.code} - ${course.name}`,
    }));

  const handleRequisiteToggle = (id) => {
		setPreRequisite((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
		);
	};

  const { mutate: register, isPending: loading } = useCreateCourse();

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!name || !code || !credits || !type || !description) {
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
      description: description,
      code: code,
      default_credits: credits,
      type: type,
      ids_preRequisite: preRequisite,
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
      size='4xl'
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
        <Flex flexDirection={{ base:'column', md: 'row' }} gap={3}>
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
        </Flex>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Descripción:'
          display='flex'
          alignItems='flex-start'
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
        </Flex>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Curso pre-requisito:'
        >
          <ReactSelect
            value={preRequisite}
            onChange={(option) => setPreRequisite((prev) => [...prev, option])}
            options={preRequisiteOptions}
            placeholder='Selecciona un curso pre-requisito'
            isClearable
            isSearchable
            size='xs'
          />
        </Field>
        <Input
            value={preRequisite.map((item) => item.label).join(', ')}
            readOnly
            size='xs'
            mt={2}
            placeholder='Cursos pre-requisito seleccionados'
            css={{ cursor: 'not-allowed', backgroundColor: 'white' }}
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.300', boxShadow: 'none' }}
          />
        {/* </Field>
        <CheckboxGroup>
          {preRequisiteOptions?.map((option) => (
              <Checkbox 
                key={option.value}
                value={option.value}
                size="sm"
                checked={
                  Array.isArray(preRequisite) &&
                  preRequisite.includes(option.value)
                }
                onChange={ () =>
                  handleRequisiteToggle(option.value)
                }
              >
                {option.label}
              </Checkbox>
            ))}
        </CheckboxGroup> */}
      </Stack>
    </Modal>
  );
};
  
AddCourseModal.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};