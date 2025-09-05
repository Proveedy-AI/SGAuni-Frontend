import { Field, Modal, Tooltip } from '@/components/ui';
import { Box, IconButton, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { HiEye } from 'react-icons/hi2';
import PropTypes from 'prop-types';

export const ViewTemplateDocs = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <Modal
          trigger={
            <Box>
              <Tooltip
                content='Ver plantilla del contrato'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='blue' size='xs'>
                  <HiEye />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title='Ver plantilla del contrato'
          placement='center'
          size='5xl'
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              w='full'
            >
              {data?.path_contract ? (
                <Box w='full' h='600px'>
                  <iframe
                    src={data?.path_contract}
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
                  <Text>No hay plantilla disponible.</Text>
                </Box>
              )}
            </Stack>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  );
};

ViewTemplateDocs.propTypes = {
  data: PropTypes.object,
};
