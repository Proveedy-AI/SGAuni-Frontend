import { AdmissionsProgramsTable } from '@/components/tables/admissions';
import { LiaSlashSolid } from 'react-icons/lia';

import {
	Box,
	Heading,
	InputGroup,
	Input,
	Stack,
	Breadcrumb,
	Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { useReadEnrollmentsPrograms } from '@/hooks/enrollments_programs';

export const TuitonPrograms = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data: profile } = useReadUserLogged();
	const [tab, setTab] = useState(1);
	const {
		data: dataEnrollmentPrograms,
		refetch: fetchEnrollmentPrograms,
		isLoading,
	} = useReadEnrollmentsPrograms({
		admission_process: Number(decrypted),
		director: profile?.id,
	});

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');
	const allEnrollmentPrograms =
		dataEnrollmentPrograms?.pages?.flatMap((page) => page.results) ?? [];

	const filteredEnrollmentPrograms = allEnrollmentPrograms?.filter(
		(item) =>
			item.status === 2 &&
			item.program_name.toLowerCase().includes(searchValue.toLowerCase())
	);

	const filteredApprovedPrograms = allEnrollmentPrograms?.filter(
		(item) =>
			item.status === 4 &&
			item.program_name.toLowerCase().includes(searchValue.toLowerCase())
	);

	return (
		<Box spaceY='5'>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Breadcrumb.Root size='lg'>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link as={RouterLink} to='/enrollments/proccess'>
								Matriculas
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.CurrentLink>Programas</Breadcrumb.CurrentLink>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'md',
						md: 'xl',
					}}
					color={'uni.secondary'}
				>
					{allEnrollmentPrograms[0]?.admission_process_name ||
						'No hay programas de matricula disponibles'}
				</Heading>
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
								Pendientes
							</Tabs.Trigger>

							<Tabs.Trigger value={2} color={tab === 2 ? 'uni.secondary' : ''}>
								Aprobados
							</Tabs.Trigger>
						</Tabs.List>
					</Box>
				</>
				<Tabs.Content value={1}>
					<Stack>
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
									placeholder='Buscar por programa ...'
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
								/>
							</InputGroup>
						</Stack>

						<AdmissionsProgramsTable
							isLoading={isLoading}
							data={filteredEnrollmentPrograms}
							fetchData={fetchEnrollmentPrograms}
							permissions={permissions}
						/>
					</Stack>
				</Tabs.Content>
				<Tabs.Content value={2}>
					<Stack>
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
									placeholder='Buscar por programa ...'
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
								/>
							</InputGroup>
						</Stack>

						<AdmissionsProgramsTable
							enrollment={true}
							isLoading={isLoading}
							data={filteredApprovedPrograms}
							fetchData={fetchEnrollmentPrograms}
							permissions={permissions}
						/>
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};
