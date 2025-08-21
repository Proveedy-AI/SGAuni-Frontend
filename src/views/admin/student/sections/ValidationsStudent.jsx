import PropTypes from 'prop-types';
import { Box, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useReadTransferRequest } from '@/hooks/transfer_requests';
import { useEffect, useMemo, useState } from 'react';
import { ReactSelect } from '@/components';
import { ConvalidacionesList } from '../accordion/ConvalidacionesList';
import { ConvalidacionForm } from '../modals/ConvalidacionForm';

export const ValidationsStudent = ({ dataStudent }) => {
	const [selectProgram, setSelectProgram] = useState(null);
	const { data: dataAcademicTransfers } = useReadTransferRequest({
		status: 4,
		student: dataStudent?.id,
	});

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs
				?.map((program) => ({
					label: program.program_name,
					value: program.program,
					academic_status: program.academic_status,
					academic_status_display: program.academic_status_display,
				}))
				.reverse() || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);

	const filteredAcademicProgressByProgram =
		dataAcademicTransfers?.results?.find(
			(data) =>
				data?.to_program === selectProgram?.value &&
				data?.student === dataStudent?.id &&
				data?.status === 4
		);

	return (
		<Stack gap={4}>
			<Stack bg='blue.100' p={4} borderRadius={6} overflow='hidden'>
				<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
					<Flex align='center' gap={3} flex={1}>
						<Text
							py={1}
							pr={2}
							color='blue.600'
							fontSize='md'
							fontWeight='bold'
						>
							Programa Académico:
						</Text>
						<Box
							bg='white'
							borderRadius={6}
							flex={1}
							maxW={{ base: 'full', lg: '320px' }}
							fontSize='sm'
						>
							<ReactSelect
								placeholder='Filtrar por programa...'
								value={selectProgram}
								onChange={(value) => setSelectProgram(value)}
								variant='flushed'
								size='xs'
								isSearchable
								isClearable
								options={ProgramsOptions}
							/>
						</Box>
					</Flex>
					<ConvalidacionForm />
				</Flex>
				{filteredAcademicProgressByProgram && (
					<Flex
						justify='space-between'
						border='1px solid'
						borderColor='blue.400'
						borderRadius={8}
						direction={{ base: 'column', lg: 'row' }}
						fontSize={'sm'}
					>
						<SimpleGrid
							p={2}
							borderEndWidth={1}
							borderColor='blue.400'
							flex={1}
							columns={1}
						>
							<Text>
								<b>De programa:</b>{' '}
								{filteredAcademicProgressByProgram?.from_program_name}
							</Text>
							<Text>
								<b>A programa:</b>{' '}
								{filteredAcademicProgressByProgram?.to_program_name}
							</Text>
						</SimpleGrid>
					</Flex>
				)}
			</Stack>
			<ConvalidacionesList
				filteredAcademicProgressByProgram={filteredAcademicProgressByProgram}
			/>
		</Stack>
	);
};

ValidationsStudent.propTypes = {
	dataStudent: PropTypes.object.isRequired,
};
