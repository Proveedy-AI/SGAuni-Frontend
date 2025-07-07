import { Encryptor } from '@/components/CrytoJS/Encryptor';
import {
	ConfirmDownloadApplicantsDataModal,
	ConfirmDownloadSuneduModal,
	GeneratePdfApliccationsModal,
} from '@/components/forms/admissions';
import { AdmissionApplicantsByProgramTable } from '@/components/tables/admissions';
import {
	Button,
	InputGroup,
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
} from '@/components/ui';
import { useReadAdmissionApplicants } from '@/hooks/admissions_applicants';
import { useReadAdmissionById } from '@/hooks/admissions_proccess/useReadAdmissionsbyId';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Breadcrumb,
	Heading,
	HStack,
	Input,
	Span,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { LiaSlashSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const AdmissionApplicantsMenu = ({ applicants, data }) => {
	const [openGeneratePdfModal, setOpenGeneratePdfModal] = useState(false);
	const [openGenerateSuneduExcelModal, setOpenGenerateSuneduExcelModal] =
		useState(false);
	const [
		openGenerateFichaPostulantesModal,
		setOpenGenerateFichaPostulantesModal,
	] = useState(false);
	const admissionProcessId = data?.admission_process || null;
	const { data: dataAdmissionProcess, loading: isAdmissionProcessLoading } =
		useReadAdmissionById(admissionProcessId);

	return (
		<Box>
			<MenuRoot>
				<MenuTrigger>
					<Button
						size='sm'
						bg='white'
						color='black'
						border={'1px solid'}
						_hover={{ bg: 'gray.100' }}
					>
						Más Acciones
					</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem
						_hover={{ bg: 'gray.100', color: 'uni.secondary' }}
						onClick={() => setOpenGeneratePdfModal(applicants.length > 0)}
					>
						Generar acta de notas
					</MenuItem>
					<MenuItem
						_hover={{ bg: 'gray.100', color: 'uni.secondary' }}
						onClick={() => {
							setOpenGenerateSuneduExcelModal(applicants.length > 0);
						}}
					>
						Descargar estudiantes (SUNEDU)
					</MenuItem>
					<MenuItem
						_hover={{ bg: 'gray.100', color: 'uni.secondary' }}
						onClick={() => {
							setOpenGenerateFichaPostulantesModal(applicants.length > 0);
						}}
					>
						Descargar ficha de postulantes
					</MenuItem>
				</MenuContent>
			</MenuRoot>

			<GeneratePdfApliccationsModal
				data={data}
				open={openGeneratePdfModal}
				setOpen={setOpenGeneratePdfModal}
			/>
			{isAdmissionProcessLoading && <Spinner />}
			{!isAdmissionProcessLoading && dataAdmissionProcess && (
				<ConfirmDownloadSuneduModal
					admissionProcess={dataAdmissionProcess}
					open={openGenerateSuneduExcelModal}
					setOpen={setOpenGenerateSuneduExcelModal}
				/>
			)}
			<ConfirmDownloadApplicantsDataModal
				dataProgram={data}
				open={openGenerateFichaPostulantesModal}
				setOpen={setOpenGenerateFichaPostulantesModal}
			/>
		</Box>
	);
};

AdmissionApplicantsMenu.propTypes = {
	applicants: PropTypes.array,
	data: PropTypes.object,
};

export const AdmissionApplicantsByProgram = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const { data: dataProgram, loading: isProgramLoading } =
		useReadAdmissionProgramsById(decrypted);
	const [searchApplicantValue, setSearchApplicantValue] = useState('');

	const {
		data: dataAdmissionApplicants,
		fetchNextPage: fetchNextApplicants,
		hasNextPage: hasNextPageApplicants,
		isFetchingNextPage: isFetchingNextApplicants,
		isLoading: isLoadingApplicants,
		refetch: refetchApplicants,
	} = useReadAdmissionApplicants();

	const allApplicants =
		dataAdmissionApplicants?.pages?.flatMap((page) => page.results) ?? [];
	const isFiltering = searchApplicantValue.trim().length > 0;

	const filteredApplicants = allApplicants.filter((item) =>
		item?.person_full_name
			?.toLowerCase()
			.includes(searchApplicantValue.trim().toLowerCase())
	);

	const totalCount = isFiltering
		? filteredApplicants.length
		: (dataAdmissionApplicants?.pages?.[0]?.count ?? 0);

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
					w={'100%'}
					size={{
						xs: 'xs',
						sm: 'md',
						md: 'xl',
					}}
					color={'uni.secondary'}
				>
					<HStack
						w={'100%'}
						justifyContent={'space-between'}
						alignItems='center'
					>
						<Box>
							<Text>{dataProgram?.program_name}</Text>
							<Span fontSize='md' color='gray.500'>
								{isProgramLoading
									? 'Cargando...'
									: dataProgram?.admission_process_name}
							</Span>
						</Box>
						<AdmissionApplicantsMenu
							applicants={allApplicants}
							data={dataProgram}
						/>
					</HStack>
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
						value={searchApplicantValue}
						onChange={(e) => setSearchApplicantValue(e.target.value)}
					/>
				</InputGroup>
			</Stack>

			<AdmissionApplicantsByProgramTable
				programId={decrypted}
				isLoading={isLoadingApplicants}
				data={filteredApplicants}
				fetchNextPage={fetchNextApplicants}
				fetchData={refetchApplicants}
				totalCount={totalCount}
				hasNextPage={hasNextPageApplicants}
				isFetchingNext={isFetchingNextApplicants}
				resetPageTrigger={searchApplicantValue}
				permissions={permissions}
			/>
		</Box>
	);
};
