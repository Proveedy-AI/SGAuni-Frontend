import PropTypes from 'prop-types';
import { Box, Text, Button, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

export const ApplicantHasDebts = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Box p={6} borderWidth={1} borderRadius="md" bg="red.50" textAlign="center">
      <Stack spacing={4} align="center">
        <Text fontSize="2xl" fontWeight="bold" color="red.600">
          Atención usuarios {data?.user?.firstname}:
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="red.600">
          Tienes deudas pendientes de S/.{data?.total || 0}
        </Text>
        <Text>
          Por favor, regulariza tus deudas para continuar con el proceso.
        </Text>
        <Button colorScheme="red" onClick={() => navigate('/debts')}>
          Ver deudas
        </Button>
      </Stack>
    </Box>
  );
}

ApplicantHasDebts.propTypes = {
  data: PropTypes.object,
}