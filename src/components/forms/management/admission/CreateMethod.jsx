import { Field, Button, ControlledModal } from "@/components/ui"
import { HStack, Input, Stack, Text } from "@chakra-ui/react"
import { HiPlus } from "react-icons/hi2"

export const CreateMethod = ({ handleOpenModal, isCreateModalOpen, setIsModalOpen, handleCloseModal }) => {
  const handleCreateMethod = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;
    console.log(elements);

    handleCloseModal('create');
  }

  return (
    <>
      <HStack w="full" justify="flex-end">
        <Button fontSize='16px' minWidth='150px' color='white' background='#711610' borderRadius={8} onClick={() => handleOpenModal('create')}>
          <HiPlus size={12} /> Crear modalidad
        </Button>
      </HStack>

      <Stack css={{ '--field-label-width': '140px' }}>
        <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
          <ControlledModal
            title='Crear Modalidad'
            placement='center'
            size='xl'
            open={isCreateModalOpen}
            onOpenChange={e => setIsModalOpen(s => ({ ...s, create: e.open }))}
            hiddenFooter={true}
          >
            <Stack>
              <form onSubmit={(e) => handleCreateMethod(e)}>
                <Field label='Nombre de la modalidad' helperText='Ingrese el nombre de la modalidad de admisión'>
                  <Input required type="text" name="name" placeholder='Ingrese nombres y apellidos' />
                </Field>
              </form>
            </Stack>
          </ControlledModal>
        </Field>
      </Stack>
    </>
  )
}