import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui";
import { Stack, Card, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { LuFileText } from 'react-icons/lu';
import { RegistrationDocument } from '@/components/pdf/RegistrationDocument';
import { FiDownload } from 'react-icons/fi';

export const GenerateRegistrationPdfModal = ({ loading, registration_info }) => {
  const [open, setOpen] = useState(false);


  return (
    <Modal
      title="Boleta de Matrícula"
      placement='center'
      trigger={
        <Button
          variant='outline'
          colorPalette='blue'
          leftIcon={<Icon as={LuFileText} />}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <FiDownload />Descargar Boleta
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root py={4}>
          <Card.Header></Card.Header>
          <Card.Body spaceY={4}>
            <RegistrationDocument registration_info={registration_info} />
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};

GenerateRegistrationPdfModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  registration_info: PropTypes.object.isRequired
}
