import { useReadConvalidationRegister } from '@/hooks/convalidation/useReadConvalidationRegister';
import {
	Accordion,
	Box,
	Table,
	Text,
	Stack,
	Badge,
	Card,
	Icon,
	HStack,
	Heading,
	Center,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FiRepeat, FiInbox } from 'react-icons/fi';

export const ConvalidacionesList = ({ convalidationsData, student, program }) => {
  const filterParams = useMemo(() => {
      const params = {};
      if (convalidationsData) params.transfer_request = convalidationsData?.id;
      if (!convalidationsData && student) params.to_program = program?.value;
      if (!convalidationsData && program) params.student = student?.id;
      return params;
    }, [convalidationsData, program, student]);

	const { data: convalidacionesDatCourses } = useReadConvalidationRegister(
		filterParams,
		{ enabled: Object.keys(filterParams).length > 0 }
	);

	const convalidaciones = convalidacionesDatCourses?.results || [];

	return (
		<Card.Root shadow={'md'}>
			<Card.Header pb={0}>
				<Stack
					justify='space-between'
					align={{ base: 'flex-start', md: 'center' }}
					direction={{ base: 'column', md: 'row' }}
					spacing={{ base: 3, md: 6 }}
					w='full'
				>
					<HStack>
						<Icon as={FiRepeat} boxSize={5} />
						<Heading size='md'>Convalidaciones</Heading>
					</HStack>
				</Stack>
			</Card.Header>
			<Card.Body>
				{convalidaciones?.length === 0 ? (
					<Center flexDir='column' py={10} color='gray.500'>
						<Icon as={FiInbox} boxSize={10} mb={2} />
						<Text fontSize='sm'>No existen convalidaciones actualmente</Text>
					</Center>
				) : (
					<Accordion.Root multiple variant='subtle' colorPalette='green'>
						{convalidaciones?.map((conv, index) => (
							<Accordion.Item key={conv.id ?? index} value={String(index)}>
								<h2 >
									<Accordion.ItemTrigger cursor='pointer' _hover={{ bg: 'blue.50' }}>
										<Box  flex='1' textAlign='left'>
											<Text fontWeight='bold'>
												Nuevo curso: {conv.new_course.course} (
												{conv.new_course.code})
											</Text>
											<Text fontSize='sm' color='gray.500'>
												Créditos: {conv.new_course.credits} | Ciclo:{' '}
												{conv.new_course.cycle} |{' '}
                        Tipo: {conv.type_convalidation ?? 'Convalidado'} |{' '}
												<Badge colorScheme='green'>
													Convalidado
												</Badge>
											</Text>
										</Box>
										<Accordion.ItemIndicator />
									</Accordion.ItemTrigger>
								</h2>
								<Accordion.ItemContent pb={4}>
									<Stack spacing={2}>
										<Text fontWeight='semibold'>
											Cursos antiguos convalidados:
										</Text>
										<Table.Root size='sm' striped>
											<Table.Header>
												<Table.Row>
													<Table.ColumnHeader>Código</Table.ColumnHeader>
													<Table.ColumnHeader>Nombre</Table.ColumnHeader>
													<Table.ColumnHeader>Créditos</Table.ColumnHeader>
													<Table.ColumnHeader>Nota</Table.ColumnHeader>
													
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{conv.old_courses.map((c, idx) => (
													<Table.Row key={idx}>
														<Table.Cell>{c.course_code}</Table.Cell>
														<Table.Cell>{c.course_name}</Table.Cell>
														<Table.Cell>{c.credits}</Table.Cell>
														<Table.Cell>{c.grade}</Table.Cell>
														
													</Table.Row>
												))}
											</Table.Body>
										</Table.Root>
									</Stack>
								</Accordion.ItemContent>
							</Accordion.Item>
						))}
					</Accordion.Root>
				)}
			</Card.Body>
		</Card.Root>
	);
};

ConvalidacionesList.propTypes = {
	convalidationsData: PropTypes.object,
	student: PropTypes.object,
	program: PropTypes.object,
};
