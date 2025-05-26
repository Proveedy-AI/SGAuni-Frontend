import { FiGrid, FiSettings } from 'react-icons/fi';

export const DataSidebar = {
	mainItems: [
		{
			href: '/',
			icon: FiGrid,
			label: 'Mi panel',
			permission: null,
		},
	],

	bottomItems: [
		{
			href: '/settings/profile',
			icon: FiSettings,
			label: 'Configuración',
			permission: null,
		},
	],
};

/*
		{
			href: '/messaging',
			icon: LuMessagesSquare,
			label: 'Mensajeria',
			permission: 'messaging.messaging.view',
			subItems: [
				{
					href: '/messaging/inbox',
					icon: FiInbox,
					label: 'Bandeja de entrada',
					permission: 'messaging.inbox.view',
				},
				{
					href: '/messaging/notifications',
					icon: FiBell,
					label: 'Notificaciones',
					permission: 'messaging.notifications.view',
				},
				{
					href: '/messaging/whatsapp',
					icon: FaWhatsapp,
					label: 'WhatsApp',
					permission: 'whatsapp.whatsapp.view',
					platform: 'whatsapp',
				},
			],
		},*/
