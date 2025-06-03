import { ControlledModal, Field, toaster } from "@/components/ui"
import { useDeleteModality } from "@/hooks/modalities/useDeleteModality";
import { Button, Flex, Stack, Text } from "@chakra-ui/react"

export const DeleteModality = ({ selectedMethod, setMethods, handleCloseModal, isDeleteModalOpen, setIsModalOpen }) => {
  const { mutateAsync: deleteModality, isPending: loading } = useDeleteModality();

  const handleDeleteMethod = () => {
    
    deleteModality(selectedMethod?.id, {
      onSuccess: () => {
        toaster.create({
          title: 'Modalidad eliminada correctamente',
          type: 'success',
        });
        setMethods(prev => prev.filter(method => method.id !== selectedMethod?.id));
        handleCloseModal('delete');
      },
      onError: (error) => {
        toaster.create({
          title: error.message || 'Error al eliminar la modalidad',
          type: 'error',
        });
      },
    });

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