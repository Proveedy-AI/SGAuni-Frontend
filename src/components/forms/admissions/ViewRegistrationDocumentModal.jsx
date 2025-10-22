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
import { useReadAcademicDegrees } from '@/hooks/academic_degrees';

export const ViewRegistrationDocumentModal = ({ data }) => {
  const [open, setOpen] = useState(false);

  const { data: academicDegrees } = useReadAcademicDegrees(
    { person: data?.person_details?.id },
    { enabled: open && !!data?.person_details?.id },
  );

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
            content='Ver ficha'
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
        <ApplicationDataDocument applicationData={data} academicDegrees={academicDegrees?.results} />
      </Stack>
    </Modal>
  );
};

ViewRegistrationDocumentModal.propTypes = {
  data: PropTypes.object,
};
