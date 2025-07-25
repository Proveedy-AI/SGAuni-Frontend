import { useState } from 'react';
//import { SettingsPermissionsTable, SettingsRolesTable } from '@/components';
import { Box, Heading, HStack, Input, Stack, Tabs } from '@chakra-ui/react';
import { useReadPermissions } from '@/hooks/permissions';
import { useReadRoles } from '@/hooks/roles';
import { InputGroup } from '@/components/ui';
import { FiSearch } from 'react-icons/fi';
import { AddSettingsRoleForm } from '@/components/forms/settings/AddSettingsRoleForm';
import { AddSettingsPermissionForm } from '@/components/forms/settings/AddSettingsPermissionForm';
import {
	SettingsPermissionsTable,
	SettingsRolesTable,
} from '@/components/tables/settings';

export const SettingsRoles = () => {
	const [tab, setTab] = useState(1);

	const [searchRoleValue, setSearchRoleValue] = useState('');
	const [searchPermissionValue, setSearchPermissionValue] = useState('');

	const { data: dataRoles, refetch: fetchRoles, isLoading } = useReadRoles();
	const {
		data: dataPermissions,
		fetchNextPage: fetchNextPermissions,
		hasNextPage: hasNextPagePermissions,
		isFetchingNextPage: isFetchingNextPermision,
		isLoading: isLoadingPermission,
		refetch: refetchPermissions,
	} = useReadPermissions();

	const allPermissions =
		dataPermissions?.pages?.flatMap((page) => page.results) ?? [];
	const isFiltering = searchPermissionValue.trim().length > 0;

	const filteredPermissions = allPermissions.filter((item) =>
		item?.name
			?.toLowerCase()
			.includes(searchPermissionValue.trim().toLowerCase())
	);

	const totalCount = isFiltering
		? filteredPermissions.length
		: (dataPermissions?.pages?.[0]?.count ?? 0);

	const filteredRoles = dataRoles?.results?.filter((item) =>
		item?.name?.toLowerCase().includes(searchRoleValue.toLowerCase())
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
					Roles y permisos
				</Heading>

				{tab === 1 ? (
					<AddSettingsRoleForm fetchData={fetchRoles} />
				) : (
					<AddSettingsPermissionForm fetchData={refetchPermissions} />
				)}
			</Stack>

			<Tabs.Root
				value={tab}
				onValueChange={(e) => setTab(e.value)}
				size={{ base: 'sm', md: 'md' }}
			>
				<Tabs.List colorPalette='cyan'>
					<Tabs.Trigger value={1} color={tab === 1 ? 'uni.secondary' : ''}>
						Roles
					</Tabs.Trigger>

					<Tabs.Trigger value={2} color={tab === 2 ? 'uni.secondary' : ''}>
						Permisos
					</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value={1}>
					<Stack>
						<Stack
							direction={{ base: 'column', sm: 'row' }}
							align={{ base: 'start', sm: 'center' }}
							justify='space-between'
						>
							<Heading size='md'>Gestión de roles</Heading>

							<HStack>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										placeholder='Buscar por nombre'
										value={searchRoleValue}
										onChange={(e) => setSearchRoleValue(e.target.value)}
									/>
								</InputGroup>
							</HStack>
						</Stack>

						<SettingsRolesTable
							dataPermissions={filteredPermissions}
							isLoading={isLoading}
							data={filteredRoles}
							fetchData={fetchRoles}
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
							isLoading={isLoadingPermission}
							data={filteredPermissions}
							fetchNextPage={fetchNextPermissions}
							fetchData={refetchPermissions}
							totalCount={totalCount}
							hasNextPage={hasNextPagePermissions}
							isFetchingNext={isFetchingNextPermision}
							resetPageTrigger={searchPermissionValue}
						/>
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};
