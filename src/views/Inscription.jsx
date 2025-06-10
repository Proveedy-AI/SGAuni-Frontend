import { /*useCreatePerson,*/ useReadCountries, useReadDepartments, useReadDistrict, useReadModalities, useReadNacionalities, useReadProgramTypes, useReadProvince } from "@/hooks";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Image,
  HStack,
  Input,
  Text,
  Span,
  Flex,
  Button,
} from "@chakra-ui/react"
import { ReactSelect } from "@/components";
import { Field, InputPhoneWithMask, Radio, RadioGroup } from "@/components/ui";

export default function AdmissionForm() {
  // Controlar si es un apellido o dos
  const [isOneLastName, setIsOneLastName] = useState(false);

  const { data: dataCountries, isLoading } = useReadCountries();
  const countryOptions = dataCountries?.results?.map(country => ({
    value: country.id,
    label: country.name,
  })) || [];
  const dialCodeOptions = dataCountries?.results?.map(country => ({
    value: country.dial_code,
    label: country.dial_code,
  })) || [];

  const { data: dataNacionalities, isLoading: loadingNationalities } = useReadNacionalities();
  const nationalityOptions = dataNacionalities?.results?.map(nationality => ({
    value: nationality.id,
    label: nationality.name,
  })) || [];

  const documentTypeOptions = [
    { value: 'dni', label: 'DNI' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'carnet_extranjeria', label: 'Carné de Extranjería' },
    { value: 'cedula_identidad', label: 'Cédula de Identidad' },
  ]

  // Consultar si es esto o otro llamado tipo de Modalidades de admisión
  const { data: dataModalities, isLoading: loadingModalities } = useReadModalities();
  const modalityOptions = dataModalities?.results?.map(modality => ({
    value: modality.id,
    label: modality.name,
  })) || [];

  const { data: dataPostgraduateProgramstypes, isLoading: loadingPostgraduatePrograms } = useReadProgramTypes();
  const postgraduateProgramTypeOptions = dataPostgraduateProgramstypes?.results?.map(program => ({
    value: program.id,
    label: program.name,
  })) || [];

  // Para controlar los departamentos, provincias y distritos
  const { data: dataDepartments, isLoading: loadingDepartments } = useReadDepartments();
  const { data: dataProvince, isLoading: loadingProvince } = useReadProvince();
  const { data: dataDistrict, isLoading: loadingDistrict } = useReadDistrict();

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const departmentOptions = dataDepartments?.results?.map(dep => ({
    value: dep.id,
    label: dep.name,
  })) || [];

  const provinceOptions = dataProvince?.results
    ?.filter(prov => selectedDepartment ? prov.department_id === selectedDepartment.value : true)
    .map(prov => ({
      value: prov.id,
      label: prov.name,
      department_id: prov.department_id,
    })) || [];

  const districtOptions = dataDistrict?.results
    ?.filter(dist => selectedProvince ? dist.province_id === selectedProvince.value : true)
    .map(dist => ({
      value: dist.id,
      label: dist.name,
      province_id: dist.province_id,
    })) || [];

  useEffect(() => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
  }, [selectedDepartment]);

  useEffect(() => {
    setSelectedDistrict(null);
  }, [selectedProvince]);

  const [inscriptionRequest, setInscriptionRequest] = useState({
    first_name: '',
    last_name: '',
    father_last_name: '',
    mother_last_name: '',
    birth_date: '',
    country: null,
    nationality: null,  // es el country_id
    dial_code: dialCodeOptions[0],
    phone_number: '',
    email: '',
    document_type: null,
    document_number: '',
    modality_type: null,
    postgraduate_program_type: null,
    address: '',
    department: null,
    province: null,
    district: null,
  });

  //const { mutateAsync: createPerson, isLoading: isSaving } = useCreatePerson();

  const handleSubmitInscription = async () => {
    const payload = {
      user : {
        username: inscriptionRequest.email,
        first_name: inscriptionRequest.first_name,
        last_name: isOneLastName ? inscriptionRequest.last_name : `${inscriptionRequest.father_last_name} ${inscriptionRequest.mother_last_name}`,
        //password: 'La constraseña se genera automáticamente',
      },
      first_name: inscriptionRequest.first_name,
      paternal_surname: inscriptionRequest.father_last_name,
      maternal_surname: inscriptionRequest.mother_last_name,
      document_type: inscriptionRequest.document_type?.value,
      document_number: inscriptionRequest.document_number,
      birth_date: inscriptionRequest.birth_date,
      district: inscriptionRequest.district?.value,
      phone: `${inscriptionRequest.dial_code?.value}${inscriptionRequest.phone_number}`,
      nationality: inscriptionRequest.nationality?.value,
      address: inscriptionRequest.address,
      has_one_surname: isOneLastName,

      //birth_country: inscriptionRequest.country?.value,
      //personal_email: inscriptionRequest.email,
      //password: 'La constraseña se genera automáticamente',
      //is_active: true,
      //birth_ubigeo_code: '',
      //address_ubigeo_code: '',
      //is_uni_graduate: false,
      //uni_graduate_code: '',
      //gender: 'X',
      //has_disability: false,
      //medical_disability_description: '',
      //license_number: '',
      //created_at: new Date().toISOString(),
      //updated_at: new Date().toISOString(),
    }

    console.log(payload);
    /*
      await createPerson(payload, {
        onSuccess: () => {
          toast({
            title: "Inscripción exitosa",
            description: "Su inscripción ha sido registrada correctamente.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Aquí puedes redirigir o limpiar el formulario
        },
        onError: (error) => {
          toast({
            title: "Error al inscribir",
            description: error.message || "Ocurrió un error al procesar su inscripción.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      });
    */
  }

  return (
    <Box minH="100dvh" bg="gray.50">
      {/* Cabecera */}
      <Box bg="#8B2635" py={4}>
        <Container maxW="container.xl">
          <HStack>
            <Image
              w="40px"
              src="/img/logo-UNI.png"
              alt="Logo"
              mr="2"
              filter="brightness(0) invert(1)"
            />
          </HStack>
        </Container>
      </Box>

      {/* Formulario de Inscripción */}
      <Box>
        <Container maxW="container.xl" py={5} fontWeight="bold" textAlign="center">
          <Text color="#8B2635" fontSize="2xl">
            Formulario de Inscripción
          </Text>
          <Span color='gray.500' fontSize="xl">Admisión 2025-2</Span>
        </Container>
        <Container maxW="container.sm">
          <HStack align="start" justify="center" spacing={8}>
            {/* Columna 1 */}
            <Box w='100%' maxW="420px" p={6} spaceY={3}>
              <Field label="Nombres completos">
                <Input 
                  type="text"
                  value={inscriptionRequest.first_name}
                  onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, first_name: e.target.value })}
                  placeholder="Ingrese sus nombres completos"
                />
              </Field>
              <Field label="¿Cuenta solo con un apellido?" >
                <RadioGroup
                  value={isOneLastName ? "yes" : "no"}
                  onChange={(value) => {setIsOneLastName(value.target.defaultValue === "yes")}}
                  direction="row"
                  spaceX={4}
                >
                  <Radio value="yes">Sí</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
              </Field>
              { isOneLastName ? (
                <Field label="Apellido">
                  <Input 
                    type="text"
                    value={inscriptionRequest.last_name}
                    onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, last_name: e.target.value })}
                    placeholder="Ingrese su apellido"
                  />
                </Field>
              ) : (
                <>
                  <Field label="Apellido Paterno">
                    <Input 
                      type="text"
                      value={inscriptionRequest.father_last_name}
                      onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, father_last_name: e.target.value })}
                      placeholder="Ingrese su apellido paterno"
                    />
                  </Field>
                  <Field label="Apellido Materno">
                    <Input 
                      type="text"
                      value={inscriptionRequest.mother_last_name}
                      onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, mother_last_name: e.target.value })}
                      placeholder="Ingrese su apellido materno"
                    />
                  </Field>
                </>
              )}
              <Field label="Fecha de Nacimiento">
                <Input 
                  type="date"
                  value={inscriptionRequest.birth_date}
                  onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, birth_date: e.target.value })}
                />
              </Field>
              <Field label="País de Nacimiento">
                <ReactSelect
                  label="País"
                  options={countryOptions}
                  value={inscriptionRequest.country}
                  onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, country: value })}
                  isLoading={isLoading}
                  placeholder="Seleccione un país"
                />
              </Field>
              <Field label="Nacionalidad">
                <ReactSelect
                  label="Nacionalidad"
                  options={nationalityOptions}
                  value={inscriptionRequest.nationality}
                  onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, nationality: value })}
                  isLoading={loadingNationalities}
                  placeholder="Seleccione una nacionalidad"
                />
              </Field>
              <Field label="Celular">
                <Flex w="100%">
                  <ReactSelect
                    options={dialCodeOptions}
                    value={inscriptionRequest.dial_code}
                    onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, dial_code: value })}
                    isLoading={isLoading}
                    styles={{ container: (base) => ({ ...base, width: "90px", minWidth: "90px", maxWidth: "90px" }) }}
                  />
                  <InputPhoneWithMask
                    dialCode={inscriptionRequest.dial_code?.value || inscriptionRequest.dial_code}
                    setDialCode={(value) => setInscriptionRequest({ ...inscriptionRequest, dial_code: value })}
                    setCountry={() => {}}
                    options={dialCodeOptions}
                    value={inscriptionRequest.phone_number}
                    onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, phone_number: e.target.value })}
                    ml={2}
                    flex={1}
                  />
                </Flex>
              </Field>
              <Field label="Correo Personal">
                <Input 
                  type="email"
                  value={inscriptionRequest.email}
                  onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, email: e.target.value })}
                  placeholder="Ingrese su correo electrónico"
                />
              </Field>
            </Box>

            {/* Columna 2 */}
            <Box w='100%' maxW="420px" p={6} spaceY={3}>
              <Field label="Documento de Identidad DNI (o Pasaporte, carné de extranjería, cédula de identidad)">
                <ReactSelect
                  label="Tipo de Documento"
                  options={documentTypeOptions}
                  value={inscriptionRequest.document_type}
                  onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, document_type: value })}
                  placeholder="Seleccione un tipo de documento"
                />
                <Input 
                  type="text"
                  value={inscriptionRequest.document_number}
                  onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, document_number: e.target.value })}
                  placeholder="Ingrese su número de documento"
                />
              </Field>
              <Field label="Tipo de Modalidad de Admisión">
                <ReactSelect
                  label="Modalidad"
                  options={modalityOptions}
                  value={inscriptionRequest.modality_type}
                  onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, modality_type: value })}
                  isLoading={loadingModalities}
                  placeholder="Seleccione una modalidad"
                />
              </Field>
              <Field label="Tipo de Programa de postgrado">
                <ReactSelect
                  label="Programa de Postgrado"
                  options={postgraduateProgramTypeOptions}
                  value={inscriptionRequest.postgraduate_program_type}
                  onChange={(value) => setInscriptionRequest({ ...inscriptionRequest, postgraduate_program_type: value })}
                  isLoading={loadingPostgraduatePrograms}
                  placeholder="Seleccione un programa de postgrado"
                />
              </Field>
              <Field label="Dirección">
                <Input 
                  type="text"
                  value={inscriptionRequest.address}
                  onChange={(e) => setInscriptionRequest({ ...inscriptionRequest, address: e.target.value })}
                  placeholder="Ingrese su dirección"
                />
              </Field>
              <Field label="País">
                <ReactSelect
                  label="Departamento"
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  isLoading={loadingDepartments}
                  placeholder="Seleccione un departamento"
                />
              </Field>
              <Field label="Provincia">
                <ReactSelect
                  label="Provincia"
                  options={provinceOptions}
                  value={selectedProvince}
                  onChange={setSelectedProvince}
                  isLoading={loadingProvince}
                  placeholder="Seleccione una provincia"
                  isDisabled={!selectedDepartment}
                  mt={4}
                />
              </Field>
              <Field label="Distrito">
                <ReactSelect
                  label="Distrito"
                  options={districtOptions}
                  value={selectedDistrict}
                  onChange={setSelectedDistrict}
                  isLoading={loadingDistrict}
                  placeholder="Seleccione un distrito"
                  isDisabled={!selectedProvince}
                  mt={4}
                />
              </Field>
              <HStack justify="end">
                <Button
                  bg="#0661D8"
                  px={10}
                  mt={5}
                  onClick={handleSubmitInscription}
                >
                  Enviar
                </Button>
              </HStack>
            </Box>
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}
