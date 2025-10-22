import PropTypes from 'prop-types';
import {
  Box,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Button, Modal } from '@/components/ui';
import { useState } from 'react';

export const AverageScoresModal = ({ applicationId, data, fetchData }) => {
  const [open, setOpen] = useState(false);
  const isAvailable = data?.length > 0 || data?.some(item => item?.qualification !== null);

  //const { mutate: calculateAverage, isSaving } = useCalculateAverageScores();

  const handleSubmit = () => {
    const payload = {
      data: data.map(item => ({
        id: item.id,
        qualification: item.qualification,
      })),
      application_id: applicationId,
    }
    /*

    calculateAverage(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Promedio calculado correctamente',
          type: 'success',
        });
        fetchData();
        setOpen(false);
      },
      onError: (error) => {
        console.error('Error calculating average scores:', error);
        toaster.create({
          title: error?.message || 'Error al calcular el promedio',
          type: 'error',
        });
      },
    });


    */
  }

  return (
    <Modal
      title='Calcular promedio de notas'
      placement='center'
      trigger={
        <Box w='fit'>
          <Button
            size='xs'
            bg='uni.secondary'
            disabled={isAvailable}
          >
            Calcular promedio
          </Button>
        </Box>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='lg'
      onSave={handleSubmit}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Text>¿Desea promediar las notas del estudiante?</Text>
      </Stack>
    </Modal>
  );
};

AverageScoresModal.propTypes = {
  applicationId: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
};
