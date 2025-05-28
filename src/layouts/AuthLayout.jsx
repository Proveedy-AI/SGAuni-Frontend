import { Outlet } from 'react-router';
import { Box, Flex } from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';

export const AuthLayout = () => {
	const { colorMode } = useColorMode();
	return (
		<Box
			height='100svh'
			position='relative'
			bg={colorMode === 'dark' ? 'uni.gray.700' : 'uni.gray.200'}
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
				bgImage={
					colorMode === 'dark'
						? "url('/img/bg-dark.png')"
						: " url('/img/bg-light.png')"
				}
				backgroundSize='90%'
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
