import { InputGroup } from '@/components/ui';
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
import { Link as RouterLink } from 'react-router';
import { AdmissionEvaluatorsByProgramTable } from './AdmissionEvaluatorsByProgramTable';

export const AdmissionEvaluatorsByProgram = () => {
    const [searchValue, setSearchValue] = useState('');

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
                                {/* {dataProgram?.evaluator_display} */}
                            </Breadcrumb.CurrentLink>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
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

            <AdmissionEvaluatorsByProgramTable />
        </Box>
    )
}
