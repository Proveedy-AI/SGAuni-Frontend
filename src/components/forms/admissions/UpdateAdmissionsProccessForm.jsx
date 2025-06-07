import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useCreateAdmissions } from '@/hooks/admissions_proccess';
import { ReactSelect } from '@/components/select';

export const UpdateAdmissionsProccessForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(data?.admission_process_name);
	const [startDate, setStartDate] = useState(data?.start_date);
	const [endDate, setEndDate] = useState(data?.end_date);
	const [url, setUrl] = useState(data.uri_url);
	const [selectedLevel, setSelectedLevel] = useState(null);

	const { mutate: createAdmissions, isPending } = useCreateAdmissions();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !startDate.trim()) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const uriUrl = `${import.meta.env.VITE_DOMAIN_MAIN}/postulations?name=${encodeURIComponent(name.trim())}`;

		const payload = {
			admission_process_name: name.trim(),
			admission_level: selectedLevel.value,
			start_date: startDate,
			end_date: endDate,
			uri_url: uriUrl,
			editable: true,
		};

		createAdmissions(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Proceso registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setName('');
				setSelectedLevel(null);
				setEndDate();
				setUrl('');
				setStartDate('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el Proceso',
					type: 'error',
				});
			},
		});
	};

	const dataLevel = [
		{ label: 'Maestría', value: 1 },
		{ label: 'Doctorado', value: 2 },
	];

	const LevelOptions = dataLevel.map((level) => ({
		label: level.label,
		value: level.value,
	}));

	useEffect(() => {
		if (data && data.admission_level) {
			const matchedLevel = dataLevel.find(
				(level) => level.value === data.admission_level
			);
			if (matchedLevel) {
				setSelectedLevel({
					label: matchedLevel.label,
					value: matchedLevel.value,
				});
			}
		}
	}, [data]);

	return (
		<Modal
			title='Agregar Proceso de Admisión'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Editar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							disabled={!data?.editable}
							colorPalette='cyan'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEdit2 />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			size='4xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Título:'
				>
					<Input
						value={name}
						onChange={(e) => {
							const newName = e.target.value;
							setName(newName);
							setUrl(
								`${import.meta.env.VITE_DOMAIN_MAIN}/postulations?name=${encodeURIComponent(newName.trim())}`
							);
						}}
						placeholder='Proceso 2025-II'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nivel:'
				>
					<ReactSelect
						value={selectedLevel}
						onChange={(select) => {
							setSelectedLevel(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						name='paises'
						options={LevelOptions}
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Fecha Inicio'
				>
					<Input
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						type='date'
						size='xs'
					/>
				</Field>

				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Fecha Fin:'
				>
					<Input
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						type='date'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='URL:'
				>
					<Input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder='pe'
						size='xs'
						disabled
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
