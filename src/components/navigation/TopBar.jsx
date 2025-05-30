import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
	Flex,
	HStack,
	Stack,
	Text,
	Float,
	Circle,
	Box,
	MenuSeparator,
	VStack,
} from '@chakra-ui/react';
import {
	Avatar,
	//ColorModeToggle,
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
	useColorMode,
	useContrastingColor,
} from '../ui';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useProvideAuth } from '@/hooks/auth';

export const TopBar = () => {
	// Datos simulados
	const mockUser = {
		username: 'Juan Pérez',
		email: 'juan.perez@example.com',
		sub: 'user123',
	};

	const mockUsers = [
		{
			id: 'user123',
			fullname: 'Juan Pérez',
			color: '#3182CE', // azul
		},
	];

	const mockRoles = [
		{
			name: 'Coordinador Académico',
			permissions_count: 15,
		},
		{
			name: 'Docente',
			permissions_count: 5,
		},
	];

	const [fullname, setFullname] = useState(mockUser.username);
	const [color, setColor] = useState('#F2F2F2');
	const { colorMode } = useColorMode();
	const { contrast } = useContrastingColor();
	const { logout } = useProvideAuth(); // Asegúrate de importar correctamente el hook
	const mensaje = import.meta.env.VITE_IS_DEMO === 'true' ? 'SGAUNI - DEMO' : '';

	useEffect(() => {
		const userInfo = mockUsers.find((u) => u.id === mockUser.sub);
		if (userInfo) {
			setFullname(userInfo.fullname);
			setColor(userInfo.color);
		}
	}, []);

	const handleLogout = () => {
		logout();
	};

	const menuItems = [{ label: 'Configurar cuenta', href: '/settings/profile' }];

	return (
		<Flex
			bg={{ base: 'white', _dark: 'uni.gray.500' }}
			justify='space-between'
			align='center'
			px='6'
			py='2.5'
			boxShadow='md'
			h='64px'
		>
			<HStack>
				<Text
					ml={{ base: '0px', md: '30px' }}
					fontSize={{ base: 'xs', md: 'md' }}
					fontWeight='bold'
				>
					{mensaje}
				</Text>
				
			</HStack>
			<HStack spacing='4'>
			{/*<ColorModeToggle />*/}
				<MenuRoot>
					<MenuTrigger asChild>
						<HStack gap={['1', '3']} cursor='pointer'>
							<Box position='relative'>
								<Avatar
									bgColor={color ?? '#F2F2F2'}
									color={contrast(color)}
									name={fullname}
									variant={colorMode === 'dark' ? 'solid' : 'subtle'}
									size='sm'
								/>
								<Float placement='bottom-end' offsetX='1' offsetY='1'>
									<Circle
										bg='green.500'
										size='8px'
										outline='0.2em solid'
										outlineColor={{
											base: 'white',
											_dark: 'uni.gray.500',
										}}
									/>
								</Float>
							</Box>

							<Stack gap='0' display={['none', 'none', 'none', 'flex']}>
								<Text fontWeight='medium'>
									{mockUser.username.split(' ').slice(0, 2).join(' ')}
								</Text>
								<Text color='fg.muted' textStyle='sm' lineHeight='1'>
									{mockRoles.length > 0
										? mockRoles.reduce((maxRole, currentRole) =>
												currentRole.permissions_count >
												maxRole.permissions_count
													? currentRole
													: maxRole
											).name
										: 'Aún no tienes rol'}
								</Text>
							</Stack>

							<FiChevronDown />
						</HStack>
					</MenuTrigger>

					<MenuContent
						bg={{ base: 'white', _dark: 'uni.gray.500' }}
						p='1'
						pt='2'
					>
						<Stack gap='0' px='4'>
							<Text fontWeight='medium'>{mockUser.username}</Text>
							<Text textStyle='sm' color='fg.muted'>
								{mockUser.email}
							</Text>
						</Stack>
						<MenuSeparator />
						<Box px='4' my='2'>
							<Text textStyle='sm'>
								{mockRoles.length === 1 ? `Rol:` : `Roles:`}
							</Text>
							{mockRoles.map((role) => (
								<Text
									key={role.name}
									color='fg.muted'
									textStyle='sm'
									lineHeight='1.2'
								>
									{role.name}
								</Text>
							))}
						</Box>
						<VStack gap='1'>
							{menuItems.map((item, index) => (
								<MenuItem
									key={index}
									as={Link}
									to={item.href}
									px='4'
									value={`menu-item-${index}`}
									_hover={{
										bg: {
											base: 'uni.100',
											_dark: 'uni.gray.400',
										},
									}}
									cursor='pointer'
									borderRadius='5px'
								>
									{item.label}
								</MenuItem>
							))}

							<MenuItem
								as={Link}
								to='/settings/help'
								px='4'
								value='menu-item-help'
								_hover={{
									bg: {
										base: 'uni.100',
										_dark: 'uni.gray.400',
									},
								}}
								cursor='pointer'
								borderRadius='5px'
							>
								Ayuda
							</MenuItem>

							<MenuItem
								onClick={handleLogout}
								bg={{ base: 'uni.100', _dark: 'uni.gray.400' }}
								color={{ base: 'red', _dark: 'red.400' }}
								cursor='pointer'
								as='button'
								px='4'
								value='logout'
								borderRadius='5px'
							>
								<HStack spacing='2'>
									<FiLogOut />
									<Text>Cerrar sesión</Text>
								</HStack>
							</MenuItem>
						</VStack>
					</MenuContent>
				</MenuRoot>
			</HStack>
		</Flex>
	);
};
