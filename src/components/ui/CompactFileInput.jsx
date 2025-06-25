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
import { LuUpload, LuX, LuFile } from 'react-icons/lu';

export function CompactFileUpload({
	name,
	accept = '.pdf',
	placeholder = 'Selecciona un archivo',
	onChange,
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
				{({ acceptedFiles }) => (
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
						{acceptedFiles.length > 0 ? (
							<>
								<Icon as={LuFile} color='gray.500' boxSize={5} />
								<Text cursor='pointer' fontSize='xs' flex='1' isTruncated>
									{acceptedFiles[0].name}
								</Text>
								<FileUpload.ClearTrigger asChild>
									<IconButton
										aria-label='Quitar archivo'
										variant='ghost'
										size='xs'
										color={'uni.secondary'}
									>
										<LuX />
									</IconButton>
								</FileUpload.ClearTrigger>
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
										color={'uni.secondary'}
									>
										<LuUpload />
									</IconButton>
								</FileUpload.Trigger>
							</>
						)}
					</Flex>
				)}
			</FileUpload.Context>
		</FileUpload.Root>
	);
}

CompactFileUpload.propTypes = {
	name: PropTypes.string,
	accept: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
};
