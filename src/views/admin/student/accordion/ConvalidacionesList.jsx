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
import { FiRepeat, FiInbox } from 'react-icons/fi';

export const ConvalidacionesList = ({ filteredAcademicProgressByProgram }) => {
	console.log(filteredAcademicProgressByProgram);
	// ejemplo de datos mock mientras conectas con tu API
	const convalidaciones = [];

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
				{convalidaciones.length === 0 ? (
					<Center flexDir='column' py={10} color='gray.500'>
						<Icon as={FiInbox} boxSize={10} mb={2} />
						<Text fontSize='sm'>No existen convalidaciones actualmente</Text>
					</Center>
				) : (
					<Accordion.Root multiple variant='subtle' colorPalette='green'>
						{convalidaciones.map((conv, index) => (
							<Accordion.Item key={conv.id ?? index} value={String(index)}>
								<h2>
									<Accordion.ItemTrigger>
										<Box flex='1' textAlign='left'>
											<Text fontWeight='bold'>
												Nuevo curso: {conv.new_course.name} (
												{conv.new_course.code})
											</Text>
											<Text fontSize='sm' color='gray.500'>
												Créditos: {conv.new_course.credits} | Nota:{' '}
												{conv.new_course.grade} |{' '}
												<Badge colorScheme='green'>
													{conv.new_course.status}
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
													<Table.ColumnHeader>Estado</Table.ColumnHeader>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{conv.old_courses.map((c, idx) => (
													<Table.Row key={idx}>
														<Table.Cell>{c.code}</Table.Cell>
														<Table.Cell>{c.name}</Table.Cell>
														<Table.Cell>{c.credits}</Table.Cell>
														<Table.Cell>{c.grade}</Table.Cell>
														<Table.Cell>
															<Badge
																colorScheme={
																	c.status === 'Aprobado' ? 'green' : 'red'
																}
															>
																{c.status}
															</Badge>
														</Table.Cell>
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
	filteredAcademicProgressByProgram: PropTypes.array,
};
