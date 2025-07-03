import { Modal, toaster, Tooltip } from '@/components/ui';
import { Box, IconButton, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ApproveTuitionProcessModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	return (
		<Modal
			scrollBehavior='inside'
			title='Solicitar aprobación'
			placement='center'
			size='sm'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
            saveLabel='Solicitar'
			onSave={() => {
				toaster.create({
					title: 'Solicitud enviada correctamente',
					type: 'success',
				});
				setOpen(false);
			}}
			trigger={
				<Box>
					<Tooltip
						content='Solicitar aprobación'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton 
							size='xs' 
							colorPalette='yellow' 
							color='white'
							disabled={data?.status?.toLowerCase() !== 'configuration'}
						>
							<FiSend />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{ style: { padding: '0 40px' } }}
		>
			<Stack>
				¿Estás seguro que quieres solicitar aprobación del programa Maestría Ingeniería Financiera?
			</Stack>
		</Modal>
	);
};

ApproveTuitionProcessModal.propTypes = {
	data: PropTypes.object,
};
