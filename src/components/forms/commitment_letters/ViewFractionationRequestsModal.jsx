import PropTypes from 'prop-types';
import { Field, InputGroup, ModalSimple, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Badge, Box, Card, Icon, IconButton, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { HiEye } from 'react-icons/hi2';
import { FiFile, FiCalendar, FiDollarSign, FiBook, FiUser, FiHash, FiAtSign, FiPhone } from 'react-icons/fi';

export const ViewFractionationRequestsModal = ({ item, matchStatus }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  return (
    <ModalSimple
      title='Vista previa de la solicitud'
      placement='center'
      size='2xl'
      trigger={
        <Box>
          <Tooltip
            content='Vista previa de la solicitud'
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
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
      hiddenFooter={true}
    >
      <Stack
        gap={2}
        pb={6}
        maxH={{ base: 'full', md: '65vh' }}
        overflowY='auto'
        sx={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.300',
            borderRadius: 'full',
          },
        }}
      >
        <Card.Root>
          <Card.Header>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='lg'
              color='blue.600'
            >
              <Icon as={FiFile} boxSize={5} />
              Información de la solicitud
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              <Field label='Fecha de solicitud:'>
                <InputGroup w='100%' flex='1' startElement={<FiCalendar />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.request_date} />
                </InputGroup>
              </Field>
              <Field label='Estado:'>
                <Badge
                  bg={matchStatus?.bg}
                  color={matchStatus?.color}
                >
                  {matchStatus?.label || 'N/A'}
                </Badge>
              </Field>
              <Field label='Monto:'>
                <InputGroup w='100%' flex='1' startElement={<FiDollarSign />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.amount} />
                </InputGroup>
              </Field>
              <Field label='Programa:'>
                <InputGroup w='100%' flex='1' startElement={<FiBook />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.program_name} />
                </InputGroup>
              </Field>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        <Card.Root>
           <Card.Header>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='lg'
              color='green.600'
            >
              <Icon as={FiUser} boxSize={5} />
              Información del solicitante
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              <Field label='Nombre completo:'>
                <InputGroup w='100%' flex='1' startElement={<FiUser />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.applicant_name} />
                </InputGroup>
              </Field>
              <Field label='Número de documento:'>
                <InputGroup w='100%' flex='1' startElement={<FiHash />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.document_num} />
                </InputGroup>
              </Field>
              <Field label='Correo electrónico:'>
                <InputGroup w='100%' flex='1' startElement={<FiAtSign />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.email} />
                </InputGroup>
              </Field>
              <Field label='Número de teléfono:'>
                <InputGroup w='100%' flex='1' startElement={<FiPhone />}>
                  <Input readOnly  ml='1' variant='flushed' value={item.phone_number} />
                </InputGroup>
              </Field>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </Stack>
    </ModalSimple>
  );
  };
  
ViewFractionationRequestsModal.propTypes = {
  item: PropTypes.object,
  matchStatus: PropTypes.object,
};