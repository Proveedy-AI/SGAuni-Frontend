import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useUpdateProgram } from '@/hooks';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';

export const EditProgram = ({
	fetchData,
	item,
	programTypesOptions,
	coordinatorsOptions,
	loadingProgramTypes,
	loadingCoordinators,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: update, isPending: loadingUpdate } = useUpdateProgram();
	const [programRequest, setProgramRequest] = useState({
		name: item.name,
		type: null,
		coordinator: null,
		price_credit: item.price_credit,
	});
	useEffect(() => {
		if (programTypesOptions?.length && coordinatorsOptions?.length) {
			setProgramRequest((prev) => ({
				...prev,
				type: programTypesOptions.find((t) => t.value === item.type.toString()),
				coordinator: coordinatorsOptions.find(
					(c) => c.value === item.coordinator.toString()
				),
			}));
		}
	}, [programTypesOptions, coordinatorsOptions, item]);
	const handleUpdate = async () => {
		const payload = {
			coordinator: Number(programRequest.coordinator.value),
			name: programRequest.name,
			type: Number(programRequest.type.value),
			price_credit: programRequest.price_credit,
		};

		if (
			!payload.name ||
			payload.price_credit <= 0 ||
			payload.coordinator === 0 ||
			payload.coordinator === null
		)
			return;

		await update(
			{ id: item.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Programa actualizado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
				},
				onError: (error) => {
					toaster.create({
						title: error.message,
						type: 'error',
					});
				},
			}
		);
	};

	return (
		<Modal
			title='Editar Programa'
			placement='center'
			trigger={
				<IconButton colorPalette='green' size='xs'>
					<HiPencil />
				</IconButton>
			}
			onSave={handleUpdate}
			loading={loadingUpdate}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4}>
				<Field label='Nombre del programa'>
					<Input
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
				</Field>

				<Field label='Tipo de programa'>
					<ReactSelect
						value={programRequest.type}
						onChange={(select) => {
							setProgramRequest({ ...programRequest, type: select });
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						name='Tipos de programa'
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
				<Field label='Precio por crédito'>
					<Input
						required
						type='number'
						name='price_credit'
						placeholder='Precio por crédito'
						value={programRequest.price_credit}
						onChange={(e) =>
							setProgramRequest({
								...programRequest,
								price_credit: Number(e.target.value),
							})
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

EditProgram.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
};
