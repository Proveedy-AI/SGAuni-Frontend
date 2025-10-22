import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateContracts } from '@/hooks/contracts';
import { useReadUsers } from '@/hooks/users';
import { ReactSelect } from '@/components/select';
import { uploadToS3 } from '@/utils/uploadToS3';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';

export const AddContractsForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [disableUpload, setDisableUpload] = useState(false);

	const [filePDF, setFilePDF] = useState(null);
	const [expiresAt, setExpiresAt] = useState('');
	//const [isSigned, setIsSigned] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const { mutate: createContracts } = useCreateContracts();
	const { data: dataUsers, isLoading } = useReadUsers({}, { enabled: open });

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!filePDF || !selectedUser || !expiresAt) {
			toaster.create({
				title: 'Todos los campos son obligatorios',
				type: 'warning',
			});
			return;
		}
		setDisableUpload(true);
		try {
			const s3Url = await uploadToS3(
				filePDF,
				'sga_uni/contratos',
				selectedUser.label.replace(/\s+/g, '_')
			);
			const payload = {
				path_contract: s3Url,
				owner: selectedUser.value,
				expires_at: expiresAt,
			};

			createContracts(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Contrato creado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData?.();
					setFilePDF(null);
					setSelectedUser(null);
					setExpiresAt('');
					setDisableUpload(false);
					//setIsSigned(false);
				},
				onError: (error) => {
					setDisableUpload(false);
					console.log(error);
					toaster.create({
						title: error.response?.data?.[0] || 'Error al crear el contrato',
						type: 'error',
					});
				},
			});
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			setDisableUpload(false);
			toaster.create({
				title: 'Error al subir el contrato',
				type: 'error',
			});
		}
	};

	const UserstOptions = dataUsers?.results.map((user) => ({
		label: user.full_name,
		value: user.id,
	}));

	return (
		<Modal
			title='Agregar Contrato'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Contrato
				</Button>
			}
			onSave={handleSubmitData}
			loading={disableUpload}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field label='Subir contrato (.pdf):'>
					<CompactFileUpload
						name='contract_pdf'
						onChange={(file) => setFilePDF(file)}
						defaultFile={typeof filePDF === 'string' ? filePDF : undefined}
						onClear={() => setFilePDF(null)}
						accept='application/pdf'
					/>
				</Field>

				<Field label='Usuario:'>
					<ReactSelect
						value={selectedUser}
						onChange={(select) => setSelectedUser(select)}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isSearchable={true}
						isClearable
						name='paises'
						options={UserstOptions}
					/>
				</Field>

				<Field label='Fecha de expiración:'>
					<CustomDatePicker
						selectedDate={expiresAt}
						onDateChange={(date) => setExpiresAt(format(date, 'yyyy-MM-dd'))}
						buttonSize='xs'
						size={{ base: '330px', md: '465px' }}
					/>
				</Field>

				{/*<Field label='Firmado:'>
					<Flex align='center' gap={3}>
						<Switch
							checked={isSigned}
							onChange={(e) => setIsSigned(e.target.checked)}
							colorScheme='teal'
							borderRadius='full'
						/>
						{isSigned ? 'Sí' : 'No'}
					</Flex>
				</Field>*/}
			</Stack>
		</Modal>
	);
};

AddContractsForm.propTypes = {
	fetchData: PropTypes.func,
};
