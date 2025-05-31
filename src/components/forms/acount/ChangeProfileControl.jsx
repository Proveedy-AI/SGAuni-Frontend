import { Avatar, useContrastingColor, } from "@/components/ui"
import { Button, HStack, Stack, Text } from '@chakra-ui/react';

export const ChangeProfileControl = ({ profile, isChangesMade, handleUpdateProfile, loadingUpdate }) => {
	const { contrast } = useContrastingColor();

  return (
    <HStack justify='space-between' w='full'>
      <HStack>
        <Avatar bgColor={profile.color} color={contrast(profile.color)} name={profile.full_name} shape='rounded' size='xl'
        />
        <Stack gap='0'>
          <Text fontWeight='medium'>{profile.full_name}</Text>
        </Stack>
      </HStack>
      <Button
        size='sm'
        onClick={isChangesMade ? handleUpdateProfile : undefined}
        isLoading={loadingUpdate}
        bg={isChangesMade ? 'uni.secondary' : 'gray.300'}
        color={isChangesMade ? 'white' : 'gray.600'}
        w={{ base: 'full', sm: 'auto' }}
        alignSelf="flex-start"
        isDisabled={!isChangesMade}
        _hover={isChangesMade ? {} : { bg: 'gray.300' }}
        _active={isChangesMade ? {} : { bg: 'gray.300' }}
        cursor={isChangesMade ? 'pointer' : 'not-allowed'}
      >
        Guardar Cambios
      </Button>
    </HStack>
  )
}