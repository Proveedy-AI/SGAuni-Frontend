import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GeneratePdfApliccationsModal } from '@/components/forms/admissions';
import { AdmissionApplicantsByProgramTable } from '@/components/tables/admissions';
import { Button, InputGroup, MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui';
import { useReadAdmissionApplicants } from '@/hooks/admissions_applicants';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import { useProvideAuth } from '@/hooks/auth';
import {
	Box,
	Breadcrumb,
	Heading,
	HStack,
	Input,
	Span,
	Stack,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { LiaSlashSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const AdmissionApplicantsMenu = ({ data }) => {
  const [openGeneratePdfModal, setOpenGeneratePdfModal] = useState(false);
  
  return (
    <Box>
      <MenuRoot>
        <MenuTrigger>
          <Button 
            size="sm" 
            bg="white" 
            color="black" 
            border={'1px solid'}
            _hover={{ bg: 'gray.100' }}
          >
            Más Acciones
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setOpenGeneratePdfModal(true)}>Generar acta de notas</MenuItem>
        </MenuContent>
      </MenuRoot>

      <GeneratePdfApliccationsModal data={data} open={openGeneratePdfModal} setOpen={setOpenGeneratePdfModal} />
    </Box>
  )
}

AdmissionApplicantsMenu.propTypes = {
  data: PropTypes.object,
};

export const AdmissionApplicantsByProgram = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const { data: dataProgram, loading: isProgramLoading } =
		useReadAdmissionProgramsById(decrypted);
	const {
		data: dataAdmissionApplicants,
		refetch: fetchAdmissionApplicants,
		isLoading,
	} = useReadAdmissionApplicants();

	const filteredApplicantsByProgramId =
		dataAdmissionApplicants?.results?.filter(
			(item) => item.admission_program === Number(decrypted)
		);

	const [searchValue, setSearchValue] = useState('');

	const filteredApplicants = filteredApplicantsByProgramId?.filter((item) =>
		item.person_full_name.toLowerCase().includes(searchValue.toLowerCase())
	);

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
							<Breadcrumb.CurrentLink>
								{dataProgram?.program_name}
							</Breadcrumb.CurrentLink>
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
          w={'100%'}
					size={{
						xs: 'xs',
						sm: 'md',
						md: 'xl',
					}}
					color={'uni.secondary'}
				>
					 <HStack w={'100%'} justifyContent={'space-between'} alignItems='center'>
            <Box>
              <Text>{dataProgram?.program_name}</Text>
              <Span fontSize='md' color='gray.500'>
                {isProgramLoading
                  ? 'Cargando...'
                  : dataProgram?.admission_process_name}
              </Span>
            </Box>
            <AdmissionApplicantsMenu data={dataProgram} />
          </HStack>
				</Heading>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'center' }}
				justify='space-between'
			>
				<InputGroup flex='1' startElement={<FiSearch />}>
					<Input
						ml='1'
						size='sm'
						bg={'white'}
						maxWidth={'550px'}
						placeholder='Buscar por nombre del postulante ...'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</InputGroup>
			</Stack>

			<AdmissionApplicantsByProgramTable
				programId={decrypted}
				isLoading={isLoading}
				data={filteredApplicants}
				fetchData={fetchAdmissionApplicants}
				permissions={permissions}
			/>
		</Box>
	);
};
