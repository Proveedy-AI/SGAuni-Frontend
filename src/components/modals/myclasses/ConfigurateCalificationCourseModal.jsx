import { ReactSelect } from "@/components/select";
import { Field, Button, Modal, toaster } from "@/components/ui";
import { Card, Flex, Heading, Input, Stack, Text, Table } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiFile, FiPlus, FiEdit2, FiTrash2, FiSave } from "react-icons/fi";
import { MdAssignment } from "react-icons/md";
import { useCreateEvaluationByCourse, useUpdateEvaluationByCourse } from "@/hooks/course_groups/evaluations";
import { useDeleteEvaluationByCourse } from "@/hooks/course_groups/evaluations/useDeleteEvaluationByCourse";

export const ConfigurateCalificationCourseModal = ({ evaluations, mode_calification }) => {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [form, setForm] = useState({ id: null, name: "", weight: "", date: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if ((selectedMode?.value === 1 || mode_calification === 1) && !form.weight) newErrors.weight = "El valor ponderado es requerido";
    if (!form.date) newErrors.date = "La fecha es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const { mutate: create, isLoading: isCreating } = useCreateEvaluationByCourse();
  const { mutate: update, isLoading: isUpdating } = useUpdateEvaluationByCourse();
  const { mutate: remove, isLoading: isRemoving } = useDeleteEvaluationByCourse();

  const isEditing = form.id !== null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      return toaster.create({
        title: 'Campos incompletos',
        description: 'Debe completar todos lo campos del formulario',
        type: 'warning'
      })
    }

    const payload = {
      name: form.name,
      weight: selectedMode?.value === 1 ? Number(form.weight) || null : null,
      date: form.date,
    };

    if (isEditing) {
      update({ id: form.id, ...payload }, {
        onSuccess: () => setForm({ id: null, name: "", weight: "", date: "" })
      });
    } else {
      create(payload, {
        onSuccess: () => setForm({ id: null, name: "", weight: "", date: "" })
      });
    }
  };

  const handleEdit = (evaluation) => {
    setForm({
      id: evaluation.id,
      name: evaluation.name,
      weight: evaluation.weight ?? "",
      date: evaluation.date?.split("T")[0] || "",
    });
  };

  const handleDelete = (id) => {
    remove({ id });
  };

  const GradingModes = [
    { value: 1, label: "Porcentaje (con pesos por evaluación)" },
    { value: 2, label: "Promedio simple" },
    { value: 3, label: "Calificación conceptual (AD, A, B, C, D, NA)" },
  ];

  useEffect(() => {
    //reset when the modal close
    setSelectedMode(null);
    setForm({ id: null, name: "", weight: "", date: "" });

  }, [open])

  return (
    <Modal
      placement='center'
      title="Configurar modo de calificación"
      size='2xl'
      trigger={
        <Button
          size='xs'
          bg='uni.secondary'
          color='white'
          px={2}
          onClick={() => setOpen(true)}
        >
          Configuración
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      hiddenFooter={true}
    >
      <Stack spacing={4}>
        <Card.Root>
          <Card.Header>
            <Heading color={'#0661D8'} size='lg' display='flex' alignItems='center' gapX={2}>
              <FiFile /> Evaluaciones
            </Heading>
            <Text fontSize='sm' color='gray.500'>
              Configura la cantidad de evaluaciones y el valor ponderado de promedio.
            </Text>
          </Card.Header>
          <Card.Body>
            {mode_calification === null ? (
              <Flex justify='space-between' align='center' mb={4} gap={4}>
                <ReactSelect
                  options={GradingModes}
                  value={selectedMode}
                  onChange={setSelectedMode}
                  isClearable
                  placeholder="Selecciona un modo de calificación"
                />
                <Button
                  size='xs'
                  bg='uni.secondary'
                  color='white'
                  px={2}
                  py={4}
                  onClick={() => setOpen(false)}
                >
                  <MdAssignment /> Asignar
                </Button>
              </Flex>
            ) : (
              <Text fontSize='md' color='gray.700'>
                Modo de calificación: <b>{GradingModes.find(m => m.value === mode_calification)?.label || "Desconocido"}</b>
              </Text>
            )}
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Flex gap={4} pb={4}>
              <Field
                label="Nombre de la evaluación"
                invalid={!!errors.name}
                errorText={errors.name}
                required
              >
                <Input
                  placeholder="Ej. Parcial 1"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Field>
              {(selectedMode?.value === 1 || mode_calification === 1) && (
                <Field
                  maxW='120px' label="Valor ponderado"
                  invalid={!!errors.weight}
                  errorText={errors.weight}
                  required
                >
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Ej. 30"
                    value={form.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </Field>
              )}
              <Field
                label="Fecha de evaluación"
                invalid={!!errors.date}
                errorText={errors.date}
                required
              >
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </Field>
            </Flex>
            <Button
              bg={isEditing ? "green.200" : "#C6E7FC"}
              color={'#0661D8'}
              onClick={handleSubmit}
              isLoading={ isCreating || isUpdating }
            >
              {isEditing ? <><FiSave /> Actualizar evaluación</> : <><FiPlus /> Añadir evaluación</>}
            </Button>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Heading size="md" mb={2}>Lista de evaluaciones</Heading>
            <Table.Root variant="simple">
              <Table.Header>
                <Table.Row>
                  <Table.Cell>Nombre</Table.Cell>
                  {mode_calification === 1 && <Table.Cell>Ponderación (%)</Table.Cell>}
                  <Table.Cell>Fecha</Table.Cell>
                  <Table.Cell>Acciones</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {evaluations?.map(ev => (
                  <Table.Row key={ev.id}>
                    <Table.Cell>{ev.name}</Table.Cell>
                    {mode_calification === 1 && (
                      <Table.Cell>
                        {ev.weight !== null && ev.weight !== undefined ? ev.weight : "-"}
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      {ev.date ? new Date(ev.date).toLocaleDateString() : "-"}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => handleEdit(ev)}
                        leftIcon={<FiEdit2 />}
                        mr={2}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleDelete(ev.id)}
                        leftIcon={<FiTrash2 />}
                        isLoading={ isRemoving }
                      >
                        Eliminar
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};

ConfigurateCalificationCourseModal.propTypes = {
  evaluations: PropTypes.array,
  mode_calification: PropTypes.number,
};
