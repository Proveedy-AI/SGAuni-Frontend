import { AdminDashboard } from './AdminDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';

export const dashboardsByPermission = [
	{
		permission: 'dashboard.admin.view',
		component: <AdminDashboard />,
	},
	{
		permission: 'dashboard.coord.view',
		component: <CoordinatorDashboard />,
	},
];
