import PropTypes from 'prop-types';
import { ReactSelect } from "@/components/select";
import { Button, Checkbox, Field, Modal, toaster } from "@/components/ui";
import { CompactFileUpload } from "@/components/ui/CompactFileInput";
import { Stack, Text, Card, Input, HStack, VStack, SimpleGrid } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiDollarSign, FiDownload } from "react-icons/fi";

export const FractionateDebt = ({ totalAmount }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  //const { mutateAsync: fractionateDebt, isSaving } = useFractionateDebt();

  // Según base de datos
  const planOptions = [
    { value: 1, label: "Creditos" },
    { value: 2, label: "Cuotas" },
    { value: 3, label: "Pagos Mensuales" },
  ]

  const [fractionateDebtPath, setFractionateDebtPath] = useState("");
  const [planType, setPlanType] = useState(null);
  const [amountToPay, setAmountToPay] = useState(null);
  const [upFrontPercentage, setUpFrontPercentage] = useState(null);
  const [installments, setInstallments] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {};
    if (!fractionateDebtPath) newErrors.fractionateDebtPath = "El archivo es requerido";
    if (!planType) newErrors.planType = "El tipo de plan es requerido";
    if (!amountToPay) newErrors.amountToPay = "El monto a pagar es requerido";
    if (amountToPay <= 0) newErrors.amountToPay = "El monto a pagar debe ser mayor a 0";
    if (amountToPay >= totalAmount) newErrors.amountToPay = "El monto a pagar no puede ser mayor o igual al total de la deuda";
    if (!upFrontPercentage) newErrors.upFrontPercentage = "El porcentaje inicial es requerido";
    if (upFrontPercentage < 0 || upFrontPercentage > 100) newErrors.upFrontPercentage = "El porcentaje inicial debe estar entre 0 y 100";
    if (!installments) newErrors.installments = "El número de cuotas es requerido";
    if (installments <= 0) newErrors.installments = "El número de cuotas debe ser mayor a 0";
    if (!acceptedTerms) newErrors.acceptedTerms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const reset = () => {
    setFractionateDebtPath("");
    setPlanType(null);
    setAmountToPay(0);
    setUpFrontPercentage(0);
    setInstallments(0);
    setAcceptedTerms(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toaster.create({
        title: 'Campos incompletos',
        description: 'Debe ingresar todos los campos',
        type: 'warning'
      })
      return ;
    }
    
    const payload = {
      document_path: fractionateDebtPath,
      plan_type: planType?.value,
      amount_to_pay: amountToPay,
      up_front_percentage: Number(upFrontPercentage/100),
      installments: installments
    }
    console.log(payload)
    /*
    fractionateDebt(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Solicitud enviada con éxito',
          type: 'success'
        })
        reset();
        setOpen(false);
      },
      onError: () => {
        toaster.create({
          title: 'Error al enviar la solicitud',
          type: 'error'
        })
      }
    })
    
    */
    reset();
    setOpen(false);
  };

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = "/SolicitudFraccionDeudaUni.docx";
    link.download = "SolicitudFraccionDeudaUni.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Modal
      title="Fraccionar Deuda"
      placement="center"
      trigger={
        <Button
          bg="uni.secondary"
          color="white"
          size="xs"
          w={{ base: "full", sm: "auto" }}
        >
          Fraccionar deuda
        </Button>
      }
      onSave={handleSubmit}
      size="3xl"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack gap={3}>
        <Card.Root>
          <Card.Header>
            <Text fontSize="lg" fontWeight="bold">
              <FiDollarSign /> Solicitud de Fraccionamiento
            </Text>
          </Card.Header>
          <Card.Body>
            <Stack css={{ "--field-label-width": "150px" }}>
              <Text fontSize="sm" mb={2}>
                Permite solicitar el fraccionamiento de una deuda, es decir, dividir el monto total en pagos más pequeños y manejables. Adjunta el documento de solicitud para iniciar el proceso.
              </Text>
              <Button
                variant="link"
                leftIcon={<FiDownload />}
                onClick={downloadSampleFile}
                ml={2}
                bg="transparent"
                border="1px solid"
                _hover={{ bg: "gray.100" }}
              >
                Descargar plantilla de solicitud
              </Button>
              <Field
                label="Adjuntar solicitud"
                invalid={!!errors.fractionateDebtPath}
                errorText={errors.fractionateDebtPath}
                required
              >
                <CompactFileUpload
                  name="path_cv"
                  onChange={(file) => setFractionateDebtPath(file)}
                  onClear={() => setFractionateDebtPath(null)}
                />
              </Field>
            </Stack>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Text fontSize="lg" fontWeight="bold">
              Detalles de Fraccionamiento
            </Text>
          </Card.Header>
          <Card.Body>
            <Stack css={{ "--field-label-width": "150px" }}>
              <SimpleGrid columns={2} gap={2} >
                <Field
                  label="Tipo de plan"
                  required
                  invalid={!!errors.planType}
                  error={errors.planType}
                >
                  <ReactSelect
                    options={planOptions}
                    value={planOptions.find(opt => opt.value === planType)}
                    onChange={opt => setPlanType(opt?.value)}
                    placeholder="Selecciona el tipo de plan"
                  />
                </Field>
                <Field
                  label="Monto a pagar"
                  required
                  invalid={!!errors.amountToPay}
                  error={errors.amountToPay}
                >
                  <Input
                    type="number"
                    min={1}
                    max={totalAmount - 1}
                    value={amountToPay}
                    onChange={e => setAmountToPay(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </Field>
                <Field
                  label="Porcentaje inicial (%)"
                  required
                  invalid={!!errors.upFrontPercentage}
                  error={errors.upFrontPercentage}
                >
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={upFrontPercentage}
                    onChange={e => setUpFrontPercentage(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </Field>
                <Field
                  label="Número de cuotas"
                  required
                  invalid={!!errors.installments}
                  error={errors.installments}
                >
                  <Input
                    type="number"
                    min={1}
                    value={installments}
                    onChange={e => setInstallments(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </Field>
              </SimpleGrid>
              <HStack>
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  mt={1}
                />
                <VStack align='start' spacing={1}>
                    <Text>
                      Acepto los{' '}
                      <Text
                        as='a'
                        href='#'
                        color='blue.600'
                        textDecoration='underline'
                      >
                        términos y condiciones
                      </Text>{' '}
                      del proceso de fraccionamiento de deuda *
                    </Text>
                    {errors.acceptedTerms && (
                      <Text color='red.500' fontSize='sm'>
                        {errors.acceptedTerms}
                      </Text>
                    )}
                  </VStack>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Modal>
  );
};

FractionateDebt.propTypes = {
  totalAmount: PropTypes.number,
};