import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	Box,
	Flex,
	IconButton,
	Input,
	Stack,
	Text,
  Card
} from '@chakra-ui/react';
import { FiCheckSquare, FiTrash2, FiCreditCard, FiInfo } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import {
	useAssignDebtConditionProgram,
	useDeleteDebtConditionProgram,
  useUpdateDebtConditionProgram,
} from '@/hooks';
import { FaSave } from 'react-icons/fa';
import { useReadDebtConditionProgram } from '@/hooks/programs/useReadDebtConditionProgram';
import { BsFillPencilFill } from 'react-icons/bs';

export const AssignDebtConditionProgram = ({ item, fetchData }) => {
	/*Agregar condición de deuda a un programa existente (item)
    ...demás campos,
    has_debt_condition: boolean,
    debt_condition: { // En caso has_debt_condition = true
      id: number,
      min_payment_percentage: number,
      max_installments: number,
      postgraduate_program: number,
    }
  */

	const contentRef = useRef();
	const [open, setOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
	const [minPaymentPercentage, setMinPaymentPercentage] = useState(0);
	const [maxInstallments, setMaxInstallments] = useState(0);

	const { mutateAsync: assignDebtCondition, isPending: isSaving } =
		useAssignDebtConditionProgram();

	const { refetch: fetchDebts } = useReadDebtConditionProgram(
		{},
		{ enabled: false }
	);

	const { mutateAsync: updateDebtCondition, isPending: isUpdating } = useUpdateDebtConditionProgram();
  const { mutateAsync: deleteDebtCondition, isPending: isDeleting } = useDeleteDebtConditionProgram();

  useEffect(() => {
    if (isEditable) {
      setMinPaymentPercentage(item?.debt_condition?.min_payment_percentage);
      setMaxInstallments(item?.debt_condition?.max_installments);
    } else {
      setMinPaymentPercentage(0);
      setMaxInstallments(0);
    }
  }, [isEditable, item])

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (minPaymentPercentage < 0 || minPaymentPercentage > 100) {
      newErrors.minPaymentPercentage = 'El porcentaje mínimo debe estar entre 0 y 100';
    }
    if (maxInstallments <= 0) {
      newErrors.maxInstallments = 'El máximo de cuotas debe ser un número positivo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const onSuccess = () => {
    toaster.create({
      title: `Condición de deuda ${isEditable ? 'actualizada' : 'asignada'} correctamente`,
      type: 'success',
    });
    fetchData();
    fetchDebts();
  }

  const onError = (error) => {
    toaster.create({
      title: error || `Error al ${isEditable ? 'actualizar' : 'asignar'} condición de deuda`,
      type: 'error',
    });
  }

  const handleEdit = (id) => {
    const payload = {
      min_payment_percentage: minPaymentPercentage,
      max_installments: maxInstallments,
      postgraduate_program: item.id,
    }

    updateDebtCondition({ id, payload }, { onSuccess, onError })
  }

  const handleAssign = () => {
    const payload = {
      min_payment_percentage: minPaymentPercentage,
      max_installments: maxInstallments,
      postgraduate_program: item.id,
    };

    assignDebtCondition(payload, { onSuccess, onError });
  }

	const handleSubmit = () => {
    if (!validate()) {
      toaster.create({
        title: 'Campos incompletos',
        description: 'Por favor, corrige los errores antes de continuar',
        type: 'warning',
      });
      return;
    }
		if (isEditable) handleEdit(item?.debt_condition?.id);
    else handleAssign();

    setOpen(false);
    setMinPaymentPercentage(0);
    setMaxInstallments(0);
	};

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
            <IconButton disabled={item.has_debt_condition} colorPalette='purple' size='xs'>
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
      <Card.Root>
        <Card.Header display={'flex'} flexDirection={'row'} gap={2} alignItems='center' color='blue.500'>
          <FiCreditCard size={24} />
          <Text fontSize='lg' fontWeight='semibold'>Condiciones de deuda</Text>
        </Card.Header>
        <Card.Body spacing={4} css={{ '--field-label-width': '150px' }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify='flex-start'
            align={'end'}
            gap={2}
            px={4}
          >
            <Field 
              label='Porcentaje mínimo de deuda'
              invalid={!!errors.minPaymentPercentage}
              errorMessage={errors.minPaymentPercentage}
            >
              <Input
                type='number'
                value={minPaymentPercentage}
                onChange={(e) => setMinPaymentPercentage(e.target.value)}
              />
            </Field>
            <Field
              label='Máximo de cuotas'
              invalid={!!errors.maxInstallments}
              errorMessage={errors.maxInstallments}
            >
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
        </Card.Body>
      </Card.Root>
      <Card.Root mt={4}>
        <Card.Header display={'flex'} flexDirection={'row'} gap={2} alignItems='center' color='green.500'>
          <FiInfo size={24} />
          <Text fontSize='lg' fontWeight='semibold'>Condiciones asignada</Text>
        </Card.Header>
        <Card.Body spacing={4} css={{ '--field-label-width': '150px' }}>
          {item?.debt_condition ? (
            <Stack spacing={3} px={4}>
              <Text>
                <strong>Porcentaje mínimo de deuda:</strong> {item?.debt_condition?.min_payment_percentage}%
              </Text>
              <Text>
                <strong>Máximo de cuotas:</strong> {item?.debt_condition?.max_installments}
              </Text>
              <Flex gap={2} mt={2} justify='flex-end'>
                <IconButton
                  size='xs'
                  loading={isUpdating}
                  colorPalette='yellow'
                  onClick={() => setIsEditable(true)}
                  aria-label='Editar'
                  px={4}
                >
                  <BsFillPencilFill /> Editar
                </IconButton>
                <IconButton
                  size='xs'
                  loading={isDeleting}
                  colorPalette='red'
                  onClick={() => handleDelete(item?.debt_condition?.id)}
                  aria-label='Eliminar'
                  px={4}
                >
                  <FiTrash2 /> Eliminar
                </IconButton>
              </Flex>
            </Stack>
          ) : (
            <Text color='gray.500'>No hay condición de deuda asignada.</Text>
          )}
        </Card.Body>
      </Card.Root>
    </Modal>
  );
};

AssignDebtConditionProgram.propTypes = {
	item: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
};
