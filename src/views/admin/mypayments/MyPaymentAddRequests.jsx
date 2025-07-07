import { Box, Card, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';

export const MyPaymentAddRequests = () => {
	return (
		<Box>
			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiFileText} boxSize={5} color='blue.600' />
						<Heading fontSize='24px'>Solicitar Orden de Pago</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Text>Contenido de las ordenes de pago.</Text>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
