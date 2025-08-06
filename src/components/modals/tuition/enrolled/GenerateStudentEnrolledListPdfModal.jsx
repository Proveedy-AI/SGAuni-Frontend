import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui";
import { Card, Icon, Stack } from "@chakra-ui/react";
import { LuFileText } from "react-icons/lu";
import { useState } from 'react';
import { EnrolledStudentsListDocument } from '@/components/pdf';

export const GenerateStudentEnrolledListPdfModal = ({ students }) => {
  const [open, setOpen] = useState(false);

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
        >
          Descargar Estudiantes Matriculados
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root py={4}>
          <Card.Header></Card.Header>
          <Card.Body spaceY={4}>
            <EnrolledStudentsListDocument students={students} />
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
}

GenerateStudentEnrolledListPdfModal.propTypes = {
  students: PropTypes.array,
}