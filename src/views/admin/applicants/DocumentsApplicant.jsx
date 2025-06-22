import { Box, Heading, Stack } from '@chakra-ui/react';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';

export const DocumentsApplicant = () => {
	const { data: dataUser } = useReadUserLogged();

	const item = EncryptedStorage.load('selectedApplicant');

	console.log(item)
	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
			mb={10}
			mt={1}
		>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'center' }}
				justify='space-between'
				mb={5}
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
					}}
					color={'gray.500'}
				>
					Subir Documentos requeridos
				</Heading>
			</Stack>
		</Box>
	);
};
