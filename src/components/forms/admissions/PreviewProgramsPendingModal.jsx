import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	IconButton,
	SimpleGrid,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import { Field, Modal, Tooltip } from '@/components/ui';
import { FiEye } from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';

export const PreviewProgramsPendingModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	const statusMap = {
		Draft: { label: 'Borrador', color: 'gray' },
		Pending: { label: 'Pendiente', color: 'orange.500' },
		Approved: { label: 'Aprobado', color: 'green' },
		Rejected: { label: 'Rechazado', color: 'red' },
	};
	const typeMap = {
		1: 'Investigación',
		2: 'Profesionalizante',
	};
	console.log(data);
	return (
		<Modal
			title='Vista previa del Programa de Admisión'
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
							colorPalette='gray'
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
			<Stack css={{ '--field-label-width': '140px' }}>
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field color='gray' label='Programa:'>
						<Text color={'black'} fontSize='xl'>
							{data.program_name}
						</Text>
					</Field>

					<Field color='gray' label='Tipo de Postgrado:'>
						<Text color='black' fontSize='lg'>
							{typeMap[data.postgrad_type] || 'No definido'}
						</Text>
					</Field>

					<Field color='gray' label='Modo de estudio:'>
						<Text color={'black'} fontSize='xl'>
							{data.study_mode_display}
						</Text>
					</Field>
					<Field label='Estado:'>
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
					</Field>
				</SimpleGrid>
				<Stack spacing={4} mt={4}>
					{/* Inicio de semestre */}
					<Field color={'uni.secondary'} label='Inicio de semestre:'>
						<Text color='black' fontWeight='medium'>
							{format(new Date(data.semester_start_date), 'dd/MM/yyyy')}
						</Text>
					</Field>

					{/* Fechas de inscripción */}
					<Box>
						<Text fontWeight='semibold' color={'uni.secondary'} mb={2}>
							Periodo de Inscripción:
						</Text>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<Field label='Inicio:'>
								<Text>
									{format(
										new Date(data.registration_start_date),
										'dd/MM/yyyy'
									) || '—'}
								</Text>
							</Field>
							<Field label='Fin:'>
								<Text>
									{' '}
									{format(new Date(data.registration_end_date), 'dd/MM/yyyy') ||
										'—'}
								</Text>
							</Field>
						</SimpleGrid>
					</Box>

					{/* Fechas de examen */}
					<Box>
						<Text color={'uni.secondary'} fontWeight='semibold' mb={2}>
							Fechas de Examen:
						</Text>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<Field label='Inicio:'>
								<Text>
									{format(new Date(data.exam_date_start), 'dd/MM/yyyy') || '—'}
								</Text>
							</Field>
							<Field label='Fin:'>
								<Text>
									{format(new Date(data.exam_date_end), 'dd/MM/yyyy') || '—'}
								</Text>
							</Field>
						</SimpleGrid>
					</Box>

					{/* Pre-maestría */}
					<Box>
						<Text color={'uni.secondary'} fontWeight='semibold' mb={2}>
							Pre-Maestría:
						</Text>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<Field label='Inicio:'>
								<Text>
									{data.pre_master_start_date
										? format(new Date(data.pre_master_start_date), 'dd/MM/yyyy')
										: '—'}
								</Text>
							</Field>
							<Field label='Fin:'>
								<Text>
									{format(new Date(data.pre_master_end_date), 'dd/MM/yyyy') ||
										'—'}
								</Text>
							</Field>
						</SimpleGrid>
					</Box>
				</Stack>
				<Box mt={6}>
					<Text color={'uni.secondary'} fontWeight='semibold' mb={2}>
						Modalidades Asignadas:
					</Text>
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
				</Box>
			</Stack>
		</Modal>
	);
};

PreviewProgramsPendingModal.propTypes = {
	data: PropTypes.object.isRequired,
};
