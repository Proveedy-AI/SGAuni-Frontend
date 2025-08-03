// DataSidebar.tsx o .js
import {
	FiGrid,
	FiUsers,
	FiSettings,
	FiCheckSquare,
	FiCheck,
	FiUserCheck,
	FiList,
	FiDollarSign,
	FiFileText,
	FiBookOpen,
	FiCreditCard,
	FiAward,
	FiShield,
	FiFolder,
	FiEdit3,
	FiClipboard,
} from 'react-icons/fi';
import { FaFileContract, FaRegFile, FaUserGraduate } from 'react-icons/fa';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const useDataSidebar = () => {
	const { data: profile } = useReadUserLogged();
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
				{
					href: '/admissions/evaluators',
					icon: FiFileText,
					label: 'Mis Asignaciones',
					permission: 'admissions.evaluators.view',
				},
			],
		},
		{
			href: '/admissions/myapplicants',
			icon: FiUserCheck,
			label: 'Mis Postulaciones',
			permission: 'applicants.myapplicants.view',
		},
		{
			href: '/mypaymentsdebts/debts',
			icon: FiCreditCard,
			label: 'Mis Pagos',
			permission: 'payment.mypaymentsdebts.view',
		},
    {
      href: '/mycourses',
      icon: FiBookOpen,
      label: 'Mis cursos',
      permission: 'enrollments.mycourses.view'
    },
    {
      href: '/myprocedures',
      icon: FiAward,
      label: 'Mis Trámites',
      permission: 'procedures.myprocedures.view',
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
			href: '/enrollments',
			icon: FaRegFile,
			label: 'Matriculas',
			subItems: [
				{
					href: '/enrollments/proccess',
					icon: FiCheck,
					label: 'Procesos Matricula',
					permission: 'enrollments.proccessEnrollments.view',
				},
			],
		},
		{
			href: '/debts/payment-requests',
			icon: FiDollarSign,
			label: 'Cobranzas',
			permission: 'payment.requests.view',
		},
		{
			href: '/courses-schedules',
			icon: FiBookOpen,
			label: 'Cursos y Horarios',
			permission: 'courses.schedules.view',
		},
		{
			href: '/myclasses/myprograms',
			icon: FiBookOpen,
			label: 'Mis Clases',
			permission: 'classes.myclasses.view',
		},
		{
			href: '/benefits',
			icon: FiAward,
			label: 'Becas y Beneficios',
			subItems: [
				{
					href: '/benefits/list',
					icon: FiCheck,
					label: 'Lista de Beneficios',
					permission: 'benefits.benefits.view',
				},
				{
					href: '/benefits/request',
					icon: FiShield,
					label: 'Solicitudes',
					permission: 'benefits.benefits.review',
				},
			],
		},

		{
			href: '/commitment-letters',
			label: 'Fraccionamientos',
			icon: FiFolder,
			subItems: [
				{
					href: '/commitment-letters/list',
					icon: FiClipboard,
					label: 'Lista general',
					permission: 'commitment.commitment.view',
				},
				{
					href: '/commitment-letters/request',
					icon: FiEdit3,
					label: 'Solicitudes',
					permission: 'commitment.commitment.review',
				},
			],
		},

		{
			href: '/students',
			icon: FaUserGraduate,
			label: 'Estudiantes',
			permission: 'students.students.view',
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
