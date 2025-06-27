import { AdmissionEvaluatorsTable } from '@/components/tables/admissions';
import { useReadProgramsForEvaluator } from '@/hooks/admissions_evaluators';
import { useProvideAuth } from '@/hooks/auth';
import { Box, Heading, Input, InputGroup, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const AdmissionEvaluators = () => {
    const { 
        data: dataProgramsForEvaluator,
        refetch: fetchProgramsForEvaluator,
        isLoading,
    } = useReadProgramsForEvaluator();
    const { getProfile } = useProvideAuth();
    const profile = getProfile();
    const roles = profile?.roles || [];
    const permissions = roles
        .flatMap((r) => r.permissions || [])
        .map((p) => p.guard_name);

    const [searchValue, setSearchValue] = useState('');

    const filteredProgramsForEvaluator = Array.isArray(dataProgramsForEvaluator)
        ? dataProgramsForEvaluator.filter((item) => {
            return item.admission_process_name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase());
            })
        : [];

    return (
        <Box spaceY='5'>
            <Stack
                Stack
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'start', sm: 'center' }}
                justify='space-between'
            >
                <Heading
                    size={{
                        xs: 'xs',
                        sm: 'sm',
                        md: 'md',
                    }}
                >
                    Mis Asignaciones
                </Heading>
            </Stack>

            <Stack
                Stack
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'start', sm: 'center' }}
                justify='space-between'
            >
                <InputGroup flex='1' startElement={<FiSearch />}>
                    <Input
                        ml='1'
                        size='sm'
                        bg={'white'}
                        maxWidth={'550px'}
                        placeholder='Buscar por nombre del evaluador asignado ...'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </InputGroup>
            </Stack>

            <AdmissionEvaluatorsTable
                data={filteredProgramsForEvaluator}
                fetchData={fetchProgramsForEvaluator}
                permissions={permissions}
                isLoading={isLoading}
            />
        </Box>
    )
}
