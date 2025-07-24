import { ReactSelect } from "@/components/select";
import { Field, Button, Modal } from "@/components/ui";
import { Card, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FiFile, FiPlus } from "react-icons/fi";
import { MdAssignment } from "react-icons/md";

export const ConfigurateCalificationCourseModal = ({ evaluations }) => {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const GradingModes = [
    { value: 1, label: "Porcentaje (con pesos por evaluación)" },
    { value: 2, label: "Promedio simple" },
    { value: 3, label: "Calificación conceptual (AD, A, B, C, D, NA)" },
  ];

  return (
    <Modal
      placement='center'
      title="Configurar modo de calificación"
      size='2xl'
      trigger={
        <Button
          size='xs'
          bg='uni.secondary'
          color='white'
          px={2}
          onClick={() => setOpen(true)}
        >
          Configuración
        </Button>
      }
      open={open}
			onOpenChange={(e) => setOpen(e.open)}
			hiddenFooter={true}
    >
      <Stack spacing={4}>
        <Card.Root>
          <Card.Header>
            <Heading color={'#0661D8'} size='lg' display='flex' alignItems='center' gapX={2}> <FiFile /> Evaluaciones</Heading>
            <Text fontSize='sm' color='gray.500'>
              Configura la cantidad de evaluaciones y el valor ponderado de promedio.
            </Text>
          </Card.Header>
          <Card.Body>
            <Flex justify='space-between' align='center' mb={4} gap={4}>
              <ReactSelect
                options={GradingModes}
                value={selectedMode}
                onChange={setSelectedMode}
                isClearable
                placeholder="Selecciona un modo de calificación"
              />
              <Button
                size='xs'
                bg='uni.secondary'
                color='white'
                px={2}
                py={4}
                onClick={() => setOpen(false)}
              >
                <MdAssignment /> Asignar
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Flex gap={4} pb={4}>
              <Field label="Nombre de la evaluación">
                <Input placeholder="Ej. Parcial 1" />
              </Field>
              {selectedMode?.value === 1 && (
                <Field maxW='120px' label="Valor ponderado">
                  <Input type="number" min={0} max={100} placeholder="Ej. 30" />
                </Field>
              )}
              <Field label="Fecha de evaluación">
                <Input type="date" />
              </Field>
            </Flex>
            <Button bg={'#C6E7FC'} color={'#0661D8'}>
              <FiPlus /> Añadir evaluación
            </Button>
          </Card.Body>
        </Card.Root>
      </Stack>
      {/* <Stack spacing={4}>
        <Field label="Modo de calificación">
          <ReactSelect
            options={gradingModes}
            value={mode}
            onChange={setMode}
          />
        </Field>
        {mode === "percentage" && (
          <Box>
            <Text fontWeight="bold" mb={2}>Pesos por evaluación (total debe ser 100%)</Text>
            <SimpleGrid columns={2} gap={2}>
              {evaluations.map(ev => (
                <Field key={ev.id} label={ev.name}>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={weights[ev.id] || ""}
                    onChange={e => handleWeightChange(ev.id, e.target.value)}
                  />
                </Field>
              ))}
            </SimpleGrid>
            <Text color={totalWeight === 100 ? "green.500" : "red.500"} mt={2}>
              Suma total: {totalWeight}%
            </Text>
          </Box>
        )}
        {mode === "conceptual" && (
          <Box>
            <Text fontWeight="bold" mb={2}>Conceptos posibles:</Text>
            <Stack direction="row" spacing={2}>
              {conceptualOptions.map(concept => (
                <Badge key={concept} colorScheme="blue">{concept}</Badge>
              ))}
            </Stack>
          </Box>
        )}
        {error && <Text color="red.500">{error}</Text>}
        <Button
          bg="uni.secondary"
          color="white"
          onClick={handleSave}
        >
          Guardar configuración
        </Button>
      </Stack> */}
    </Modal>
  );
}

ConfigurateCalificationCourseModal.propTypes = {
  evaluations: PropTypes.array,
}