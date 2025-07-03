import { Modal, Tooltip } from '@/components/ui';
import {
	Box,
	IconButton,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ObservationTuitionProcessModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	return (
		<Modal
			title='Observaciones'
			placement='center'
			size='md'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
            hiddenFooter={true}
			trigger={
				<Box>
					<Tooltip
						content='Observaciones'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='cyan'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiMessageCircle />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{ style: { padding: '40px' } }}
		>
			<Stack>
				{data.observation ? (
					<Box w='full' textAlign='left'>
						{data.observation}
					</Box>
				) : (
					<Box color='gray.500' textAlign='center'>
						Aún no hay observaciones registradas
					</Box>
				)}
			</Stack>
		</Modal>
	);
};

ObservationTuitionProcessModal.propTypes = {
	data: PropTypes.object,
};
