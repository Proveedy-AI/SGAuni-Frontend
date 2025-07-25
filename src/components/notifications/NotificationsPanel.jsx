import {
	Box,
	Button,
	Card,
	Circle,
	Float,
	Heading,
	HStack,
	IconButton,
	Portal,
	Separator,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiBell, FiX } from 'react-icons/fi';
import { BsCheck2All } from 'react-icons/bs';
import { MenuContent, MenuRoot, MenuTrigger, Modal } from '../ui';
import {
	useMarkReadNotifications,
	useReadMyNotifications,
} from '@/hooks/notifications';
import { useTimeDifference } from '@/hooks';
import { useMarkAllReadNotifications } from '@/hooks/notifications/useMarkAllReadNotifications';

export const NotificationsPanel = ({ dataUser }) => {
	const [visibleCount, setVisibleCount] = useState(4);
	const [toastData, setToastData] = useState({
		open: false,
		title: '',
		message: '',
	});
	const socketRef = useRef(null);
	const { data: notifications, refetch } = useReadMyNotifications(
		{},
		{ enabled: true }
	);

	const { mutateAsync: markAllRead } = useMarkAllReadNotifications();

	const handleMarkAllAsRead = async () => {
		try {
			await markAllRead();
			refetch();
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
		}
	};

	const handleCloseToast = () => {
		setToastData((prev) => ({ ...prev, open: false }));
	};

	const counter = useMemo(() => {
		return (
			notifications?.notifications?.filter((notification) => !notification.is_read)
				.length || 0
		);
	}, [notifications]);

	useEffect(() => {
		const socketUrl = import.meta.env.VITE_WEBSOCKET_URL;

		if (!dataUser?.id || !socketUrl) return;

		socketRef.current = new WebSocket(socketUrl);

		socketRef.current.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log('Mensaje recibido del WebSocket:', data);
				if (data?.id === dataUser.id) {
					refetch({ user_id: dataUser.id });

					const audio = new Audio('/notificaciones.wav');
					audio.play();

					setToastData({
						open: true,
						title: data?.title ?? 'Notificación',
						message: data?.message ?? 'Tienes una nueva notificación.',
					});
				}
			} catch (error) {
				console.error('Error al parsear mensaje del WebSocket:', error);
			}
		};

		socketRef.current.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			if (
				socketRef.current &&
				socketRef.current.readyState === WebSocket.OPEN
			) {
				socketRef.current.close();
				console.log('❌ WebSocket desconectado');
			}
			socketRef.current = null;
		};
	}, [dataUser?.id, refetch]);

	const visibleNotifications = notifications?.notifications?.slice(0, visibleCount);
	const hasMore = visibleCount < notifications?.notifications?.length;

	return (
		<>
			<MenuRoot>
				<MenuTrigger asChild bg='transparent'>
					<IconButton
						variant='ghost'
						aria-label='Botón notificaciones'
						outline='none'
						size='24'
						boxShadow='none'
						_focus={{ outline: 'none', boxShadow: 'none' }}
						minW='auto'
					>
						<FiBell size='24' />
						{counter > 0 && (
							<Float>
								<Circle size='4' p={2.5} bg='red' color='white'>
									{counter > 99 ? '99+' : counter}
								</Circle>
							</Float>
						)}
					</IconButton>
				</MenuTrigger>

				<MenuContent maxWidth='500px' minW='450px' bg='white'>
					<Card.Root border='none' shadow='none'>
						<Card.Header
							bgGradient='linear(to-r, blue.50, indigo.50)'
							py={3}
							px={2}
						>
							<HStack justify='space-between' align='center'>
								<Heading fontSize='20px' color='gray.800'>
									Notificaciones
								</Heading>
								<Button
									size='xs'
									colorPalette={'blue'}
									variant='outline'
									borderRadius={'md'}
									onClick={handleMarkAllAsRead}
								>
									{' '}
									<BsCheck2All />
									<Text fontSize='xs'>Marcar todos</Text>
								</Button>
							</HStack>
						</Card.Header>

						<Card.Body px={0} pt={0} pb={2}>
							<Stack maxH='455px' overflowY='auto' spacing={0}>
								{visibleNotifications && visibleNotifications.length > 0 ? (
									visibleNotifications.map((item, index) => (
										<Fragment key={item.id}>
											<NotificationItem data={item} fetchData={refetch} />
											{index !== visibleNotifications.length - 1 && (
												<Separator mx={2} />
											)}
										</Fragment>
									))
								) : (
									<Stack
										minH='455px'
										align='center'
										justify='center'
										w='full'
										px='4'
										py='6'
									>
										<Text fontSize='sm' color='gray.500'>
											Sin notificaciones
										</Text>
									</Stack>
								)}
							</Stack>
						</Card.Body>

						<Card.Footer px={2} py={2}>
							<HStack w='full' gap={2}>
								{hasMore && (
									<Button
										variant='solid'
										bg='uni.secondary'
										color='white'
										size='sm'
										flex={1}
										onClick={() => setVisibleCount((prev) => prev + 4)}
									>
										Ver más
									</Button>
								)}
							</HStack>
						</Card.Footer>
					</Card.Root>
				</MenuContent>
			</MenuRoot>
			<NotificationToast
				open={toastData.open}
				onClose={handleCloseToast}
				title={toastData.title}
				message={toastData.message}
			/>
		</>
	);
};

NotificationsPanel.propTypes = {
	dataUser: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
};

export const NotificationItem = ({ data, fetchData }) => {
	const { formattedTime } = useTimeDifference(data?.created_at, true);
	const isViewed = !!data?.is_read;

	const { mutateAsync: updateNotifications } = useMarkReadNotifications();

	const handleClick = async () => {
		if (!isViewed) {
			try {
				updateNotifications({ id: data.id });
				fetchData();
			} catch (error) {
				console.error('Error al actualizar la notificación:', error);
			}
		}
	};
	return (
		<Modal
			title={`NOT${String(data?.id).padStart(5, '0')}: ${data?.title}`}
			placement='center'
			trigger={
				<Stack
					onClick={handleClick}
					gap='0'
					_hover={{ bg: 'uni.100' }}
					bg={data.viewed ? 'white' : 'uni.100'}
					cursor='pointer'
					p='3'
					borderRadius='md'
				>
					<Text fontSize='md' fontWeight='semibold' lineClamp='1'>
						{data.title}
					</Text>
					<Text fontSize='sm' color='gray.500' lineClamp='1'>
						{data.message}
					</Text>
					<HStack justify='space-between'>
						<HStack color={isViewed ? 'gray.400' : 'green.500'}>
							<BsCheck2All />
							<Text fontSize='xs'>{isViewed ? 'Visto' : 'Nuevo'}</Text>
						</HStack>
						<Text fontSize='xs' color='gray.400'>
							hace {formattedTime}
						</Text>
					</HStack>
				</Stack>
			}
			hiddenFooter
		>
			<Stack>
				<Text fontSize='md' color='gray.500'>
					{data.message}
				</Text>
				<HStack justify='end'>
					<Text fontSize='sm' fontWeight='semibold' color='gray.400'>
						hace {formattedTime}
					</Text>
				</HStack>
			</Stack>
		</Modal>
	);
};

NotificationItem.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.number,
		title: PropTypes.string,
		message: PropTypes.string,
		timeAgo: PropTypes.string,
		viewed: PropTypes.bool,
		is_read: PropTypes.bool,
		created_at: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.instanceOf(Date),
		]),
	}).isRequired,
	fetchData: PropTypes.func,
};
export const NotificationToast = ({
	open,
	onClose,
	title = 'Notificación',
	message = 'Tiene una nueva notificación.',
	duration = 3000,
}) => {
	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				onClose?.();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [open, duration, onClose]);

	if (!open) return null;

	return (
		<Portal>
			<Box
				position='fixed'
				bottom='20px'
				right='20px'
				zIndex='99999'
				bg='uni.gray.500'
				color='white'
				p='4'
				borderRadius='md'
				boxShadow='lg'
				maxW='350px'
				onClick={(e) => e.stopPropagation()}
				pointerEvents='auto'
			>
				<VStack align='start' spacing='3'>
					<HStack w='full' justify='space-between'>
						<Text fontSize='md' fontWeight='bold'>
							{title}
						</Text>
						<IconButton
							colorPalette='red'
							size='xs'
							aria-label='Cerrar toast'
							onClick={onClose}
						>
							<FiX />
						</IconButton>
					</HStack>
					<Text>{message}</Text>
				</VStack>
			</Box>
		</Portal>
	);
};

NotificationToast.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	message: PropTypes.string,
	duration: PropTypes.number,
};
