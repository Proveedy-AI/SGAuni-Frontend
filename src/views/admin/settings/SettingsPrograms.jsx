import { AddProgram } from '@/components/forms/management/programs/CreateProgram';
import { AddProgramFocus } from '@/components/forms/management/programs/programsFocus/AddProgramFocus';
import { AddProgramType } from '@/components/forms/management/programTypes';
import { ProgramTable } from '@/components/tables/ProgramTable';
import { ProgramTypesTable } from '@/components/tables/ProgramTypesTable';
import { ProgramFocusTable } from '@/components/tables/settings/programs/ProgramFocusTable';
import { InputGroup } from '@/components/ui';
import { useReadPrograms, useReadProgramTypes } from '@/hooks';
import { useReadProgramsFocus } from '@/hooks/programs/programsFocus/useReadProgramsFocus';
import { useReadUsers } from '@/hooks/users';
import { Box, Heading, HStack, Input, Stack, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SettingsPrograms = () => {
	const [tab, setTab] = useState(1);

	const [searchProgramValue, setSearchProgramValue] = useState('');
	const [searchProgramTypesValue, setSearchProgramTypesValue] = useState('');

	const {
		data: dataPrograms,
		refetch: fetchPrograms,
		isLoading,
	} = useReadPrograms();
	const {
		data: dataProgramTypes,
		refetch: fetchProgramTypes,
		isLoading: loadingProgramTypes,
	} = useReadProgramTypes();

	const { data: dataProgramFocus, refetch: fetchProgramFocus } =
		useReadProgramsFocus();

	const { data: dataCoordinators, isLoading: loadingCoordinators } =
		useReadUsers();

	const programTypesOptions = dataProgramTypes?.results?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));

	const ProgramFocusOptions = dataProgramFocus?.results?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));

	const coordinatorsOptions = dataCoordinators?.results
		?.filter(
			(item) =>
				item?.is_active === true &&
				Array.isArray(item?.roles) &&
				item.roles.some((role) => role?.name === 'Coordinador Académico')
		)
		?.map((item) => ({
			value: item.id.toString(),
			label: item.full_name,
		}));

	const DirectorOptions = dataCoordinators?.results
		?.filter(
			(item) =>
				item?.is_active === true &&
				Array.isArray(item?.roles) &&
				item.roles.some((role) => role?.name === 'Director')
		)
		?.map((item) => ({
			value: item.id.toString(),
			label: item.full_name,
		}));

	const filteredPrograms = dataPrograms?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchProgramValue.toLowerCase())
	);

	const filteredProgramTypes = dataProgramTypes?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchProgramTypesValue.toLowerCase())
	);

	const filteredProgramFocus = dataProgramFocus?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchProgramTypesValue.toLowerCase())
	);

	return (
		<Box>
			<Stack
				direction={{ base: 'column', md: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justifyContent='space-between'
			>
				<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>
					Programas de Postgrado
				</Heading>

				{tab === 1 && (
					<AddProgram
						fetchData={fetchPrograms}
						ProgramFocusOptions={ProgramFocusOptions}
						DirectorOptions={DirectorOptions}
						programTypesOptions={programTypesOptions}
						coordinatorsOptions={coordinatorsOptions}
						loadingProgramTypes={loadingProgramTypes}
						loadingCoordinators={loadingCoordinators}
					/>
				)}
				{tab === 2 && <AddProgramType fetchData={fetchProgramTypes} />}
				{tab === 3 && <AddProgramFocus fetchData={fetchProgramFocus} />}
			</Stack>
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
							<Tabs.Trigger value={1} color={tab === 1 ? 'uni.secondary' : ''}>
								Programas
							</Tabs.Trigger>

							<Tabs.Trigger value={2} color={tab === 2 ? 'uni.secondary' : ''}>
								Tipos de Programas
							</Tabs.Trigger>
							<Tabs.Trigger value={3} color={tab === 3 ? 'uni.secondary' : ''}>
								Enfoques de Programas
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
							<Heading size='md'>Gestión de Programas de Postgrado</Heading>

							<HStack>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										placeholder='Buscar por nombre'
										value={searchProgramValue}
										onChange={(e) => setSearchProgramValue(e.target.value)}
									/>
								</InputGroup>
							</HStack>
						</Stack>

						<ProgramTable
							isLoading={isLoading}
							data={filteredPrograms}
							fetchData={fetchPrograms}
							DirectorOptions={DirectorOptions}
							programTypesOptions={programTypesOptions}
							coordinatorsOptions={coordinatorsOptions}
							loadingProgramTypes={loadingProgramTypes}
							loadingCoordinators={loadingCoordinators}
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
							<Heading size='md'>Gestión de Tipos de Programas</Heading>

							<HStack>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										placeholder='Buscar por nombre'
										value={searchProgramTypesValue}
										onChange={(e) => setSearchProgramTypesValue(e.target.value)}
									/>
								</InputGroup>
							</HStack>
						</Stack>

						{/* Cargar la tabla de Tipos de Programas */}

						<ProgramTypesTable
							isLoading={loadingProgramTypes}
							data={filteredProgramTypes}
							fetchData={fetchProgramTypes}
						/>
					</Stack>
				</Tabs.Content>
				<Tabs.Content value={3}>
					<Stack>
						<Stack
							direction={{ base: 'column', sm: 'row' }}
							align={{ base: 'start', sm: 'center' }}
							justify='space-between'
						>
							<Heading size='md'>Gestión de Enfoques de Programas</Heading>

							<HStack>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										placeholder='Buscar por nombre'
										value={searchProgramTypesValue}
										onChange={(e) => setSearchProgramTypesValue(e.target.value)}
									/>
								</InputGroup>
							</HStack>
						</Stack>

						{/* Cargar la tabla de Enfoques de Programas */}
						<ProgramFocusTable
							isLoading={loadingProgramTypes}
							data={filteredProgramFocus}
							fetchData={fetchProgramFocus}
						/>
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};
