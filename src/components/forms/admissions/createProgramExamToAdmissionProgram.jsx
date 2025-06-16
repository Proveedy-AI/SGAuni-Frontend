import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useCreateAdmissionEvaluation, useDeleteAdmissionEvaluation, useReadAdmissionEvaluations, useUpdateAdmissionEvaluation } from '@/hooks/admissions_evaluations';
import { Box, Flex, IconButton, Input, Stack, Table, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';

export const CreateProgramExamToAdmissionProgram = ({ item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  const { mutate: createEvaluation, isPending: isCreateEvaluationPending } = useCreateAdmissionEvaluation()
  const { data: dataEvaluations, refetch: fetchEvaluations } = useReadAdmissionEvaluations();
  const { mutate: editEvaluation, isPending: isEditEvaluationPending } = useUpdateAdmissionEvaluation();
  const { mutate: deleteEvaluation, isPending: isDeleteEvaluationPending } = useDeleteAdmissionEvaluation();

  const filteredEvaluationsByStudent = dataEvaluations?.results?.filter(evaluation => evaluation.application === item?.id)
  const [nameExamInput, setNameExamInput] = useState('');
  const [dateExamInput, setDateExamInput] = useState('');
  const [timeExamInput, setTimeExamInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleResetForm = () => {
    setNameExamInput('');
    setDateExamInput('');
    setTimeExamInput('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!nameExamInput || !dateExamInput || !timeExamInput) {
      toaster.create({
        title: 'Completa todos los campos obligatorios',
        type: 'warning',
      });
      return;
    }

    const payload = {
      name: nameExamInput,
      date: dateExamInput,
      time: timeExamInput,
    };

    console.log('Payload:', payload);

    const onSuccess = () => {
      toaster.create({
        title: editingId ? 'Examen actualizado' : 'Examen creado',
        type: 'success',
      });
      handleResetForm();
      fetchData();
      fetchEvaluations();
    };

    const onError = (error) => {
      console.error(error);
      toaster.create({
        title: error.response?.data?.[0] || 'Error en la creación del examen',
        type: 'error',
      });
    };

    if (editingId) {
      editEvaluation({ id: editingId, payload }, { onSuccess, onError });
    } else {
      createEvaluation(payload, { onSuccess, onError });
    }
  }

  const handleDelete = (id) => {
    deleteEvaluation(id, {
      onSuccess: () => {
        toaster.create({
          title: 'Examen eliminado',
          type: 'success',
        });
        fetchData();
        fetchEvaluations();
      },
      onError: (error) => {
        console.error(error);
        toaster.create({
          title: error.response?.data?.[0] || 'Error al eliminar el examen',
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Programa exámenes'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Programa exámenes'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='green'
              css={{ _icon: { width: '5', height: '5' } }}
            >
              <FiCalendar />
            </IconButton>
          </Tooltip>
        </Box>
      }
      size='4xl'
      open={open}
      hiddenFooter={true}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
        {/* Formulario para Examen */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='flex-start'
          align={'end'}
          gap={2}
          mt={2}
        >
          <Field label='Nombre del Examen:'>
            <Input
              value={nameExamInput}
              onChange={(e) => setNameExamInput(e.target.value)}
              size='sm'
              placeholder='Nombre'
            />
          </Field>
          <Field label='Fecha:'>
            <Input
              type='date'
              value={dateExamInput}
              onChange={(e) => setDateExamInput(e.target.value)}
              size='sm'
            />
          </Field>
          <Field label='Hora:'>
            <Input
              type='time'
              value={timeExamInput}
              onChange={(e) => setTimeExamInput(e.target.value)}
              size='sm'
            />
          </Field>
          <IconButton
            size='sm'
            bg='green'
            // loading={isCreatePending || isEditPending}
            disabled={!nameExamInput || !dateExamInput || !timeExamInput}
            onClick={handleSubmit}
            isLoading={isCreateEvaluationPending || isEditEvaluationPending}
            css={{ _icon: { width: '5', height: '5' } }}
            aria-label={editingId ? 'Actualizar' : 'Guardar'}
          >
            <FaSave />
          </IconButton>
          <IconButton
            size='sm'
            bg='red'
            // loading={isCreatePending || isEditPending}
            disabled={!nameExamInput || !dateExamInput || !timeExamInput}
            onClick={handleResetForm}
            css={{ _icon: { width: '5', height: '5' } }}
            aria-label={editingId ? 'Actualizar' : 'Guardar'}
          >
            <FaTimes />
          </IconButton>
        </Flex>
        {/* Tabla de Exámenes */}
        <Box mt={6}>
          <Text fontWeight='semibold' mb={2}>
            Exámenes Asignados:
          </Text>
          <Table.Root size='sm' striped>
            <Table.Header>
              <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                <Table.ColumnHeader>N°</Table.ColumnHeader>
                <Table.ColumnHeader>Nombre</Table.ColumnHeader>
                <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                <Table.ColumnHeader>Hora</Table.ColumnHeader>
                <Table.ColumnHeader>Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                filteredEvaluationsByStudent.length > 0 ? (
                  filteredEvaluationsByStudent.map((exam, index) => (
                    <Table.Row key={exam.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{exam.name}</Table.Cell>
                      <Table.Cell>{exam.date}</Table.Cell>
                      <Table.Cell>{exam.time}</Table.Cell>
                      <Table.Cell>
                        <Flex gap={2}>
                          <IconButton
                            size='xs'
                            colorPalette='blue'
                            onClick={() => {
                              setEditingId(exam.id);
                              setNameExamInput(exam.name);
                              setDateExamInput(exam.date);
                              setTimeExamInput(exam.time);
                            }}
                            aria-label='Editar'
                          >
                            <FaSave />
                          </IconButton>
                          <IconButton
                            size='xs'
                            colorPalette='red'
                            isLoading={isDeleteEvaluationPending}
                            onClick={() => {
                              handleDelete(exam.id);
                            }}
                            aria-label='Eliminar'
                          >
                            <FaTimes />
                          </IconButton>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} textAlign='center'>
                      Sin datos disponibles
                    </Table.Cell>
                  </Table.Row>
                )
              }
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Modal>
  );
}

CreateProgramExamToAdmissionProgram.propTypes = {
  item: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
}