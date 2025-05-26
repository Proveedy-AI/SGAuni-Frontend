import { Box, Heading, Flex } from '@chakra-ui/react';

export const Dashboard = () => {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Box
        bg={{ base: 'white', _dark: 'uni.gray.500' }}
        p="10"
        borderRadius="10px"
        w="100%"
        maxW="md"
        boxShadow="lg"
      >
        <Heading size="xl" textAlign="center">
          ¡Bienvenido al Dashboard!
        </Heading>
      </Box>
    </Flex>
  );
};
