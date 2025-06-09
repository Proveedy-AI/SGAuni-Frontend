import { ReactSelect } from '@/components/select';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { 
  useReadAdmissionEvaluators, 
  useCreateAdmissionEvaluator,
  useUpdateAdmissionEvaluator,
  useDeleteAdmissionEvaluator
} from '@/hooks/admissions_evaluators';
import { useReadUsers } from '@/hooks/users';
import { Box, Flex, IconButton, Spinner, Stack, Table, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiCheckSquare, FiTrash2 } from 'react-icons/fi';

export const AssignEvaluatorProgramModal = ({ item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [evaluatorRequest, setEvaluatorRequest] = useState({
    coordinator: null,
    role: null
  });

  const { data: dataUsers, isLoading: loadingUsers } = useReadUsers();
  const { data: dataAdmissionEvaluators, isLoading: loading, refetch: fetchAdmissionEvaluators } = useReadAdmissionEvaluators();

  const coordinatorOptions = dataUsers?.results
    ?.filter(
      (c) =>
        c?.is_active === true &&
        Array.isArray(c?.roles) &&
        c.roles.some((role) => role?.name === "Docente")
    )
    ?.map((c) => ({
      value: c.id.toString(),
      label: c.full_name,
    }));

  const roleOptions = [
    { label:'Ensayo', value:'1' },
    { label:'Examen', value:'2'},
    { label:'Entrevista personal', value:'3'},
  ]
  
  const evaluatorsAssigned = dataAdmissionEvaluators?.results?.filter((evaluator) => 
    evaluator.admission_program === item.id
  )

  // Filtra los roles que NO están asignados al evaluador seleccionado
  const filteredRolesOptions = evaluatorRequest.coordinator
    ? roleOptions.filter((option) => (
        !loading &&
        !evaluatorsAssigned?.some(
          (evaluatorAssigned) =>
            evaluatorAssigned.evaluator === Number(evaluatorRequest.coordinator?.value) &&
            evaluatorAssigned.role === Number(option.value)
        )
      ))
    : roleOptions;

  const { mutateAsync: assignEvaluator, isPending: isSaving } = useCreateAdmissionEvaluator();
  const { mutateAsync: updateAssignment } = useUpdateAdmissionEvaluator();
  const { mutate: deleteAssignment } = useDeleteAdmissionEvaluator();

  const handleResetForm = () => {
    setEvaluatorRequest({
      coordinator: null,
      role: null
    });
		setEditingId(null);
	};


  const handleSubmit = async () => {
    if (!evaluatorRequest.coordinator || !evaluatorRequest.role) {
			toaster.create({
				title: 'Completa todos los campos obligatorios',
				type: 'warning',
			});
			return;
		}

    const payload = {
      admission_program: item.id,
      evaluator: Number(evaluatorRequest.coordinator.value),
      role: Number(evaluatorRequest.role.value)
    }

    const onSuccess = () => {
      toaster.create({
        title: editingId ? 'Asignación actualizada' : 'Asignación creada',
				type: 'success',
      })
      handleResetForm();
      fetchAdmissionEvaluators();
      fetchData();
    }

    const onError = (error) => {
			toaster.create({
				title: error.response?.data?.[0] || 'Error en la asignación',
				type: 'error',
			});
		};

    if (editingId) {
			updateAssignment({ id: editingId, payload }, { onSuccess, onError });
		} else {
			assignEvaluator(payload, { onSuccess, onError });
		}
  }

  const handleDelete = (id) => {
    deleteAssignment(id, {
      onSuccess: () => {
        toaster.create({ title: 'Asignación eliminada', type: 'info' });
        handleResetForm();
        fetchAdmissionEvaluators();
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: error.response?.data?.[0] || 'Error al eliminar',
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Asignar/Quitar Coordinador'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Asignar Coordinador'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
            >
            <IconButton colorPalette='purple' size='xs'>
              <FiCheckSquare />
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
      {
        loadingUsers ? (
          <Flex justify='center' align='center' minH='200px'>
            <Spinner size='xl' />
          </Flex>
        ) : (
          <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              align={'end'}
              gap={2}
              mt={2}
            >
              <Field label='Evaluador'>
                <ReactSelect
                  options={coordinatorOptions}
                  value={evaluatorRequest.coordinator}
                  onChange={(value) => setEvaluatorRequest((prev) => ({ ...prev, coordinator: value }))}
                />
              </Field>
              <Field label='Rol del evaluador'>
                <ReactSelect
                  options={evaluatorRequest.coordinator ? filteredRolesOptions: []}
                  value={evaluatorRequest.role}
                  onChange={(value) => setEvaluatorRequest((prev) => ({ ...prev, role: value }))}
                />
              </Field>
              <IconButton
                size='sm'
                bg='uni.secondary'
                loading={isSaving}
                disabled={!evaluatorRequest.coordinator || !evaluatorRequest.role}
                onClick={handleSubmit}
                css={{ _icon: { width: '5', height: '5' } }}
              >
                <FaSave />
              </IconButton>
            </Flex>
            <Box mt={6}>
              <Text fontWeight='semibold' mb={2}>
                Modalidades Asignadas:
              </Text>
              <Table.Root size='sm' striped>
                <Table.Header>
                  <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                    <Table.ColumnHeader>N°</Table.ColumnHeader>
                    <Table.ColumnHeader>Evaluador</Table.ColumnHeader>
                    <Table.ColumnHeader>Tipo de Evaluación</Table.ColumnHeader>
                    <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
    
                <Table.Body>
                  {evaluatorsAssigned?.map((item, index) => (
                    <Table.Row
                      key={item.id}
                      bg={{ base: 'white', _dark: 'its.gray.500' }}
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.evaluator_display || item.evaluator}</Table.Cell>
                      <Table.Cell>{item.role_display}</Table.Cell>
    
                      <Table.Cell>
                        <Flex gap={2}>
                          <IconButton
                            size='xs'
                            colorPalette='red'
                            onClick={() => handleDelete(item.id)}
                            aria-label='Eliminar'
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  {evaluatorsAssigned?.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={7} textAlign='center'>
                        Sin datos disponibles
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </Stack>
        )
      }
    </Modal>
  )
}

AssignEvaluatorProgramModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func,
};

