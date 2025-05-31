import { useColorMode } from '@/components/ui';
import { useReadRolesAndPermissions } from '@/hooks/users';
import {
	Box,
	Grid,
	GridItem,
	Heading,
	Stack,
	Text,
	Flex,
} from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router';

export const SettingsLayout = () => {
	const { permissions } = useReadRolesAndPermissions();
	const { colorMode } = useColorMode();
	const location = useLocation();

	const hasPermission = (permission) => {
		return !permission || permissions.includes(permission);
	};

	const activeBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.200';

	const settingsItems = [
		{
			href: '/settings/profile',
			label: 'Cuenta',
			permission: null,
		},
		{
			href: '/settings/regional',
			label: 'Configuración regional',
			permission: 'settings.regional.view',
		},
		{
			href: '/settings/data-processing',
			label: 'Tratamiento de datos',
			permission: 'settings.data-processing.view',
		},

		// {
		// 	href: '/settings/availability-status',
		// 	label: 'Estado de disponibilidad',
		// 	permission: 'settings.availability-status.view',
		// },
		{
			href: '/settings/mails-server',
			label: 'Servidor de correo electrónico',
			permission: 'settings.mails-servers.view',
		},
		{
			href: '/settings/business-goals',
			label: 'Metas comerciales',
			permission: 'settings.business-goals.view',
		},
		{
			href: '/settings/develop',
			label: 'Desarrollador',
			permission: 'settings.develop.view',
		},
		{
			href: '/settings/help',
			label: 'Ayuda',
			permission: 'settings.help.view',
		},

		// {
		// 	href: '/settings/usage-guide',
		// 	label: 'Guía de uso',
		// 	permission: null,
		// },
		// {
		// 	href: '/settings/documentation',
		// 	label: 'Documentación',
		// 	permission: null,
		// },
    {
      href: '/settings/Modalities',
      label: 'Modalidades',
      permission: null,
    },
	{
		href: '/settings/roles',
		label: 'Roles y permisos',
		permission: null,
	},
	{
		href: '/settings/regional',
		label: 'Región y países',
		permission: null,
	},
	];

	return (
		<Box>
			<Grid
				templateColumns={{
					base: '1fr',
					md: '200px 1fr',
				}}
				templateRows={{
					base: 'auto',
					md: '1fr',
				}}
				h={{ base: 'auto', md: 'calc(100vh - 64px)' }}
			>
				<GridItem
					bg={{ base: 'white', _dark: 'uni.gray.500' }}
					py='6'
					px={{ base: '2', md: '5' }}
					overflowY='auto'
					boxShadow='md'
					css={{
						msOverflowStyle: 'none',
						scrollbarWidth: 'none',
					}}
				>
					<Stack spaceY={5}>
						<Heading
							display={{ base: 'none', md: 'block' }}
							size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg' }}
						>
							Configuración
						</Heading>

						<Stack direction={{ base: 'row', md: 'column' }} gap='1'>
							{settingsItems
								.filter((item) => hasPermission(item.permission))
								.map((item, index) => {
									const isActive = location.pathname === item.href;
									return (
										<Link key={index} to={item.href} cursor='pointer'>
											<Flex
												h={{ base: 'auto', md: '40px' }}
												align='center'
												px='2'
												fontWeight='medium'
												borderRadius='10px'
												bg={isActive ? activeBg : 'transparent'}
												color={isActive ? 'uni.secondary' : 'inherit'}
												_hover={{
													bg:
														colorMode === 'dark' ? 'uni.gray.400' : 'gray.300',
												}}
											>
												<Text
													lineHeight='1.1'
													fontSize={{
														base: '10px',
														xs: 'xs',
														sm: 'sm',
													}}
												>
													{item.label}
												</Text>
											</Flex>
										</Link>
									);
								})}
						</Stack>
					</Stack>
				</GridItem>

				<GridItem p={{ base: '3', md: '6' }} overflowY='auto'>
					<Outlet />
				</GridItem>
			</Grid>
		</Box>
	);
};
