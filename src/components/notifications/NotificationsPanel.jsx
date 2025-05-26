import {
	Box,
	Button,
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
import { Fragment } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { BsCheck2All, BsPlus } from 'react-icons/bs';
import { MenuContent, MenuRoot, MenuTrigger, Modal } from '../ui';

export const NotificationsPanel = () => {
	const dummyNotifications = [
		{
			id: 1,
			title: 'Nueva asignación de curso',
			message: 'Has sido asignado como docente en Matemáticas Avanzadas.',
			timeAgo: '2 horas',
			viewed: false,
		},
		{
			id: 2,
			title: 'Cambio de horario',
			message: 'Tu clase de Física se ha movido a las 10:00 AM.',
			timeAgo: '4 horas',
			viewed: true,
		},
		{
			id: 3,
			title: 'Pago recibido',
			message: 'Se ha registrado tu pago de matrícula.',
			timeAgo: '1 día',
			viewed: true,
		},
		{
			id: 4,
			title: 'Nueva notificación general',
			message: 'La plataforma estará en mantenimiento este fin de semana.',
			timeAgo: '2 días',
			viewed: false,
		},
	];

	return (
		<>
			<MenuRoot open>
				<MenuTrigger asChild bg='transparent'>
					<IconButton variant='ghost' aria-label='Botón notificaciones' size='sm'>
						<FiBell />
						<Float>
							<Circle size='4' bg='red' color='white'>
								4
							</Circle>
						</Float>
					</IconButton>
				</MenuTrigger>

				<MenuContent maxWidth='300px' bg='white'>
					<Stack>
						<HStack justify='space-between' align='center' px='3' pt='3'>
							<Heading size='lg'>Notificaciones</Heading>
							<Button size='2xs' bg='uni.secondary' color='white'>
								<BsCheck2All />
								<Text fontSize='11px'>Marcar todos</Text>
							</Button>
						</HStack>

						<Stack maxH='355px' overflowY='auto' gap='0'>
							{dummyNotifications.map((item, index) => (
								<Fragment key={item.id}>
									<NotificationItem data={item} />
									{index !== dummyNotifications.length - 1 && <Separator />}
								</Fragment>
							))}
						</Stack>

						<HStack px='3' py='2' w='full' gap='2'>
							<Button variant='solid' bg='uni.secondary' color='white' size='sm' flex='1'>
								Ver más
							</Button>
							<Button
								size='sm'
								color='uni.secondary'
								variant='outline'
								borderColor='uni.secondary'
							>
								Crear <BsPlus />
							</Button>
						</HStack>
					</Stack>
				</MenuContent>
			</MenuRoot>

			<NotificationToast open />
		</>
	);
};

export const NotificationItem = ({ data }) => {
	return (
		<Modal
			title={`NOT${String(data?.id).padStart(5, '0')}: ${data?.title}`}
			placement='center'
			trigger={
				<Stack
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
						<HStack color={data.viewed ? 'gray.400' : 'green.500'}>
							<BsCheck2All />
							<Text fontSize='xs'>{data.viewed ? 'Visto' : 'Recibido'}</Text>
						</HStack>
						<Text fontSize='xs' color='gray.400'>
							hace {data.timeAgo}
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
						hace {data.timeAgo}
					</Text>
				</HStack>
			</Stack>
		</Modal>
	);
};

export const NotificationToast = ({ open }) => {
	if (!open) return null;

	return (
		<Portal>
			<Box
				position='fixed'
				bottom='20px'
				right='20px'
				zIndex='9999'
				bg='uni.gray.500'
				color='white'
				p='4'
				borderRadius='md'
				boxShadow='lg'
				maxW='350px'
			>
				<VStack align='start' spacing='3'>
					<HStack w='full' justify='space-between'>
						<Text fontSize='md' fontWeight='bold'>
							Nueva notificación
						</Text>
						<IconButton colorPalette='red' size='xs' aria-label='Cerrar toast'>
							<FiX />
						</IconButton>
					</HStack>
					<Text>Tienes una nueva notificación en el CRM uni.</Text>
				</VStack>
			</Box>
		</Portal>
	);
};
