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
	Spinner,
} from '@chakra-ui/react';
import { Avatar, MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useProvideAuth } from '@/hooks/auth';

export const TopBar = () => {
	const { getProfile, logout } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];

	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const hasPermission = (requiredPermission) => {
		if (!requiredPermission) return true;
		if (!permissions || permissions.length === 0) return false;
		return permissions.includes(requiredPermission.trim());
	};

	const [fullname, setFullname] = useState('');
	const mensaje =
		import.meta.env.VITE_IS_DEMO === 'true' ? 'SGAUNI - DEMO' : '';

	useEffect(() => {
		if (profile) {
			setFullname(profile.user.first_name || '');
		}
	}, [profile]);

	if (!profile) {
		return (
			<Flex align='center' justify='center' h='100vh'>
				<Spinner size='xl' />
			</Flex>
		);
	}

	const settingsHref = hasPermission('settings.studenprofile.view')
		? '/settings/myprofile'
		: '/settings/profile';

	const menuItems = [{ label: 'Configuración', href: settingsHref }];
	const username = profile.user?.username || '';
	//const email = profile.uni_email || '';

	const mainRole =
		roles.length > 0
			? roles.reduce((max, curr) =>
					(curr.permissions?.length || 0) > (max.permissions?.length || 0)
						? curr
						: max
				)
			: null;

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
				<MenuRoot>
					<MenuTrigger asChild>
						<HStack gap={['1', '3']} cursor='pointer'>
							<Box position='relative'>
								{fullname && <Avatar name={fullname} size='sm' />}
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
									{fullname?.split(' ').slice(0, 2).join(' ')}
								</Text>
								<Text color='fg.muted' textStyle='sm' lineHeight='1'>
									{mainRole?.name || 'Aún no tienes rol'}
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
							<Text fontWeight='medium'>{username}</Text>
						</Stack>
						<MenuSeparator />
						<Box px='4' my='2'>
							<Text textStyle='sm'>
								{roles.length === 1 ? `Rol:` : `Roles:`}
							</Text>
							{roles.map((role) => (
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

							{/*<MenuItem
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
							</MenuItem>*/}

							<MenuItem
								onClick={logout}
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
