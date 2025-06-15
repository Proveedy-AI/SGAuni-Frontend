import { Avatar } from '@/components/ui';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
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
		<Flex
			w='full'
			flexDirection={{ base: 'column', md: 'row' }}
			justify='space-between'
			gap={4}
		>
			<Stack direction='row' align='center'>
				{profile?.first_name && (
					<Avatar name={profile.first_name} shape='rounded' size='xl' />
				)}

				<Stack gap='0'>
					<Text fontWeight='medium'>{profile?.first_name}</Text>
				</Stack>
			</Stack>

			<Stack spacing={1} align={{ base: 'stretch', md: 'flex-end' }}>
				<Button
					size='sm'
					onClick={!isButtonDisabled ? handleUpdateProfile : undefined}
					isLoading={loadingUpdate}
					bg={isButtonDisabled ? 'gray.300' : 'uni.secondary'}
					color={isButtonDisabled ? 'gray.600' : 'white'}
					w={{ base: 'full', sm: 'auto' }}
					alignSelf={{ base: 'stretch', md: 'flex-start' }}
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
		</Flex>
	);
};

ChangeProfileControl.propTypes = {
	profile: PropTypes.object.isRequired,
	isChangesMade: PropTypes.bool.isRequired,
	handleUpdateProfile: PropTypes.func.isRequired,
	loadingUpdate: PropTypes.bool,
};
