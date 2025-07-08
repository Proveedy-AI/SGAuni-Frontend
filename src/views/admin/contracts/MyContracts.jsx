import { ContractsMyListTable } from '@/components/tables/contracts';
import { useReadContracts } from '@/hooks/contracts';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

import { Box, Heading, Stack } from '@chakra-ui/react';

export const MyContracts = () => {
	const { data: profile } = useReadUserLogged();

	const {
		data: dataContracts,
		refetch: fetchContracts,
		isLoading,
	} = useReadContracts({
		owner_id: profile?.id,
	});

	return (
		<Box spaceY='5'>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
					}}
				>
					Mis Contratos
				</Heading>
			</Stack>

			<ContractsMyListTable
				isLoading={isLoading}
				data={dataContracts?.results}
				fetchData={fetchContracts}
			/>
		</Box>
	);
};
