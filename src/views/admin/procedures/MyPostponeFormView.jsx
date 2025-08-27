import { EncryptedStorage } from "@/components/CrytoJS/EncryptedStorage";
import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { Button, Checkbox, toaster } from "@/components/ui";
import { 
  Box, 
  Card, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  Stack,
  Flex,
  Separator
} from "@chakra-ui/react";
import { useState } from "react";
import { 
  FiAlertTriangle, 
  FiInfo, 
  FiClock, 
  FiDollarSign, 
  FiUserX,
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi";
import { usePostponeEnrollment } from "@/hooks/enrollments";
import { useNavigate } from "react-router";

export const MyPostponeFormView = () => {
  // const { id } = useParams(); //id de la matrícula (enrollment)
	// const decoded = decodeURIComponent(id);
  const navigate = useNavigate();
  const { mutate: postponeEnrollment, isPending } = usePostponeEnrollment();

  const enrollment = EncryptedStorage.load('selectedEnrollmentProccess');

  const [hasReadTerms, setHasReadTerms] = useState(false);

  const handleConfirmPostponement = () => {
    if (hasReadTerms) {
      postponeEnrollment(enrollment?.uuid, {
        onSuccess: () => {
          toaster.create({
            title: "Éxito",
            description: "El proceso de postergación se ha confirmado.",
            type: "success",
          });
          navigate('/myprocedures/');
        },
        onError: () => {
          toaster.create({
            title: "Error",
            description: "Hubo un problema al confirmar la postergación. Intenta nuevamente.",
            type: "error",
          });
        }
      });
    }
  };

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
      <ResponsiveBreadcrumb
        items={[
          { label: 'Trámites', to: '/myprocedures' },
          {
            label: 'Proceso de Postergación',
            to: '/myprocedures/postpone-process',
          },
          { label: enrollment ? enrollment?.program_name : 'Cargando...' },
        ]}
      />

      <VStack spacing={6} align="stretch">
        
        {/* Información del proceso */}
        <Card.Root>
          <Card.Header>
            <HStack spacing={3}>
              <Icon as={FiInfo} boxSize={6} color="blue.500" />
              <Heading size="md" color="blue.700">
                ¿Qué es la postergación de matrícula?
              </Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Text color="gray.700" mb={4}>
              La postergación de matrícula te permite suspender temporalmente tus estudios. 
              Durante este período, no estarás inscrito en cursos pero mantienes tu condición 
              de estudiante en el programa.
            </Text>
            <HStack spacing={2} align="start">
              <Icon as={FiClock} color="orange.500" mt={1} />
              <Text fontSize="sm" color="gray.600">
                <strong>Importante:</strong> Tienes un máximo de 5 años desde tu ingreso 
                para completar todo tu programa académico.
              </Text>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Flujo del proceso */}
        <Card.Root>
          <Card.Header>
            <HStack spacing={3}>
              <Icon as={FiArrowRight} boxSize={6} color="purple.500" />
              <Heading size="md" color="purple.700">
                Flujo del Proceso de Postergación
              </Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <VStack spacing={4} align="stretch">
              
              {/* Paso 1: Verificación de deudas */}
              <Box p={4} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiDollarSign} color="orange.600" />
                  <Text fontWeight="bold" color="orange.700">
                    1. Verificación de Deudas
                  </Text>
                </HStack>
                <Text fontSize="sm" color="orange.700">
                  El sistema verificará si tienes deudas pendientes. 
                  <strong> Si tienes deudas, NO podrás postergar tu matrícula.</strong>
                </Text>
              </Box>

              {/* Paso 2: Verificación de tiempo */}
              <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiClock} color="blue.600" />
                  <Text fontWeight="bold" color="blue.700">
                    2. Verificación de Tiempo Transcurrido
                  </Text>
                </HStack>
                <Text fontSize="sm" color="blue.700">
                  Se evaluará si han pasado más de 5 años desde tu ingreso. 
                  <strong> Si es así, serás separado del programa automáticamente.</strong>
                </Text>
              </Box>

              {/* Paso 3: Cambio de estado */}
              <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiCheckCircle} color="green.600" />
                  <Text fontWeight="bold" color="green.700">
                    3. Cambio de Estado (Si cumples los requisitos)
                  </Text>
                </HStack>
                <Text fontSize="sm" color="green.700">
                  Tu estado cambiará a <strong>&quot;Estudiante postergó su matrícula siguiente&quot;</strong> 
                  y podrás hacer solo reserva de matrícula hasta por 2 semestres.
                </Text>
              </Box>

            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Advertencias importantes */}
        <Card.Root>
          <Card.Header>
            <HStack spacing={3}>
              <Icon as={FiAlertTriangle} boxSize={6} color="red.500" />
              <Heading size="md" color="red.700">
                Advertencias Importantes
              </Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <VStack spacing={4} align="stretch">
              
              <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiUserX} color="red.600" />
                  <Text fontWeight="bold" color="red.700">
                    Separación del Programa
                  </Text>
                </HStack>
                <Text fontSize="sm" color="red.700">
                  Si han transcurrido más de 5 años desde tu ingreso, ya no podrás reincorporarte 
                  y se te cambiará el estado a <strong>&quot;Separado de la Maestría/Doctorado&quot;</strong>.
                </Text>
              </Box>

              <Box p={4} bg="amber.50" borderRadius="md" border="1px solid" borderColor="amber.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiDollarSign} color="amber.600" />
                  <Text fontWeight="bold" color="amber.700">
                    Deudas Pendientes
                  </Text>
                </HStack>
                <Text fontSize="sm" color="amber.700">
                  No podrás postergar si tienes alguna deuda pendiente con la universidad. 
                  Debes regularizar todos los pagos antes de solicitar la postergación.
                </Text>
              </Box>

              <Box p={4} bg="purple.50" borderRadius="md" border="1px solid" borderColor="purple.200">
                <HStack spacing={3} mb={2}>
                  <Icon as={FiInfo} color="purple.600" />
                  <Text fontWeight="bold" color="purple.700">
                    Reincorporación Futura
                  </Text>
                </HStack>
                <Text fontSize="sm" color="purple.700">
                  Cuando desees volver a incorporarte, podrás solicitar la reincorporación 
                  a través de la plataforma. El proceso evaluará nuevamente tus condiciones.
                </Text>
              </Box>

            </VStack>
          </Card.Body>
        </Card.Root>

        <Separator />

        {/* Confirmación y términos */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="gray.700">
              Confirmación de Postergación
            </Heading>
          </Card.Header>
          <Card.Body>
            <VStack spacing={4} align="stretch">
              
              <Text color="gray.700">
                Al confirmar este proceso, declares que:
              </Text>

              <Stack spacing={2} pl={4}>
                <Text fontSize="sm" color="gray.600">
                  • Has leído y entendido todas las condiciones del proceso de postergación
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Comprendes que si tienes deudas pendientes, no podrás postergar
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Entiendes las limitaciones de tiempo (máximo 5 años desde el ingreso)
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Conoces las implicaciones de la separación automática por tiempo
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Aceptas que solo podrás hacer reserva de matrícula hasta por 2 semestres
                </Text>
              </Stack>

              <Box p={4} bg="gray.50" borderRadius="md">
                <Flex align="start" gap={3}>
                  <Checkbox
                    checked={hasReadTerms}
                    onChange={(e) => setHasReadTerms(e.target.checked)}
                    mt={1}
                  />
                  <Text fontSize="sm" color="gray.700">
                    Confirmo que he leído y acepto todas las condiciones mencionadas 
                    para el proceso de postergación de matrícula.
                  </Text>
                </Flex>
              </Box>

              <Flex justify="end" pt={4}>
                <Button
                  bg={hasReadTerms ? '#0661D8' : 'gray.400'}
                  color="white"
                  _hover={{ 
                    bg: hasReadTerms ? '#0550B8' : 'gray.400' 
                  }}
                  disabled={!hasReadTerms}
                  onClick={handleConfirmPostponement}
                  size="lg"
                  loading={isPending}
                  loadingText="Confirmando..."
                >
                  Confirmar Postergación de Matrícula
                </Button>
              </Flex>

            </VStack>
          </Card.Body>
        </Card.Root>

      </VStack>
    </Box>
  );
}