import { AdmissionApplicantsTable } from '@/components/tables/admissions';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';
import { Box, Heading, InputGroup, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const AdmissionApplicants = () => {
	const {
		data: dataAdmissionPrograms,
		refetch: fetchAdmissionPrograms,
		isLoading,
	} = useReadAdmissionsPrograms();
	const [searchValue, setSearchValue] = useState({
		program_name: '',
		program_type: null,
		admission_process: null,
		date: null,
	});

	const filteredAdmissionPrograms = dataAdmissionPrograms?.results?.filter(
		(item) =>
			item.status === 4 &&
			(!searchValue.program_name ||
				item.program_name
					.toLowerCase()
					.includes(searchValue.program_name.toLowerCase())) &&
			(!searchValue.program_type?.value ||
				item.program_type.toLowerCase() ===
					searchValue.program_type.label.toLowerCase()) &&
			(!searchValue.admission_process?.value ||
				item.admission_process === searchValue.admission_process.value) &&
			(!searchValue.date ||
				item.semester_start_date.slice(0, 10) === searchValue.date)
	);

	console.log(dataAdmissionPrograms);

	return (
		<Box spaceY='5'>
			<Stack
				Stack
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
					Postulantes
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
						placeholder='Buscar por nombre del programa ...'
						value={searchValue.program_name}
						onChange={(e) =>
							setSearchValue({ ...searchValue, program_name: e.target.value })
						}
					/>
				</InputGroup>
			</Stack>

			<AdmissionApplicantsTable
				data={filteredAdmissionPrograms}
				fetchData={fetchAdmissionPrograms}
				permissions={[]}
				search={searchValue}
				isLoading={isLoading}
				setSearch={setSearchValue}
			/>
		</Box>
	);
};
