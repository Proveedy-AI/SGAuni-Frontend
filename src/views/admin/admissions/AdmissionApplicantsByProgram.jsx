import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { AdmissionApplicantsByProgramTable } from '@/components/tables/admissions';
import { InputGroup } from '@/components/ui';
import { useReadAdmissionApplicants } from '@/hooks/admissions_applicants';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import { useProvideAuth } from '@/hooks/auth';
import {
	Box,
	Breadcrumb,
	Heading,
	Input,
	Span,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { LiaSlashSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const AdmissionApplicantsByProgram = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const { data: dataProgram, loading: isProgramLoading } =
		useReadAdmissionProgramsById(decrypted);
	const { data: dataAdmissionApplicants, refetch: fetchAdmissionApplicants } =
		useReadAdmissionApplicants();

	const filteredApplicantsByProgramId =
		dataAdmissionApplicants?.results?.filter(
			(item) => item.admission_program === Number(decrypted)
		);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setInitialLoading] = useState(true);

	const filteredApplicants = filteredApplicantsByProgramId?.filter((item) =>
		item.person_full_name.toLowerCase().includes(searchValue.toLowerCase())
	);

	useEffect(() => {
		if (loading && filteredApplicantsByProgramId) {
			setInitialLoading(false);
		}
	}, [loading, filteredApplicantsByProgramId]);

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
							<Breadcrumb.Link as={RouterLink} to='/admissions/applicants'>
								Postulantes
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.CurrentLink>
								{dataProgram?.program_name}
							</Breadcrumb.CurrentLink>
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
					<Text>{dataProgram?.program_name}</Text>
					<Span fontSize='md' color='gray.500'>
						{isProgramLoading
							? 'Cargando...'
							: dataProgram?.admission_process_name}
					</Span>
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
						placeholder='Buscar por nombre del postulante ...'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>
			</Stack>

			{loading && <Spinner />}
			{
				<>
					{!loading && dataAdmissionApplicants?.results?.length > 0 ? (
						<AdmissionApplicantsByProgramTable
							programId={decrypted}
							data={filteredApplicants}
							fetchData={fetchAdmissionApplicants}
							permissions={permissions}
						/>
					) : (
						<Heading size='sm' color='gray.500'>
							No se encontraron postulaciones
						</Heading>
					)}
				</>
			}
		</Box>
	);
};
