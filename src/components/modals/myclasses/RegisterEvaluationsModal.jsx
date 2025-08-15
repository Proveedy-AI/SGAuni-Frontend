import PropTypes from 'prop-types';
import { Button, Modal, toaster } from "@/components/ui"
import { useState } from "react";
import { FiFile } from "react-icons/fi";
import { 
  Box, 
  Stack, 
  Text, 
  HStack, 
  VStack, 
  Badge,
  Input,
} from '@chakra-ui/react';
import { useCreateBulkEvaluations } from '@/hooks/evaluations';

export const RegisterEvaluationsModal = ({ fetchData, fetchGradesReport, student, evaluationComponents }) => {
  const { mutate: registerEvaluation, isPending } = useCreateBulkEvaluations();
  console.log(evaluationComponents)

  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState({});
  const [errors, setErrors] = useState({});

  // Inicializar grades con las notas existentes cuando se abre el modal
  const initializeGrades = () => {
    const initialGrades = {};
    
    if (student?.califications) {
      student.califications.forEach(qualification => {
        // Usar evaluation_component (no component_id) y grade (no grade_obtained)
        initialGrades[qualification.evaluation_component] = qualification.grade || '';
      });
    }
    
    setGrades(initialGrades);
    setErrors({});
  };

  const validate = (componentId, value) => {
    const numValue = parseFloat(value);
    
    if (value === '' || value === null || value === undefined) {
      return null; // Permitir valores vacíos
    }
    
    if (isNaN(numValue) || numValue < 0 || numValue > 20) {
      return 'La nota debe estar entre 0 y 20';
    }
    
    return null;
  };

  const handleGradeChange = (componentId, value) => {
    const error = validate(componentId, value);
    
    setGrades(prev => ({
      ...prev,
      [componentId]: value === '' ? '' : value
    }));
    
    setErrors(prev => ({
      ...prev,
      [componentId]: error
    }));
  };

  const handleSubmit = () => {
    // Validar todos los campos antes de enviar
    const newErrors = {};
    let hasErrors = false;

    Object.entries(grades).forEach(([componentId, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        const error = validate(componentId, value);
        if (error) {
          newErrors[componentId] = error;
          hasErrors = true;
        }
      }
    });

    // Actualizar errores si los hay
    if (hasErrors) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      toaster.create({
        title: "Error en las notas",
        description: "Por favor corrige los errores antes de guardar.",
        type: "error"
      });
      return; // No continuar con el submit
    }

    const payload = [];
    
    Object.entries(grades).forEach(([componentId, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        payload.push({
          evaluation_component_id: parseInt(componentId),
          value: parseFloat(value)
        });
      }
    });

    const courseSelectionId = student?.enrollment_course_selection;

    registerEvaluation({ courseSelectionId, payload }, {
      onSuccess: () => {
        toaster.create({
          title: "Evaluaciones registradas",
          description: "Las evaluaciones se han registrado correctamente.",
          type: "success"
        })
        setOpen(false);
        fetchData();
        fetchGradesReport();
      },
      onError: (error) => {
        toaster.create({
          title: "Error al registrar evaluaciones",
          description: error.message,
          type: "error"
        });
      }
    });
  };

  const handleModalOpen = () => {
    initializeGrades();
    setOpen(true);
  };

  return (
    <Modal
      trigger={
        <Button
          bg='blue.500'
          color='white'
          variant='outline'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
          onClick={handleModalOpen}
        >
          <FiFile /> Calificar
        </Button>
      }
      title={`Calificar evaluaciones: ${student?.student_name}`}
      placement='center'
      size='3xl'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onSave={handleSubmit}
      onClose={() => setOpen(false)}
      isLoading={isPending}
    >
      <VStack spacing={6} align='stretch' maxHeight={'700px'} overflowY='auto'>
        {/* Información del estudiante */}
        <Box bg='blue.50' p={4} borderRadius='lg' border='1px solid' borderColor='blue.200'>
          <VStack align='start' spacing={2}>
            <HStack>
              <Text fontWeight='bold' color='blue.800'>Estudiante:</Text>
              <Text color='blue.700'>{student?.student_name}</Text>
            </HStack>
            <HStack>
              <Text fontWeight='bold' color='blue.800'>Email:</Text>
              <Text color='blue.700'>{student?.student_email}</Text>
            </HStack>
            <HStack>
              <Text fontWeight='bold' color='blue.800'>Estado:</Text>
              <Badge 
                colorScheme={student?.qualification_status === 1 ? 'yellow' : 'green'}
                variant='subtle'
              >
                {student?.qualification_status_display}
              </Badge>
            </HStack>
            {student?.final_grade && (
              <HStack>
                <Text fontWeight='bold' color='blue.800'>Nota Final:</Text>
                <Badge colorScheme='green' variant='solid'>
                  {student.final_grade}
                </Badge>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Formulario de evaluaciones */}
        <Box>
          <Text fontSize='lg' fontWeight='bold' mb={4} color='gray.700'>
            Evaluaciones del curso
          </Text>
          
          <Stack spacing={4}>
            {evaluationComponents?.map((component) => {
              const currentGrade = grades[component.id] || '';
              const currentError = errors[component.id];

              return (
                <Box
                  key={component.id}
                  p={4}
                  bg='gray.50'
                  borderRadius='lg'
                  border='1px solid'
                  borderColor='gray.200'
                >
                  <HStack justify='space-between' align='center'>
                    <VStack align='start' spacing={1} flex={1}>
                      <HStack>
                        <Text fontWeight='bold' color='gray.800'>
                          {component.name}
                        </Text>
                        <Badge colorScheme='purple' variant='outline'>
                          {component.weight}%
                        </Badge>
                      </HStack>
                    </VStack>

                    <VStack align='end' spacing={2}>
                      {/* Input de nota */}
                      <Box textAlign='end'>
                        <Input
                          type="number"
                          value={currentGrade}
                          onChange={(e) => handleGradeChange(component.id, e.target.value)}
                          min={0}
                          max={20}
                          step={0.5}
                          w='100px'
                          placeholder="0.0"
                          borderColor={currentError ? 'red.500' : 'gray.200'}
                        />
                        {currentError && (
                          <Text fontSize='xs' color='red.500' mt={1}>
                            {currentError}
                          </Text>
                        )}
                      </Box>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Información adicional */}
        <Box bg='yellow.50' p={4} borderRadius='lg' border='1px solid' borderColor='yellow.200'>
          <Text fontSize='sm' color='yellow.800'>
            <strong>Instrucciones:</strong>
          </Text>
          <VStack align='start' spacing={1} mt={2}>
            <Text fontSize='sm' color='yellow.700'>
              • Las notas deben estar entre 0 y 20 puntos
            </Text>
            <Text fontSize='sm' color='yellow.700'>
              • Se permiten decimales con paso de 0.5 (ej: 15.5)
            </Text>
            <Text fontSize='sm' color='yellow.700'>
              • No es necesario completar todas las evaluaciones
            </Text>
            <Text fontSize='sm' color='yellow.700'>
              • Los inputs mostrarán las notas existentes si las hay
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Modal>
  )
}

RegisterEvaluationsModal.propTypes = {
  fetchData: PropTypes.func,
  fetchGradesReport: PropTypes.func,
  student: PropTypes.object,
  evaluationComponents: PropTypes.array,
};
