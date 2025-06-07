import { AddAdmissionsProccessForm } from '@/components/forms/admissions';
import { AdmissionsListTable } from '@/components/tables/admissions';
import { useReadAdmissions } from '@/hooks/admissions_proccess';
import { useProvideAuth } from '@/hooks/auth';

import { Box, Heading, InputGroup, Input, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const AdmissionsProccess = () => {
	const { data: dataAdmissions, refetch: fetchCountries } = useReadAdmissions();
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');

	const [loading, setInitialLoading] = useState(true);

	const filteredAdmissions = dataAdmissions?.results?.filter((item) =>
		item.admission_process_name
			.toLowerCase()
			.includes(searchValue.toLowerCase())
	);

	useEffect(() => {
		if (loading && filteredAdmissions?.length > 0) {
			setInitialLoading(false);
		}
	}, [loading, filteredAdmissions]);

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
					Procesos de Admisión
				</Heading>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'center' }}
				justify='space-between'
			>
				<InputGroup flex='1' startElement={<FiSearch />}>
					<Input
						ml='1'
						size='sm'
						bg={'white'}
						maxWidth={'550px'}
						placeholder='Buscar por título ...'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>

				<AddAdmissionsProccessForm fetchData={fetchCountries} />
			</Stack>

			<AdmissionsListTable
				data={filteredAdmissions}
				fetchData={fetchCountries}
				permissions={permissions}
			/>
		</Box>
	);
};
