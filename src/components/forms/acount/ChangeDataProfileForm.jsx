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

const FieldWithInputText = ({ label, field, value, updateProfileField }) => {
  if (!value || value.length === 0) return null;

  return (
    <Field
      orientation={{
        base: 'vertical',
        sm: 'horizontal',
      }}
      label={ label }
    >
      <Input
        value={value}
        onChange={(e) => updateProfileField(field, e.target.value)}
        variant='flushed'
        flex='1'
        size='sm'
      />
    </Field>
  )
}

export const ChangeDataProfileForm = ({ profile, updateProfileField }) => {

  return (
   <Grid w='full' templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap='6'>
      <Box minW='50%'>
        <Stack css={{ '--field-label-width': '140px' }}>
          <FieldWithInputText label='Nombres:' field='first_name' value={profile.first_name} updateProfileField={updateProfileField} /> 

          <FieldWithInputText label='Apellidos:' field='last_name' value={profile.last_name} updateProfileField={updateProfileField} /> 
          
          {/* <FieldWithInputText label='Correo electrónico:' field='email' value={profile.email} updateProfileField={updateProfileField} /> */}
          
          <FieldWithInputText label='Nro. de documento de identidad:' field='num_doc' value={profile.num_doc} updateProfileField={updateProfileField} />
          
          {/* <FieldWithInputText label='País:' field='country' value={profile.country.label || user.country.name} updateProfileField={updateProfileField} /> */}
          
          <FieldWithInputText label='Correo institucional:' field='uni_email' value={profile.uni_email}  updateProfileField={updateProfileField} />
          
          <FieldWithInputText label='Categoría:' field='category' value={profile.category} updateProfileField={updateProfileField} />
        </Stack>
        {/* 
        <Stack css={{ '--field-label-width': '140px' }}>
          
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
        */}
      </Box> 

      <Box minW='50%'>
        <Stack css={{ '--field-label-width': '140px' }}>
    
          <FieldWithInputText label='Teléfono:' field='phone' value={profile.phone} updateProfileField={updateProfileField} />

          <Field orientation={{ base: 'vertical', sm: 'horizontal', }} label='CV:'>
            {
              !profile.path_cv
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
                      href={profile.path_cv || '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Ver CV
                    </Button>
                    <Button
                      size='xs'
                      colorScheme='red'
                      onClick={() => updateProfileField('path_cv', '')}
                    >
                      Quitar CV
                    </Button>
                  </Flex>
                )
            }
          </Field>

          <Field orientation={{ base: 'vertical', sm: 'horizontal', }} label='Contrato:'>
            {
              !profile.path_grade
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
                      href={profile.path_grade || '#'}
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
