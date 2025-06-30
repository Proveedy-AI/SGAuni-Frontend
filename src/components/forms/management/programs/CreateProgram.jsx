import { Field, Button, toaster, Modal } from '@/components/ui';
import { Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCreateProgram } from '@/hooks';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';

export const AddProgram = ({
	fetchData,
	programTypesOptions,
	coordinatorsOptions,
	loadingProgramTypes,
	loadingCoordinators,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { mutate: register, isPending: loading } = useCreateProgram();

	const [programRequest, setProgramRequest] = useState({
		name: '',
		type: null,
		coordinator: null,
		price_credit: '',
	});

	const handleSubmitData = async (e) => {
		e.preventDefault();
		if (
			!programRequest.name ||
			!programRequest.type ||
			!programRequest.coordinator ||
			programRequest.price_credit <= 0
		)
			return;

		const payload = {
			name: programRequest.name,
			type: Number(programRequest.type.value),
			coordinator: Number(programRequest.coordinator.value),
			price_credit: programRequest.price_credit,
		};

		register(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setProgramRequest({
					name: '',
					type: null,
					coordinator: null,
					price_credit: '',
				});
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Crear Programa'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Programa
				</Button>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Field label='Nombre del Programa'>
					<Input
						required
						type='text'
						name='name'
						placeholder='Nombre del programa'
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest({ ...programRequest, name: e.target.value })
						}
					/>
				</Field>
				<Field label='Tipo de Programa'>
					<ReactSelect
						value={programRequest.type}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						onChange={(select) => {
							setProgramRequest({ ...programRequest, type: select });
						}}
						name='Tipos de Programa'
						options={programTypesOptions}
					/>
				</Field>
				<Field label='Coordinador'>
					<ReactSelect
						value={programRequest.coordinator}
						onChange={(select) => {
							setProgramRequest({ ...programRequest, coordinator: select });
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingCoordinators}
						isLoading={loadingCoordinators}
						isSearchable={true}
						isClearable
						name='Coordinadores'
						options={coordinatorsOptions}
					/>
				</Field>
				<Field label='Precio por crédito (S/.)'>
					<Input
						required
						type='number'
						name='price_credit'
						placeholder='Precio por crédito'
						value={programRequest.price_credit}
						onChange={(e) =>
							setProgramRequest({
								...programRequest,
								price_credit: e.target.value,
							})
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddProgram.propTypes = {
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
};
