import { Field, Modal, Tooltip } from '@/components/ui';
import { Box, IconButton, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiFile } from 'react-icons/fi';

export const ViewDocumentRequestModal = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <Modal
          trigger={
            <Box>
              <Tooltip
                content='Ver documento de solicitud'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='purple' size='xs'>
                  <FiFile />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title='Ver documento de solicitud'
          placement='center'
          size='5xl'
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          disabledSave={item.status === 3}
          onSave={() => {}}
          isSaving={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              w='full'
            >
              {item?.file_path ? (
                <Box w='full' h='600px'>
                  <iframe
                    src={item?.file_path}
                    width='100%'
                    height='100%'
                    title='Payment Voucher'
                    style={{ border: 'none' }}
                  />
                </Box>
              ) : (
                <Box
                  w='full'
                  h='600px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Text>No hay documento disponible.</Text>
                </Box>
              )}
            </Stack>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  );
};

ViewDocumentRequestModal.propTypes = {
  item: PropTypes.object,
};
