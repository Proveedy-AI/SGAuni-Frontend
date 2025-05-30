import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Field, FileInput, FileUploadRoot } from '@/components/ui';

export const ChangeDataProfileForm = ({ user, profile, updateProfileField }) => {

  return (
   <Grid w='full' templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap='6'>
      <Box minW='50%'>
        <Stack css={{ '--field-label-width': '140px' }}>
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Nombre y Apellidos:'
          >
            <Input
              value={profile.fullname}
              onChange={(e) => updateProfileField('fullname', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Correo electrónico:'
          >
            <Input
              value={profile.email}
              onChange={(e) => updateProfileField('email', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Nro. de documento de identidad:'
          >
            <Input
              value={profile.numDoc}
              onChange={(e) => updateProfileField('numDoc', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>
        </Stack>

        <Stack css={{ '--field-label-width': '140px' }}>
          {/* País */}
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='País:'
          >
            <Input
              value={profile.country.label || user.country.name}
              onChange={(e) => updateProfileField('country', { label: e.target.value, value: profile.country.value })}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          {/* Correo institucional */}
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Correo institucional:'
          >
            <Input
              value={profile.uniEmail}
              onChange={(e) => updateProfileField('uniEmail', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          {/* Categoría */}
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Categoría:'
          >
            <Input
              value={profile.category}
              onChange={(e) => updateProfileField('category', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          {/* Estado */}
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Estado:'
          >
              <Flex w='full' align='start' gap='2' wrap='wrap'>
              <Badge
                bg={{
                  base: 'uni.200',
                  _dark: 'uni.gray.300',
                }}
              >
                {profile.status ? 'Activo' : 'Inactivo'}
              </Badge>
            </Flex>
          </Field>
        </Stack>
      </Box>

      <Box minW='50%'>
        <Stack css={{ '--field-label-width': '140px' }}>
          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Teléfono:'
          >
            <Input
              value={profile.phoneNumber}
              onChange={(e) => updateProfileField('phoneNumber', e.target.value)}
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>

          <Field 
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='CV:'
          >
            {
              !profile.pathCv
                ? (
                  <FileUploadRoot>
                    <FileInput
                      accept='.pdf'
                      size='sm'
                      placeholder='Selecciona tu CV'
                      onChange={ e => console.log(e) }
                    />
                  </FileUploadRoot>
                )
                : (
                  <Flex gap={2} justify="flex-start">
                    <Button
                      size='xs'
                      colorScheme='blue'
                      as='a'
                      href={profile.pathCv || '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Ver CV
                    </Button>
                    <Button
                      size='xs'
                      colorScheme='red'
                      onClick={() => updateProfileField('pathCv', '')}
                    >
                      Quitar CV
                    </Button>
                  </Flex>
                )
            }
          </Field>

          <Field 
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Contrato:'
          >
            {
              !profile.pathContract
                ? (
                  <FileUploadRoot>
                    <FileInput
                      accept='.pdf'
                      size='sm'
                      placeholder='Selecciona tu contrato'
                      onChange={ e => console.log(e) }
                    />
                  </FileUploadRoot>
                )
                : (
                  <Flex gap={2} justify="flex-start">
                    <Button
                      size='xs'
                      colorScheme='blue'
                      as='a'
                      href={profile.pathContract || '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Ver Contrato
                    </Button>
                    <Button
                      size='xs'
                      colorScheme='red'
                      onClick={() => updateProfileField('pathContract', '')}
                    >
                      Quitar Contrato
                    </Button>
                  </Flex>
                )
            }
          </Field>

          <Field
            orientation={{
              base: 'vertical',
              sm: 'horizontal',
            }}
            label='Fecha de Expiración:'
          >
            <Input
              value={profile.contractExpiresAt ? new Date(profile.contractExpiresAt).toLocaleDateString() : ''}
              readOnly
              variant='flushed'
              flex='1'
              size='sm'
            />
          </Field>
        </Stack>
      </Box>
      <Stack css={{ '--field-label-width': '140px' }}>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Roles asignados:'
        >
          <Flex w='full' align='start' gap='2' wrap='wrap'>
            {profile.roles.length > 0 ? (
              profile.roles.map((role, index) => (
                <Badge
                  key={index}
                  bg={{
                    base: 'uni.200',
                    _dark: 'uni.gray.300',
                  }}
                >
                  {role.name}
                </Badge>
              ))
            ) : (
              <Text fontSize='sm' color='gray.500'>
                Sin roles asignados
              </Text>
            )}
          </Flex>
        </Field>
      </Stack>
    </Grid>
  );
};
