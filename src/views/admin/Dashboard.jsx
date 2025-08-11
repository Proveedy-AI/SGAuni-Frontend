// Dashboard.tsx
import { Box, Flex, Spinner, Heading } from '@chakra-ui/react';
import { dashboardsByPermission } from './dashboards';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { FooterDashboard } from '@/layouts/FooterDashboard';

export const Dashboard = () => {
	const { data: profile } = useReadUserLogged();

	if (!profile) {
		return (
			<Flex align='center' justify='center' h='100vh'>
				<Spinner size='xl' />
			</Flex>
		);
	}

	const userPermissions = [
		...new Set(
			profile.roles?.flatMap((role) =>
				role.permissions.map((perm) => perm.guard_name)
			) ?? []
		),
	];

	const allowedDashboards = dashboardsByPermission
		.filter(({ permission }) => userPermissions.includes(permission))
		.map(({ component }, idx) => (
			<Box key={idx} w='full'>
				{component()}{' '}
				{/* Ejecutamos la función, así solo se instancia si hay permiso */}
			</Box>
		));

	return (
		<Flex direction='column' minH='100vh'>
			<Box flex='1' py='8' px='0' w='full'>
				{allowedDashboards.length > 0 ? (
					allowedDashboards
				) : (
					<Box>
						<Heading size='md'>No tienes dashboards disponibles.</Heading>
					</Box>
				)}
			</Box>
			<FooterDashboard />
		</Flex>
	);
};
