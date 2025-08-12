import { AdminDashboard } from './AdminDashboard';
import { ApplicantDashboard } from './ApplicantDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { DebtDashboard } from './DebtDashboard';
import { DirectorDashboard } from './DirectorDashboard';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';

export const dashboardsByPermission = [
	{
		permission: 'dashboard.admin.view',
		component: () => <AdminDashboard />,
	},
	{
		permission: 'dashboard.director.view',
		component: () => <DirectorDashboard />,
	},
	{
		permission: 'dashboard.coord.view',
		component: () => <CoordinatorDashboard />,
	},
	{
		permission: 'dashboard.student.view',
		component: () => <StudentDashboard />,
	},
	{
		permission: 'dashboard.applicant.view',
		component: () => <ApplicantDashboard />,
	},

	{
		permission: 'dashboard.debt.view',
		component: () => <DebtDashboard />,
	},
	{
		permission: 'dashboard.teacher.view',
		component: () => <TeacherDashboard />,
	},
];
