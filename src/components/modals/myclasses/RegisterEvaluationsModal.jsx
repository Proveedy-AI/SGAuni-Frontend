import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui"
import { useState } from "react";
import { FiFile, FiEdit2 } from "react-icons/fi";
import { 
  Box, 
  Stack, 
  Text, 
  HStack, 
  VStack, 
  Badge,
  Input,
} from '@chakra-ui/react';

export const RegisterEvaluationsModal = ({ student, evaluationComponents }) => {
  console.log(student?.enrollment_course_selection);
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState({});
  const [editMode, setEditMode] = useState({});

  // Inicializar grades con las notas existentes cuando se abre el modal
  const initializeGrades = () => {
    const initialGrades = {};
    const initialEditMode = {};
    
    if (student?.califications) {
      student.califications.forEach(qualification => {
        initialGrades[qualification.component_id] = qualification.grade_obtained || '';
        // Si tiene nota existente, empieza en modo NO editable (false)
        // Si no tiene nota, empieza en modo editable (true)
        initialEditMode[qualification.component_id] = qualification.grade_obtained === null;
      });
    }
    
    setGrades(initialGrades);
    setEditMode(initialEditMode);
  };

  const handleGradeChange = (componentId, value) => {
    setGrades(prev => ({
      ...prev,
      [componentId]: value === '' ? '' : parseFloat(value)
    }));
  };

  const toggleEditMode = (componentId) => {
    setEditMode(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  const handleSubmit = () => {
    const califications = [];
    
    Object.entries(grades).forEach(([componentId, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        califications.push({
          evaluation_component_id: parseInt(componentId),
          value: parseFloat(value)
        });
      }
    });

    const payload = {
      califications
    };

    console.log('Payload a enviar:', payload);
    // Aquí iría la lógica para enviar al API
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
              const qualification = student?.califications?.find(q => q.component_id === component.id);
              const hasExistingGrade = qualification?.grade_obtained !== null && qualification?.grade_obtained !== undefined;
              const isEditable = hasExistingGrade ? editMode[component.id] === true : true;
              const currentGrade = grades[component.id] || '';

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
                      
                      {hasExistingGrade && !isEditable && (
                        <HStack>
                          <Text fontSize='sm' color='gray.600'>Nota actual:</Text>
                          <Badge colorScheme='green' variant='solid'>
                            {qualification.grade_obtained}
                          </Badge>
                        </HStack>
                      )}
                    </VStack>

                    <HStack spacing={3}>
                      {/* Input de nota */}
                      <Box>
                        <Input
                          type="number"
                          value={currentGrade}
                          onChange={(e) => handleGradeChange(component.id, e.target.value)}
                          min={0}
                          max={20}
                          step={0.5}
                          disabled={!isEditable}
                          w='100px'
                          placeholder="0.0"
                        />
                      </Box>

                      {/* Botón de editar - solo se muestra si hay nota existente */}
                      {hasExistingGrade && (
                        <Button
                          size='sm'
                          variant='outline'
                          colorScheme={isEditable ? 'red' : 'blue'}
                          onClick={() => toggleEditMode(component.id)}
                        >
                          <FiEdit2 />
                          {isEditable ? 'Cancelar' : 'Editar'}
                        </Button>
                      )}
                    </HStack>
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
              • Para editar una nota existente, presiona el botón &quot;Editar&quot;
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Modal>
  )
}

RegisterEvaluationsModal.propTypes = {
  student: PropTypes.object,
  evaluationComponents: PropTypes.array,
};
