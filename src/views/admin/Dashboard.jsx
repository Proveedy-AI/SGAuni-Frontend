import { Box, Flex, Spinner, Heading } from '@chakra-ui/react';

import { dashboardsByPermission } from './dashboards';
import { useProvideAuth } from '@/hooks/auth';

export const Dashboard = () => {
	const { getProfile } = useProvideAuth();
	const profile = getProfile();

	if (!profile) {
		return (
			<Flex align='center' justify='center' h='100vh'>
				<Spinner size='xl' />
			</Flex>
		);
	}

	const userPermissions =
		profile.roles?.[0]?.permissions?.map((perm) => perm.guard_name) || [];

	const allowedDashboards = dashboardsByPermission
		.filter(({ permission }) => userPermissions.includes(permission))
		.map(({ component }, idx) => (
			<Box key={idx} w='full'>
				{component}
			</Box>
		));

	return (
		<Flex direction='column' px='0' w='full'>
			<Box py='8' px='0' w='full'>
				{allowedDashboards.length > 0 ? (
					allowedDashboards
				) : (
					<Box>
						<Heading size='md'>No tienes dashboards disponibles.</Heading>
					</Box>
				)}
			</Box>
		</Flex>
	);
};
