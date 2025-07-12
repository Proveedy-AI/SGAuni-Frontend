import { ReactSelect } from '@/components';
import { UpdateTuitionProcessModal } from '@/components/modals/tuition';
import { TuitionListTable } from '@/components/tables/tuition';
import { Field } from '@/components/ui';
import { useProvideAuth } from '@/hooks/auth';
import { useReadEnrollments } from '@/hooks/enrollments_proccess';
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

// export const tuitionProcessesData = [
// 	{
// 		id: 1,
// 		academicPeriod: 'Cycle 2026-2',
// 		schedule: '13/08/26 - 20/12/26',
// 		status: 'Pending Approval',
// 		observation:
// 			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, quae.',
// 	},
// 	{
// 		id: 2,
// 		academicPeriod: 'Cycle 2026-1',
// 		schedule: '13/08/26 - 20/12/26',
// 		status: 'Configuration',
// 		observation: '',
// 	},
// 	{
// 		id: 3,
// 		academicPeriod: 'Cycle 2025-2',
// 		schedule: '13/08/26 - 20/12/26',
// 		status: 'Approved',
// 		observation: '',
// 	},
// ];

export const TuitionProcess = () => {
	const {
		data: dataEnrollments,
		refetch: fetchEnrollments,
		isLoading,
	} = useReadEnrollments();
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const [searchValue, setSearchValue] = useState('');
	const [actionType, setActionType] = useState('create');
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	// const statusOptions = Array.from(
	// 	new Set(tuitionProcessesData.map((item) => item.status))
	// ).map((status) => ({
	// 	label: status,
	// 	value: status,
	// }));

	const filteredTuitionProcesses = dataEnrollments?.results?.filter((item) => {
		const matchesSearch = item.academic_period_name
			?.toLowerCase()
			.includes(searchValue.toLowerCase());

		// const matchesStatus = selectedStatus
		// 	? item.status === selectedStatus.value
		// 	: true;

		return matchesSearch // && matchesStatus;
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

					{/* <Field flex={1} minW={'200px'} maxW={'300px'}>
						<ReactSelect
							label='Estado'
							placeholder='Filtrar por estado'
							isSearchable={false}
							options={statusOptions}
							value={selectedStatus}
							onChange={(value) => setSelectedStatus(value)}
							isClearable
							styles={{
								control: (base, state) => ({
									...base,
									fontSize: '14px',
									borderColor: state.isFocused ? '#711610' : base.borderColor,
									boxShadow: state.isFocused ? '0 0 0 1px #711610' : 'none',
									cursor: 'pointer',
									'&:hover': {
										borderColor: '#711610',
									},
								}),

								option: (base, state) => {
									const isSelected = state.isSelected;
									const isFocused = state.isFocused;

									return {
										...base,
										fontSize: '14px',
										backgroundColor: isSelected
											? '#711610'
											: isFocused
												? '#F2F2F2'
												: 'white',
										color: isSelected ? 'white' : 'black',
										cursor: 'pointer',
										'&:hover': {
											backgroundColor: isSelected ? '#711610' : '#F2F2F2',
											color: isSelected ? 'white' : 'black',
										},
									};
								},
							}}
						/>
					</Field> */}
				</Stack>

				{permissions?.includes('enrollments.proccess.create') && (
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
				existingNames={filteredTuitionProcesses?.map(item => item?.academic_period_name?.toLowerCase())}
			/>
		</Box>
	);
};
