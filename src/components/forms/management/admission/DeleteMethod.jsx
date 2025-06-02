import { ControlledModal, Field } from "@/components/ui"
import { Button, Flex, Stack, Text } from "@chakra-ui/react"

export const DeleteMethodModal = ({ selectedMethod, setMethods, handleCloseModal, isDeleteModalOpen, setIsModalOpen }) => {
  const handleDeleteMethod = () => {
    setMethods(prev => prev.filter(method => method.id !== selectedMethod?.id));
    handleCloseModal('delete');
  }

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
      >
        <ControlledModal
          title='Eliminar Modalidad'
          placement='center'
          size='xl'
          open={isDeleteModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, delete: e.open }))}
          hiddenFooter={true}
        >
          <Text>¿Quieres eliminar la modalidad {selectedMethod?.name}?</Text>
          <Flex justify='end' mt='6' gap='2'>
            <Button
              variant='outline'
              colorPalette='red'
              onClick={() =>
                setIsModalOpen((s) => ({ ...s, delete: false }))
              }
            >
              Cancelar
            </Button>
            <Button onClick={handleDeleteMethod} bg='uni.secondary' color='white'>
              Eliminar
            </Button>
          </Flex>
        </ControlledModal>
      </Field>
    </Stack>
  )
}