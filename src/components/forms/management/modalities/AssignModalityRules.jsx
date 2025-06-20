import { Checkbox, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useAssignModalityRules, useReadModalityRules } from '@/hooks';
import {
	Box,
	Flex,
	IconButton,
	Spinner,
	Stack,
	VStack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

export const AssignModalityRules = ({ item, fetchData }) => {
	const contentRef = useRef();
	const modalityId = item?.id;
	const [open, setOpen] = useState(false);

	const { data: dataModalityRules, isLoading: loadingRules } =
		useReadModalityRules();
	const { mutateAsync: assignRules, isPending: isSaving } =
		useAssignModalityRules();
	const [selectedRuleIds, setSelectedRuleIds] = useState([]);

	useEffect(() => {
		if (item?.rules) {
			setSelectedRuleIds(item.rules.map((r) => r.id));
		}
	}, [item]);

	const handleCheckboxChange = (ruleId, isChecked) => {
		setSelectedRuleIds((prev) =>
			isChecked ? [...prev, ruleId] : prev.filter((id) => id !== ruleId)
		);
	};

	const handleSaveRules = async () => {
		if (selectedRuleIds.length === 0) {
      toaster.create({
        title: 'Por favor, seleccione al menos una regla.',
        type: 'warning',
      });
      return;
    }
    
    const payload = {
			modalityId: modalityId,
			rulesId: selectedRuleIds,
		};

		await assignRules(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Reglas actualizadas correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
			},
			onError: (error) => {
				toaster.create({
					title: error?.message || 'Error al asignar reglas',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Asignar Reglas'
			placement='center'
			size='4xl'
			trigger={
				<Box>
					<Tooltip
						content='Asignar regla'
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
			contentRef={contentRef}
			onSave={handleSaveRules}
			loading={isSaving}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
			{loadingRules ? (
				<Flex justify='center' align='center' minH='200px'>
					<Spinner size='xl' />
				</Flex>
			) : (
				<Stack>
					<Field label='Roles'>
						<VStack align='start'>
							{dataModalityRules?.results?.map((rule) => (
								<Field key={rule.id} orientation='horizontal'>
									<Checkbox
										checked={selectedRuleIds.includes(rule.id)}
										onChange={(e) =>
											handleCheckboxChange(rule.id, e.target.checked)
										}
									>
										{rule.field_name}
									</Checkbox>
								</Field>
							))}
						</VStack>
					</Field>
				</Stack>
			)}
		</Modal>
	);
};

AssignModalityRules.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
};
