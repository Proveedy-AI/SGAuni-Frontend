'use client';

import {
	FileUpload,
	Icon,
	IconButton,
	Text,
	Box,
	Flex,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { LuUpload, LuX, LuFile, LuEye } from 'react-icons/lu';

export function CompactFileUpload({
	name,
	accept = '.pdf',
	placeholder = 'Selecciona un archivo',
	onChange,
	defaultFile,
	onClear, // <- nueva prop
}) {
	return (
		<FileUpload.Root
			name={name}
			accept={accept}
			multiple={false}
			onValueChange={(files) => onChange?.(files?.[0] ?? null)}
		>
			<FileUpload.HiddenInput
				onChange={(e) => {
					const file = e.target.files?.[0] ?? null;
					onChange?.(file);
				}}
			/>

			<FileUpload.Context>
				{({ acceptedFiles, clear }) => {
					const file = acceptedFiles[0];
					const hasTempFile = !!file;
					const hasDefaultFile = !!defaultFile;

					const handleClear = () => {
						if (hasTempFile) {
							clear(); // limpia archivo temporal
						}
						onChange?.(null); // notifica limpieza
						onClear?.(); // permite limpiar estado externo
					};

					return (
						<Flex
							align='center'
							gap={2}
							w='full'
							borderBottom='1px solid'
							borderColor='gray.300'
							bgGradient='linear(to-r, gray.50, gray.100)'
							px={3}
							py={1}
							cursor='pointer'
							_hover={{ bg: 'gray.100' }}
						>
							{hasTempFile || hasDefaultFile ? (
								<>
									<Icon as={LuFile} color='gray.500' boxSize={5} />
									<Text cursor='pointer' fontSize='xs' flex='1' isTruncated>
										{file?.name || defaultFile.split('/').pop()}
									</Text>

									<IconButton
										as='a'
										href={hasTempFile ? URL.createObjectURL(file) : defaultFile}
										target='_blank'
										rel='noopener noreferrer'
										aria-label='Ver archivo'
										variant='ghost'
										size='xs'
										color='uni.secondary'
									>
										<LuEye />
									</IconButton>

									<IconButton
										aria-label='Quitar archivo'
										variant='ghost'
										size='xs'
										color='uni.secondary'
										onClick={handleClear}
									>
										<LuX />
									</IconButton>
								</>
							) : (
								<>
									<Icon as={LuUpload} color='gray.400' boxSize={5} />
									<FileUpload.Trigger asChild>
										<Box
											as='button'
											fontSize='sm'
											color='gray.600'
											textAlign='left'
											flex='1'
											cursor='pointer'
										>
											{placeholder}{' '}
											<Text as='span' color='gray.500'>
												({accept})
											</Text>
										</Box>
									</FileUpload.Trigger>
									<FileUpload.Trigger asChild>
										<IconButton
											aria-label='Seleccionar archivo'
											variant='ghost'
											size='xs'
											color='uni.secondary'
										>
											<LuUpload />
										</IconButton>
									</FileUpload.Trigger>
								</>
							)}
						</Flex>
					);
				}}
			</FileUpload.Context>
		</FileUpload.Root>
	);
}

CompactFileUpload.propTypes = {
	name: PropTypes.string,
	accept: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	defaultFile: PropTypes.string,
	onClear: PropTypes.func, // <- nueva prop
};
