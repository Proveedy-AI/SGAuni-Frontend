import { AdminDashboard } from './AdminDashboard';
import { ApplicantDashboard } from './ApplicantDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { DebtDashboard } from './DebtDashboard';
import { StudentDashboard } from './StudentDashboard';

export const dashboardsByPermission = [
	{
		permission: 'dashboard.admin.view',
		component: () => <AdminDashboard />,
	},
	{
		permission: 'dashboard.coord.view',
		component: () => <CoordinatorDashboard />,
	},
	{
		permission: 'dashboard.applicant.view',
		component: () => <ApplicantDashboard />,
	},

	{
		permission: 'dashboard.student.view',
		component: () => <StudentDashboard />,
	},
	{
		permission: 'dashboard.debt.view',
		component: <DebtDashboard />,
	},
];
