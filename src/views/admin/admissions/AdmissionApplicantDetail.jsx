import { useReadPersonById } from "@/hooks";
import { useReadAdmissionApplicantById } from "@/hooks/admissions_applicants/useReadAdmissionApplicantById";
import { Badge, Box, Breadcrumb, Flex, Heading, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { LiaSlashSolid } from "react-icons/lia";
import { useParams } from "react-router"
import { Link as RouterLink } from 'react-router';

export const AdmissionApplicantDetail = () => {
  const { programId, id } = useParams();
  const { data: dataApplicant, loading: isApplicantLoading } = useReadAdmissionApplicantById(id);
  const { data: dataApplicantDetails, loading: isApplicantDetailsLoading } = useReadPersonById(id);

  const statusEnum = [
   { id: 1, label: 'En Revisión', bg:'#FDD9C6', color:'#F86A1E' },
   { id: 2, label: 'Aprobado', bg:'green', color:'white' },
   { id: 3, label: 'Rechazado', bg:'red', color:'white' }
  ]

  const statusEnumSelected = statusEnum.find(item => item.id === dataApplicant?.status);

  /*
  Persona
  {
    "id": 1,
    "user": {
      "id": 7,
      "username": "ejemplo@gmail.com",
      "first_name": "Jose",
      "last_name": "Diaz Torres"
    },
    "first_name": "Jose",
    "paternal_surname": "Diaz",
    "maternal_surname": "Torres",
    "document_type": 1,
    "document_number": "77777777",
    "birth_date": "2004-02-17",
    "district": 1,
    "phone": "+51 987 654 321",
    "nationality": 1,
    "address": "La marina, C.C. San Miguel",
    "has_one_surname": false,
    "country": 1,
    "birth_ubigeo": null,
    "address_ubigeo": null,
    "uni_email": "",
    "is_uni_graduate": true,
    "uni_code": "",
    "has_disability": true,
    "type_disability": null,
    "other_disability": "",
    "license_number": "",
    "entrant": true,
    "admission_date": "2025-06-11",
    "orcid_code": "",
    "document_path": ""
  }


  Postulante
  {
    "id": 1,
    "person_full_name": "Jose Diaz Torres",
    "admission_program": 4,
    "admission_process": "3",
    "admission_process_name": "proceso prueb",
    "modality_id": 5,
    "modality_display": "Prueba Modalidad 3",
    "status": 1,
    "status_display": "Incomplete",
    "postgrade_name": "Programa 1",
    "status_qualification_display": "Pending"
  }
  */

  return (
    <Box spaceY='5'>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Breadcrumb.Root size='lg'>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link as={RouterLink} to='/admissions/applicants'>
								Postulantes
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
            <Breadcrumb.Item>
							<Breadcrumb.Link as={RouterLink} to={`/admissions/applicants/programs/${programId}`}>
								{ isApplicantLoading ? 'Cargando...' : dataApplicant?.postgrade_name }
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.CurrentLink>{dataApplicant?.person_full_name}</Breadcrumb.CurrentLink>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'md',
						md: 'xl',
					}}
					color={'uni.secondary'}
				>
					<Text color='gray.500'>{ isApplicantLoading ? 'Cargando...' : dataApplicant?.person_full_name}</Text>
				</Heading>
			</Stack>
      
       { isApplicantLoading && <Spinner /> }
          { (
            <>
            { !isApplicantLoading && !isApplicantDetailsLoading && dataApplicant && dataApplicantDetails ? (
                <Box maxW="900px" mx="auto">
                  {/* Estado y Programa */}
                  <Flex
                    bg="gray.50"
                    borderRadius="md"
                    px={6}
                    py={8}
                    mb={6}
                    align="center"
                    justify="space-between"
                    wrap="wrap"
                  >
                    <Flex align="center" gap={2}>
                      <Text fontWeight="semibold">Estado:</Text>
                      <Badge 
                        bg={statusEnumSelected?.bg}
                        color={statusEnumSelected?.color}
                        variant="solid"
                        fontSize="0.9em"
                      >
                        {statusEnumSelected?.label}
                      </Badge>
                    </Flex>
                    <Text>
                      <Text as="span" fontWeight="semibold">Programa académico:</Text> { dataApplicant?.postgrade_name }
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="semibold">Modalidad:</Text> {dataApplicant?.modality_display}
                    </Text>
                  </Flex>
                  <Box bg="gray.50" borderRadius="md" p={6} mb={6}>
                    <Text fontWeight="bold" color="red.600" mb={4}>
                      Datos del postulante:
                    </Text>
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                      <Box>
                        <Text>Fecha de Nacimiento: {dataApplicantDetails.birth_date}</Text>
                        <Text>País de Nacimiento: {dataApplicantDetails.nationality}</Text>
                        <Text>Nacionalidad: {dataApplicantDetails.nationality}</Text>
                        <Text>Celular: {dataApplicantDetails.phone}</Text>
                        <Text>Correo: {dataApplicantDetails.user?.username}</Text>
                      </Box>
                      <Box>
                        <Text><b>Documento de identidad:</b> {dataApplicantDetails.document_number}</Text>
                        <Text><b>Dirección:</b> {dataApplicantDetails.address}</Text>
                        <Text><b>Departamento:</b> {dataApplicantDetails.department || 'No hay'}</Text>
                        <Text><b>Provincia:</b> {dataApplicantDetails.province || 'No hay'}</Text>
                        <Text><b>Distrito:</b> {dataApplicantDetails.district}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>
              ) : (
                <Heading size='sm' color='gray.500'>
                  Postulante no encontrado
                </Heading>
              )}
            </>
          )}
		</Box>
  )
}