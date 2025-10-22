import PropTypes from 'prop-types';
import { Button, ControlledModal, Field } from "@/components/ui";
import { Card, Icon, Stack, Alert } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { EnrolledStudentsListDocument } from '@/components/pdf';
import { ReactSelect } from '@/components/select';
import { FiAlertCircle } from 'react-icons/fi';

export const GenerateStudentEnrolledListPdfModal = ({ open, setOpen, students, options }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  
  // Crear opción "Todos los programas"
  const allProgramsOption = { value: 'all', label: 'Todos los programas' };
  const programOptions = [allProgramsOption, ...(Array.isArray(options) ? options : [])];

  // Función para obtener estudiantes filtrados según el programa seleccionado
  const getFilteredStudents = () => {
    if (!selectedProgram) return [];
    
    if (selectedProgram.value === 'all') {
      // Retornar todos los estudiantes de todos los programas
      return students || [];
    } else {
      // Filtrar por programa específico
      const filteredPrograms = students?.filter(program => 
        program.program_name === selectedProgram.label
      ) || [];
      return filteredPrograms;
    }
  };

  const filteredStudents = getFilteredStudents();

  // Función para contar el total de estudiantes
  const getTotalStudentsCount = (programs) => {
    if (!programs || !Array.isArray(programs)) return 0;
    return programs.reduce((total, program) => {
      return total + (program.students?.length || 0);
    }, 0);
  };

  const totalStudents = getTotalStudentsCount(filteredStudents);
  const hasStudents = totalStudents > 0;

  // Mensaje de estado según la selección
  const getStatusMessage = () => {
    if (!selectedProgram) {
      return { type: 'info', message: 'Selecciona un programa para continuar' };
    }
    
    if (!hasStudents) {
      return { 
        type: 'warning', 
        message: selectedProgram.value === 'all' 
          ? 'No hay estudiantes matriculados en ningún programa'
          : `No hay estudiantes matriculados en ${selectedProgram.label}`
      };
    }
    
    return { 
      type: 'success', 
      message: selectedProgram.value === 'all'
        ? `${totalStudents} estudiante${totalStudents !== 1 ? 's' : ''} en total`
        : `${totalStudents} estudiante${totalStudents !== 1 ? 's' : ''} en ${selectedProgram.label}`
    };
  };

  const statusMessage = getStatusMessage();

  const handleGeneratePdf = () => {
    if (!selectedProgram || !hasStudents) return;
    setShowPdf(true);
  };

  useEffect(() => {
    setSelectedProgram(null);
    setShowPdf(false);
  }, [open])

  useEffect(() => {
    setShowPdf(false);
  }, [selectedProgram])

  return (
    <ControlledModal
      title="Estudiantes Matriculados"
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root py={4}>
          <Card.Header>
            <Stack spacing={4}>
              <Field
                label="Programa"
                required
                invalid={!selectedProgram}
                errorText={'Selecciona un programa'}
              >
                <ReactSelect
                  options={programOptions}
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  placeholder="Selecciona un programa o todos..."
                  isClearable
                />
              </Field>

              {/* Mensaje de estado */}
              {selectedProgram && (
                <Alert.Root 
                  status={statusMessage.type} 
                  variant="subtle"
                  size="sm"
                >
                  <Alert.Indicator>
                    <Icon as={FiAlertCircle} />
                  </Alert.Indicator>
                  <Alert.Title>
                    {statusMessage.message}
                  </Alert.Title>
                </Alert.Root>
              )}

              <Button
                variant='outline'
                colorScheme={hasStudents ? 'blue' : 'gray'}
                leftIcon={<Icon as={LuDownload} />}
                onClick={handleGeneratePdf}
                isDisabled={!selectedProgram || !hasStudents}
                size="md"
              >
                {hasStudents 
                  ? `Generar PDF (${totalStudents} estudiante${totalStudents !== 1 ? 's' : ''})`
                  : 'Generar PDF'
                }
              </Button>
            </Stack>
          </Card.Header>
          
          {showPdf && hasStudents && (
            <Card.Body spaceY={4}>
              <EnrolledStudentsListDocument students={filteredStudents} />
            </Card.Body>
          )}
        </Card.Root>
      </Stack>
    </ControlledModal>
  );
}

GenerateStudentEnrolledListPdfModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  students: PropTypes.array,
  isDownloadable: PropTypes.bool,
  options: PropTypes.array
}