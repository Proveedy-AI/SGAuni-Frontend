import PropTypes from 'prop-types';
import {
  Stack,
} from '@chakra-ui/react';
import { ControlledModal, Field } from '@/components/ui';
import { FinalRecordDocument } from '@/components/pdf';
import { ReactSelect } from '@/components/select';
import { useState } from 'react';

export const GeneratePdfApliccationsModal = ({ data, open, setOpen }) => {
  const modalityOptions = data.modalities?.map((modality) => ({
    value: modality.id,
    label: modality.modality_name
  }))

  const [selectedModality, setSelectedModality] = useState(null)

  const PDFHeaders = [
    'No.',
    'Apellidos y Nombres',
    'Promedio\nConocimiento\n(Ensayo)',
    'Evaluación\nMéritos',
    'Promedio final',
    'Ingresó'
  ]

  return (
    <ControlledModal
      title='Vista previa del documento de acta de notas'
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Field label='Modalidad de admisión'>
          <ReactSelect
            name='modality'
            options={modalityOptions}
            placeholder='Seleccione una modalidad'
            value={selectedModality}
            onChange={(setValue) => setSelectedModality(setValue)}
          />
        </Field>
        <FinalRecordDocument 
          modality={selectedModality} 
          dataProgram={data} 
          headers={PDFHeaders} 
        />
      </Stack>
    </ControlledModal>
  );
};

GeneratePdfApliccationsModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func
};
