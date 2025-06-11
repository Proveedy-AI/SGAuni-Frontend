import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	Flex,
	Icon,
	IconButton,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useSignContracts } from '@/hooks/contracts';
import { uploadToS3 } from '@/utils/uploadToS3';
import { FaSignature } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/fi';

export const SignContractsForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [filePDF, setFilePDF] = useState(null);
	const [expiresAt] = useState(data?.expires_at);
	const [owner] = useState(data?.owner);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFilePDF(file);
		}
	};

	const { mutate: signContracts, isPending } = useSignContracts();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!filePDF) {
			toaster.create({
				title: 'Usuario y fecha de expiración son obligatorios',
				type: 'warning',
			});
			return;
		}

		try {
			const s3Url = await uploadToS3(
				filePDF,
				'sga_uni/contratos',
				data.owner_name.replace(/\s+/g, '_')
			);

			const payload = {
				path_contract_signed: s3Url,
				owner,
				expires_at: expiresAt,
			};

			signContracts(
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

	return (
		<Modal
			title='Subir Contrato Firmado'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Firmar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							variant='outline'
							size='xs'
							borderColor='uni.secondary'
							color='uni.secondary'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FaSignature />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field label='Subir contrato (.pdf):'>
					<Box
						as='label'
						htmlFor='pdf-upload'
						borderWidth='2px'
						borderStyle='dashed'
						borderColor={'gray.300'}
						borderRadius='lg'
						_hover={{
							borderColor: 'uni.secondary',
							bg: 'gray.10',
						}}
						p={4}
						w='100%'
						cursor='pointer'
						textAlign='center'
					>
						<Flex direction='column' align='center' justify='center' gap={2}>
							<Icon as={FiUploadCloud} boxSize={6} color='teal.400' />
							<Text fontSize='sm' color='gray.600'>
								{filePDF ? filePDF.name : 'Haz clic para subir un archivo PDF'}
							</Text>
							<Input
								id='pdf-upload'
								type='file'
								accept='application/pdf'
								hidden
								onChange={handleFileChange}
							/>
						</Flex>
					</Box>
				</Field>
			</Stack>
		</Modal>
	);
};

SignContractsForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
