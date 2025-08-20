
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Button,
  Text,
  Textarea,
  Flex,
  Icon,
  Card,
  Heading,
  SimpleGrid,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiAlertTriangle, FiCheckCircle, FiMessageSquare, FiXCircle } from 'react-icons/fi';

export const UpdateStatusRequestModal = ({ data, fetchData }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null); // 2: Aprobado, 3: Rechazado
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  const validateFields = () => {
    const newErrors = {};
    if (selectedStatus === 3 && !comments.trim()) {
      newErrors.comments = 'El comentario es requerido para rechazar.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitStatus = async () => {
    if (!validateFields()) return;
    setIsPending(true);
    // Simulación de API
    setTimeout(() => {
      toaster.create({
        title:
          selectedStatus === 2
            ? 'Solicitud aprobada correctamente'
            : 'Solicitud rechazada correctamente',
        type: 'success',
      });
      setOpen(false);
      setComments('');
      setSelectedStatus(null);
      setIsPending(false);
      fetchData && fetchData();
    }, 1200);
  };

  const handleOpenChange = (e) => {
    setOpen(e.open);
    if (!e.open) {
      setSelectedStatus(null);
      setComments('');
      setErrors({});
    }
  };

  return (
    <Modal
      placement='center'
      title={
        <>
          <HStack>
            <Icon as={FiCheckCircle} boxSize={5} />
            <Text fontWeight='medium'>Aprobar o Rechazar Solicitud de Traslado</Text>
          </HStack>
        </>
      }
      trigger={
        <Box>
          <Tooltip
            content='Aprobar / Rechazar'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='green'
              css={{ _icon: { width: '5', height: '5' } }}
            >
              <FiCheckCircle />
            </IconButton>
          </Tooltip>
        </Box>
      }
      size='2xl'
      loading={isPending}
      open={open}
      onOpenChange={handleOpenChange}
      contentRef={contentRef}
      onSave={handleSubmitStatus}
      hiddenFooter={!selectedStatus}
    >
      <Stack gap={2} pb={6} maxH='70vh' overflowY='auto'>
        <Card.Root>
          <Card.Header>
            <Heading fontSize='lg'>Selecciona una Acción</Heading>
          </Card.Header>
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              <Button
                variant='outline'
                size='lg'
                height='4rem'
                flexDirection='column'
                gap={2}
                disabled={isPending}
                bg={selectedStatus === 2 ? 'green.600' : 'transparent'}
                _hover={
                  selectedStatus === 2
                    ? { bg: 'green.700' }
                    : {
                        bg: 'green.50',
                        borderColor: 'green.300',
                        color: 'green.700',
                      }
                }
                color={selectedStatus === 2 ? 'white' : undefined}
                borderColor={selectedStatus === 2 ? 'green.600' : undefined}
                onClick={() => setSelectedStatus(2)}
              >
                <Icon as={FiCheckCircle} boxSize={5} />
                <Text fontWeight='medium'>Aprobar Solicitud</Text>
              </Button>

              <Button
                variant='outline'
                size='lg'
                height='4rem'
                flexDirection='column'
                gap={2}
                disabled={isPending}
                bg={selectedStatus === 3 ? 'red.600' : 'transparent'}
                _hover={
                  selectedStatus === 3
                    ? { bg: 'red.700' }
                    : { bg: 'red.50', borderColor: 'red.300', color: 'red.700' }
                }
                color={selectedStatus === 3 ? 'white' : undefined}
                borderColor={selectedStatus === 3 ? 'red.600' : undefined}
                onClick={() => setSelectedStatus(3)}
              >
                <Icon as={FiXCircle} boxSize={5} />
                <Text fontWeight='medium'>Rechazar Solicitud</Text>
              </Button>
            </SimpleGrid>

            {selectedStatus && (
              <Alert
                mt={6}
                status='info'
                bg={selectedStatus === 2 ? 'green.50' : 'red.50'}
                borderColor={selectedStatus === 2 ? 'green.200' : 'red.200'}
                borderWidth='1px'
                color={selectedStatus === 2 ? 'green.600' : 'red.600'}
                icon={<FiAlertTriangle boxSize={4} mr={2} />}
              >
                <Text color={selectedStatus === 2 ? 'green.800' : 'red.800'}>
                  {selectedStatus === 2
                    ? 'La solicitud será aprobada y se notificará automáticamente.'
                    : 'La solicitud será rechazada. Por favor, proporciona un comentario explicativo.'}
                </Text>
              </Alert>
            )}
          </Card.Body>
        </Card.Root>

        {selectedStatus === 3 && (
          <Card.Root borderLeft='4px solid' borderLeftColor='red.500'>
            <Card.Header>
              <Flex align='center' gap={2}>
                <Icon as={FiMessageSquare} boxSize={5} color='red.700' />
                <Heading fontSize='lg' color='red.700'>
                  Comentario de Rechazo
                </Heading>
                <Badge colorPalette='red' variant='solid' ml={2}>
                  Requerido
                </Badge>
              </Flex>
            </Card.Header>
            <Card.Body>
              <Box>
                <Heading fontSize='sm' fontWeight='medium' color='gray.700'>
                  Explica las razones del rechazo
                </Heading>
                <Textarea
                  minHeight='100px'
                  resize='none'
                  focusBorderColor='red.500'
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder='Describe las razones por las cuales la solicitud no puede ser aprobada...'
                  disabled={isPending}
                />
                {errors.comments && (
                  <Text fontSize='xs' color='red.500' mt={1}>
                    {errors.comments}
                  </Text>
                )}
                <Text fontSize='xs' color='gray.500' mt={1}>
                  Este comentario será visible para el solicitante.
                </Text>
              </Box>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>
    </Modal>
  );
};

UpdateStatusRequestModal.propTypes = {
  data: PropTypes.object,
  fetchData: PropTypes.func,
};