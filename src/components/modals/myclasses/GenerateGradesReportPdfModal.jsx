import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiDownload } from 'react-icons/fi';
import { GradesReportDocument } from '@/components/pdf';

export const GenerateGradesReportPdfModal = ({ dataGradesReport, isLoading }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title="Generar Acta de Notas"
      placement='center'
      trigger={
        <Button
          size='sm'
          variant='outline'
          colorPalette='blue'
          onClick={() => setOpen(true)}
          disabled={!isLoading}
        >
          <FiDownload />
          Descargar Acta de Notas
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <VStack spacing={4} align='stretch'>
        <GradesReportDocument dataGradesReport={dataGradesReport} />
      </VStack>
    </Modal>
  );
};

GenerateGradesReportPdfModal.propTypes = {
  dataGradesReport: PropTypes.array,
  isLoading: PropTypes.bool,
};
