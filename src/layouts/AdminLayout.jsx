import { Sidebar, TopBar } from '@/components';
import { Toaster, useColorMode } from '@/components/ui';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router';

export const AdminLayout = () => {
	const { colorMode } = useColorMode();
	const location = useLocation();
	const { data: profile } = useReadUserLogged();
	const isSettingsPage = location.pathname.startsWith('/settings');
	const isMyPaymentsPage = location.pathname.startsWith('/mypayments');
	const isDebtsPage = location.pathname.startsWith('/debts');

	return (
		<Flex h='100svh' w='100vw' position='fixed' direction='column'>
			<Flex h='100%' w='100%'>
				<Sidebar profile={profile} />

				<Flex
					flex='1'
					direction='column'
					bg={colorMode === 'dark' ? 'uni.gray.400' : 'uni.50'}
					minW='0'
				>
					<TopBar profile={profile} />

					<Box
						p={
							!isSettingsPage && !isMyPaymentsPage && !isDebtsPage
								? { base: '3', md: '6' }
								: '0'
						}
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
