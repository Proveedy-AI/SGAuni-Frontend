import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateCountry } from '@/hooks';

export const AddSettingsCountryForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [isoCode, setIsoCode] = useState('');
	const [dialCode, setDialCode] = useState('');

	const { mutate: createCountry, isPending } = useCreateCountry();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !code.trim() || !isoCode.trim() || !dialCode.trim()) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name: name.trim(),
			code: code.trim(),
			iso_code: isoCode.trim().toLowerCase(),
			dial_code: dialCode.trim(),
		};

		createCountry(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'País registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData?.();
				setName('');
				setCode('');
				setDialCode('');
				setIsoCode('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el país',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Agregar nuevo país'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar país
				</Button>
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

AddSettingsCountryForm.propTypes = {
	fetchData: PropTypes.func,
};
