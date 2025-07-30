import { useColorMode } from '@/components/ui';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Grid,
	GridItem,
	Stack,
	Text,
	Flex,
	Icon,
	Heading,
} from '@chakra-ui/react';
import {
	FiAlertCircle,
	FiAward,
	FiCalendar,
	FiFileText,
	FiPlus,
	FiUpload,
} from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router';

export const MyPaymentsLayout = () => {
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
			href: '/mypaymentsdebts/debts',
			label: 'Estado de deudas',
			icon: FiAlertCircle,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/requests',
			label: 'Solicitudes y ordenes',
			icon: FiFileText,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/addrequests',
			label: 'Solicitar orden',
			icon: FiPlus,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/uploadsvouchers',
			label: 'Comprobantes',
			icon: FiUpload,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/addBenefits',
			label: 'Solicitar Beneficio',
			icon: FiAward,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/schedule',
			label: 'Cronograma de pagos',
			icon: FiCalendar,
			permission: null,
		},
		{
			href: '/mypaymentsdebts/mycommitmentLetters',
			label: 'Mis Fraccionamientos',
			icon: FiFileText,
			permission: null,
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
							Gestionar Pagos{' '}
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
