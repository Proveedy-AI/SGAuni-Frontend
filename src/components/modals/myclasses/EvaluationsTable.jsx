import PropTypes from 'prop-types';
import { memo } from 'react';
import { Box, Group, HStack, Table, Text, Button, Flex } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Row = memo(({ evaluation, index, currentQualificationType, onEdit, onDelete, isRemoving }) => {
  return (
    <Table.Row key={evaluation.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>
        {index + 1}
      </Table.Cell>
      <Table.Cell>
        <Text fontWeight="medium">{evaluation.name}</Text>
      </Table.Cell>
      {currentQualificationType === 1 && (
        <Table.Cell textAlign="center">
          <Text fontWeight="bold" color="#0661D8">
            {evaluation.weight !== null && evaluation.weight !== undefined ? `${evaluation.weight}%` : "-"}
          </Text>
        </Table.Cell>
      )}
      <Table.Cell>
        <HStack justify='center'>
          <Group>
            <Button
              size="xs"
              colorScheme="blue"
              onClick={() => onEdit(evaluation)}
              leftIcon={<FiEdit2 />}
            >
              Editar
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => onDelete(evaluation.id)}
              leftIcon={<FiTrash2 />}
              isLoading={isRemoving}
            >
              Eliminar
            </Button>
          </Group>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'EvaluationRow';

Row.propTypes = {
  evaluation: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  currentQualificationType: PropTypes.number,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool,
};

export const EvaluationsTable = ({ 
  evaluationComponents, 
  currentQualificationType, 
  onEdit, 
  onDelete, 
  isRemoving 
}) => {
  if (!evaluationComponents || evaluationComponents.length === 0) {
    return (
      <Box
        bg={{ base: 'white', _dark: 'its.gray.500' }}
        p='6'
        borderRadius='10px'
        boxShadow='md'
        textAlign="center"
      >
        <Text color="gray.500">No hay evaluaciones configuradas</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={{ base: 'white', _dark: 'its.gray.500' }}
      p='3'
      borderRadius='10px'
      overflow='hidden'
      boxShadow='md'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full' striped>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader w='10%'>
                <Text fontWeight="bold">N°</Text>
              </Table.ColumnHeader>
              <Table.ColumnHeader w={currentQualificationType === 1 ? '45%' : '70%'}>
                <Text fontWeight="bold">Nombre</Text>
              </Table.ColumnHeader>
              {currentQualificationType === 1 && (
                <Table.ColumnHeader w='20%' textAlign="center">
                  <Text fontWeight="bold">Ponderación (%)</Text>
                </Table.ColumnHeader>
              )}
              <Table.ColumnHeader w='25%' textAlign="center">
                <Text fontWeight="bold">Acciones</Text>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {evaluationComponents.map((evaluation, index) => (
              <Row
                key={evaluation.id}
                evaluation={evaluation}
                index={index}
                currentQualificationType={currentQualificationType}
                onEdit={onEdit}
                onDelete={onDelete}
                isRemoving={isRemoving}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Resumen de ponderaciones para modo porcentaje */}
      {currentQualificationType === 1 && (
        <Flex justify="space-between" align="center" mt={4} p={3} bg="blue.50" borderRadius="md">
          <Text fontWeight="bold" color="blue.700">
            Total ponderado:
          </Text>
          <Text fontWeight="bold" color="blue.700" fontSize="lg">
            {evaluationComponents.reduce((sum, ev) => sum + (ev.weight || 0), 0)}%
          </Text>
        </Flex>
      )}
    </Box>
  );
};

EvaluationsTable.propTypes = {
  evaluationComponents: PropTypes.array,
  currentQualificationType: PropTypes.number,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool,
};
