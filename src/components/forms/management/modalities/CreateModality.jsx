import { Field, Button, Radio, RadioGroup, toaster, Modal, Checkbox } from "@/components/ui"
import { Flex, Input, Stack, VStack } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { useCreateModality, useReadModalityRules } from "@/hooks";
import PropTypes from "prop-types";
import { FiPlus } from "react-icons/fi";

export const AddModalityForm = ({ fetchData }) => {
  const contentRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [modalityRequest, setModalityRequest] = useState({
    name: '',
    requires_pre_master_exam: false,
    requires_interview: false,
    requires_essay: false,
    description: '',
    essay_weight: 0.5,
    interview_weight: 0.5,
    min_grade: 0,
    rules_ids: []
  })
  const { data: dataModalityRules, isLoading: loadingRules } =
      useReadModalityRules();

  const [selectedRuleIds, setSelectedRuleIds] = useState([]);

  const handleCheckboxChange = (ruleId, isChecked) => {
		setSelectedRuleIds((prev) =>
			isChecked ? [...prev, ruleId] : prev.filter((id) => id !== ruleId)
		);
	};

  const { mutate: create, isPending: loading } = useCreateModality();

  const handleSubmitData = (e) => {
    e.preventDefault();
    
    if (!modalityRequest.name || !modalityRequest.description || !modalityRequest.min_grade || !modalityRequest.essay_weight || !modalityRequest.interview_weight) {
      toaster.create({
        title: 'Por favor, complete todos los campos correctamente.',
        type: 'warning',
      });
      return;
    }

    if (modalityRequest.min_grade < 0 || modalityRequest.min_grade > 20) {
      toaster.create({
        title: 'El grado mínimo debe estar entre 0 y 20.',
        type: 'warning',
      });
      return;
    }

    if (modalityRequest.essay_weight < 0 || modalityRequest.essay_weight > 1) {
      toaster.create({
        title: 'El peso del ensayo debe estar entre 0 y 1.',
        type: 'warning',
      });
      return;
    }

    if (modalityRequest.requires_interview && (modalityRequest.interview_weight < 0 || modalityRequest.interview_weight > 1)) {
      toaster.create({
        title: 'El peso de la entrevista debe estar entre 0 y 1.',
         type: 'warning',
      });
      return;
    }

    if (selectedRuleIds.length === 0) {
      toaster.create({
        title: 'Debe seleccionar al menos una regla.',
        type: 'warning',
      });
      return;
    }

    const payload = {
      ...modalityRequest,
      rules_ids: selectedRuleIds,
    }

    create(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Modalidad registrada correctamente',
          type: 'success'
        })
        setOpen(false);
        fetchData();
        setModalityRequest({
          name: '',
          requires_pre_master_exam:false,
          requires_interview: false,
          requires_essay: false,
          description: '',
          essay_weight: 0.5,
          interview_weight: 0.5,
          min_grade: 0,
        })
        setSelectedRuleIds([]);
      },
      onError: (error) => {
        toaster.create({
          title: error?.message || 'Error al crear la modalidad',
          type: 'error',
        });
      }
    })
  }

  return (
    <Modal
      title='Crear Modalidad'
      placement='center'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Crear Modalidad
        </Button>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field label='Nombre de la modalidad' helperText='Ingrese el nombre de la modalidad de admisión'>
          <Input
            required
            type="text"
            name="name"
            placeholder='Ingrese nombres de la modalidad'
            value={modalityRequest.name}
            onChange={e => setModalityRequest({ ...modalityRequest, name: e.target.value })}
          />
        </Field>
        <Field label='Descripción' helperText='Ingrese una breve descripción de la modalidad'>
          <Input
            required
            type="text"
            name="description"
            placeholder='Descripción de la modalidad'
            value={modalityRequest.description}
            onChange={e => setModalityRequest({ ...modalityRequest, description: e.target.value })}
          />
        </Field>
        <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
          <Field marginBottom="4" label='Requiere pre-maestría'>
            <RadioGroup
              name="requiresPreMasterExam"
              value={modalityRequest.requires_pre_master_exam ? "true" : "false"}
              onChange={(e) => setModalityRequest({ ...modalityRequest, requires_pre_master_exam: e.target.value === "true" })}
              direction="row"
            >
              <Flex gap="5">
                <Radio value={"true"}>Sí</Radio>
                <Radio value={"false"}>No</Radio>
              </Flex>
            </RadioGroup>
          </Field>
          <Field marginBottom="4" label='Grado mínimo'>
            <Input
              required
              type="number"
              name="min_grade"
              placeholder='Ingrese el grado mínimo'
              value={modalityRequest.min_grade}
              onChange={e => setModalityRequest({ ...modalityRequest, min_grade: e.target.value })}
              min={0}
              max={20}
              step={0.5}
            />
          </Field>
        </Flex>
        <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
          <Field label='Requiere ensayo'>
            <RadioGroup
              name="requiresEssay"
              value={modalityRequest.requires_essay ? "true" : "false"}
              onChange={(e) => setModalityRequest({ ...modalityRequest, requires_essay: e.target.value === "true" })}
              direction="row"
            >
              <Flex gap="5">
                <Radio value={"true"}>Sí</Radio>
                <Radio value={"false"}>No</Radio>
              </Flex>
            </RadioGroup>
          </Field>
          {
            modalityRequest.requires_essay && (
              <Field label='Peso del ensayo (0 a 1)'>
                <Input
                  required
                  type="number"
                  name="essay_weight"
                  placeholder='Ej: 0.5'
                  value={modalityRequest.essay_weight}
                  onChange={e => setModalityRequest({ ...modalityRequest, essay_weight: e.target.value })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Field>
            )
          }
        </Flex>
        <Flex marginBottom="4" alignItems="start" direction={{ base: 'column', sm: 'row' }} gap={4}>
          <Field label='Requiere entrevista personal'>
            <RadioGroup
              name="requiresInterview"
              value={modalityRequest.requires_interview ? "true" : "false"}
              onChange={(e) => setModalityRequest({ ...modalityRequest, requires_interview: e.target.value === "true" })}
              direction="row"
            >
              <Flex gap="5">
                <Radio value={"true"}>Sí</Radio>
                <Radio value={"false"}>No</Radio>
              </Flex>
            </RadioGroup>
          </Field>
          {modalityRequest.requires_interview && (
            <Field label='Peso de la entrevista (0 a 1)'>
              <Input
                required
                type="number"
                name="interview_weight"
                value={modalityRequest.interview_weight}
                onChange={e => setModalityRequest({ ...modalityRequest, interview_weight: e.target.value })}
                placeholder='Ej: 0.5'
                min={0}
                max={1}
                step={0.01}
              />
            </Field>
          )}
        </Flex>
        <Field label='Reglas'>
          <VStack align='start'>
            {!loadingRules && dataModalityRules?.results?.map((rule) => (
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
    </Modal>
  )
}

AddModalityForm.propTypes = {
  fetchData: PropTypes.func,
};
