import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	Stack,
	Table,
	Badge,
	Text,
	Flex,
	Icon,
	Card,
	Heading,
	SimpleGrid,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import { LuFileText, LuHistory } from 'react-icons/lu';
import { FiAlertCircle } from 'react-icons/fi';
import { ObservationCell } from '../admissions/ObservationCell';
import { formatDateString } from '@/components/ui/dateHelpers';
import { useReadCourseScheduleReview } from '@/hooks/enrollments_programs/schedule/useReadCourseScheduleReview';

export const HistoryStatusCourseSheduleView = ({ data, statusMap }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { data: admissionReviews } = useReadCourseScheduleReview(
		{ course_schedule: data.id },
		{ enabled: open } // Evita llamada automática
	);

	const approvedCount =
		admissionReviews?.results?.filter((r) => r.status_display === 'Aprobado')
			.length || 0;
	const rejectedCount =
		admissionReviews?.results?.filter((r) => r.status_display === 'Rechazado')
			.length || 0;
	const totalEvaluations =
		admissionReviews?.results?.filter((review) => review.review_at !== null)
			.length || 0;

	return (
		<Modal
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Historial de estados'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						{(() => {
							const status = statusMap[data.status_review] || {
								label: data.status_display,
								color: 'gray',
							};
							return (
								<Badge variant='solid' cursor='pointer' bg={status.color}>
									{status.label}
								</Badge>
							);
						})()}
					</Tooltip>
				</Box>
			}
			size='6xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack gap={2} px={6}>
				<Box
					top='0'
					bg='white'
					borderBottom='1px solid'
					borderColor='gray.200'
					pb={2}
					px={6}
					zIndex={1}
				>
					<Flex justify='space-between' align='flex-start'>
						<Box>
							<Flex align='center' gap={2}>
								<Icon as={LuHistory} color='blue.600' boxSize={6} />
								<Text fontSize='2xl' fontWeight='bold'>
									Historial de Estados
								</Text>
							</Flex>
						</Box>
						<Flex align='center' gap={3}>
							{(() => {
								const status = statusMap[data.status_review] || {
									label: data.status_display,
									color: 'gray',
									icon: FiAlertCircle,
								};
								return (
									<Badge
										variant='solid'
										bg={status.color}
										display='flex'
										alignItems='center'
										gap={1}
										px={2}
										py={1}
										borderRadius='md'
									>
										<Icon as={status.icon} className='h-4 w-4' />
										<Text ml={1}>{status.label}</Text>
									</Badge>
								);
							})()}
						</Flex>
					</Flex>
					<Flex align='center' gap={2} mt={2}>
						<Text fontSize='md' color='gray.600'>
							{data.program_name}
						</Text>
					</Flex>
				</Box>
				<SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
					<Card.Root className='text-center'>
						<Card.Body pt={4}>
							<Heading fontSize='2xl' fontWeight='bold' color='blue.600'>
								{totalEvaluations}
							</Heading>
							<Text fontSize='sm' color='gray.600'>
								Total Evaluaciones
							</Text>
						</Card.Body>
					</Card.Root>

					<Card.Root className='text-center'>
						<Card.Body pt={4}>
							<Heading fontSize='2xl' fontWeight='bold' color='green.600'>
								{approvedCount}
							</Heading>
							<Text fontSize='sm' color='gray.600'>
								Aprobaciones
							</Text>
						</Card.Body>
					</Card.Root>

					<Card.Root className='text-center'>
						<Card.Body pt={4}>
							<Heading fontSize='2xl' fontWeight='bold' color='red.600'>
								{rejectedCount}
							</Heading>
							<Text fontSize='sm' color='gray.600'>
								Rechazos
							</Text>
						</Card.Body>
					</Card.Root>

					<Card.Root className='text-center'>
						<Card.Body pt={4}>
							<Heading fontSize='2xl' fontWeight='bold' color='purple.600'>
								{totalEvaluations > 0
									? Math.round((approvedCount / totalEvaluations) * 100)
									: 0}
								%
							</Heading>
							<Text fontSize='sm' color='gray.600'>
								Tasa Aprobación
							</Text>
						</Card.Body>
					</Card.Root>
				</SimpleGrid>
				<Card.Root borderLeft='4px solid' borderLeftColor='blue.500'>
					<Card.Header>
						<Flex align='center' gap={2}>
							<Icon as={LuFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'> Registro de Evaluaciones</Heading>
						</Flex>
					</Card.Header>
					<Card.Body>
						{' '}
						<Box>
							<Table.Root size='sm' striped>
								<Table.Header>
									<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
										<Table.ColumnHeader>N°</Table.ColumnHeader>
										<Table.ColumnHeader>Fecha de Revisión</Table.ColumnHeader>
										<Table.ColumnHeader>Estado</Table.ColumnHeader>
										<Table.ColumnHeader>Observación</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{admissionReviews?.results?.filter(
										(review) => review.reviewed_at !== null
									).length > 0 ? (
										admissionReviews?.results.map((item, index) => (
											<Table.Row
												key={item.id}
												bg={{ base: 'white', _dark: 'its.gray.500' }}
											>
												<Table.Cell>{index + 1}</Table.Cell>
												<Table.Cell>
													{formatDateString(item?.reviewed_at) || ''}
												</Table.Cell>
												<Table.Cell>
													{(() => {
														const status = statusMap[item.status] || {
															label: item.status_display,
															color: 'gray',
															icon: FiAlertCircle,
														};
														return (
															<Badge
																variant='solid'
																colorPalette={status.color}
																gap={1}
																px={2}
																py={1}
																borderRadius='md'
															>
																<Icon as={status.icon} className='h-4 w-4' />
																<Text ml={1}>{status.label}</Text>
															</Badge>
														);
													})()}
												</Table.Cell>
												<Table.Cell>
													<ObservationCell
														comments={item.comments}
														index={index}
													/>
												</Table.Cell>
											</Table.Row>
										))
									) : (
										<Table.Row>
											<Table.Cell colSpan={7} textAlign='center'>
												Sin datos disponibles
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table.Root>
						</Box>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

HistoryStatusCourseSheduleView.propTypes = {
	data: PropTypes.object,
	statusMap: PropTypes.object,
};
