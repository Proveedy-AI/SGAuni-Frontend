import { Box, Card, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';

export const MyPaymentHistories = () => {
	return (
		<Box>
			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiFileText} boxSize={5} color='blue.600' />
						<Heading fontSize='24px'>Mis Historiales de Pago</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Text>Contenido de los historiales de pago.</Text>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
