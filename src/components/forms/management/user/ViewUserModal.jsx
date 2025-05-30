import { ControlledModal, Field } from "@/components/ui"
import { useReadUserById } from "@/hooks/users/useReadUserById";
import { Flex, Stack, Text } from "@chakra-ui/react"
import { useEffect } from "react";

export const ViewUserModal = ({ selectedUser, isViewModalOpen, setIsModalOpen, handleCloseModal}) => {

  const {
    data: dataUser,
    refetch: fetchUser,
  } = useReadUserById({ id: selectedUser?.id, enabled: false });

  useEffect(() => {
    if (isViewModalOpen && selectedUser?.id) {
      fetchUser();
    }
  }, [isViewModalOpen, selectedUser?.id, fetchUser]);

  if (!selectedUser) return null;

  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
      >
        <ControlledModal
          title='Ver Usuario'
          placement='center'
          size='xl'
          open={isViewModalOpen}
          onOpenChange={e => setIsModalOpen(s => ({ ...s, view: e.open }))}
          onSave={() => handleCloseModal('view')}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack>
              <Flex gap={6} flexDir={{ base: 'column', md: 'row' }}>
                <Stack flex={1} spacing={4}>
                  <Field label='Nombres y apellidos'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.full_name || `${dataUser?.first_name || ''} ${dataUser?.last_name || ''}` }</Text>
                  </Field>
                  <Field label='Usuario'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.username }</Text>
                  </Field>
                  <Field label='Correo Institucional'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.uni_email }</Text>
                  </Field>
                  <Field label='Número de documento'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.num_doc }</Text>
                  </Field>
                  <Field label='Teléfono'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.phone }</Text>
                  </Field>
                  <Field label='Categoría'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.category }</Text>
                  </Field>
                </Stack>
                <Stack flex={1} spacing={4}>
                  <Field label='CV'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                      isTruncated
                    >{ dataUser?.path_cv }</Text>
                  </Field>
                  <Field label='Grado'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                      isTruncated
                    >{ dataUser?.path_grade }</Text>
                  </Field>
                  <Field label='Activo'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.user?.is_active ? 'Sí' : 'No' }</Text>
                  </Field>
                  <Field label='Fecha de creación'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.created_at?.slice(0, 19).replace('T', ' ') }</Text>
                  </Field>
                  <Field label='Fecha de actualización'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.updated_at?.slice(0, 19).replace('T', ' ') }</Text>
                  </Field>
                  <Field label='Fecha de eliminación'>
                    <Text
                      w='full'
                      py={2}
                      px={3}
                      border={'1px solid #E2E8F0'}
                      borderRadius='md'
                    >{ dataUser?.deleted_at?.slice(0, 19).replace('T', ' ') }</Text>
                  </Field>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </ControlledModal>
      </Field>
    </Stack>
  )
}