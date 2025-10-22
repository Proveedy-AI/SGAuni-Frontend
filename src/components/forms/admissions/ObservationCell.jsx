import { useState } from 'react';
import {
	Box,
	Text,
	Button,
	Flex,
	useDisclosure,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FiChevronDown, FiChevronUp, FiEye, FiMessageSquare } from 'react-icons/fi';
import { Modal } from '@/components/ui';

export const ObservationCell = ({ comments }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const maxLength = 100;

	if (!comments) {
		return (
			<Text fontSize='sm' fontStyle='italic' color='gray.400'>
				Sin observaciones
			</Text>
		);
	}

	const isLong = comments.length > maxLength;
	const truncated = comments.substring(0, maxLength) + '...';

	return (
		<Box maxW="md">
			<Flex align="start" gap={2}>
				<Box mt={1}>
					<FiMessageSquare size={12} color="#A0AEC0" />
				</Box>
				<Box>
					<Text fontSize="sm" color="gray.700">
						{isExpanded || !isLong ? comments : truncated}
						{isLong && (
							<Button
								variant="link"
								size="xs"
								ml={2}
								color="blue.500"
								onClick={() => setIsExpanded(!isExpanded)}
								leftIcon={
									isExpanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />
								}
							>
								{isExpanded ? 'Ver menos' : 'Ver más'}
							</Button>
						)}
					</Text>
				</Box>
			</Flex>

			{/* Botón para abrir modal */}
			{isLong && (
				<Box mt={2}>
					<Modal
						placement="center"
						size="2xl"
						trigger={
							<Button
								variant="outline"
								size="xs"
								leftIcon={<FiEye size={12} />}
							>
								Ver completo
							</Button>
						}
						hiddenFooter
						open={isOpen}
						onOpenChange={(e) => (e.open ? onOpen() : onClose())}
					>
						<Box p={4} bg="gray.50" rounded="md" borderLeft="4px solid #90CDF4">
							<Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
								{comments}
							</Text>
						</Box>
					</Modal>
				</Box>
			)}
		</Box>
	);
};

ObservationCell.propTypes = {
	comments: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
};
