import { StudentTuitionTable } from '@/components/tables/students/StudentTuitionTable';

import { Card, Heading, HStack, Icon, SimpleGrid } from '@chakra-ui/react';
import { FiClipboard } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const EnrollmentStudent = ({ myEnrollment, isLoadingEnrollment }) => {
	return (
		<SimpleGrid columns={{ base: 1, lg: 1 }} gap={6}>
			<Card.Root shadow={'md'}>
				<Card.Header pb={0}>
					<HStack gap={2}>
						<Icon as={FiClipboard} boxSize={5} />
						<Heading size='md'>Matrículas</Heading>
					</HStack>
				</Card.Header>

				<Card.Body>
					<StudentTuitionTable
						data={myEnrollment}
						isLoading={isLoadingEnrollment}
					/>
				</Card.Body>
			</Card.Root>
		</SimpleGrid>
	);
};

EnrollmentStudent.propTypes = {
	dataPerson: PropTypes.object.isRequired,
	myEnrollment: PropTypes.array.isRequired,
	isLoadingEnrollment: PropTypes.bool.isRequired,
	dataDocuments: PropTypes.object.isRequired,
};
