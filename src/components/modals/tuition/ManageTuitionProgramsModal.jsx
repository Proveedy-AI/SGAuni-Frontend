import { Modal, Tooltip, Checkbox, toaster } from '@/components/ui';
import {
	Box,
	CheckboxGroup,
	IconButton,
	Stack,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ManageTuitionProgramsModal = () => {
	const [open, setOpen] = useState(false);

    const handleSave = () => {
		console.log('Vincular programas:');
		setOpen(false);
		toaster.create({
			title: 'Programas vinculados correctamente',
			type: 'success',
		});
	};

	return (
		<Modal
			title='Ciclo 2026-1'
			size='sm'
			placement='center'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			scrollBehavior='inside'
            onSave={handleSave}
			trigger={
				<Box>
					<Tooltip content='Gestionar programas' showArrow>
						<IconButton
							size='xs'
							colorPalette='cyan'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiBookOpen />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{ style: { padding: '0 40px' } }}
		>
			<Stack gap={4}>
				<VStack align={'start'}>
					<CheckboxGroup>
                        <Checkbox
                            // key={}
                            // value={}
                            // isChecked={}
                            // onChange={}
                        >
                        </Checkbox>
					</CheckboxGroup>
				</VStack>
			</Stack>
		</Modal>
	);
};

ManageTuitionProgramsModal.propTypes = {};
