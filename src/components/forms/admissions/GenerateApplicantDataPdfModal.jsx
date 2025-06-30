import { ApplicationDataDocument } from '@/components/pdf';
import { Button, ModalSimple } from '@/components/ui';
import { Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

export const GenerateApplicantDataPdfModal = ({ applicationPersonalData }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalSimple
      title="Documento de Datos Personales"
      placement='center'
      trigger={
        <Button variant='outline'>
         <FaDownload /> Ficha Inscripción
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <ApplicationDataDocument applicationData={applicationPersonalData} />
      </Stack>
    </ModalSimple>
  )
}

GenerateApplicantDataPdfModal.propTypes = {
  applicationPersonalData: PropTypes.object.isRequired
}

