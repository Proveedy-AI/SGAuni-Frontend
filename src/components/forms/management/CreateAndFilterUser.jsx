import { Button, ControlledModal, Field, InputGroup } from "@/components/ui"
import { Flex, HStack, Input, Stack } from "@chakra-ui/react"
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2"

export const CreateAndFilterUser = ({ search, setSearch, handleOpenModal, isCreateModalOpen, setIsModalOpen, setUsers, handleCloseModal }) => {
  const handleCreateUser = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;
    const username = elements.namedItem('username');
    const email = elements.namedItem('email');
    if (!username.value || !email.value) return;

    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      username: username.value,
      email: email.value,
      isActive: true,
      role: []
    };
    setUsers(prev => [...prev, newUser]);
    handleCloseModal('create');
  }
  
  return (
    <>
      <HStack justify='space-between' w='full' flexWrap="wrap">
        <InputGroup minWidth='250px' w='2/5' endElement={ <HiMagnifyingGlass size={24} /> }>
          <Input
            background={{ base: 'white', _dark: 'gray.700' }}
            placeholder='Buscar usuario'
            value={search}
            onChange={e => setSearch(e.target.value)}
            border='none'
            _focus={{ border: 'none', boxShadow: 'none' }}
          />
        </InputGroup>
        <Button fontSize='16px' minWidth='150px' color='white' background='#711610' borderRadius={8} onClick={() => handleOpenModal('create')}>
          <HiPlus size={12} /> Crear usuario
        </Button>
      </HStack>

      <Stack css={{ '--field-label-width': '140px' }}>
        <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
          <ControlledModal
            title='Crear Usuario'
            placement='center'
            size='xl'
            open={isCreateModalOpen}
            onOpenChange={e => setIsModalOpen(s => ({ ...s, create: e.open }))}
            hiddenFooter={true}
          >
            <Stack>
              <form onSubmit={(e) => handleCreateUser(e)}>
                <Field label='Nombres y apellidos' helperText='Ingrese los nombres y apellidos del usuario'>
                  <Input required type="text" name="username" placeholder='Ingrese nombres y apellidos' />
                </Field>
                <Field label='Correo' helperText='Ingrese el correo electrónico del usuario'>
                  <Input required type="email" name="email" placeholder='Ingrese correo electrónico' />
                </Field>
                <Flex justify='end' mt='4' gap='2'>
                  <Button 
                    variant='outline' 
                    colorPalette='red' 
                    onClick={e => setIsModalOpen(s => ({ ...s, create: e.open }))}
                  >Cancelar</Button>
                  <Button type='submit' bg='uni.secondary' color='white'>Crear</Button>
                </Flex>
              </form>
            </Stack>
          </ControlledModal>
        </Field>
      </Stack>
    </>
  )
}