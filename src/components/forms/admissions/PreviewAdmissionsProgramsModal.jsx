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
	Text,
	VStack,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import {
	FiBookOpen,
	FiCalendar,
	FiClock,
	FiEye,
	FiMapPin,
} from 'react-icons/fi';
import { useState } from 'react';
import { formatDateString } from '@/components/ui/dateHelpers';
import { FaGraduationCap } from 'react-icons/fa';
import { da } from 'date-fns/locale';

export const PreviewAdmissionsProgramsModal = ({ data, statusMap }) => {
	const [open, setOpen] = useState(false);

	return (
		<Modal
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
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
			hiddenFooter={true}
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
								{data.program_name || data.postgraduate_name}
							</Text>
							<Flex align='center' gap={2} mt={2}>
								<Icon as={FaGraduationCap} color='blue.600' boxSize={4} />
								<Text fontSize='md' color='gray.600'>
									{data.study_mode_display || data.postgraduate_type
}
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
							<Icon as={FiBookOpen} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Información General</Heading>
						</Flex>
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiCalendar} boxSize={4} color='green.600' />
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
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					{/* Periodo de Inscripción */}
					<Card.Root borderLeft='4px solid' borderLeftColor='orange.500'>
						<Card.Header pb={1}>
							<Flex align='center' gap={1}>
								<Icon as={FiClock} boxSize={5} color='orange.600' />
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

					{/* Fechas de Examen */}
					<Card.Root borderLeft='4px solid' borderLeftColor='red.500'>
						<Card.Header pb={1}>
							<Flex align='center' gap={2}>
								<Icon as={FiMapPin} boxSize={5} color='red.600' />
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
				</SimpleGrid>
			</Stack>
		</Modal>
	);
};

PreviewAdmissionsProgramsModal.propTypes = {
	data: PropTypes.object.isRequired,
	statusMap: PropTypes.object.isRequired,
};
