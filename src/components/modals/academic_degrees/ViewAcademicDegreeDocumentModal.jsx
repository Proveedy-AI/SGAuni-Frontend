import PropTypes from 'prop-types';
import { Modal, Tooltip } from '@/components/ui';
import { useRef, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';

export const ViewAcademicDegreeDocumentModal = ({ item }) => {
  const contentRef = useRef(null);
	const [open, setOpen] = useState(false);

	return (
		<Modal
			title='Documento de Título Académico'
			placement='center'
			size='4xl'
			trigger={
				<Box>
					<Tooltip
						content='Ver Documento'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='blue' size='xs'>
							<FiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			hiddenFooter={true}
      contentRef={contentRef}
		>
			<Box minH='500px'>
				{item?.path_url ? (
					<iframe
						src={item?.path_url}
						title='Documento de Título Académico'
						width='100%'
						height='500px'
						style={{ border: 'none' }}
					/>
				) : (
					<Box p={4} textAlign='center'>
						No hay documento disponible.
					</Box>
				)}
			</Box>
		</Modal>
	);
};

ViewAcademicDegreeDocumentModal.propTypes = {
	item: PropTypes.object,
};
