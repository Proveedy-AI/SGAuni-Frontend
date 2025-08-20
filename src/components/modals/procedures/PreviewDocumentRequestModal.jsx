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
    >
      <Box w="100%" h="80vh">
        <iframe
          src={documentPath}
          title="Documento de Solicitud"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </Box>
    </Modal>
  );
};

PreviewDocumentRequestModal.propTypes = {
  documentPath: PropTypes.string
}
