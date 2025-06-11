import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateContracts } from '@/hooks/contracts';
import { useReadUsers } from '@/hooks/users';
import { ReactSelect } from '@/components/select';
import { uploadToS3 } from '@/utils/uploadToS3';

export const UpdateContractsForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [filePDF, setFilePDF] = useState(null);
	const [expiresAt, setExpiresAt] = useState(data?.expires_at);
	//const [isSigned, setIsSigned] = useState(data?.is_signed);
	const [selectedUser, setSelectedUser] = useState(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFilePDF(file);
		}
	};

	const { mutate: updateContracts, isPending } = useUpdateContracts();
	const { data: dataUsers, isLoading } = useReadUsers();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!selectedUser || !expiresAt) {
			toaster.create({
				title: 'Usuario y fecha de expiración son obligatorios',
				type: 'warning',
			});
			return;
		}

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
			console.log(s3Url)

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
					},
					onError: (error) => {
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
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field label='Subir contrato (.pdf):'>
					<Input
						type='file'
						accept='application/pdf'
						size='sx'
						onChange={handleFileChange}
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
						name='paises'
						options={UserstOptions}
					/>
				</Field>

				<Field label='Fecha de expiración:'>
					<Input
						value={expiresAt}
						onChange={(e) => setExpiresAt(e.target.value)}
						type='date'
						size='xs'
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
