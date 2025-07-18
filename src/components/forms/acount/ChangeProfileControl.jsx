import { Avatar } from '@/components/ui';
import { Badge, Box, Button, Card, Flex, HStack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const ChangeProfileControl = ({
	profile,
	isChangesMade,
	handleUpdateProfile,
	loadingUpdate,
	disableUpload,
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
		<Card.Root>
			<Card.Body pt={6}>
				<Flex align='center' gap={6} wrap='wrap'>
					<Avatar
						name={profile.first_name}
						shape='rounded'
						size='2xl'
						rounded={'full'}
					/>

					<Box flex='1'>
						{profile.full_name && (
							<Text fontSize='2xl' fontWeight='bold'>
								{profile.full_name}
							</Text>
						)}
						{!profile.full_name && (
							<Text fontSize='2xl' fontWeight='bold'>
								{profile.first_name} {profile.paternal_surname}{' '}
								{profile.maternal_surname}
							</Text>
						)}
						{profile.type_document_name && (
							<Text fontSize='sm' color='gray.500'>
								{profile.type_document_name}: {profile.document_number}
							</Text>
						)}

						{profile.nationality_name && (
							<HStack mt={2} gap={3}>
								<Badge colorPalette='purple'>{profile.nationality_name}</Badge>
								<Badge colorPalette={profile.has_disability ? 'red' : 'green'}>
									{profile.has_disability
										? 'Con discapacidad'
										: 'Sin discapacidad'}
								</Badge>
							</HStack>
						)}
					</Box>

					<HStack gap={2}>
						<Button
							size='sm'
							onClick={handleUpdateProfile}
							isLoading={loadingUpdate}
							bg={
								isButtonDisabled || disableUpload ? 'gray.300' : 'uni.secondary'
							}
							color={isButtonDisabled || disableUpload ? 'gray.600' : 'white'}
							w={{ base: 'full', sm: 'auto' }}
							alignSelf={{ base: 'stretch', md: 'flex-start' }}
							disabled={isButtonDisabled || disableUpload}
							_hover={
								isButtonDisabled || disableUpload ? { bg: 'gray.300' } : {}
							}
							_active={
								isButtonDisabled || disableUpload ? { bg: 'gray.300' } : {}
							}
							cursor={
								isButtonDisabled || disableUpload ? 'not-allowed' : 'pointer'
							}
						>
							Guardar Cambios
						</Button>

						{isPasswordMismatch && (
							<Text fontSize='xs' color='red.500'>
								Las contraseñas no coinciden
							</Text>
						)}
					</HStack>
				</Flex>
			</Card.Body>
		</Card.Root>
	);
};

ChangeProfileControl.propTypes = {
	profile: PropTypes.object.isRequired,
	isChangesMade: PropTypes.bool.isRequired,
	handleUpdateProfile: PropTypes.func.isRequired,
	loadingUpdate: PropTypes.bool,
	disableUpload: PropTypes.bool,
};
