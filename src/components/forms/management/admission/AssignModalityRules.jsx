import { Field, Modal, toaster } from '@/components/ui';
import { useAssignModalityRules, useReadModalityHasRule, /*useReadModalityRules*/ } from '@/hooks';
import { Checkbox, Flex, IconButton, Spinner, Stack, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

export const AssignModalityRules = ({ item, modalityRules, fetchData }) => {
  const contentRef = useRef();
  const modalityId = item?.id
  const [open, setOpen] = useState(false);
  console.log(item)

  //const { data: dataModalityRules, isLoading: loadingRules } = useReadModalityRules();
  const { data: rulesInModality, isLoading: loadingAssigned } = useReadModalityHasRule(modalityId);
  const { mutateAsync: assignRules, isPending: isSaving } = useAssignModalityRules();
  console.log('seleccionado', rulesInModality)
  console.log('elecciones', modalityRules)

  const [selectedRuleIds, setSelectedRuleIds] = useState([]);

  const handleCheckboxChange = (roleId, isChecked) => {
		setSelectedRuleIds((prev) =>
			isChecked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
		);
	};

  const handleSaveRules = async () => {
    await assignRules({ modalityId: modalityId, rulesId: selectedRuleIds }, {
      onSuccess: () => {
        toaster.create({
          title: 'Reglas actualizadas correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
        setSelectedRuleIds([]);
      },
      onError: (error) => {
        toaster.create({
          title: error?.message || 'Error al asignar reglas',
          type: 'error',
        });
      }
    })
  }

  return (
    <Modal
      title='Asignar Reglas'
      placement='center'
      size='4xl'
      trigger={
        <IconButton colorPalette='green' size='xs'>
          <FiCheckSquare />
        </IconButton>
      }
      contentRef={contentRef}
      onSave={handleSaveRules}
      loading={isSaving}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
    >
      {
        loadingAssigned || loadingAssigned ? (
          <Flex justify='center' align='center' minH='200px'>
            <Spinner size='xl' />
          </Flex>
        ) : (
          <Stack>
            <Field label='Roles'>
              <VStack align='start'>
                {modalityRules?.map((rule) => (
                  <Field key={rule.id} orientation='horizontal'>
                    <Checkbox key={rule.id} isChecked={(e) => handleCheckboxChange(rule.id, e.target.checked)}>
                      {rule.name}
                    </Checkbox>
                  </Field>
                ))}
              </VStack>
            </Field>
          </Stack>
        )
      }
    </Modal>
  )
}

AssignModalityRules.propTypes = {
  item: PropTypes.object,
  modalityRules: PropTypes.arrayOf(PropTypes.object),
  fetchData: PropTypes.func,
};