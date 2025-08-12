import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiDownload } from 'react-icons/fi';
import { AcademicTranscriptDocument } from '@/components/pdf/AcademicTranscriptDocument';

export const GenerateAcademicTranscriptPdfModal = ({ data, isActive }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title="Descargar Boleta de Notas"
      placement='center'
      trigger={
        <Button
          size='sm'
          bg="blue.500"
          color="white"
          variant='outline'
          onClick={() => setOpen(true)}
          disabled={!isActive}
        >
          <FiDownload /> Descargar Boleta de Notas
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <VStack spacing={4} align='stretch' maxHeight={'700px'} overflowY='auto'>
        <AcademicTranscriptDocument data={data} />
      </VStack>
    </Modal>
  );
};

GenerateAcademicTranscriptPdfModal.propTypes = {
  data: PropTypes.object,
  isActive: PropTypes.bool,
};

