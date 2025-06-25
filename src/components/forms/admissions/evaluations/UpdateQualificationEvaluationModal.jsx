import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';
import { useUpdateAdmissionEvaluation } from '@/hooks/admissions_evaluations';

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
  const [qualification, setQualification] = useState(data.qualification || '');
 
  const { mutateAsync: updateExam, isSaving } = useUpdateAdmissionEvaluation();
  
  const handleUpdateQualification = async () => {
    if (qualification < 0 || qualification > 20) {
      toaster.create({
        title: 'la calificación debe estar entre 0 y 20',
        type: 'warning',
      })
      return;
    }

    const payload = {
      application: data?.application,
      qualification: qualification
    }

    updateExam({ id: data.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Calificación actualizada correctamente',
          type: 'success',
        });
        fetchData();
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error?.message || 'Error al actualizar la calificación',
          type: 'error',
        });
      },
    })
  }

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
      isSaving={isSaving}
      onSave={handleUpdateQualification}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Field label='Nombre de la evaluación:'>
          <Input readOnly value={data.type_application_display} />
        </Field>

        <Field label='Evaluador asignado:'>
          <Input readOnly value={data.evaluator_full_name || 'Sin evaluador'} size='xs' />
        </Field>

        <Field label='Ingresar calificación: (0-20)'>
          <Input
            type='number'
            min={0}
            max={20}
            placeholder='Calificación'
            size='xs'
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
        </Field>
      </Stack>
    </Modal>
  );
};

UpdateQualificationEvaluationModal.propTypes = {
  data: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
};
