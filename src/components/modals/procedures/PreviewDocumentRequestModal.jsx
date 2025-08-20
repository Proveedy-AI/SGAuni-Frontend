import PropTypes from "prop-types";
import { Modal, Tooltip } from "@/components/ui";
import { Box, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FiFile } from "react-icons/fi";

export const PreviewDocumentRequestModal = ({ documentPath }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Ver Documento de Solicitud'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='gray'
              css={{
                _icon: {
                  width: '5',
                  height: '5',
                },
              }}
            >
              <FiFile />
            </IconButton>
          </Tooltip>
        </Box>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    ></Modal>
  );
};

PreviewDocumentRequestModal.propTypes = {
  documentPath: PropTypes.string
}
