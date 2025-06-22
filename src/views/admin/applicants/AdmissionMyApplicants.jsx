import { PersonalDataApplicants } from '@/components/forms/admissions/MyApplicants';
import { MyApplicantsTable } from '@/components/tables/myApplicants';
import { useReadMyApplicants } from '@/hooks';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Heading, Stack, Spinner, Flex } from '@chakra-ui/react';
import { useState } from 'react';

export const AdmissionMyApplicants = () => {
	const {
		data: dataMyApplicants,
		refetch: fetchMyApplicants,
		isLoading,
	} = useReadMyApplicants();
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

	console.log(dataMyApplicants);

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
					Mis Postulaciones
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
			{!isLoading && !dataUser?.document_path && (
				<PersonalDataApplicants
					loading={isLoadingDataUser}
					fetchUser={fetchDataUser}
					data={dataUser}
				/>
			)}
			{
				<>
					{!isLoading &&
						dataMyApplicants?.length > 0 &&
						dataUser?.document_path && (
							<MyApplicantsTable
								data={dataMyApplicants}
								fetchData={fetchMyApplicants}
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
