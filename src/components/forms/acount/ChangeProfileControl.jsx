import { Avatar } from '@/components/ui';
import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const ChangeProfileControl = ({
	profile,
	isChangesMade,
	handleUpdateProfile,
	loadingUpdate,
}) => {
	const isPasswordMismatch =
		profile.password &&
		profile.confirmPassword &&
		profile.password !== profile.confirmPassword;
	const isPasswordRequiredButEmpty =
		profile.password && !profile.confirmPassword;
	const isButtonDisabled =
		!isChangesMade || isPasswordMismatch || isPasswordRequiredButEmpty;

	return (
		<HStack justify='space-between' w='full'>
			<HStack>
				{profile?.full_name && (
					<Avatar name={profile.full_name} shape='rounded' size='xl' />
				)}

				<Stack gap='0'>
					<Text fontWeight='medium'>{profile.full_name}</Text>
				</Stack>
			</HStack>

			<Stack spacing={1} align='end'>
				<Button
					size='sm'
					onClick={!isButtonDisabled ? handleUpdateProfile : undefined}
					isLoading={loadingUpdate}
					bg={isButtonDisabled ? 'gray.300' : 'uni.secondary'}
					color={isButtonDisabled ? 'gray.600' : 'white'}
					w={{ base: 'full', sm: 'auto' }}
					alignSelf='flex-start'
					isDisabled={isButtonDisabled}
					_hover={isButtonDisabled ? { bg: 'gray.300' } : {}}
					_active={isButtonDisabled ? { bg: 'gray.300' } : {}}
					cursor={isButtonDisabled ? 'not-allowed' : 'pointer'}
				>
					Guardar Cambios
				</Button>

				{isPasswordMismatch && (
					<Text fontSize='xs' color='red.500'>
						Las contraseñas no coinciden
					</Text>
				)}
			</Stack>
		</HStack>
	);
};

ChangeProfileControl.propTypes = {
	profile: PropTypes.object.isRequired,
	isChangesMade: PropTypes.bool.isRequired,
	handleUpdateProfile: PropTypes.func.isRequired,
	loadingUpdate: PropTypes.bool,
};
