import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
//import { IsoTipo, Logo } from '../logo';
import {
	Box,
	Collapsible,
	Flex,
	IconButton,
	Image,
	Separator,
	Skeleton,
	SkeletonCircle,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
	useColorMode,
} from '../ui';
import {
	FiArrowLeft,
	FiArrowRight,
	FiChevronDown,
	FiChevronUp,
	FiLogOut,
} from 'react-icons/fi';
import { useSidebarState } from '@/hooks';
import { useProvideAuth } from '@/hooks/auth';
import { useDataSidebar } from '@/data';

export const Sidebar = ({ profile }) => {
	const { isCollapsed, toggleSidebar } = useSidebarState();
	const { logout } = useProvideAuth();
	const { mainItems, bottomItems } = useDataSidebar();
	// Obtener permisos desde el profile

	if (!profile) {
		return (
			<Box mt={24} w={isCollapsed ? '60px' : '230px'} py='4' px='3' h='100vh'>
				<Flex
					direction='column'
					flex='1'
					maxHeight='calc(100svh - 130px)'
					justify='space-between'
				>
					<Box
						align='start'
						overflowY='auto'
						h='full'
						css={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
					>
						<VStack align='start' spacing='3'>
							{[...Array(5)].map((_, i) => (
								<Flex key={i} align='center' gap='3' w='full'>
									<SkeletonCircle size='6' />
									{!isCollapsed && <Skeleton height='16px' width='120px' />}
								</Flex>
							))}
						</VStack>
					</Box>

					<Box mt='auto' pt='10'>
						<VStack
							align='start'
							justify={isCollapsed ? 'center' : 'space-between'}
							gap='2'
						>
							{[...Array(2)].map((_, i) => (
								<Flex key={i} align='center' gap='3' w='full'>
									<SkeletonCircle size='6' />
									{!isCollapsed && <Skeleton height='16px' width='100px' />}
								</Flex>
							))}

							{/* Cerrar sesión */}
							<Flex align='center' gap='3' w='full'>
								<SkeletonCircle size='6' />
								{!isCollapsed && <Skeleton height='16px' width='100px' />}
							</Flex>
						</VStack>
					</Box>
				</Flex>
			</Box>
		);
	}

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const hasPermission = (requiredPermission) => {
		if (!requiredPermission) return true;
		if (!permissions || permissions.length === 0) return false;
		return permissions.includes(requiredPermission.trim());
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<Box
			w={isCollapsed ? '64px' : '250px'}
			bg={{ base: 'white', _dark: 'uni.gray.500' }}
			transition='width 0.3s'
			boxShadow='md'
			h='full'
			px={isCollapsed ? '3' : '5'}
			py='8'
			position='relative'
			display='flex'
			flexDirection='column'
		>
			<Flex justify='space-between' align='center' mb='6'>
				{isCollapsed ? (
					<Box w='40px' h='40px' px='1.5'>
						<Image src='/img/logo-UNI.png' alt='Logo' />
					</Box>
				) : (
					<Box h='40px'>
						<Flex align='center'>
							<Image w='40px' src='/img/logo-UNI.png' alt='Logo' mr='2' />
							<Text fontWeight='bold' color='#5D5D5D' fontSize='16px'>
								Portal Institucional
							</Text>
						</Flex>
					</Box>
				)}
				<IconButton
					aria-label='Toggle Sidebar'
					onClick={toggleSidebar}
					bg={{ base: 'gray.200', _dark: 'uni.gray.100' }}
					color={{ base: 'uni.secondary', _dark: 'uni.gray.400' }}
					position='fixed'
					top='32px'
					left={isCollapsed ? '80px' : '260px'}
					transform='translateX(-50%)'
					borderRadius='10px'
					zIndex='1000'
					boxShadow='lg'
					transition='left 0.3s ease'
					display={['none', 'none', 'none', 'flex']}
				>
					{isCollapsed ? <FiArrowRight /> : <FiArrowLeft />}
				</IconButton>
			</Flex>
			<Flex
				direction='column'
				flex='1'
				maxHeight='calc(100svh - 130px)'
				justify='space-between'
			>
				<Box
					align='start'
					overflowY='auto'
					h='full'
					css={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
					spaceY='1'
				>
					{mainItems
						.filter((item) => hasPermission(item.permission))
						.map((item, index) => {
							const filteredSubItems =
								item.subItems?.filter((sub) => hasPermission(sub.permission)) ||
								[];
							if (item.subItems && filteredSubItems.length === 0) return null;

							return (
								<SidebarItem
									key={index}
									href={item.href}
									icon={item.icon}
									label={item.label}
									profile={profile}
									isCollapsed={isCollapsed}
									subItems={
										filteredSubItems.length > 0 ? filteredSubItems : undefined
									}
								/>
							);
						})}
				</Box>
				<Separator size='xs' variant='solid' bg='uni.gray.200' />
				<Box mt='auto' spaceY='1' overflow={'clip'}>
					{bottomItems
						.filter((item) => hasPermission(item.permission))
						.map((item, index) => (
							<SidebarItem
								key={index}
								href={item.href}
								icon={item.icon}
								label={item.label}
								isCollapsed={isCollapsed}
								profile={profile}
							/>
						))}

					<SidebarItem
						onClick={handleLogout}
						icon={FiLogOut}
						label='Cerrar sesión'
						isCollapsed={isCollapsed}
						profile={profile}
					/>
				</Box>
			</Flex>
		</Box>
	);
};

Sidebar.propTypes = {
	profile: PropTypes.object.isRequired,
};

const SidebarItem = ({
	href,
	icon,
	label,
	isCollapsed,
	subItems,
	profile,
	...atr
}) => {
	const { colorMode } = useColorMode();
	const location = useLocation();
	const [isExpanded, setIsExpanded] = useState(() =>
		subItems?.some((i) => location.pathname === i.href)
	);

	const isActive =
		location.pathname === href ||
		(subItems && subItems.some((item) => location.pathname === item.href));
	const toggleExpand = () => setIsExpanded(!isExpanded);

	const activeBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.200';
	const hoverBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.300';
	const activeColor = colorMode === 'dark' ? 'white' : 'black';
	const activeIconColor =
		colorMode === 'dark' ? 'uni.secondary' : 'uni.secondary';

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const hasPermission = (requiredPermission) => {
		if (!requiredPermission) return true;
		if (!permissions || permissions.length === 0) return false;
		return permissions.includes(requiredPermission.trim());
	};

	const getHref = () => {
		if (href === '/settings') {
			return hasPermission.includes('settings.studenprofile.view')
				? '/settings/myprofile'
				: '/settings/profile';
		}
		return href;
	};

	return (
		<Stack w='full'>
			{subItems ? (
				isCollapsed ? (
					<MenuRoot positioning={{ placement: 'right-start' }}>
						<MenuTrigger asChild>
							<Flex
								h='40px'
								align='center'
								justify='center'
								fontWeight='medium'
								borderRadius='10px'
								px='2'
								bg={isActive ? activeBg : 'transparent'}
								color={isActive ? activeColor : 'inherit'}
								_hover={{ bg: hoverBg }}
								cursor='pointer'
								{...atr}
							>
								{icon && (
									<Box
										w='20px'
										h='20px'
										color={isActive ? activeIconColor : 'inherit'}
										as={icon}
									/>
								)}
							</Flex>
						</MenuTrigger>
						<MenuContent
							bg={{ base: 'white', _dark: 'uni.gray.500' }}
							position='absolute'
							left='calc(100% + 8px)'
							zIndex='1000'
							boxShadow='md'
						>
							<VStack align='start'>
								{subItems.map((subItem, index) => (
									<MenuItem
										key={index}
										to={subItem.href}
										as={Link}
										value={`menu-item-${index}`}
										borderRadius='4px'
										bg={
											location.pathname === subItem.href
												? activeBg
												: 'transparent'
										}
										color={
											location.pathname === subItem.href
												? activeColor
												: 'inherit'
										}
										_hover={{ bg: hoverBg }}
									>
										{subItem.icon && (
											<Box
												mr='2'
												w='16px'
												h='16px'
												color={
													location.pathname === subItem.href
														? activeIconColor
														: 'inherit'
												}
												as={subItem.icon}
											/>
										)}
										<Text lineHeight='1'>{subItem.label}</Text>
									</MenuItem>
								))}
							</VStack>
						</MenuContent>
					</MenuRoot>
				) : (
					<Collapsible.Root w='full' open={isExpanded}>
						<Collapsible.Trigger w='full'>
							<Flex
								h='40px'
								align='center'
								justify='space-between'
								px='2'
								fontWeight='medium'
								borderRadius='10px'
								_hover={{ bg: hoverBg }}
								onClick={toggleExpand}
								cursor='pointer'
								{...atr}
							>
								<Flex align='center'>
									{icon && <Box mr='2' w='20px' h='20px' as={icon} />}
									<Text fontSize='14px'>{label}</Text>
								</Flex>
								<Box as={isExpanded ? FiChevronUp : FiChevronDown} />
							</Flex>
						</Collapsible.Trigger>
						<Collapsible.Content>
							<VStack align='start' pl='7' pt='2' spacing='2'>
								{subItems.map((subItem, index) => (
									<Link to={subItem.href} key={index} style={{ width: '100%' }}>
										<Flex
											h='40px'
											align='center'
											px='2'
											fontWeight='medium'
											borderRadius='10px'
											bg={
												location.pathname === subItem.href
													? activeBg
													: 'transparent'
											}
											color={
												location.pathname === subItem.href
													? activeColor
													: 'inherit'
											}
											_hover={{ bg: hoverBg }}
										>
											{subItem.icon && (
												<Box
													mr='2'
													w='20px'
													h='20px'
													color={
														location.pathname === subItem.href
															? activeIconColor
															: 'inherit'
													}
													as={subItem.icon}
												/>
											)}
											<Text fontSize='14px'>{subItem.label}</Text>
										</Flex>
									</Link>
								))}
							</VStack>
						</Collapsible.Content>
					</Collapsible.Root>
				)
			) : (
				<Box as={href ? Link : Box} to={getHref()} cursor='pointer'>
					<Flex
						h='40px'
						align='center'
						justify={isCollapsed ? 'center' : 'space-between'}
						px='2'
						fontWeight='medium'
						borderRadius='10px'
						bg={isActive ? activeBg : 'transparent'}
						color={isActive ? activeColor : 'inherit'}
						_hover={{ bg: hoverBg }}
						onClick={subItems ? toggleExpand : undefined}
						{...atr}
					>
						<Flex align='center'>
							{icon && (
								<Box
									mr={isCollapsed ? '0' : '2'}
									w='20px'
									h='20px'
									color={isActive ? activeIconColor : 'inherit'}
									as={icon}
								/>
							)}
							{!isCollapsed && <Text fontSize='14px'>{label}</Text>}
						</Flex>
					</Flex>
				</Box>
			)}
		</Stack>
	);
};

SidebarItem.propTypes = {
	href: PropTypes.string,
	icon: PropTypes.elementType,
	label: PropTypes.string,
	isCollapsed: PropTypes.bool,
	subItems: PropTypes.arrayOf(
		PropTypes.shape({
			href: PropTypes.string,
			label: PropTypes.string,
		})
	),
	profile: PropTypes.object,
};
