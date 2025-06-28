import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { AdmissionEvaluatorsByProgramTable } from '@/components/tables/admissions';
import { InputGroup } from '@/components/ui';
import { useReadAdmissionApplicantEvaluation } from '@/hooks/admissions_applicants';
import { useReadAdmissionProgramsById } from '@/hooks/admissions_programs';
import {
    Box,
    Breadcrumb,
    Heading,
    Input,
    Span,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { LiaSlashSolid } from 'react-icons/lia';
import { useLocation, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const AdmissionEvaluatorsByProgram = () => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuidParam = searchParams.get('uuid');
    const decoded = decodeURIComponent(id);
    const decrypted = Encryptor.decrypt(decoded);

    const { data: dataProgram, loading: isProgramLoading } = useReadAdmissionProgramsById(decrypted);
    const { data: dataApplicantEvaluation, refetch: fetchApplicantEvaluators, isLoading } = useReadAdmissionApplicantEvaluation(uuidParam);

    const [searchValue, setSearchValue] = useState('');

    const filteredApplicants = dataApplicantEvaluation?.filter((item) =>
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
                            <Breadcrumb.Link as={RouterLink} to='/admissions/evaluators'>
                                Mis Asignaciones
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
                    size={{
                        xs: 'xs',
                        sm: 'md',
                        md: 'xl',
                    }}
                    color={'uni.secondary'}
                >
                    <Text>{dataProgram?.program_name}</Text>
                    <Span fontSize='md' color='gray.500'>
                        {isProgramLoading ? 'Cargando...' : dataProgram?.admission_process_name}
                    </Span>
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

            <AdmissionEvaluatorsByProgramTable
                isLoading={isLoading}
                data={filteredApplicants}
                fetchData={fetchApplicantEvaluators}
            />
        </Box>
    );
};
