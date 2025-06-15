import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	IconButton,
	Stack,
	Button,
	Text,
	Textarea,
	Flex,
} from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { LiaCheckCircleSolid } from 'react-icons/lia';
import { useAproveeAdmissionsPrograms } from '@/hooks/admissions_programs';
import { FaBan, FaCheck } from 'react-icons/fa';

export const UpdateStatusAdmissionsProccessForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null); // 4: Aprobado, 3: Rechazado

	const { mutate: aproveePrograms, isPending } = useAproveeAdmissionsPrograms();

	const handleSubmitStatus = () => {
		if (!selectedStatus) {
			toaster.create({
				title: 'Por favor selecciona una acción: aprobar o rechazar.',
				type: 'warning',
			});
			return;
		}

		if (selectedStatus === 3 && !comments.trim()) {
			toaster.create({
				title: 'Por favor ingresa un comentario para rechazar.',
				type: 'warning',
			});
			return;
		}

		const payload = {
			comments: selectedStatus === 3 ? comments.trim() : '',
			status: selectedStatus,
		};

		aproveePrograms(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title:
							selectedStatus === 4
								? 'Proceso aprobado correctamente'
								: 'Proceso rechazado correctamente',
						type: 'success',
					});
					setOpen(false);
					setComments('');
					setSelectedStatus(null);
					fetchData();
				},
				onError: (error) => {
					console.error(error);
					toaster.create({
						title: error.response?.data?.[0] || 'Error al actualizar estado',
						type: 'error',
					});
				},
			}
		);
	};

	const handleOpenChange = (e) => {
		setOpen(e.open);
		if (!e.open) {
			setSelectedStatus(null);
			setComments('');
		}
	};

	return (
		<Modal
			title='Aprobar o Rechazar Proceso'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Aprobar / Rechazar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<LiaCheckCircleSolid />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='xl'
			loading={isPending}
			open={open}
			onOpenChange={handleOpenChange}
			contentRef={contentRef}
			onSave={handleSubmitStatus}
		>
			<Stack spacingY={8}>
				<Field label='Título:'>
					<Text fontSize='xl' color={'uni.secondary'}>
						{data?.program_name}
					</Text>
				</Field>

				<Flex justify='flex-start' gap={2} mt={2}>
					<Field label='Inicio Semestre:'>
						<Text fontSize='lg'>{data?.semester_start_date}</Text>
					</Field>
					<Field label='Nivel:'>
						<Text fontSize='lg'>{data?.post_grad_type_display}</Text>
					</Field>
				</Flex>

				<Flex justify='flex-start' gap={2} mt={2}>
					<Button
						colorPalette={selectedStatus === 4 ? 'green' : 'gray'}
						variant={selectedStatus === 4 ? 'solid' : 'subtle'}
						size='sm'
						onClick={() => setSelectedStatus(4)}
					>
						<FaCheck />
						Aprobar
					</Button>
					<Button
						colorPalette={selectedStatus === 3 ? 'red' : 'gray'}
						variant={selectedStatus === 3 ? 'solid' : 'subtle'}
						size='sm'
						onClick={() => setSelectedStatus(3)}
					>
						<FaBan />
						Rechazar
					</Button>
				</Flex>

				{selectedStatus === 3 && (
					<Field label='Comentario:'>
						<Textarea
							value={comments}
							onChange={(e) => setComments(e.target.value)}
							placeholder='Agrega un comentario para rechazar...'
							size='sm'
						/>
					</Field>
				)}
			</Stack>
		</Modal>
	);
};

UpdateStatusAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
