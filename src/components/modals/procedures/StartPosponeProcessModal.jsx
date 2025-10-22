import PropTypes from 'prop-types';
import { Button, Modal } from '@/components/ui';
import { Stack, Card, Text, Box, Flex, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { LuCircleAlert } from 'react-icons/lu';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

export const StartPosponeProcessModal = ({
  enrollment,
  onStartEnrollment,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      placement='center'
      trigger={
        <Button
          bg='transparent'
          disabled={enrollment.status === 5}
          color='blue.600'
          size='sm'
          _hover={{
            color: 'blue.800',
          }}
          ml={4}
        >
          Iniciar Proceso
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='2xl'
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
        <Card.Root py={4}>
          <Card.Header>
            <Text fontSize='xl' fontWeight='semibold' textAlign={'center'}>
              Proceso de Postergación de Matrícula
            </Text>
          </Card.Header>
          <Card.Body spaceY={3}>
            <Text fontSize='sm' color='gray.600' textAlign={'justify'}>
              Estás a punto de iniciar el proceso de <strong>postergación de matrícula</strong> para el programa{' '}
              <strong>{enrollment.program_name}</strong>.
            </Text>
            
            {/* Información importante sobre postergación */}
            <Box
              borderRadius='md'
              p={4}
              mb={4}
              bg={'amber.50'}
              border={'1px solid'}
              borderColor={'amber.200'}
            >
              <Flex align='center' mb={2} gap={2} color={'amber.700'}>
                <Icon as={FiInfo} boxSize={5} />
                <Text fontSize='sm' fontWeight='semibold'>
                  Información importante
                </Text>
              </Flex>
              <Text fontSize='xs' color='amber.700'>
                La postergación te permite suspender temporalmente tu matrícula. 
                Recuerda que <strong>tienes 5 años máximo</strong> para completar tu programa 
                desde tu ingreso inicial.
              </Text>
            </Box>

            <Box
              borderRadius='xl'
              p={{ base: 6, md: 8 }}
              mb={8}
              bg={'blue.100'}
            >
              <Flex
                align='center'
                mb={2}
                gap={2}
                color={'blue.600'}
                fontSize={16}
                fontWeight={'semibold'}
              >
                <Icon as={LuCircleAlert} boxSize={8} /> Proceso de Postergación
              </Flex>
              <Stack as='ol' gap={2} pb={8}>
                <Text fontSize='sm' color='blue.900'>
                  <strong>1.</strong> El sistema evaluará si tienes deudas pendientes
                </Text>
                <Text fontSize='sm' color='blue.900'>
                  <strong>2.</strong> Se verificará el tiempo transcurrido desde tu ingreso
                </Text>
                <Text fontSize='sm' color='blue.900'>
                  <strong>3.</strong> Si cumples los requisitos, tu estado cambiará a &quot;Estudiante postergó su matrícula siguiente&quot;
                </Text>
                <Text fontSize='sm' color='blue.900'>
                  <strong>4.</strong> Podrás solicitar reincorporación cuando desees continuar
                </Text>
              </Stack>

              {/* Advertencias según el flujo */}
              <Box
                borderRadius='md'
                p={3}
                mb={4}
                bg={'red.50'}
                border={'1px solid'}
                borderColor={'red.200'}
              >
                <Flex align='center' mb={2} gap={2} color={'red.600'}>
                  <Icon as={FiAlertTriangle} boxSize={4} />
                  <Text fontSize='xs' fontWeight='semibold'>
                    Condiciones importantes
                  </Text>
                </Flex>
                <Text fontSize='xs' color='red.600'>
                  • Si tienes deudas pendientes, no podrás postergar<br/>
                  • Si han pasado más de 5 años desde tu ingreso, serás separado del programa<br/>
                  • La postergación puede afectar tu cronograma académico
                </Text>
              </Box>

              <Flex justify={'end'}>
                <Button
                  bg='#0661D8'
                  _hover={{ bg: '#0550B8' }}
                  onClick={() => {
                    onStartEnrollment(enrollment);
                    setOpen(false);
                  }}
                >
                  Continuar con postergación
                </Button>
              </Flex>
            </Box>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};

StartPosponeProcessModal.propTypes = {
  enrollment: PropTypes.object.isRequired,
  onStartEnrollment: PropTypes.func.isRequired,
};
