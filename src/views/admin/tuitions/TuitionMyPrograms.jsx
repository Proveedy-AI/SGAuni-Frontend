import {
	Box,
	Heading,
	InputGroup,
	Input,
	Stack,
	Breadcrumb,
	Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { useReadEnrollmentsPrograms } from '@/hooks/enrollments_programs';
import { useReadEnrollmentById } from '@/hooks/enrollments_proccess';
import { LiaSlashSolid } from 'react-icons/lia';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { EnrollmentsMyProgramsTable } from '@/components/tables/tuition';
import { UpdateTuitionProgramsModal } from '@/components/modals/tuition';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const TuitionMyPrograms = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { data } = useReadEnrollmentById(decrypted);
	const {
		data: dataEnrollmentsPrograms,
		refetch: fetchEnrollmentsPrograms,
		isLoading,
	} = useReadEnrollmentsPrograms();

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');
	const [actionType, setActionType] = useState('create');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	const filteredEnrollmentsPrograms = dataEnrollmentsPrograms?.results?.filter(
		(item) => {
			const matchesSearch = item.program_name
				?.toLowerCase()
				.includes(searchValue.toLowerCase());

			return matchesSearch;
		}
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
					{data?.academic_period_name}
				</Heading>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'center' }}
				justify='space-between'
			>
				<InputGroup
					startElement={<FiSearch />}
					flex='1'
					minW={'240px'}
					maxW={'400px'}
				>
					<Input
						size='sm'
						bg={'white'}
						maxWidth={'450px'}
						placeholder='Buscar por programa'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>

				{permissions?.includes('enrollments.myprogramsEnrollments.create') && (
					<Button
						bg='uni.secondary'
						size='xs'
						borderRadius='md'
						onClick={() => {
							setModalData(null);
							setIsModalOpen(true);
							setActionType('create');
						}}
					>
						<FiPlus color='white' />
						<div style={{ marginRight: 3, marginBottom: 2 }}>
							Añadir Programas
						</div>
					</Button>
				)}
			</Stack>

			<EnrollmentsMyProgramsTable
				isLoading={isLoading}
				data={filteredEnrollmentsPrograms}
				fetchData={fetchEnrollmentsPrograms}
				permissions={permissions}
				setIsModalOpen={setIsModalOpen}
				setModalData={setModalData}
				setActionType={setActionType}
			/>

			<UpdateTuitionProgramsModal
				open={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setModalData(null);
				}}
				data={modalData}
				profileId={profile?.id}
				processData={data}
				fetchData={fetchEnrollmentsPrograms}
				actionType={actionType}
			/>
		</Box>
	);
};
