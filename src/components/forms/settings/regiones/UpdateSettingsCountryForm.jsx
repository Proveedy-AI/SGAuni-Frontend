import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateCountry } from '@/hooks';

export const UpdateSettingsCountryForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);
	const [code, setCode] = useState(data?.code);
	const [isoCode, setIsoCode] = useState(data?.iso_code);
	const [dialCode, setDialCode] = useState(data?.dial_code);

	const { mutateAsync: updateCountry, isPending } = useUpdateCountry();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name.trim(),
			code: code.trim(),
			iso_code: isoCode.trim().toLowerCase(),
			dial_code: dialCode.trim(),
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
					label='Nombre de país:'
				>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Perú'
						size='xs'
					/>
				</Field>

				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nacionalidad:'
				>
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Peruano'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Prefijo'
				>
					<Input
						value={dialCode}
						onChange={(e) => setDialCode(e.target.value)}
						placeholder='+51'
						size='xs'
					/>
				</Field>

				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Código de país:'
				>
					<Input
						value={isoCode}
						onChange={(e) => setIsoCode(e.target.value)}
						placeholder='pe'
						size='xs'
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsCountryForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
