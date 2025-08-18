import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	Separator,
	SimpleGrid,
	Stack,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import { FiEye } from 'react-icons/fi';
import { useState } from 'react';
import { formatDateString } from '@/components/ui/dateHelpers';
import {
	FaBookOpen,
	FaCalendarAlt,
	FaClock,
	FaGraduationCap,
	FaMapPin,
	FaUsers,
} from 'react-icons/fa';

export const PreviewAdmissionsProgramsModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	const statusMap = {
		Borrador: { label: 'Borrador', color: 'gray' },
		Pendiente: { label: 'Pendiente', color: 'orange.500' },
		Aprobado: { label: 'Aprobado', color: 'green' },
		Rechazado: { label: 'Rechazado', color: 'red' },
	};

	return (
		<Modal
			colortitle='#000000'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Mas información'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='blue'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
		>
			<Stack gap={2} px={6}>
				<Box
					top='0'
					bg='white'
					borderBottom='1px solid'
					borderColor='gray.200'
					px={6}
					py={4}
					zIndex={1}
				>
					<Flex justify='space-between' align='flex-start'>
						<Box>
							<Text fontSize='2xl' fontWeight='bold'>
								{data.program_name}
							</Text>
							<Flex align='center' gap={2} mt={2}>
								<Icon as={FaGraduationCap} color='blue.600' boxSize={4} />
								<Text fontSize='md' color='gray.600'>
									{data.study_mode_display}
								</Text>
							</Flex>
						</Box>

						<Flex align='center' gap={3}>
							{(() => {
								const status = statusMap[data.status_display] || {
									label: data.status_display,
									color: 'default',
								};
								return (
									<Badge variant='solid' bg={status.color}>
										{status.label}
									</Badge>
								);
							})()}
						</Flex>
					</Flex>
				</Box>

				<Card.Root borderLeft='4px solid' borderLeftColor='blue.500'>
					<Card.Header>
						<Flex align='center' gap={2}>
							<Icon as={FaBookOpen} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Información General</Heading>
						</Flex>
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FaCalendarAlt} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Inicio de Semestre
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{formatDateString(data.semester_start_date)}
								</Text>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
				<SimpleGrid
					columns={{ base: 1, md: data.exam_date_start ? 2 : 1 }}
					gap={4}
				>
					{/* Periodo de Inscripción */}
					<Card.Root borderLeft='4px solid' borderLeftColor='orange.500'>
						<Card.Header pb={1}>
							<Flex align='center' gap={1}>
								<Icon as={FaClock} boxSize={5} color='orange.600' />
								<Heading fontSize='24px'>Periodo de Inscripción</Heading>
							</Flex>
						</Card.Header>
						<Card.Body>
							<VStack align='start' gap={1}>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Fecha de Inicio
									</Text>
									<Text fontSize='lg' fontWeight='semibold' color='gray.900'>
										{formatDateString(data.registration_start_date)}
									</Text>
								</Box>

								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Fecha de Cierre
									</Text>
									<Text fontSize='lg' fontWeight='semibold' color='gray.900'>
										{formatDateString(data.registration_end_date)}
									</Text>
								</Box>
							</VStack>
						</Card.Body>
					</Card.Root>

					{data.exam_date_start && (
						<Card.Root borderLeft='4px solid' borderLeftColor='red.500'>
							<Card.Header pb={1}>
								<Flex align='center' gap={2}>
									<Icon as={FaMapPin} boxSize={5} color='red.600' />
									<Heading fontSize='24px'>Fechas de evaluaciones</Heading>
								</Flex>
							</Card.Header>
							<Card.Body>
								<VStack align='start' gap={1}>
									<Box>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Fecha de Inicio
										</Text>
										<Text fontSize='lg' fontWeight='semibold' color='gray.900'>
											{formatDateString(data.exam_date_start)}
										</Text>
									</Box>
									<Separator />
									<Box>
										<Text fontSize='sm' fontWeight='medium' color='gray.600'>
											Fecha de Finalización
										</Text>
										<Text fontSize='lg' fontWeight='semibold' color='gray.900'>
											{formatDateString(data.exam_date_end)}
										</Text>
									</Box>
								</VStack>
							</Card.Body>
						</Card.Root>
					)}
				</SimpleGrid>
				{data?.modalities && (
					<Card.Root borderLeft='4px solid' borderLeftColor='purple.500'>
						<Card.Header pb={3}>
							<Flex align='center' gap={2}>
								<Icon as={FaUsers} boxSize={5} color='purple.600' />
								<Heading fontSize='lg'>Modalidades Asignadas</Heading>
								<Badge
									variant='outline'
									bg='purple.50'
									color='purple.700'
									borderColor='purple.200'
									ml={2}
								>
									{data.modalities?.length || 0} modalidades
								</Badge>
							</Flex>
						</Card.Header>

						<Card.Body>
							<Table.Root size='sm' striped>
								<Table.Header>
									<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
										<Table.ColumnHeader>N°</Table.ColumnHeader>
										<Table.ColumnHeader>Modalidad</Table.ColumnHeader>
										<Table.ColumnHeader>Vacantes</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{data?.modalities?.map((item, index) => (
										<Table.Row
											key={item.id}
											bg={{ base: 'white', _dark: 'its.gray.500' }}
										>
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell>{item.modality_name}</Table.Cell>
											<Table.Cell>{item.vacancies}</Table.Cell>
										</Table.Row>
									))}
									{data?.modalities?.length === 0 && (
										<Table.Row>
											<Table.Cell colSpan={7} textAlign='center'>
												Sin datos disponibles
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table.Root>
						</Card.Body>
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

PreviewAdmissionsProgramsModal.propTypes = {
	data: PropTypes.object.isRequired,
};
