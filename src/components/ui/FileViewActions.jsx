import { HStack, IconButton } from '@chakra-ui/react';
import { LuFile, LuTrash } from 'react-icons/lu';
import PropTypes from 'prop-types';
import { Tooltip } from '.';

export function FileViewActions({ fileUrl, onRemove }) {
	return (
		<HStack spacing={1}>
			<Tooltip
				content='Ver Archivo'
				positioning={{ placement: 'bottom-center' }}
				showArrow
				openDelay={0}
			>
				<IconButton
					as='a'
					href={fileUrl}
					target='_blank'
					variant={'outline'}
					rel='noopener noreferrer'
					size='sm'
					colorPalette='blue'
                     px={2}
					aria-label='Ver archivo'
				>
					<LuFile /> Ver archivo
				</IconButton>
			</Tooltip>

			<Tooltip
				content='Quitar Archivo'
				positioning={{ placement: 'bottom-center' }}
				showArrow
				openDelay={0}
			>
				<IconButton
					onClick={onRemove}
					size='sm'
					colorPalette='red'
                    variant={'outline'}
					aria-label='Quitar archivo'
                    px={2}
				>
					<LuTrash /> Quitar archivo
				</IconButton>
			</Tooltip>
		</HStack>
	);
}

FileViewActions.propTypes = {
	fileUrl: PropTypes.string.isRequired,
	onRemove: PropTypes.func.isRequired,
};
