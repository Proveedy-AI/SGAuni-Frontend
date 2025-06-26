import PropTypes from 'prop-types';
import {
  Stack,
} from '@chakra-ui/react';
import { ControlledModal } from '@/components/ui';
import { PdfDocument } from '@/components/pdf';

export const GeneratePdfApliccationsModal = ({ data, open, setOpen }) => {
  /*
    {
      "id": 1,
      "postgrad_type": 2,
      "postgrad_type_display": "Professional",
      "study_mode": 3,
      "study_mode_display": "Presential",
      "director": 4,
      "director_name": "Pedro Lopez",
      "admission_process": 1,
      "admission_process_name": "Proceso 2025 - II",
      "program": 1,
      "program_name": "Maestría en Administración de Empresas",
      "status": 4,
      "status_display": "Approved",
      "program_type": "Maestría",
      "coordinator": 2,
      "coordinator_name": "Rodrigo Torres",
      "registration_start_date": "2025-06-16",
      "registration_end_date": "2025-06-30",
      "exam_date_start": "2025-07-01",
      "exam_date_end": "2025-07-06",
      "semester_start_date": "2025-09-01",
      "pre_master_start_date": "2025-07-08",
      "pre_master_end_date": "2025-12-31",
      "uuid": "ac0f74a9-dd8e-44e9-b023-02244bdf8805",
      "modalities": [
          {
              "id": 1,
              "modality_name": "Pre Maestría",
              "vacancies": 20
          }
      ]
  }
  */

  const PDFHeaders = [
    'No.',
    'Apellidos y Nombres',
    'Promedio\nConocimiento\n(Ensayo)',
    'Evaluación\nMéritos',
    'Promedio final',
    'Ingresó'
  ]

  const PDFData = [
    { fullname: 'John Doe', knowledge_average: 85, merit_evaluation: 90, final_average: 87.5, enrolled: true },
    { fullname: 'Jane Smith', knowledge_average: 78, merit_evaluation: 82, final_average: 80, enrolled: false },
    { fullname: 'Alice Johnson', knowledge_average: 92, merit_evaluation: 88, final_average: 90, enrolled: true },
    { fullname: 'Bob Brown', knowledge_average: 75, merit_evaluation: 80, final_average: 77.5, enrolled: false },
    { fullname: 'Charlie White', knowledge_average: 88, merit_evaluation: 85, final_average: 86.5, enrolled: true },
    { fullname: 'Diana Green', knowledge_average: 80, merit_evaluation: 78, final_average: 79, enrolled: false },
    { fullname: 'Ethan Black', knowledge_average: 90, merit_evaluation: 92, final_average: 91, enrolled: true },
    { fullname: 'Fiona Blue', knowledge_average: 82, merit_evaluation: 84, final_average: 83, enrolled: false },
    { fullname: 'George Yellow', knowledge_average: 87, merit_evaluation: 89, final_average: 88, enrolled: true },
    { fullname: 'Hannah Purple', knowledge_average: 76, merit_evaluation: 74, final_average: 75, enrolled: false }
  ]

  return (
    <ControlledModal
      title='Vista previa del Programa de Admisión'
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <PdfDocument dataProgram={data} headers={PDFHeaders} data={PDFData} />
      </Stack>
    </ControlledModal>
  );
};

GeneratePdfApliccationsModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func
};
