import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, IconButton, Stack } from '@chakra-ui/react';
import { Alert, Field, Modal, toaster } from '@/components/ui';
import { FiToggleLeft } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { FaInfoCircle } from 'react-icons/fa';
import { useUpdateEnrollment } from '@/hooks/enrollments/useUpdateEnrollment';

export const UpdateEnrollmentStudentForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [selectedStatus, setselectedStatus] = useState(null);
	const [readInstructions, setReadInstructions] = useState(false);
	const { mutateAsync: updateEnrollment, isPending } = useUpdateEnrollment();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			status: selectedStatus.value,
		};

		try {
			await updateEnrollment({ id: data.id, payload });
			toaster.create({
				title: 'Distrito editado correctamente',
				type: 'success',
			});
			setOpen(false);
			setReadInstructions(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	const StatusOptions = useMemo(
		() => [
			{ label: 'Pago Pendiente', value: 1 },
			{ label: 'Pago Parcial', value: 2 },
			{ label: 'Pago Vencido', value: 3 },
			{ label: 'Elegible', value: 4 },
			{ label: 'Matriculado', value: 5 },
			{ label: 'Cancelado', value: 6 },
			{ label: 'No matriculado', value: 7 },
		],
		[]
	);
	console.log(data);
	useEffect(() => {
		if (data && data.status) {
			const matchedStatus = StatusOptions.find((c) => c.value === data.status);
			if (matchedStatus) {
				setselectedStatus({
					label: matchedStatus.label,
					value: matchedStatus.value,
				});
			}
		}
	}, [data, StatusOptions]);

	return (
		<Modal
			title='Actualizar Estado'
			placement='center'
			trigger={
				<Box>
					<IconButton
						colorPalette='purple'
						px={2}
						variant={'outline'}
						size='xs'
					>
						<FiToggleLeft /> Cambiar Estado
					</IconButton>
				</Box>
			}
			onSave={handleSubmitData}
			disabledSave={!readInstructions}
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }} gap={4}>
				<Field label='Estado:'>
					<ReactSelect
						value={selectedStatus}
						onChange={(select) => {
							setselectedStatus(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						isClearable
						name='estado'
						options={StatusOptions}
					/>
				</Field>

				<Alert
					status='warning'
					title='Cambio de estado'
					icon={<FaInfoCircle />}
				>
					Ten en cuenta que modificar el estado puede impactar en otras
					funciones del sistema. Asegúrate de que deseas continuar antes de
					realizar este cambio.
				</Alert>

				<Flex align='center' gap={2} mt={2}>
					<input
						type='checkbox'
						id='readInstructionsReject'
						checked={readInstructions}
						onChange={(e) => setReadInstructions(e.target.checked)}
						style={{ accentColor: '#E53E3E', width: 18, height: 18 }}
					/>
					<label
						htmlFor='readInstructionsReject'
						style={{ fontSize: '0.95em', color: '#9B2C2C', fontWeight: 500 }}
					>
						He leído, comprendo las instrucciones y confirmo mi decisión.
					</label>
				</Flex>
			</Stack>
		</Modal>
	);
};

UpdateEnrollmentStudentForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataProvince: PropTypes.array,
};
