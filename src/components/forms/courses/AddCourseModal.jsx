import PropTypes from 'prop-types';
import { Button, Field, Modal, toaster } from "@/components/ui";
import { useCreateCourse } from "@/hooks/courses";
import { useRef, useState } from "react";
import { FiBookOpen, FiPlus } from 'react-icons/fi';
import { Card, Flex, Icon, Input, Stack, Textarea } from '@chakra-ui/react';

export const AddCourseModal = ({ data, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [level, setLevel] = useState('');
  //const [preRequisite, setPreRequisite] = useState([]);

  // const preRequisiteOptions = data
  //   ?.filter((course) => 
  //     !preRequisite.some((selected) => selected.value === course.id)
  //   )
  //   .map((course) => ({
  //     value: course.id,
  //     label: `${course.code} - ${course.name}`,
  //   }));

  // const handleRequisiteToggle = (id) => {
	// 	setPreRequisite((prev) =>
	// 		prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
	// 	);
	// };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre del curso es requerido';
    if (!code) newErrors.code = 'El código del curso es requerido';
    if (!credits) newErrors.credits = 'Los créditos son requeridos';
    if (!level) newErrors.level = 'El tipo de curso es requerido';
    if (!description) newErrors.description = 'La descripción es requerida';

    if (data.find((course) => course.code === code)) newErrors.code = 'El código ya fue registrado'; 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const { mutate: register, isPending: loading } = useCreateCourse();

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toaster.create({
        title: 'Campos requeridos',
        description: 'Por favor, completa todos los campos requeridos',
        type: 'warning',
      });
      return;
    }

    if (data.find((course) => course.code === code)) {
      toaster.create({
        title: `Código ${code} ya existente`,
        description: 'Ya existe un curso con ese código',
        type: 'warning',
      });
      return;
    }

    const payload = {
      name: name,
      description: description,
      code: code,
      default_credits: credits,
      level: level,
      //ids_preRequisite: preRequisite,
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
          <FiPlus /> Agregar curso
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
        <Card.Root>
          <Card.Header>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='lg'
            >
              <Icon as={FiBookOpen} boxSize={5} color='blue.600' />
              Campos para el nuevo curso
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
                    value={credits}
                    onChange={(event) => setCredits(event.target.value)}
                    size='xs'
                  />
                </Field>
                <Field
                  label='Ciclo al que pertenece: (1-10)'
                  invalid={!!errors.level}
								  errorText={errors.level}
								  required
                >
                  <Input
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    size='xs'
                  />
                </Field>
              </Flex>
            </Flex>
            {/* <Field
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
              /> */}
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
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};
  
AddCourseModal.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};