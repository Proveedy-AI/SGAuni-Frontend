import { Button, Field, Modal, PasswordInput } from "@/components/ui"
import { Stack, Text } from "@chakra-ui/react"

export const ChangePasswordForm = ({ isOpen, setIsOpen, handleChangePassword, loadingPassword, passwords, updatePasswordField}) => {
  return (
    <Stack css={{ '--field-label-width': '140px' }}>
      <Field
        orientation={{ base: 'vertical', sm: 'horizontal' }}
        label='Contraseña:'
      >
        <Modal
          title='Cambiar contraseña'
          placement='center'
          size='xl'
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          trigger={
            <Button
              onClick={() => setIsOpen(true)}
              bg='uni.secondary'
              color='white'
              size='xs'
              w={{ base: 'full', sm: 'auto' }}
              alignSelf="flex-start"
            >
              Cambiar contraseña
            </Button>
          }
          onSave={handleChangePassword}
          loading={loadingPassword}
        >
          <Stack>
            <Text>
              Asegúrate de crear una contraseña larga e incluir caracteres
              especiales para reforzar la seguridad.
            </Text>
            <Field label='Contraseña actual:'>
              <PasswordInput
                value={passwords.currentPassword}
                onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                size='xs'
              />
            </Field>
            <Field
              label='Nueva contraseña:'
              invalid={
                passwords.newPassword !== passwords.confirmPassword && passwords.confirmPassword !== ''
              }
              errorText='Las contraseñas no coinciden.'
            >
              <PasswordInput
                value={passwords.newPassword}
                onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                size='xs'
              />
            </Field>
            <Field
              label='Confirmar contraseña:'
              invalid={
                passwords.newPassword !== passwords.confirmPassword && passwords.confirmPassword !== ''
              }
              errorText='Las contraseñas no coinciden.'
            >
              <PasswordInput
                value={passwords.confirmPassword}
                onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                size='xs'
              />
            </Field>
          </Stack>
        </Modal>
      </Field>
    </Stack>
  )
}