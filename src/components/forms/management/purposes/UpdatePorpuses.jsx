import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdatePurposes } from '@/hooks/purposes/useUpdatePurposes';

export const UpdatePorpuses = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);

	const { mutateAsync: updateCountry, isPending } = useUpdatePurposes();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name.trim(),
		};

		try {
			await updateCountry({ id: data.id, payload });
			toaster.create({
				title: 'País editado correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Modal
			title='Editar propiedades'
			placement='center'
			trigger={
				<IconButton colorPalette='cyan' size='xs'>
					<FiEdit2 />
				</IconButton>
			}
			onSave={handleSubmitData}
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Propósito:'
				>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Perú'
						size='xs'
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdatePorpuses.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
