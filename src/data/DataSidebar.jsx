import {
	FiGrid,
	FiUsers,
	FiSettings,
	FiCheckSquare,
	FiCheck,
	FiUserCheck,
	FiList,
} from 'react-icons/fi';
import { FaFileContract } from "react-icons/fa";
import { HiOutlineClipboardList } from 'react-icons/hi';

export const DataSidebar = {
	mainItems: [
		{
			href: '/',
			icon: FiGrid,
			label: 'Mi panel',
			permission: null,
		},
		{
			href: '/admissions',
			icon: FiCheckSquare,
			label: 'Admisiones',
			subItems: [
				{
					href: '/admissions/proccess',
					icon: FiCheck,
					label: 'Procesos Admisión',
					permission: 'admissions.proccess.view',
				},
				{
					href: '/admissions/applicants',
					icon: FiUserCheck,
					label: 'Postulantes',
					permission: null,
				},
			],
		},
		{
			href: '/contracts',
			icon: FaFileContract,
			label: 'Contratos',
			subItems: [
				{
					href: '/contracts/list',
					icon: FiList,
					label: 'Lista General',
					permission: 'contracts.list.view',
				},
				{
					href: '/contracts/mylist',
					icon: HiOutlineClipboardList,
					label: 'Lista Personal',
					permission: 'contracts.mylist.view',
				},
			],
		},
		{
			href: '/users',
			icon: FiUsers,
			label: 'Usuarios',
			permission: 'users.users.view',
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
