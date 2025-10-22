import PropTypes from 'prop-types';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useReadTransferRequest } from '@/hooks/transfer_requests';
import { useEffect, useMemo, useState } from 'react';
import { ReactSelect } from '@/components';
import { ConvalidacionesList } from '../accordion/ConvalidacionesList';
import { ConvalidacionForm } from '../modals/ConvalidacionForm';

export const ValidationsStudent = ({ dataStudent }) => {
	const [selectProgram, setSelectProgram] = useState(null);
  console.log(selectProgram)
	const { data: dataAcademicTransfers, refetch: refetchAcademicTransfers } =
		useReadTransferRequest({
			to_program: selectProgram?.value,
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

	const academicProgress = dataAcademicTransfers?.results?.[0] ?? null;

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
					{academicProgress && (
						<ConvalidacionForm
							convalidationsData={academicProgress}
							dataStudent={dataStudent}
							fetchData={refetchAcademicTransfers}
						/>
					)}
				</Flex>
				{academicProgress && (
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='space-between'
						align='center'
						border='1px solid'
						borderColor='blue.300'
						borderRadius='md'
						bg='blue.50'
						p={4}
						gap={4}
					>
						{/* De Programa */}
						<Flex align='center' gap={2} flex={1}>
							<Box w={3} h={3} bg='blue.500' borderRadius='full' />
							<Box>
								<Text fontSize='xs' color='blue.600'>
									De Programa
								</Text>
								<Text fontWeight='bold' fontSize='sm' color='blue.800'>
									{academicProgress?.from_program_name || 'N/A'}
								</Text>
							</Box>
						</Flex>

						{/* Icono de transición */}
						<Flex justify='center' align='center'>
							<Text fontSize='lg' color='blue.400'>
								→
							</Text>
						</Flex>

						{/* A Programa */}
						<Flex align='center' gap={2} flex={1}>
							<Box w={3} h={3} bg='green.400' borderRadius='full' />
							<Box>
								<Text fontSize='xs' color='green.600'>
									A Programa
								</Text>
								<Text fontWeight='bold' fontSize='sm' color='green.800'>
									{academicProgress?.to_program_name || 'N/A'}
								</Text>
							</Box>
						</Flex>
					</Flex>
				)}
			</Stack>
			<ConvalidacionesList convalidationsData={academicProgress} student={dataStudent} program={selectProgram} />
		</Stack>
	);
};

ValidationsStudent.propTypes = {
	dataStudent: PropTypes.object.isRequired,
};
