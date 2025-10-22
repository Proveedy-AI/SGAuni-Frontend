import { UpdateTuitionProcessModal } from '@/components/modals/tuition';
import { TuitionListTable } from '@/components/tables/tuition';
import { useReadEnrollments } from '@/hooks/enrollments_proccess';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Button,
	Heading,
	Input,
	InputGroup,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

export const TuitionProcess = () => {
	const {
		data: dataEnrollments,
		refetch: fetchEnrollments,
		isLoading,
	} = useReadEnrollments();
	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');
	const [actionType, setActionType] = useState('create');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	const filteredTuitionProcesses = dataEnrollments?.results?.filter((item) => {
		const matchesSearch = item.academic_period_name
			?.toLowerCase()
			.includes(searchValue.toLowerCase());
		return matchesSearch; // && matchesStatus;
	});

	return (
		<Box spaceY='5'>
			<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>
				Procesos de Matrícula
			</Heading>

			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
				flexWrap={'wrap'}
				gap={22}
			>
				<Stack
					direction={{ base: 'column', sm: 'row' }}
					align={{ base: 'start', sm: 'center' }}
					flexWrap={'wrap'}
					flex={1}
				>
					<InputGroup
						startElement={<FiSearch />}
						flex={1}
						minW={'240px'}
						maxW={'400px'}
					>
						<Input
							size='sm'
							bg={'white'}
							maxWidth={'450px'}
							placeholder='Buscar por período'
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</InputGroup>
				</Stack>

				{permissions?.includes('enrollments.proccessEnrollments.create') && (
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
						<div style={{ marginRight: 3, marginBottom: 2 }}>Crear período</div>
					</Button>
				)}
			</Stack>

			<TuitionListTable
				data={filteredTuitionProcesses}
				fetchData={fetchEnrollments}
				permissions={permissions}
				isLoading={isLoading}
				setIsModalOpen={setIsModalOpen}
				setModalData={setModalData}
				setActionType={setActionType}
			/>

			<UpdateTuitionProcessModal
				open={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setModalData(null);
				}}
				data={modalData}
				fetchData={fetchEnrollments}
				actionType={actionType}
				existingNames={filteredTuitionProcesses?.map((item) =>
					item?.academic_period_name?.toLowerCase()
				)}
			/>
		</Box>
	);
};
