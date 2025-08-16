import { useState } from 'react';
//import { SettingsPermissionsTable, SettingsRolesTable } from '@/components';
import { Box, Heading, HStack, Input, Stack, Tabs } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui';
import { FiSearch } from 'react-icons/fi';

import { useReadPurposes } from '@/hooks/purposes';
import { SettingsPurposesTable } from '@/components/tables/settings/dataProccess/SettingsPurposesTable';
import { useReadPaymentRules } from '@/hooks';
import { SettingsPaymentRulesTable } from '@/components/tables/settings/dataProccess/SettingsPaymentRulesTable';
import { AddPaymentRules } from '@/components/forms/management/dataProccess/AddPaymentRules';

export const SettingsDataProccess = () => {
	const [tab, setTab] = useState(1);

	const [searchCountryValue, setSearchCountryValue] = useState('');

	const {
		data: dataPurposes,
		refetch: fetchPurposes,
		isLoading,
	} = useReadPurposes();

	const {
		data: dataPaymentRules,
		refetch: fetchPaymentRules,
		isLoading: isLoadingPaymentRules,
	} = useReadPaymentRules();

	const PurposeOptions = dataPurposes?.results?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));

	const filteredCountryList = dataPurposes?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchCountryValue.toLowerCase())
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
					Gestión de Procesamiento de Datos
				</Heading>
				{tab === 1 && (
					<AddPaymentRules
						fetchData={fetchPaymentRules}
						PurposeOptions={PurposeOptions}
						loadingPurposeOptions={isLoading}
					/>
				)}
				{tab === 2 && ''}
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
								Reglas
							</Tabs.Trigger>
							<Tabs.Trigger value={2} color={tab === 2 ? 'uni.secondary' : ''}>
								Conceptos
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
							<Heading size='md'>Gestión Reglas de Pagos</Heading>

							{/*<HStack>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										placeholder='Buscar por nombre'
										value={searchPaymentRulesValue}
										onChange={(e) => setSearchPaymentRulesValue(e.target.value)}
									/>
								</InputGroup>
							</HStack>*/}
						</Stack>

						<SettingsPaymentRulesTable
							PurposeOptions={PurposeOptions}
							isLoading={isLoadingPaymentRules}
							data={dataPaymentRules?.results}
							fetchData={fetchPaymentRules}
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
							<Heading size='md'>Gestión Conceptos de Pago</Heading>

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

						<SettingsPurposesTable
							isLoading={isLoading}
							data={filteredCountryList}
							fetchData={fetchPurposes}
						/>
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};
