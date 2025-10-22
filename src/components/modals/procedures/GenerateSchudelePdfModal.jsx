import PropTypes from 'prop-types';
import { Button, Modal } from '@/components/ui';
import { Stack, Card, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { LuFileText } from 'react-icons/lu';
import { FiCalendar } from 'react-icons/fi';
import { RegistrationScheduleDocument } from '@/components/pdf/RegistrationScheduleDocument';

export const GenerateSchudelePdfModal = ({
	loading,
	registration_info,
	mySelections,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Modal
			title='Boleta de Matrícula'
			placement='center'
			trigger={
				<Button
					colorPalette='purple'
					leftIcon={<Icon as={LuFileText} />}
					onClick={() => setOpen(true)}
					disabled={loading}
				>
					<FiCalendar />
					Descargar Cronograma
				</Button>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='6xl'
			hiddenFooter={true}
		>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Card.Root py={4}>
					<Card.Header></Card.Header>
					<Card.Body spaceY={4}>
						<RegistrationScheduleDocument
							coursesGroups={mySelections}
							registration_info={registration_info}
						/>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

GenerateSchudelePdfModal.propTypes = {
	loading: PropTypes.bool.isRequired,
	registration_info: PropTypes.object.isRequired,
	mySelections: PropTypes.array.isRequired,
};
