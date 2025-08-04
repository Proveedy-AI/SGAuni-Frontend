import { ReactSelect } from "@/components/select";
import { Field, Button, Modal, toaster } from "@/components/ui";
import { Card, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiFile, FiPlus, FiSave } from "react-icons/fi";
import { useCreateEvaluationByCourse, useUpdateEvaluationByCourse } from "@/hooks/course_groups/evaluations";
import { useDeleteEvaluationByCourse } from "@/hooks/course_groups/evaluations/useDeleteEvaluationByCourse";
import { EvaluationsTable } from "./EvaluationsTable";

export const ConfigurateCalificationCourseModal = ({ fetchData, courseGroup, evaluationComponents }) => {
  const [open, setOpen] = useState(false);
  const [currentQualificationType, setCurrentQualificationType] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [form, setForm] = useState({ id: null, name: "", weight: "", selectedMode: null });
  const [errors, setErrors] = useState({});

  const GradingModes = [
    { value: 1, label: "Porcentaje por pesos" },
    { value: 2, label: "Promedio simple" },
    { value: 3, label: "Calificación conceptual" },
  ];

  // Establecer el tipo de calificación actual basado en props
  useEffect(() => {
    const gradingModes = [
      { value: 1, label: "Porcentaje por pesos" },
      { value: 2, label: "Promedio simple" },
      { value: 3, label: "Calificación conceptual" },
    ];
    
    // Si hay evaluaciones existentes, tomar el tipo de la primera evaluación
    if (evaluationComponents && evaluationComponents.length > 0) {
      const firstEvalType = evaluationComponents[0].qualification_type;
      setCurrentQualificationType(firstEvalType);
      setSelectedMode(gradingModes.find(mode => mode.value === firstEvalType));
    } else {
      // Si no hay evaluaciones, resetear los estados
      setCurrentQualificationType(null);
      setSelectedMode(null);
    }
  }, [setForm, evaluationComponents]);

  const validate = () => {
    const newErrors = {};
    
    if (!form.selectedMode) {
      newErrors.selectedMode = "Debe seleccionar un modo de calificación";
    }
    
    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    if (form.selectedMode?.value === 1 && !form.weight) {
      newErrors.weight = "El valor ponderado es requerido";
    }

    // Validar que el modo seleccionado coincida con el tipo actual (si hay evaluaciones)
    if (hasExistingEvaluations && form.selectedMode && form.selectedMode.value !== currentQualificationType) {
      newErrors.selectedMode = "No puede cambiar el modo de calificación si ya existen evaluaciones";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate: create, isLoading: isCreating } = useCreateEvaluationByCourse();
  const { mutate: update, isLoading: isUpdating } = useUpdateEvaluationByCourse();
  const { mutate: remove, isLoading: isRemoving } = useDeleteEvaluationByCourse();

  const isEditing = form.id !== null;
  const hasExistingEvaluations = evaluationComponents && evaluationComponents.length > 0;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpiar errores específicos del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) {
      return toaster.create({
        title: 'Campos incompletos',
        description: 'Debe completar todos los campos del formulario correctamente',
        type: 'warning'
      });
    }

    const payload = {
      course_group: courseGroup.id,
      name: form.name,
      qualification_type: currentQualificationType ? currentQualificationType : form.selectedMode.value,
      weight: form.selectedMode.value === 1 ? Number(form.weight) : null,
      is_verified: true
    };

    console.log(payload)

    if (isEditing) {
      update({ id: form.id, ...payload }, {
        onSuccess: () => {
          setForm({ id: null, name: "", weight: "", selectedMode: null });
          setErrors({});
          fetchData && fetchData();
          toaster.create({
            title: 'Evaluación actualizada',
            description: 'La evaluación se ha actualizado correctamente',
            type: 'success'
          });
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al actualizar',
            description: error.message || 'Ocurrió un error al actualizar la evaluación',
            type: 'error'
          });
        }
      });
    } else {
      create(payload, {
        onSuccess: () => {
          setForm({ id: null, name: "", weight: "", selectedMode: null });
          setErrors({});
          // Establecer el tipo de calificación si es la primera evaluación
          if (!currentQualificationType) {
            setCurrentQualificationType(form.selectedMode.value);
          }
          fetchData && fetchData();
          toaster.create({
            title: 'Evaluación creada',
            description: 'La evaluación se ha creado correctamente',
            type: 'success'
          });
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al crear',
            description: error.message || 'Ocurrió un error al crear la evaluación',
            type: 'error'
          });
        }
      });
    }
  };

  const handleEdit = (evaluation) => {
    const currentMode = GradingModes.find(mode => mode.value === currentQualificationType);
    setForm({
      id: evaluation.id,
      name: evaluation.name,
      weight: evaluation.weight ?? "",
      selectedMode: currentMode,
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    console.log(id)
    remove(id, {
      onSuccess: () => {
        fetchData && fetchData();
        toaster.create({
          title: 'Evaluación eliminada',
          description: 'La evaluación se ha eliminado correctamente',
          type: 'success'
        });
      },
      onError: (error) => {
        toaster.create({
          title: 'Error al eliminar',
          description: error.message || 'Ocurrió un error al eliminar la evaluación',
          type: 'error'
        });
      }
    });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", weight: "", selectedMode: null });
    setErrors({});
  };

  useEffect(() => {
    // Reset when the modal closes
    if (!open) {
      resetForm();
      if (!hasExistingEvaluations) {
        setSelectedMode(null);
        setCurrentQualificationType(null);
      }
    }
  }, [open, hasExistingEvaluations]);

  return (
    <Modal
      placement='center'
      title="Configurar modo de calificación"
      size='4xl'
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
              <FiFile /> Configuración de Calificaciones
            </Heading>
            <Text fontSize='sm' color='gray.500'>
              Configura el modo de calificación y gestiona las evaluaciones del curso.
            </Text>
          </Card.Header>
          <Card.Body>
            <Field
              label="Modo de calificación"
              invalid={!!errors.qualification_type}
              errorText={errors.qualification_type}
              required
            >
              <Input
                readOnly
                placeholder="Modo de calificación actual"
                value={hasExistingEvaluations ? selectedMode?.label : "No definido"}
				        variant='flushed'
              />
            </Field>
          </Card.Body>
        </Card.Root>

        {/* Formulario para crear/editar evaluaciones */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="#0661D8">
              {isEditing ? "Editar Evaluación" : "Nueva Evaluación"}
            </Heading>
          </Card.Header>
            <Card.Body>
              <Stack spacing={4}>
                <Flex gap={4} direction={{ base: "column", md: "row" }}>
                  <Field
                    label="Modo de calificación"
                    invalid={!!errors.selectedMode}
                    errorText={errors.selectedMode}
                    required
                    maxW={{ base: "100%", md: "300px" }}
                  >
                    <ReactSelect
                      options={GradingModes}
                      value={form.selectedMode}
                      onChange={(value) => handleChange("selectedMode", value)}
                      placeholder="Selecciona modo de calificación"
                    />
                  </Field>
                  
                  <Field
                    label="Nombre de la evaluación"
                    invalid={!!errors.name}
                    errorText={errors.name}
                    required
                    flex={1}
                  >
                    <Input
                      placeholder="Ej. Parcial 1, Examen Final, Trabajo Grupal"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </Field>
                  
                  {(form.selectedMode?.value === 1 || currentQualificationType === 1) && (
                    <Field
                      label="Valor ponderado (%)"
                      invalid={!!errors.weight}
                      errorText={errors.weight}
                      required
                      maxW={{ base: "100%", md: "150px" }}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="30"
                        value={form.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                      />
                    </Field>
                  )}
                </Flex>
                
                <Flex gap={2}>
                  <Button
                    bg={isEditing ? "green.500" : "#0661D8"}
                    color="white"
                    onClick={handleSubmit}
                    isLoading={isCreating || isUpdating}
                    leftIcon={isEditing ? <FiSave /> : <FiPlus />}
                  >
                    {isEditing ? "Actualizar evaluación" : "Añadir evaluación"}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                  )}
                </Flex>
              </Stack>
            </Card.Body>
          </Card.Root>

        {/* Lista de evaluaciones existentes */}
        {hasExistingEvaluations && (
          <Card.Root>
            <Card.Header>
              <Heading size="md" color="#0661D8">
                Evaluaciones Configuradas ({evaluationComponents.length})
              </Heading>
            </Card.Header>
            <Card.Body p={3}>
              <EvaluationsTable
                evaluationComponents={evaluationComponents}
                currentQualificationType={currentQualificationType}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isRemoving={isRemoving}
              />
            </Card.Body>
          </Card.Root>
        )}
      </Stack>
    </Modal>
  );
};

ConfigurateCalificationCourseModal.propTypes = {
  fetchData: PropTypes.func,
  courseGroup: PropTypes.object,
  evaluationComponents: PropTypes.array,
};
