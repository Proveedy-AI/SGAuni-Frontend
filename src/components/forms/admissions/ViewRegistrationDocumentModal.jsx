import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Span,
  Stack,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import { useState } from 'react';
import { ApplicationDataDocument } from '@/components/pdf';
import { FiFile } from 'react-icons/fi';

export const ViewRegistrationDocumentModal = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title='Vista previa de la ficha de matrícula'
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
      trigger={
        <Box>
          <Tooltip
            content='Programar tareas'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='purple'
              px={3}
            >
              <FiFile />
              <Span>Matrícula</Span>
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <ApplicationDataDocument applicationData={data} />
      </Stack>
    </Modal>
  );
};

ViewRegistrationDocumentModal.propTypes = {
  data: PropTypes.object,
};
