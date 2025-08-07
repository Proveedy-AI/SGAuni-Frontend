import PropTypes from 'prop-types';
import { Button, Field, Modal } from "@/components/ui";
import { Card, Icon, Stack } from "@chakra-ui/react";
import { LuDownload, LuFileText } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { EnrolledStudentsListDocument } from '@/components/pdf';
import { ReactSelect } from '@/components/select';

export const GenerateStudentEnrolledListPdfModal = ({ isDownloadable, students, options }) => {
  const [open, setOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const filteredStudents = selectedProgram ? students.filter(student =>
    student?.program === selectedProgram?.value
  ) : students;

  const handleGeneratePdf = () => {
    if (!selectedProgram) return;

    setShowPdf(true);
  }

  useEffect(() => {
    setSelectedProgram(null);
    setShowPdf(false);
  }, [open])

  useEffect(() => {
    setShowPdf(false);
  }, [selectedProgram])

  return (
    <Modal
      title="Estudiantes Matriculados"
      placement='center'
      trigger={
        <Button
          variant='outline'
          colorScheme='blue'
          leftIcon={<Icon as={LuFileText} />}
          onClick={() => setOpen(true)}
          disabled={!isDownloadable}
        >
          Descargar Matriculados
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root py={4}>
          <Card.Header>
            <Field
              label="Programa"
              required
              invalid={!selectedProgram}
              errorText={'Programa es obligatorio'}
            >
              <ReactSelect
                options={options}
                value={selectedProgram}
                onChange={setSelectedProgram}
                isClearable
              />
            </Field>
            <Button
              variant='outline'
              colorScheme='blue'
              leftIcon={<Icon as={LuDownload} />}
              onClick={handleGeneratePdf}
            >
              Generar PDF
            </Button>
          </Card.Header>
          { showPdf && (
            <Card.Body spaceY={4}>
              <EnrolledStudentsListDocument students={filteredStudents} />
            </Card.Body>
          )}
        </Card.Root>
      </Stack>
    </Modal>
  );
}

GenerateStudentEnrolledListPdfModal.propTypes = {
  students: PropTypes.array,
  isDownloadable: PropTypes.bool,
  options: PropTypes.array
}