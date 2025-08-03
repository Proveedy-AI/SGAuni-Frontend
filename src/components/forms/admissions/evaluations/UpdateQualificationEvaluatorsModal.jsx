import PropTypes from 'prop-types';
import {
  Badge,
  FieldErrorText,
  Flex,
  Input,
  Spinner,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Field, Modal } from '@/components/ui';
import { useEffect, useState } from 'react';

export const UpdateQualificationEvaluatorsModal = ({ data, isLoading, isOpen, onClose, onSubmit }) => {
  const [qualification, setQualification] = useState(data.qualification || '');
  const [feedback, setFeedback] = useState(data.feedback || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setQualification(data.qualification || '');
      setFeedback(data.feedback || '');
      setError(false);
    }
  }, [isOpen, data]);

  const handleQualificationChange = (e) => {
    const value = e.target.value;
    const regex = /^(\d{1,2})(\.\d{0,2})?$/;

    if (value === '') {
      setQualification('');
      setError(false);
      return;
    }

    if (regex.test(value)) {
      const parsed = parseFloat(value);

      if (parsed >= 0 && parsed <= 20) {
        setQualification(value);
        setError(false);
      }
    }
  };

  return (
    <Modal
      scrollBehavior='inside'
      title='Calificar examen'
      role='alertdialog'
      placement='center'
      size='xl'
      hiddenFooter={false}
      onSave={() => 
        onSubmit?.({
          qualification,
          feedback,
          setError,
          setIsSaving
        })
      }
      loading={isSaving}
      open={isOpen}
      onOpenChange={onClose}
	  positionerProps={{ style: { padding: '0 40px' } }}
    >
      {isLoading ? (
        <Flex justify='center' align='center' minH='200px'>
          <Spinner size='xl' />
        </Flex>
      ): (
        <Stack gap='4'>
          <Field label='Tipo de evaluación:'>{data.type_application_display}</Field>
          <Field label='Estado:'>
            <Badge
              bg={data.status_qualification_display === 'Completado' ? '#D0EDD0' : '#AEAEAE'}
              color={data.status_qualification_display === 'Completado' ? '#2D9F2D' : '#F5F5F5'}
              fontWeight='semibold'
            >
              {data.status_qualification_display === 'Completado' ? 'Calificado' : 'Pendiente'}
            </Badge>
          </Field>
          
          <Field 
            label='Nota'
            invalid={error}
          >
            <Input
              value={qualification}
              onChange={(e) => handleQualificationChange(e)}
              type='number'
              min='0'
              max='20'
              step='0.1'
              css={{ 
                "--focus-color": "blue",
                "&::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
                "&::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                MozAppearance: "textfield"
              }}
            />
            {error && (
              <FieldErrorText>Ingrese una nota válida (0.00 - 20.00)</FieldErrorText>
            )}
          </Field>

          <Field label='Observaciones'>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Field>
        </Stack>
      )}
    </Modal>
  );
};

UpdateQualificationEvaluatorsModal.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};
