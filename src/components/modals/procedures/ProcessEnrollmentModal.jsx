import { Button, Modal } from "@/components/ui"
import { Stack, Card, Text, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react"
import { LuConstruction, LuClock } from 'react-icons/lu';

export const ProcessEnrollmentModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      placement='center'
      trigger={
        <Button colorScheme="blue">
          Procesar matrícula
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='lg'
      hiddenFooter={true}
    >
      <Stack
        gap={4}
        pb={6}
      >
        <Card.Root py={4}>
          <Card.Header>
            <Flex justify="center" mb={4}>
              <Icon as={LuConstruction} boxSize={12} color="orange.500" />
            </Flex>
            <Text fontSize='xl' fontWeight='semibold' textAlign={'center'} color="orange.600">
              Función en Desarrollo
            </Text>
          </Card.Header>
          <Card.Body spaceY={4}>
            
            <Flex 
              bg="orange.50" 
              p={4} 
              borderRadius="md" 
              border="1px" 
              borderColor="orange.200"
              align="center" 
              gap={3}
            >
              <Icon as={LuClock} color="orange.500" boxSize={5} />
              <Text fontSize="sm" color="orange.700">
                Estamos trabajando para completar su matrícula.
              </Text>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};
