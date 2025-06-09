import { Outlet, useLocation } from 'react-router';
import { Box, Flex } from '@chakra-ui/react';

export const AuthLayout = () => {
	const location = useLocation();

	let bgImage = '';
	if (location.pathname === '/auth/login') {
		bgImage = "url('/img/bg-admin.png')";
	} else {
		bgImage = "url('/img/bg-admin.png')";
	}
	return (
		<Box
			height='100svh'
			position='relative'
			bg={'uni.gray.200'}
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<Box
				position='absolute'
				top={0}
				left={0}
				width='full'
				height='full'
				bgImage={bgImage}
				backgroundSize='100%'
				backgroundPosition='center'
				zIndex={1}
			/>
			<Flex
				width='full'
				h='100svh'
				justifyContent={{ base: 'center', lg: 'flex-end' }}
				zIndex={4}
			>
				<Outlet />
			</Flex>
		</Box>
	);
};
