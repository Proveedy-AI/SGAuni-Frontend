// DataSidebar.tsx o .js
import {
	FiGrid,
	FiUsers,
	FiSettings,
	FiCheckSquare,
	FiCheck,
	FiUserCheck,
	FiList,
} from 'react-icons/fi';
import { FaFileContract } from 'react-icons/fa';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useProvideAuth } from '@/hooks/auth';

export const useDataSidebar = () => {
	const { getProfile } = useProvideAuth();
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

	const settingsHref = hasPermission('settings.studenprofile.view')
		? '/settings/myprofile'
		: '/settings/profile';

	const mainItems = [
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
					permission: 'admissions.applicants.view',
				},
			],
		},
		{
			href: '/admissions/myapplicants',
			icon: FiUserCheck,
			label: 'Mis Postulantes',
			permission: 'admissions.myapplicants.view',
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
	];

	const bottomItems = [
		{
			href: settingsHref,
			icon: FiSettings,
			label: 'Configuración',
			permission: null,
		},
	];

	return {
		mainItems: mainItems.filter((item) => hasPermission(item.permission)),
		bottomItems: bottomItems.filter((item) => hasPermission(item.permission)),
	};
};
