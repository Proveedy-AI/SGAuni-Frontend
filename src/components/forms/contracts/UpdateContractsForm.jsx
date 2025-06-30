import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateContracts } from '@/hooks/contracts';
import { useReadUsers } from '@/hooks/users';
import { ReactSelect } from '@/components/select';
import { uploadToS3 } from '@/utils/uploadToS3';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const UpdateContractsForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [disableUpload, setDisableUpload] = useState(false);
	const [filePDF, setFilePDF] = useState(null);
	const [expiresAt, setExpiresAt] = useState(data?.expires_at);
	//const [isSigned, setIsSigned] = useState(data?.is_signed);
	const [selectedUser, setSelectedUser] = useState(null);

	const { mutate: updateContracts } = useUpdateContracts();
	const { data: dataUsers, isLoading } = useReadUsers({}, { enabled: open });

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!selectedUser || !expiresAt) {
			toaster.create({
				title: 'Usuario y fecha de expiración son obligatorios',
				type: 'warning',
			});
			return;
		}
		setDisableUpload(true);
		try {
			let s3Url = data?.path_contract;

			// Solo subir a S3 si hay un archivo nuevo
			if (filePDF) {
				s3Url = await uploadToS3(
					filePDF,
					'sga_uni/contratos',
					selectedUser.label.replace(/\s+/g, '_') // evita espacios
				);
			}

			const payload = {
				path_contract: s3Url,
				owner: selectedUser.value,
				expires_at: expiresAt,
			};

			updateContracts(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Contrato actualizado correctamente',
							type: 'success',
						});
						setOpen(false);
						fetchData();
						setDisableUpload(false);
					},
					onError: (error) => {
						setDisableUpload(false);
						console.log(error);
						toaster.create({
							title:
								error.response?.data?.[0] || 'Error al actualizar el contrato',
							type: 'error',
						});
					},
				}
			);
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

	useEffect(() => {
		if (data && data.owner && dataUsers?.results?.length) {
			const matchedUser = dataUsers?.results.find((c) => c.id === data.owner);
			if (matchedUser) {
				setSelectedUser({
					label: matchedUser.full_name,
					value: matchedUser.id,
				});
			}
		}
	}, [data, dataUsers]);

	return (
		<Modal
			title='Editar Contrato'
			placement='center'
			trigger={
				<IconButton colorPalette='cyan' size='xs'>
					<FiEdit2 />
				</IconButton>
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

UpdateContractsForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
