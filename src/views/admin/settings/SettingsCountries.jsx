import { AddSettingsCountryForm } from '@/components/forms/settings';
import { SettingsCountryManagementTable } from '@/components/tables/settings';
import { useReadCountries } from '@/hooks';
import {
	Box,
	Heading,
	HStack,
	InputGroup,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SettingsCountries = () => {
	const { data: dataCountries, refetch: fetchCountries } = useReadCountries();

	const [searchValue, setSearchValue] = useState('');

	const [loading, setInitialLoading] = useState(true);

	const filteredCountries = dataCountries?.filter((item) =>
		item.name.toLowerCase().includes(searchValue.toLowerCase())
	);

	useEffect(() => {
		if (loading && filteredCountries?.length > 0) {
			setInitialLoading(false);
		}
	}, [loading, filteredCountries]);

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
					Configuración regional
				</Heading>

				<HStack>
					<InputGroup flex='1' startElement={<FiSearch />}>
						<Input
							ml='1'
							size='sm'
							placeholder='Buscar por nombre'
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</InputGroup>

					<AddSettingsCountryForm fetchData={fetchCountries} />
				</HStack>
			</Stack>

			<SettingsCountryManagementTable
				data={filteredCountries}
				fetchData={fetchCountries}
				loading={loading}
			/>
		</Box>
	);
};
