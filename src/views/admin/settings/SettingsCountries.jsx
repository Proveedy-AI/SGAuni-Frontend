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
	Text,
} from '@chakra-ui/react';
import { InputGroup } from '@/components/ui';
import { FiSearch } from 'react-icons/fi';
import {
	SettingsCountryManagementTable,
	SettingsDepartmentTable,
	SettingsDistrictTable,
	SettingsProvinceTable,
	SettingsUbigeosTable,
} from '@/components/tables/settings';

import { useReadCountries, useReadDepartments } from '@/hooks';
import {
	AddSettingsCountryForm,
	AddSettingsDepartmentForm,
	AddSettingsDistrictForm,
	AddSettingsProvinceForm,
	AddSettingsUbigeoForm,
} from '@/components/forms/settings';
import { useReadProvince } from '@/hooks/provincies';
import { useReadDistrict } from '@/hooks/district';
import { useReadUbigeos } from '@/hooks/ubigeos';
import { useReadNationality } from '@/hooks/nationality';
import { SettingsNationalityTable } from '@/components/tables/settings/SettingsNationalityTable';
import { AddSettingsNationalityForm } from '@/components/forms/settings/regiones/AddSettingsNationalityForm';

export const SettingsCountries = () => {
	const [tab, setTab] = useState(1);

	const [searchCountryValue, setSearchCountryValue] = useState('');
	const [searchDepartmentsValue, setSearchDepartmentValue] = useState('');
	const [searchProvincesValue, setSearchProvincesValue] = useState('');
	const [searchDistrictValue, setSearchDistrictValue] = useState('');
	const [searchUbigeosValue, setSearchUbigeosValue] = useState('');

	const {
		data: dataCountries,
		refetch: fetchCountry,
		isLoading,
	} = useReadCountries();

	const {
		data: dataDepartments,
		refetch: fetchDepartmetns,
		isLoading: loadingDepartments,
	} = useReadDepartments();

	const {
		data: dataProvince,
		refetch: fetchProvince,
		isLoading: loadingProvince,
	} = useReadProvince();

	const {
		data: dataDistrict,
		refetch: fetchDistrict,
		isLoading: loadingDistrict,
	} = useReadDistrict();

	const { data: dataUbigeos, refetch: fetchUbigeos } = useReadUbigeos();
	const { data: dataNationality, refetch: fetchNationality } =
		useReadNationality();

	const filteredCountry = dataCountries?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchCountryValue.toLowerCase())
	);

	const filteredDepartment = dataDepartments?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchDepartmentsValue.toLowerCase())
	);

	const filteredProvinces = dataProvince?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchDepartmentsValue.toLowerCase())
	);

	const filteredDistricts = dataDistrict?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchDistrictValue.toLowerCase())
	);

	const filteredUbigeos = dataUbigeos?.results?.filter((item) =>
		item?.code?.toLowerCase().includes(searchUbigeosValue.toLowerCase())
	);

	const filteredNationality = dataNationality?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchUbigeosValue.toLowerCase())
	);

	console.log(filteredNationality);

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

				{tab === 1 && <AddSettingsCountryForm fetchData={fetchCountry} />}
				{tab === 2 && (
					<AddSettingsDepartmentForm
						fetchData={fetchDepartmetns}
						isLoading={isLoading}
						dataCountries={dataCountries?.results}
					/>
				)}
				{tab === 3 && (
					<AddSettingsProvinceForm
						fetchData={fetchProvince}
						isLoading={loadingDepartments}
						dataDepartments={dataDepartments?.results}
					/>
				)}
				{tab === 4 && (
					<AddSettingsDistrictForm
						fetchData={fetchDistrict}
						isLoading={loadingProvince}
						dataProvince={dataProvince?.results}
					/>
				)}
				{tab === 5 && (
					<AddSettingsUbigeoForm
						fetchData={fetchUbigeos}
						isLoading={loadingDistrict}
						dataDistrict={dataDistrict?.results}
					/>
				)}
				{tab === 6 && (
					<AddSettingsNationalityForm
						fetchData={fetchNationality}
						isLoading={isLoading}
						dataCountries={dataCountries?.results}
					/>
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
								<Tabs.Trigger
									value={6}
									color={tab === 5 ? 'uni.secondary' : ''}
								>
									Nacionalidades
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

							{dataCountries?.results?.length > 0 ? (
								<SettingsCountryManagementTable
									data={filteredCountry}
									fetchData={fetchCountry}
								/>
							) : (
								<Text>No hay países registrados.</Text>
							)}
						</Stack>
					</Tabs.Content>

					<Tabs.Content value={2}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Departamentos</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar ...'
											value={searchDepartmentsValue}
											onChange={(e) => setSearchDepartmentValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							{dataDepartments?.results?.length > 0 ? (
								<SettingsDepartmentTable
									data={filteredDepartment}
									dataCountries={dataCountries?.results}
									fetchData={fetchDepartmetns}
								/>
							) : (
								<Text>No hay departamentos registrados.</Text>
							)}
						</Stack>
					</Tabs.Content>
					<Tabs.Content value={3}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Provincias</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar ...'
											value={searchProvincesValue}
											onChange={(e) => setSearchProvincesValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							{dataProvince?.results?.length > 0 ? (
								<SettingsProvinceTable
									data={filteredProvinces}
									dataDepartments={dataDepartments?.results}
									fetchData={fetchProvince}
								/>
							) : (
								<Text>No hay provincias registradas.</Text>
							)}
						</Stack>
					</Tabs.Content>
					<Tabs.Content value={4}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Distritos</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar por nombre'
											value={setSearchDistrictValue}
											onChange={(e) => setSearchDistrictValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							{dataDistrict?.results?.length > 0 ? (
								<SettingsDistrictTable
									data={filteredDistricts}
									dataProvince={dataProvince?.results}
									fetchData={fetchDistrict}
								/>
							) : (
								<Text>No hay distritos registrados.</Text>
							)}
						</Stack>
					</Tabs.Content>
					<Tabs.Content value={5}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Ubigeos</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar ...'
											value={searchCountryValue}
											onChange={(e) => setSearchUbigeosValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							{dataUbigeos?.results?.length > 0 ? (
								<SettingsUbigeosTable
									data={filteredUbigeos}
									fetchData={fetchUbigeos}
									dataDistrict={dataDistrict?.results}
								/>
							) : (
								<Text>No hay ubigeos registrados.</Text>
							)}
						</Stack>
					</Tabs.Content>
					<Tabs.Content value={6}>
						<Stack>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={{ base: 'start', sm: 'center' }}
								justify='space-between'
							>
								<Heading size='md'>Gestión Nacionalidades</Heading>

								<HStack>
									<InputGroup flex='1' startElement={<FiSearch />}>
										<Input
											ml='1'
											size='sm'
											placeholder='Buscar ...'
											value={searchCountryValue}
											onChange={(e) => setSearchUbigeosValue(e.target.value)}
										/>
									</InputGroup>
								</HStack>
							</Stack>

							{dataNationality?.results?.length > 0 ? (
								<SettingsNationalityTable
									data={filteredNationality}
									fetchData={fetchNationality}
									dataCountries={dataCountries?.results}
								/>
							) : (
								<Text>No hay nacionalidades registrados.</Text>
							)}
						</Stack>
					</Tabs.Content>
				</Tabs.Root>
			)}
		</Box>
	);
};
