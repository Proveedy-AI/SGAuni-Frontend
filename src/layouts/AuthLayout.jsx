import { Outlet, useLocation } from 'react-router';
import { Box, Flex } from '@chakra-ui/react';

export const AuthLayout = () => {
	const location = useLocation();

	let bgImage = '';
	if (location.pathname === '/auth/login') {
		bgImage = "url('/img/bg-login.png')";
	} else {
		bgImage = "url('/img/bg-login.png')";
	}
	return (
		<Box
			height='100svh'
			position='relative'
			bg='white'
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<Box
				position='absolute'
        w="full"
        height='100dvh'
        backgroundSize="cover"
        bgRepeat='no-repeat'
				bgImage={{ base: null, xl: bgImage }}
				backgroundPosition='start'
				zIndex={1}
			/>
			<Flex
				width='full'
				h='100svh'
				justifyContent={{ base: 'center', xl: 'flex-end' }}
				zIndex={4}
			>
				<Outlet />
			</Flex>
		</Box>
	);
};
