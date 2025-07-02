import { Badge, Box, Icon, Stack, Text } from '@chakra-ui/react';
import { FiLink, FiExternalLink, FiShare2 } from 'react-icons/fi';
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverCloseTrigger,
	toaster,
	Button,
} from '.';
import PropTypes from 'prop-types';

export const UrlActionsPopover = ({ url }) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);

			toaster.create({
				title: 'URL copiada',
				description: 'El enlace ha sido copiado al portapapeles.',
				type: 'success',
			});
		} catch (err) {
			console.error('Error al copiar:', err);
		}
	};

	const handleOpenLink = () => {
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({ title: 'Compartir enlace', url });
			} catch (err) {
				console.error('Error al compartir:', err);
			}
		} else {
			alert('Tu navegador no soporta la función de compartir.');
		}
	};

	return (
		<PopoverRoot>
			<PopoverTrigger>
				<Button size='xs' variant='link' colorPalette='blue'>
					<Badge bg='green' color='white'>
						Ver url
					</Badge>
				</Button>
			</PopoverTrigger>
			<PopoverContent w='260px' boxShadow='lg'>
				<PopoverCloseTrigger />
				<PopoverBody>
					<Stack>
						<Box>
							<Text fontSize='xs' color='gray.600' noOfLines={1}>
								{url}
							</Text>
						</Box>

						<Button
							size='sm'
							variant='ghost'
							justifyContent='flex-start'
							onClick={handleCopy}
						>
							<Icon as={FiLink} /> Copiar enlace
						</Button>

						<Button
							size='sm'
							variant='ghost'
							justifyContent='flex-start'
							onClick={handleOpenLink}
						>
							<Icon as={FiExternalLink} /> Abrir enlace
						</Button>

						<Button
							size='sm'
							variant='ghost'
							justifyContent='flex-start'
							onClick={handleShare}
						>
							<Icon as={FiShare2} /> Compartir
						</Button>
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
};

UrlActionsPopover.propTypes = {
	url: PropTypes.string,
};
