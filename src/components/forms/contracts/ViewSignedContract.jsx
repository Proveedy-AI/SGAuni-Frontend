import { Field, Modal, Tooltip } from '@/components/ui';
import { Box, IconButton, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiFile } from 'react-icons/fi';

export const ViewSignedContract = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <Modal
          trigger={
            <Box>
              <Tooltip
                content='Ver contrato firmado'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='green' size='xs' disabled={!data?.is_signed}>
                  <FiFile />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title='Ver contrato firmado'
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
              {data?.path_contract_signed ? (
                <Box w='full' h='600px'>
                  <iframe
                    src={data?.path_contract_signed}
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
                  <Text>No hay contrato disponible.</Text>
                </Box>
              )}
            </Stack>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  );
};

ViewSignedContract.propTypes = {
  data: PropTypes.object,
};
