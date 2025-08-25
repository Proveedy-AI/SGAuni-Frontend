import { AdmissionApplicantsTable } from '@/components/tables/admissions';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Heading, InputGroup, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const AdmissionApplicants = () => {
	const [searchValue, setSearchValue] = useState({
		program_name: '',
		program_type: null,
		admission_process: null,
		date: null,
	});
	const { data: profile } = useReadUserLogged();

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	let queryParams = { status: 4 };

	// Según permisos agregamos el filtro
	if (permissions.includes('admissions.applicants.viewcoord')) {
		queryParams.coordinator = profile?.id;
	} else if (permissions.includes('admissions.applicants.viewdirector')) {
		queryParams.director = profile?.id;
	}

	const {
		data: dataAdmissionPrograms,
		fetchNextPage: fetchNextAdmissionPrograms,
		hasNextPage: hasNextPageAdmissionPrograms,
		isFetchingNextPage: isFetchingNextAdmissionPrograms,
		refetch: fetchAdmissionPrograms,
		isLoading,
	} = useReadAdmissionsPrograms(queryParams);

	const allAdmissionPrograms =
		dataAdmissionPrograms?.pages?.flatMap((page) => page.results) ?? [];
	const isFiltering =
		!!searchValue.program_name.trim() ||
		!!searchValue.program_type ||
		!!searchValue.admission_process ||
		!!searchValue.date;
	
	const filteredAdmissionPrograms = allAdmissionPrograms
		?.filter(
			(item) =>
				(!searchValue.program_name ||
					item.program_name
						.toLowerCase()
						.includes(searchValue.program_name.trim().toLowerCase())) &&
				(!searchValue.program_type?.value ||
					item.program_type.trim().toLowerCase() ===
						searchValue.program_type.label.trim().toLowerCase()) &&
				(!searchValue.admission_process?.value ||
					item.admission_process === searchValue.admission_process.value) &&
				(!searchValue.date ||
					item.semester_start_date.slice(0, 10) === searchValue.date)
		)
		?.sort((a, b) => b.id - a.id); // ascendente (usa b.id - a.id para descendente)

	const totalCount = isFiltering
		? filteredAdmissionPrograms.length
		: (allAdmissionPrograms?.length ?? 0);

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
				fetchNextPage={fetchNextAdmissionPrograms}
				hasNextPage={hasNextPageAdmissionPrograms}
				isFetchingNextPage={isFetchingNextAdmissionPrograms}
				resetPageTrigger={searchValue}
				totalCount={totalCount}
				permissions={[]}
				isLoading={isLoading}
			/>
		</Box>
	);
};
