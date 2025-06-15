import PropTypes from "prop-types";
import { Field, Modal, toaster, Tooltip } from "@/components/ui"
import { Box, Flex, IconButton, Input, Stack, Table, Text } from "@chakra-ui/react";
import { FiCheckSquare, FiTrash2 } from "react-icons/fi";
import { useRef, useState } from "react";
import { useAssignDebtConditionProgram, useDeleteDebtConditionProgram } from "@/hooks";
import { FaSave } from "react-icons/fa";

export const AssignDebtConditionProgram = ({ item, fetchData }) => {
  /*Solicitar que a los programas se le añade un array de condiciones de deuda
    {
      ...las demás propiedades del programa,
      debt_conditions: [
        {
          id: 1,
          min_payment_percentage: 10,
          max_installments: 12,
          created_at: "2023-10-01T12:00:00Z",
          updated_at: "2023-10-01T12:00:00Z",
        },
      ]
    }
  */

  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const [minPaymentPercentage, setMinPaymentPercentage] = useState(0);
  const [maxInstallments, setMaxInstallments] = useState(0);

  const { mutateAsync: assignDebtCondition, isPending: isSaving } = useAssignDebtConditionProgram();
  const { mutate: deleteDebtCondition } = useDeleteDebtConditionProgram();

  const handleSubmit = async () => {
    const payload = {

    }

    assignDebtCondition({ programId: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Condicion de deuda asignada correctamente',
          status: 'success'
        })
        fetchData();
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error?.response?.data?.detail || 'Error al asignar condicion de deuda',
          status: 'error'
        });
      }
    });
  }

  const handleDelete = (id) => {
      deleteDebtCondition(id, {
        onSuccess: () => {
          toaster.create({ title: 'Condición eliminada', type: 'info' });
          fetchData();
        },
        onError: (error) => {
          toaster.create({
            title: error.response?.data?.[0] || 'Error al eliminar',
            type: 'error',
          });
        },
      });
    };

  return (
    <Modal
      title='Asignar condiciones de deuda'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Asignar condiciones de deuda'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton colorPalette='purple' size='xs'>
              <FiCheckSquare />
            </IconButton>
          </Tooltip>
        </Box>
      }
      size='4xl'
      open={open}
      hiddenFooter={true}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='flex-start'
          align={'end'}
          gap={2}
          mt={2}
        >
          <Field label='Porcentaje mínimo de deuda'>
            <Input
              type='number'
              value={minPaymentPercentage}
              onChange={(e) => setMinPaymentPercentage(e.target.value)}
            />
          </Field>
          <Field label='Máximo de cuotas'>
            <Input
              type='number'
              value={maxInstallments}
              onChange={(e) => setMaxInstallments(e.target.value)}
            />
          </Field>
          <IconButton
            size='sm'
            bg='uni.secondary'
            loading={isSaving}
            disabled={!minPaymentPercentage || !maxInstallments}
            onClick={handleSubmit}
            css={{ _icon: { width: '5', height: '5' } }}
          >
            <FaSave />
          </IconButton>
        </Flex>
        <Box mt={6}>
          <Text fontWeight='semibold' mb={2}>
            Condiciones de deuda asignadas:
          </Text>
          <Table.Root size='sm' striped>
            <Table.Header>
              <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                <Table.ColumnHeader>N°</Table.ColumnHeader>
                <Table.ColumnHeader>% min de Deuda</Table.ColumnHeader>
                <Table.ColumnHeader># máx de Cuotas</Table.ColumnHeader>
                <Table.ColumnHeader>Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {item?.debt_conditions?.map((item, index) => (
                <Table.Row
                  key={item.id}
                  bg={{ base: 'white', _dark: 'its.gray.500' }}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{item.min_payment_percentage}</Table.Cell>
                  <Table.Cell>{item.max_installments}</Table.Cell>

                  <Table.Cell>
                    <Flex gap={2}>
                      <IconButton
                        size='xs'
                        colorPalette='red'
                        onClick={() => handleDelete(item.id)}
                        aria-label='Eliminar'
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
              {item?.debt_conditions?.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign='center'>
                    Sin datos disponibles
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Modal>
  )
}

AssignDebtConditionProgram.propTypes = {
  item: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
};