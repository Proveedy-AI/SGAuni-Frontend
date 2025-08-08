import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui"
import { useState } from "react";
import { FiDownload } from 'react-icons/fi';
import { EnrolledStudentsByCourseDocument } from '@/components/pdf/EnrolledStudentsByCourseDocument';

export const GenerateStudentsByCoursePdfModal = ({ isDownloadable, data, students }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title="Estudiantes Matriculados"
      placement='center'
      trigger={
        <Button
          variant='outline'
          bg="blue.500"
          color="white"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={!isDownloadable}
        >
          <FiDownload /> Descargar
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <EnrolledStudentsByCourseDocument data={data} students={students} />
    </Modal>
  )
}

GenerateStudentsByCoursePdfModal.propTypes = {
  data: PropTypes.object,
  isDownloadable: PropTypes.bool,
  students: PropTypes.array,
}