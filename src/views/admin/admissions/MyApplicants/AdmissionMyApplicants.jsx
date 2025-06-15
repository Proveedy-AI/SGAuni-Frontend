import { PersonalDataApplicants } from '@/components/forms/admissions/MyApplicants';
import { AdmissionApplicantsTable } from '@/components/tables/admissions';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Heading, Stack, Spinner, Flex } from '@chakra-ui/react';
import { useState } from 'react';

export const AdmissionMyApplicants = () => {
	const {
		data: dataAdmissionPrograms,
		refetch: fetchAdmissionPrograms,
		isLoading,
	} = useReadAdmissionsPrograms();
	const {
		data: dataUser,
		isLoading: isLoadingDataUser,
		refetch: fetchDataUser,
	} = useReadUserLogged();
	const [searchValue, setSearchValue] = useState({
		program_name: '',
		program_type: null,
		admission_process: null,
		date: null,
	});

	const filteredAdmissionPrograms = dataAdmissionPrograms?.results?.filter(
		(item) =>
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
console.log(dataUser?.document_path)
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
					Mis Postulantes
				</Heading>
			</Stack>

			{isLoading && (
				<Flex
					height='50vh'
					align='center'
					justify='center'
					bg='white' // opcional: color de fondo
				>
					<Spinner
						size='xl'
						thickness='4px'
						speed='0.65s'
						color='uni.primary'
					/>
				</Flex>
			)}
			{!isLoading && dataUser?.document_path && (
				<PersonalDataApplicants
					loading={isLoadingDataUser}
					fetchUser={fetchDataUser}
          data={dataUser}
				/>
			)}
			{
				<>
					{!isLoading &&
						dataAdmissionPrograms?.results?.length > 0 &&
						dataUser?.document_path && (
							<AdmissionApplicantsTable
								data={filteredAdmissionPrograms}
								fetchData={fetchAdmissionPrograms}
								permissions={[]}
								search={searchValue}
								setSearch={setSearchValue}
							/>
						)}
				</>
			}
		</Box>
	);
};
