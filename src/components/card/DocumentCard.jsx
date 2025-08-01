import {
	Box,
	Flex,
	Badge,
	Text,
	Heading,
	Button,
	Icon,
	HStack,
} from '@chakra-ui/react';
import {
	FiFileText,
	FiCalendar,
	FiDownload,
	FiExternalLink,
} from 'react-icons/fi';

import PropTypes from 'prop-types';

export const DocumentCard = ({ doc, handleDownload }) => {
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};
	return (
		<Box
			key={doc.id}
			borderWidth='1px'
			borderRadius='lg'
			p={4}
			_hover={{ bg: 'gray.50' }}
			transition='background-color 0.2s'
		>
			<Flex justify='space-between' align='flex-start'>
				<Flex flex='1' gap={3}>
					<Box bg='blue.100' p={2} borderRadius='lg'>
						<Icon as={FiFileText} boxSize={5} color='blue.600' />
					</Box>
					<Box flex='1' minW={0}>
						<HStack gap={2} mb={1} align='center'>
							<Heading size='sm' isTruncated>
								{doc.type_document_name}
							</Heading>
							<Badge variant='outline' fontSize='xs' colorScheme='gray'>
								ID: {doc.id}
							</Badge>
						</HStack>

						<HStack spacing={4} fontSize='xs' color='gray.500'>
							<HStack spacing={1}>
								<Icon as={FiCalendar} boxSize={3} />
								<Text>{formatDate(doc.uploaded_at)}</Text>
							</HStack>
						</HStack>
					</Box>
				</Flex>

				<HStack gap={2} ml={4} align='flex-end'>
					<Button
						size='sm'
						variant='outline'
						onClick={() => window.open(doc.file_path, '_blank')}
						leftIcon={<Icon as={FiExternalLink} />}
					>
						Ver archivo
					</Button>
					<Button
						size='sm'
						variant='solid'
						colorPalette='blue'
						onClick={() =>
							handleDownload(doc.file_path, doc.type_document_name)
						}
						leftIcon={<Icon as={FiDownload} />}
					>
						Descargar
					</Button>
				</HStack>
			</Flex>
		</Box>
	);
};

DocumentCard.propTypes = {
	doc: PropTypes.object.isRequired,
	expandedDoc: PropTypes.number,
	setExpandedDoc: PropTypes.func.isRequired,
	handleDownload: PropTypes.func.isRequired,
};
