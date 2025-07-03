import { ReactSelect } from '@/components';
import { AddTuitionProcessModal } from '@/components/modals/tuition';
import { TuitionProcessesTable } from '@/components/tables/tuition';
import { Field, toaster } from '@/components/ui';
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

export const tuitionProcessesData = [
	{
		id: 1,
		academicPeriod: 'Cycle 2026-2',
		schedule: '13/08/26 - 20/12/26',
		status: 'Pending Approval',
		observation:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, quae.',
	},
	{
		id: 2,
		academicPeriod: 'Cycle 2026-1',
		schedule: '13/08/26 - 20/12/26',
		status: 'Configuration',
		observation: '',
	},
	{
		id: 3,
		academicPeriod: 'Cycle 2025-2',
		schedule: '13/08/26 - 20/12/26',
		status: 'Approved',
		observation: '',
	},
];

export const Tuition = () => {
	// const {
	//     data: dataProgramsForEvaluator,
	// } = useReadProgramsForEvaluator()

	const [searchValue, setSearchValue] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);

	const statusOptions = Array.from(
		new Set(tuitionProcessesData.map((item) => item.status))
	).map((status) => ({
		label: status,
		value: status,
	}));

	const filteredTuitionProcesses = tuitionProcessesData.filter((item) => {
		const matchesSearch = item.academicPeriod
			?.toLowerCase()
			.includes(searchValue.toLowerCase());

		const matchesStatus = selectedStatus
			? item.status === selectedStatus.value
			: true;

		return matchesSearch && matchesStatus;
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

					<Field flex={1} minW={'200px'} maxW={'300px'}>
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
					</Field>
				</Stack>

				<Button
					bg='uni.secondary'
					size='xs'
					borderRadius='md'
					onClick={() => {
						setModalData(null);
						setIsModalOpen(true);
					}}
				>
					<FiPlus color='white' />
					<div style={{ marginRight: 3, marginBottom: 2 }}>Crear período</div>
				</Button>
			</Stack>

			<TuitionProcessesTable
				data={filteredTuitionProcesses}
				isLoading={false}
				setIsModalOpen={setIsModalOpen}
				setModalData={setModalData}
			/>

			<AddTuitionProcessModal
				open={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setModalData(null)
				}}
				data={modalData}
			/>
		</Box>
	);
};
