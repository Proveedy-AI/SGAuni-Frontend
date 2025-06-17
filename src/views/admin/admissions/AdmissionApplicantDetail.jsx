import { useReadPersonById } from "@/hooks";
import { useReadAdmissionApplicantById } from "@/hooks/admissions_applicants/useReadAdmissionApplicantById";
import { Badge, Box, Breadcrumb, Flex, Heading, SimpleGrid, Spinner, Stack, Table, Text } from "@chakra-ui/react";
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
                    bg={{ base: 'white', _dark: 'its.gray.500' }}
                    borderRadius='10px'
                    overflow='hidden'
                    boxShadow='md'
                    mb={6}
                    px={6}
                    py={8}
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
                  <Box 
                    bg={{ base: 'white', _dark: 'its.gray.500' }}
                    borderRadius='10px'
                    overflow='hidden'
                    boxShadow='md'
                    p={6}
                    mb={6}
                  >
                    <Text fontWeight="bold" color="red.600" mb={4}>
                      Datos del postulante:
                    </Text>
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                      <Box>
                        <Text><b>Fecha de Nacimiento:</b> {dataApplicantDetails.birth_date}</Text>
                        <Text><b>País de Nacimiento:</b> {dataApplicantDetails.nationality}</Text>
                        <Text><b>Nacionalidad:</b> {dataApplicantDetails.nationality}</Text>
                        <Text><b>Celular:</b> {dataApplicantDetails.phone}</Text>
                        <Text><b>Correo:</b> {dataApplicantDetails.user?.username}</Text>
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
                  <Box 
                    bg={{ base: 'white', _dark: 'its.gray.500' }}
                    borderRadius='10px'
                    overflow='hidden'
                    boxShadow='md'
                    p={6}
                    mb={6}
                  >
                    <Text fontWeight="bold" color="red.600" mb={4}>
                      Trámites:
                    </Text>
                    <Box
                      bg={{ base: 'white', _dark: 'its.gray.500' }}
                      p='3'
                      borderRadius='10px'
                      overflow='hidden'
                      boxShadow='md'
                    >
                      <Table.Root size='sm' w='full'>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>N°</Table.ColumnHeader>
                            <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                            <Table.ColumnHeader>Nombres del trámite</Table.ColumnHeader>
                            <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          
                        </Table.Body>
                      </Table.Root>
                    </Box>
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