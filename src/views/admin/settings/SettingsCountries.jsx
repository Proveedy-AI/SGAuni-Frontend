import { useState } from 'react';
//import { SettingsPermissionsTable, SettingsRolesTable } from '@/components';
import {
	Box,
	Heading,
	HStack,
	Input,
	Spinner,
	Stack,
	Tabs,
} from '@chakra-ui/react';
import { useReadPermissions } from '@/hooks/permissions';
import { InputGroup } from '@/components/ui';
import { FiSearch } from 'react-icons/fi';
import { AddSettingsPermissionForm } from '@/components/forms/settings/AddSettingsPermissionForm';
import {
	SettingsCountryManagementTable,
	SettingsPermissionsTable,
} from '@/components/tables/settings';
import { AddSettingsCountryForm } from '@/components/forms/settings';
import { useReadCountries } from '@/hooks';

export const SettingsCountries = () => {
	const [tab, setTab] = useState(1);

	const [searchCountryValue, setSearchCountryValue] = useState('');
	const [searchPermissionValue, setSearchPermissionValue] = useState('');

	const {
		data: dataCountries,
		refetch: fetchCountry,
		isLoading,
	} = useReadCountries();
	const { data: dataPermissions, refetch: fetchPermissions } =
		useReadPermissions();

	const filteredCountry = dataCountries?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchCountryValue.toLowerCase())
	);
	const filteredPermissions = dataPermissions?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchPermissionValue.toLowerCase())
	);

	return (
		<Box spaceY='5'>
			<Stack
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
					Gestión de Regiones
				</Heading>

				{tab === 1 ? (
					<AddSettingsCountryForm fetchData={fetchCountry} />
				) : (
					<AddSettingsPermissionForm fetchData={fetchPermissions} />
				)}
			</Stack>

			{isLoading && <Spinner mt={4} />}
			{!isLoading && (
				<Tabs.Root
					value={tab}
					onValueChange={(e) => setTab(e.value)}
					size={{ base: 'sm', md: 'md' }}
				>
					<>
						<Box
							overflowX='auto'
							whiteSpace='nowrap'
							css={{
								'&::-webkit-scrollbar': { height: '6px' },
								'&::-webkit-scrollbar-thumb': {
									background: '#A0AEC0', // Color del thumb
									borderRadius: '4px',
								},
							}}
						>
							<Tabs.List minW='max-content' colorPalette='cyan'>
								<Tabs.Trigger
									value={1}
									color={tab === 1 ? 'uni.secondary' : ''}
								>
									Países
								</Tabs.Trigger>

								<Tabs.Trigger
									value={2}
									color={tab === 2 ? 'uni.secondary' : ''}
								>
									Departamentos
								</Tabs.Trigger>
								<Tabs.Trigger
									value={3}
									color={tab === 3 ? 'uni.secondary' : ''}
								>
									Provincias
								</Tabs.Trigger>
								<Tabs.Trigger
									value={4}
									color={tab === 4 ? 'uni.secondary' : ''}
								>
									Distritos
								</Tabs.Trigger>
								<Tabs.Trigger
									value={5}
									color={tab === 5 ? 'uni.secondary' : ''}
								>
									Ubigeos
								</Tabs.Trigger>
							</Tabs.List>
						</Box>
					</>
					<Tabs.Content value={1}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Países</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar por nombre'
											value={searchCountryValue}
											onChange={(e) => setSearchCountryValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							<SettingsCountryManagementTable
								data={filteredCountry}
								fetchData={fetchCountry}
							/>
						</Stack>
					</Tabs.Content>

					<Tabs.Content value={2}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión de permisos</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar por nombre'
											value={searchPermissionValue}
											onChange={(e) => setSearchPermissionValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							<SettingsPermissionsTable
								data={filteredPermissions}
								fetchData={fetchPermissions}
							/>
						</Stack>
					</Tabs.Content>
					<Tabs.Content value={3}></Tabs.Content>
					<Tabs.Content value={4}></Tabs.Content>
					<Tabs.Content value={5}></Tabs.Content>
				</Tabs.Root>
			)}
		</Box>
	);
};
