import { Box, Flex, Spinner, VStack, Heading } from '@chakra-ui/react';

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
			<Box
				key={idx}
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				p='6'
				borderRadius='10px'
				w='100%'
				maxW='md'
				boxShadow='lg'
			>
				{component}
			</Box>
		));

	return (
		<Flex direction='column' align='center' py='8' px='4'>
			<VStack spacing='6' w='100%'>
				{allowedDashboards.length > 0 ? (
					allowedDashboards
				) : (
					<Box>
						<Heading size='md'>No tienes dashboards disponibles.</Heading>
					</Box>
				)}
			</VStack>
		</Flex>
	);
};
