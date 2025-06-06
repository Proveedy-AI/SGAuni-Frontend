import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateAdmissions } from '@/hooks/admissions_proccess';

export const AddAdmissionsProccessForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [url, setUrl] = useState('');

	const { mutate: createAdmissions, isPending } = useCreateAdmissions();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !code.trim() || !startDate.trim() || !url.trim()) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name: name.trim(),
			code: code.trim(),
			start_date: startDate,
			uri_url: url,
		};

		createAdmissions(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'País registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData?.();
				setName('');
				setCode('');
				setUrl('');
				setStartDate('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el país',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Agregar Proceso de Admisión'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Proceso
				</Button>
			}
			onSave={handleSubmitData}
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
						onChange={(e) => setName(e.target.value)}
						placeholder='Proceso 2025-II'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nivel:'
				>
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Doctorado'
						size='xs'
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
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
};
