import PropTypes from 'prop-types';
import { Box, IconButton, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { Field, Modal, Tooltip } from '@/components/ui';
import { FiEye } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';
import { useState } from 'react';

export const PreviewAdmissionsProgramsModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	const { data: dataPrograms } = useReadPrograms();

	const dataMode = [
		{ label: 'Virtual', value: 1 },
		{ label: 'Semi-Presencial', value: 2 },
		{ label: 'Presencial', value: 3 },
	];

	const dataType = [
		{ label: 'Investigación', value: 1 },
		{ label: 'Profesionalizante', value: 2 },
	];

	const ProgramsOptions = dataPrograms?.results?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	const getLabel = (options, value) =>
		options?.find((opt) => opt.value === value) || { label: '—', value: null };

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
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
			hiddenFooter={true}
		>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Field label='Programa:'>
					<ReactSelect
						value={getLabel(ProgramsOptions, data.program)}
						isDisabled
						variant='flushed'
						size='xs'
					/>
				</Field>

				<Field label='Tipo de Postgrado:'>
					<ReactSelect
						value={getLabel(dataType, data.postgrad_type)}
						isDisabled
						variant='flushed'
						size='xs'
					/>
				</Field>

				<Field label='Modo de estudio:'>
					<ReactSelect
						value={getLabel(dataMode, data.study_mode)}
						isDisabled
						variant='flushed'
						size='xs'
					/>
				</Field>

				<Field label='Inicio de semestre:'>
					<Input value={data.semester_start_date || ''} isReadOnly size='xs' />
				</Field>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field label='Inicio de inscripción:'>
						<Input
							value={data.registration_start_date || ''}
							isReadOnly
							size='xs'
						/>
					</Field>

					<Field label='Fin de inscripción:'>
						<Input
							value={data.registration_end_date || ''}
							isReadOnly
							size='xs'
						/>
					</Field>

					<Field label='Inicio de examen:'>
						<Input value={data.exam_date_start || ''} isReadOnly size='xs' />
					</Field>

					<Field label='Fin de examen:'>
						<Input value={data.exam_date_end || ''} isReadOnly size='xs' />
					</Field>

					<Field label='Inicio Pre-Maestría:'>
						<Input
							value={data.pre_master_start_date || ''}
							isReadOnly
							size='xs'
						/>
					</Field>

					<Field label='Fin Pre-Maestría:'>
						<Input
							value={data.pre_master_end_date || ''}
							isReadOnly
							size='xs'
						/>
					</Field>
				</SimpleGrid>
			</Stack>
		</Modal>
	);
};

PreviewAdmissionsProgramsModal.propTypes = {
	data: PropTypes.object.isRequired,
};
