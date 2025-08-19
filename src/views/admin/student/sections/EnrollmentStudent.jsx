import { StudentTuitionTable } from '@/components/tables/students/StudentTuitionTable';

import {
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
}) => {
	const [selectProgram, setSelectProgram] = useState(null);
	console.log(myEnrollment, selectProgram);
	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs?.map((program) => ({
				label: program.program_name,
				value: program.program,
			})) || [],
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
						justify={'space-between'}
						align='center'
						direction={{ base: 'column', md: 'row' }}
					>
						<HStack>
							<Icon as={FiClipboard} boxSize={5} />
							<Heading size='md'>Matrículas</Heading>
						</HStack>

						<HStack>
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
							<AddEnrollmentStudentForm
								dataStudent={dataStudent}
								selectProgram={selectProgram}
							/>
						</HStack>
					</Stack>
				</Card.Header>

				<Card.Body>
					<StudentTuitionTable
						dataStudent={dataStudent}
						data={filteredEnrollment}
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
};
