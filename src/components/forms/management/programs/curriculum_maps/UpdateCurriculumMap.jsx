import { Alert, Modal, toaster, Tooltip } from "@/components/ui";
import { useUpdateCurriculumMap } from "@/hooks/curriculum_maps";
import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export const UpdateCurriculumMap = ({ item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  const { mutate: update, isPending } = useUpdateCurriculumMap();

  const handleSubmit = () => {
    if (item?.total_courses === 0) {
      toaster.create({
        title: 'No se puede activar la malla curricular',
        description: 'La malla curricular debe tener al menos un curso para ser activada.',
        type: 'warning',
      });
      return;
    }

    const payload = {
      is_current: true,
    }

    update({ id: item?.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Malla curricular actualizada',
          type: 'success',
        });
        setOpen(false);
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: 'Error al actualizar la malla curricular',
          description: error?.response?.data?.message || error.message,
          type: 'error',
        });
      }
    });
  };

  return (
    <Modal
      placement='center'
			size='xl'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={handleSubmit}
      saveLabel="Si, activar"
			contentRef={contentRef}
			isPending={isPending}
      trigger={
        <Box>
          <Tooltip 
            content={ item?.is_current ? 'Malla Activa' : 'Activar Malla Curricular'}
            positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
          >
            <IconButton colorPalette='purple' size='xs' disabled={item?.is_current} >
              <FiCheckCircle />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Stack p={4}>
        <Text fontSize="md" fontWeight="semibold">¿Está seguro de que desea activar esta malla curricular?</Text>
        <Alert
          title="Al activar esta malla curricular, se desactivará automáticamente cualquier otra malla que esté actualmente activa para este programa."
        />
      </Stack>
    </Modal>
  );
};

UpdateCurriculumMap.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func,
};