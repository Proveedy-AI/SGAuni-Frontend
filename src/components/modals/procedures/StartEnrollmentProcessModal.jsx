import PropTypes from 'prop-types';
import { Button, Modal } from "@/components/ui"
import { Stack, Card, Text, Box, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react"
import { LuCircleAlert } from 'react-icons/lu';

export const StartEnrollmentProcessModal = ({ enrollment, onStartEnrollment }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      placement='center'
      trigger={
        <Button
          bg="transparent"
          color="blue.600"
          size="sm"
          _hover={{
            color: "blue.800",
          }}
          ml={4}
        >
          Iniciar matrícula
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
            <Text fontSize='xl' fontWeight='semibold' textAlign={'center'}>Proceso de Matrícula</Text>
          </Card.Header>
          <Card.Body spaceY={3}>
            <Text fontSize='sm' color='gray.600' textAlign={'justify'}>
              Estás a punto de iniciar el proceso de matrícula para el programa <strong>{enrollment.program_name}</strong>.
            </Text>
            <Box
              borderRadius="xl"
              p={{ base: 6, md: 8 }}
              mb={8}
              bg={'blue.100'}
            >
              <Flex align="center" mb={2} gap={2} color={"blue.600"} fontSize={16} fontWeight={'semibold'}>
                <Icon as={LuCircleAlert} boxSize={8} /> Pasos a seguir
              </Flex>
              <Stack as="ol" gap={1} pb={8}>
                <Text fontSize="sm" color="blue.900">
                  1. Selecciona los cursos correspondientes al ciclo.
                </Text>
                <Text fontSize="sm" color="blue.900">
                  2. Verifica el horario final y continúa el proceso.
                </Text>
                <Text fontSize="sm" color="blue.900">
                  3. Revisa el resumen para verificar los créditos y el monto total de tu selección.
                </Text>
                <Text fontSize="sm" color="blue.900">
                  4. Selecciona procesar matrícula y finalizará el proceso.
                </Text>
              </Stack>
              <Flex justify={'end'}>
                <Button
                  bg="#0661D8"
                  _hover={{ bg: "#0550B8" }}
                  onClick={() => {
                    onStartEnrollment(enrollment.id);
                    setOpen(false);
                  }}
                >
                  Iniciar proceso de matrícula
                </Button>
              </Flex>
            </Box>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  )
}

StartEnrollmentProcessModal.propTypes = {
  enrollment: PropTypes.object.isRequired,
  onStartEnrollment: PropTypes.func.isRequired,
};
