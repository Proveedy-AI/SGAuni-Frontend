import { Modal, Tooltip } from '@/components/ui';
import { Box, IconButton, Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export const ViewAdmissionProgramExams = ({ item, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title='Ver exámenes'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Ver exámenes'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='blue'
              css={{ _icon: { width: '5', height: '5' } }}
            >
              <FiCheckCircle />
            </IconButton>
          </Tooltip>
        </Box>
      }
      size='4xl'
      open={open}
      hiddenFooter={true}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
        
      </Stack>
    </Modal>
  );
}

ViewAdmissionProgramExams.propTypes = {
  item: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
}