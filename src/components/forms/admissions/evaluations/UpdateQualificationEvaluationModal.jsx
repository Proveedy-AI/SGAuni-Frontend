import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { Field, Modal, Tooltip } from '@/components/ui';
import { FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';

export const UpdateQualificationEvaluationModal = ({ data, fetchData }) => {
  /*
  {
    "id": 1,
    "application": 1,
    "type_application": 2,
    "type_application_display": "Interview",
    "path_url": null,
    "status_qualification": 1,
    "status_qualification_display": "Pending",
    "start_date": "2025-06-25",
    "end_date": "2025-06-27",
    "feedback": null,
    "qualification": null,
    "evaluator": 5,
    "evaluator_full_name": "Jose Arias",
    "evaluation_time": "14:30:00",
    "uuid": "7252c226-4084-4289-a797-367e16780ae8"
  }
  */

  const [open, setOpen] = useState(false);

  return (
    <Modal
      title='Ver detalles del examen'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Calificar examen'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='green'
              css={{ _icon: { width: '5', height: '5' } }}
            >
              <FiCheckCircle />
            </IconButton>
          </Tooltip>
        </Box>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Field label='Nombre de la evaluación:'>
          <Input value={data.type_application_display} />
        </Field>

        <Field label='Evaluador asignado:'>
          <Input value={data.evaluator_full_name || 'Sin evaluador'} size='xs' />
        </Field>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field label='Inicio de examen:'>
            <Input value={data.start_date || ''} size='xs' />
          </Field>

          <Field label='Fin de examen:'>
            <Input value={data.end_date || ''} size='xs' />
          </Field>

          <Field label='Hora:'>
            <Input value={data.evaluation_time || ''} size='xs' />
          </Field>

          <Field label='Estado:'>
            <Input value={data.status_qualification_display || ''} size='xs' />
          </Field>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
};

UpdateQualificationEvaluationModal.propTypes = {
  data: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
};
