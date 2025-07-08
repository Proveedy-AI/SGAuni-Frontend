import { AddAdmissionsProgramsForm } from '@/components/forms/admissions';
import { AdmissionsMyProgramsTable } from '@/components/tables/admissions';
import { useReadAdmissionById } from '@/hooks/admissions_proccess/useReadAdmissionsbyId';
import { LiaSlashSolid } from 'react-icons/lia';

import {
	Box,
	Heading,
	InputGroup,
	Input,
	Stack,
	Breadcrumb,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const AdmissionsMyPrograms = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data: profile } = useReadUserLogged();

	const { data } = useReadAdmissionById(decrypted);
	const {
		data: dataAdmissionsPrograms,
		refetch: fetchAdmissionsPrograms,
		isLoading,
	} = useReadAdmissionsPrograms({
		admission_process: Number(decrypted),
		coordinator: profile?.id,
	});

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');

	const allAdmissionPrograms =
		dataAdmissionsPrograms?.pages?.flatMap((page) => page.results) ?? [];

	const filteredAdmissionsPrograms = allAdmissionPrograms?.filter((item) =>
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
							<Breadcrumb.Link as={RouterLink} to='/admissions/proccess'>
								Admisiones
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.CurrentLink>Mis Programas</Breadcrumb.CurrentLink>
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
					{data?.admission_process_name}
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
						placeholder='Buscar por programa ...'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>
				{permissions?.includes('admissions.myprograms.create') && (
					<AddAdmissionsProgramsForm
						id={decrypted}
						profileId={profile?.id}
						fetchData={fetchAdmissionsPrograms}
					/>
				)}
			</Stack>

			<AdmissionsMyProgramsTable
				isLoading={isLoading}
				data={filteredAdmissionsPrograms}
				fetchData={fetchAdmissionsPrograms}
				permissions={permissions}
			/>
		</Box>
	);
};
