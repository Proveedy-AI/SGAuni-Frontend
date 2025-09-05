import { StudentTuitionTable } from '@/components/tables/students/StudentTuitionTable';

import {
	Box,
	Card,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { FiClipboard } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { AddEnrollmentStudentForm } from '../modals/AddEnrollmentStudentForm';
import { ReactSelect } from '@/components';
import { useEffect, useMemo, useState } from 'react';

export const EnrollmentStudent = ({
	dataStudent,
	myEnrollment,
	isLoadingEnrollment,
	fetchData,
}) => {
	const [selectProgram, setSelectProgram] = useState(null);

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs
				?.map((program) => ({
					label: program.program_name,
					value: program.program,
				}))
				.reverse() || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);

	const filteredEnrollment = useMemo(() => {
		if (!myEnrollment) return [];
		if (!selectProgram) return myEnrollment; // si no hay selección, muestra todo

		return Array.isArray(myEnrollment)
			? myEnrollment.filter(
					(enroll) => enroll.program_name === selectProgram.label
				)
			: myEnrollment.program_name === selectProgram.label
				? [myEnrollment]
				: [];
	}, [myEnrollment, selectProgram]);

	return (
		<SimpleGrid columns={{ base: 1, lg: 1 }} gap={6}>
			<Card.Root shadow={'md'}>
				<Card.Header pb={0}>
					<Stack
						justify='space-between'
						align={{ base: 'flex-start', md: 'center' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={{ base: 3, md: 6 }}
						w='full'
					>
						{/* Título */}
						<HStack>
							<Icon as={FiClipboard} boxSize={5} />
							<Heading size='md'>Matrículas</Heading>
						</HStack>

						{/* Filtros y acciones */}
						<Stack
							direction={{ base: 'column', sm: 'row' }}
							spacing={{ base: 2, md: 4 }}
							w={{ base: 'full', md: 'auto' }}
              overflow={{ base: 'auto', md: 'hidden' }}
						>
							<Box flex='1' minW={{ base: 'full', sm: '200px', md: '400px' }}>
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

							<AddEnrollmentStudentForm
								dataStudent={dataStudent}
								selectProgram={selectProgram}
								fetchData={fetchData}
							/>
						</Stack>
					</Stack>
				</Card.Header>

				<Card.Body>
					<StudentTuitionTable
						dataStudent={dataStudent}
						data={filteredEnrollment}
						fetchData={fetchData}
						isLoading={isLoadingEnrollment}
					/>
				</Card.Body>
			</Card.Root>
		</SimpleGrid>
	);
};

EnrollmentStudent.propTypes = {
	myEnrollment: PropTypes.array.isRequired,
	isLoadingEnrollment: PropTypes.bool.isRequired,
	dataStudent: PropTypes.object.isRequired,
	fetchData: PropTypes.func,
};
