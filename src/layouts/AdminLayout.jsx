import { Sidebar, TopBar } from '@/components';
import { Toaster, useColorMode } from '@/components/ui';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router';

export const AdminLayout = () => {

	const { colorMode } = useColorMode();
	const location = useLocation();

	const isSettingsPage = location.pathname.startsWith('/settings');

	return (
		<Flex h='100svh' w='100vw' position='fixed' direction='column'>
			<Flex h='100%' w='100%'>
				<Sidebar />

				<Flex
					flex='1'
					direction='column'
					bg={colorMode === 'dark' ? 'uni.gray.400' : 'uni.100'}
					minW='0'
				>
					<TopBar />

					<Box
						p={!isSettingsPage ? { base: '3', md: '6' } : '0'}
						overflowY='auto'
					>
						<Outlet />

						<Toaster />
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};
