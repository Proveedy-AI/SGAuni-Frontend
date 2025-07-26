import PropTypes from 'prop-types';
import { Field, InputGroup, ModalSimple, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Badge, Box, Card, Icon, IconButton, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { HiEye } from 'react-icons/hi2';
import { FiFile, FiCalendar, FiDollarSign, FiBook, FiUser, FiHash, FiPercent } from 'react-icons/fi';

export const ViewFractionationRequestsModal = ({ item, matchStatus }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  return (
    <ModalSimple
      title='Vista previa de la solicitud'
      placement='center'
      size='5xl'
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
          <Card.Header pb={2}>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='xl'
              color='blue.700'
              fontWeight="bold"
            >
              <Icon as={FiFile} boxSize={6} />
              Información de la solicitud
            </Card.Title>
          </Card.Header>
          <Card.Body pt={4}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={3}>
              <Field label='Periodo de matrícula:'>
                <InputGroup w='100%' startElement={<FiCalendar color="#3182ce" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.enrollment_name} />
                </InputGroup>
              </Field>
              <Field label='Tipo de plan:'>
                <InputGroup w='100%' startElement={<FiBook color="#3182ce" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.plan_type_display} />
                </InputGroup>
              </Field>
              <Field label='Monto total:'>
                <InputGroup w='100%' startElement={<FiDollarSign color="#38a169" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.total_amount} />
                </InputGroup>
              </Field>
              <Field label='Amortización total:'>
                <InputGroup w='100%' startElement={<FiDollarSign color="#38a169" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.total_amortization} />
                </InputGroup>
              </Field>
              <Field label='Saldo total:'>
                <InputGroup w='100%' startElement={<FiDollarSign color="#e53e3e" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.total_balance} />
                </InputGroup>
              </Field>
              <Field label='Porcentaje de cuota inicial:'>
                <InputGroup w='100%' startElement={<FiPercent color="#805ad5" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.upfront_percentage} />
                </InputGroup>
              </Field>
              <Field label='N° de cuotas:'>
                <InputGroup w='100%' startElement={<FiHash color="#2b6cb0" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.number_of_installments} />
                </InputGroup>
              </Field>
              <Field label='Tipo de documento de pago:'>
                <InputGroup w='100%' startElement={<FiFile color="#718096" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.payment_document_type_display} />
                </InputGroup>
              </Field>
              <Field label='Estado:'>
                <Badge
                  bg={matchStatus?.bg || 'gray.200'}
                  color={matchStatus?.color || 'gray.800'}
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontWeight="semibold"
                  fontSize="md"
                  boxShadow="sm"
                >
                  {matchStatus?.label || 'N/A'}
                </Badge>
              </Field>
            </SimpleGrid>
            {/* <Field pt={4} label='Comentarios adicionales:' >
              <InputGroup w='100%' startElement={<FiFile color="#718096" />}>
                <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.additional_comments} />
              </InputGroup>
            </Field> */}
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header pb={2}>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='xl'
              color='green.700'
              fontWeight="bold"
            >
              <Icon as={FiUser} boxSize={6} />
              Información del solicitante
            </Card.Title>
          </Card.Header>
          <Card.Body pt={4}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5}>
              <Field label='Número de documento:'>
                <InputGroup w='100%' flex='1' startElement={<FiHash color="#2b6cb0" />}>
                  <Input readOnly ml='1' variant='filled' bg="gray.50" value={item.num_document_person} />
                </InputGroup>
              </Field>
              {/* Puedes agregar más campos de persona si están disponibles */}
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