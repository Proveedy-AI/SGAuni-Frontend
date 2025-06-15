import { AdminDashboard } from './AdminDashboard';
import { ApplicantDashboard } from './ApplicantDashboard';
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
	{
		permission: 'dashboard.applicant.view',
		component: <ApplicantDashboard />,
	},
];
