import { AddContractsForm } from '@/components/forms';
import { ContractsListTable } from '@/components/tables/contracts';
import { useProvideAuth } from '@/hooks/auth';
import { useReadContracts } from '@/hooks/contracts';

import {
	Box,
	Heading,
	HStack,
	InputGroup,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const Contracts = () => {
	const {
		data: dataContracts,
		refetch: fetchContracts,
		isLoading,
	} = useReadContracts();
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');

	const filteredContracts = dataContracts?.results?.filter((item) =>
		item.owner_name.toLowerCase().includes(searchValue.toLowerCase())
	);

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
					Contratos
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
						maxWidth={'550px'}
						bg={'white'}
						size='sm'
						variant='outline'
						placeholder='Buscar por nombre'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>
				<HStack>
					{permissions?.includes('contracts.list.create') && (
						<AddContractsForm fetchData={fetchContracts} />
					)}
				</HStack>
			</Stack>
			<ContractsListTable
				data={filteredContracts}
				fetchData={fetchContracts}
				isLoading={isLoading}
				permissions={permissions}
			/>
		</Box>
	);
};
