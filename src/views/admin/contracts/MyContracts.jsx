import { ContractsMyListTable } from '@/components/tables/contracts';
import { useProvideAuth } from '@/hooks/auth';
import { useReadContracts } from '@/hooks/contracts';

import { Box, Heading, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const MyContracts = () => {
	const { getProfile } = useProvideAuth();
	const profile = getProfile();

	const [loading, setInitialLoading] = useState(true);

	const { data: dataContracts, refetch: fetchContracts } = useReadContracts({
		owner_id: profile?.id,
	});
	useEffect(() => {
		if (loading && dataContracts?.results?.length > 0) {
			setInitialLoading(false);
		}
	}, [loading, dataContracts?.results]);

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
				data={dataContracts?.results}
				fetchData={fetchContracts}
				loading={loading}
			/>
		</Box>
	);
};
