import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	Box,
	Button,
	HStack,
	IconButton,
	Stack,
	Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiCheck, FiCheckCircle, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ApproveDirectorTuitionProcessModal = ({ status }) => {
	const [open, setOpen] = useState(false);
	const [action, setAction] = useState(null);
	const [observation, setObservation] = useState('');

	const isApproved = status?.toLowerCase() === 'approved';

	useEffect(() => {
		if (open) {
			setAction(null);
			setObservation('');
		}
	}, [open]);

	return (
		<Modal
			scrollBehavior='inside'
			title='Validar programa'
			placement='center'
			size='sm'
			hiddenFooter={false}
			onSave={() => {
				setOpen(false);
				toaster.create({
					title: 'Se enviaron los resultados de validación correctamente',
					type: 'success',
				});
			}}
			trigger={
				<Box>
					<Tooltip
						content='Aprobar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							css={{ _icon: { width: '5', height: '5' } }}
							disabled={isApproved}
						>
							<FiCheckCircle />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{
				style: {
					padding: '40px',
				},
			}}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			disabledSave={!action}
		>
			<Stack gap={4}>
				<Field label='Nombre del Programa Académico'>Data Science</Field>

				<Field label='Validar Programa Académico'>
					<HStack gap={3}>
						<Button
							colorPalette={'green'}
							onClick={() => setAction('approved')}
							rounded='md'
							variant={action === 'approved' ? 'solid' : 'subtle'}
						>
							<FiCheck style={{ width: '16px', height: '16px' }} />
							Aprobar
						</Button>

						<Button
							colorPalette={'red'}
							onClick={() => setAction('rejected')}
							rounded='md'
							variant={action === 'rejected' ? 'solid' : 'subtle'}
						>
							<FiX style={{ width: '16px', height: '16px' }} />
							Rechazar
						</Button>
					</HStack>
				</Field>

				{action === 'rejected' && (
					<Field label='Observaciones'>
						<Textarea
							placeholder='Ingresar detalle'
							rows={3}
							size='sm'
							value={observation}
							onChange={(e) => setObservation(e.target.value)}
						/>
					</Field>
				)}
			</Stack>
		</Modal>
	);
};

ApproveDirectorTuitionProcessModal.propTypes = {
	status: PropTypes.string,
};
