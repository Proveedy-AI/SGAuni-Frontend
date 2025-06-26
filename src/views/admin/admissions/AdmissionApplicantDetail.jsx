import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GenerateApplicantDataPdfModal } from '@/components/forms/admissions';
import { PaymentOrdersByApplicationTable } from '@/components/tables/payment_orders';
import ApplicantSkeleton from '@/components/ui/ApplicantSkeleton';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';
import {
	Badge,
	Box,
	Flex,
	Grid,
	Heading,
	HStack,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router';

export const AdmissionApplicantDetail = () => {
	const { programId, id } = useParams();
	const decodedProgrma = decodeURIComponent(programId);
	const encodeProgram = encodeURIComponent(decodedProgrma);
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataApplicant, isLoading: isApplicantLoading } =
		useReadAdmissionApplicantById(decrypted);

	const statusEnum = [
		{ id: 1, label: 'En Revisión', bg: '#FDD9C6', color: '#F86A1E' },
		{ id: 2, label: 'Aprobado', bg: 'green', color: 'white' },
		{ id: 3, label: 'Rechazado', bg: 'red', color: 'white' },
	];

	const statusEnumSelected = statusEnum.find(
		(item) => item.id === dataApplicant?.status
	);

	return (
		<Box spaceY='5'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Postulantes', to: '/admissions/applicants' },
					{
						label: isApplicantLoading
							? 'Cargando...'
							: dataApplicant?.postgrade_name,
						to: `/admissions/applicants/programs/${encodeProgram}`,
					},
					{ label: dataApplicant?.person_full_name },
				]}
			/>

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
					<Text color='gray.500'>
						{isApplicantLoading
							? 'Cargando...'
							: dataApplicant?.person_full_name}
					</Text>
				</Heading>
			</Stack>

			{isApplicantLoading ? (
				<ApplicantSkeleton />
			) : dataApplicant ? (
				<Box mx='auto'>
					<Flex
						bg={{ base: 'white', _dark: 'its.gray.500' }}
						borderRadius='10px'
						overflow='hidden'
						boxShadow='md'
						mb={6}
						px={6}
						py={8}
						align='center'
						justify='space-between'
						wrap='wrap'
					>
						<HStack spacing={2} align='flex-end'>
							<Text as='span' fontWeight='semibold'>
								Estado:
							</Text>
							<Badge
								bg={statusEnumSelected?.bg}
								color={statusEnumSelected?.color}
								variant='solid'
								fontSize='0.9em'
							>
								{statusEnumSelected?.label}
							</Badge>
						</HStack>

						<HStack spacing={2} align='flex-end'>
							<Text as='span' fontWeight='semibold'>
								Programa académico:
							</Text>
							<Text
								borderBottom='1px solid'
								pb='1px'
								minW={{ base: 'auto', lg: '350px' }}
								borderColor='gray.300'
							>
								{dataApplicant?.postgrade_name}
							</Text>
						</HStack>
						<HStack spacing={2} align='flex-end'>
							<Text as='span' fontWeight='semibold'>
								Modalidad:
							</Text>
							<Text
								borderBottom='1px solid'
								pb='1px'
								minW={{ base: 'auto', lg: '200px' }}
								borderColor='gray.300'
							>
								{dataApplicant?.modality_display || '—'}
							</Text>
						</HStack>
					</Flex>
					<Box
						bg={{ base: 'white', _dark: 'its.gray.500' }}
						borderRadius='10px'
						overflow='hidden'
						boxShadow='md'
						p={6}
						mb={6}
					>
						<Flex justify='space-between' align='center' mb={4}>
              <Text fontWeight='bold' color='red.600' mb={4}>
                Datos del postulante:
              </Text>
              <GenerateApplicantDataPdfModal applicationPersonalData={dataApplicant} />
            </Flex>
						<SimpleGrid columns={[1, 2]} spacingY={2} columnGap={6}>
							<Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
								{[
									{
										label: 'Fecha de Nacimiento',
										value: dataApplicant?.person_details?.birth_date || '—',
									},
									{
										label: 'País de Nacimiento',
										value: dataApplicant?.person_details?.country_name || '—',
									},
									{
										label: 'Nacionalidad',
										value:
											dataApplicant?.person_details?.nationality_name || '—',
									},
									{
										label: 'Celular',
										value: dataApplicant?.person_details?.phone || '—',
									},
									{
										label: 'Correo',
										value: dataApplicant?.person_details?.email || '—',
									},
								].map(({ label, value }, index) => (
									<React.Fragment key={index}>
										<Text fontWeight='semibold'>{label}:</Text>
										<Text
											borderBottom='1px solid'
											pb='1px'
											maxW='full'
											borderColor='gray.300'
										>
											{value}
										</Text>
									</React.Fragment>
								))}
							</Grid>

							<Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
								{[
									{
										label: 'Documento de identidad',
										value:
											dataApplicant?.person_details?.document_number || '—',
									},
									{
										label: 'Dirección',
										value: dataApplicant?.person_details?.address || '—',
									},
									{
										label: 'Departamento',
										value:
											dataApplicant?.person_details?.department_name || '—',
									},
									{
										label: 'Provincia',
										value: dataApplicant?.person_details?.province_name || '—',
									},
									{
										label: 'Distrito',
										value: dataApplicant?.person_details?.district_name || '—',
									},
								].map(({ label, value }, index) => (
									<React.Fragment key={index}>
										<Text fontWeight='semibold'>{label}:</Text>
										<Text
											borderBottom='1px solid'
											pb='1px'
											maxW='full'
											borderColor='gray.300'
										>
											{value}
										</Text>
									</React.Fragment>
								))}
							</Grid>
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
						<Text fontWeight='bold' color='red.600' mb={4}>
							Trámites:
						</Text>
						<PaymentOrdersByApplicationTable
							data={dataApplicant?.payment_orders}
						/>
					</Box>
				</Box>
			) : (
				<Heading size='sm' color='gray.500'>
					Postulante no encontrado
				</Heading>
			)}
		</Box>
	);
};
