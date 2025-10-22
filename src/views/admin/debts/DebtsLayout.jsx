import { useColorMode } from '@/components/ui';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Grid,
	GridItem,
	Heading,
	Stack,
	Text,
	Flex,
	Icon,
} from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router';
import { FiFileText, FiClipboard } from 'react-icons/fi';

export const DebtsLayout = () => {
	const { colorMode } = useColorMode();
	const location = useLocation();
	const { data: profile } = useReadUserLogged();

	const hasPermission = (permission) => {
		if (!permission) return true;
		const roles = profile?.roles || [];
		const permissions = roles.flatMap((r) => r.permissions || []);
		return permissions.some((p) => p.guard_name === permission);
	};

	const activeBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.200';

	const settingsItems = [
		{
			href: '/debts/payment-requests',
			label: 'Solicitudes de Pago',
			icon: FiClipboard,
			permission: 'payment.requests.view',
		},
		{
			href: '/debts/payment-orders',
			label: 'Ordenes de Pago',
			icon: FiFileText,
			permission: 'payment.orders.view',
		},
   
	];

	return (
		<Box>
			<Grid
				templateColumns={{ base: '1fr', md: '240px 1fr' }}
				templateRows={{ base: 'auto', md: '1fr' }}
				h={{ base: 'auto', md: 'calc(100vh - 64px)' }}
			>
				<GridItem
					bg={{ base: 'white', _dark: 'uni.gray.500' }}
					py='6'
					px={{ base: 2, md: 4 }}
					overflowY='auto'
					boxShadow='md'
					borderRightWidth='1px'
				>
					<Stack gap={6}>
						<Heading
							display={{ base: 'none', md: 'block' }}
							size={{ base: 'sm', md: 'md' }}
							px='2'
						>
							Cobranzas
						</Heading>
						<Stack gap={2}>
							{settingsItems
								.filter((item) => hasPermission(item.permission))
								.map((item, index) => {
									const isActive = location.pathname === item.href;
									return (
										<Link key={index} to={item.href}>
											<Flex
												align='center'
												gap={3}
												px={3}
												py={2}
												borderRadius='md'
												bg={isActive ? activeBg : 'transparent'}
												color={isActive ? 'uni.secondary' : 'inherit'}
												_hover={{
													bg:
														colorMode === 'dark' ? 'uni.gray.400' : 'gray.300',
												}}
												transition='background 0.2s'
											>
												<Icon as={item.icon} boxSize={4} />
												<Text fontSize='sm' fontWeight='medium'>
													{item.label}
												</Text>
											</Flex>
										</Link>
									);
								})}
						</Stack>
					</Stack>
				</GridItem>

				<GridItem
					p={{ base: 3, md: 6 }}
					overflowY='auto'
					bg={{ base: 'gray.50', _dark: 'uni.gray.600' }}
				>
					<Outlet />
				</GridItem>
			</Grid>
		</Box>
	);
};
