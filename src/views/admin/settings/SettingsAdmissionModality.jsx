import { AddModalityForm } from '@/components/forms/management/admission';
import { AddModalityRuleForm } from '@/components/forms/management/modalitiesRules';
import { AdmissionModalitiesTable, ModalityRulesTable } from '@/components/tables';
import { InputGroup } from '@/components/ui';
import { useReadModalities, useReadModalityRules } from '@/hooks';
import { Box, Heading, Spinner, Stack, Tabs, HStack, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SettingsAdmissionModality = () => {
  const [tab, setTab] = useState(1);

  const [searchModalityValue, setSearchModalityValue] = useState('');
  const [searchModalityRulesValue, setSearchModalityRulesValue] = useState('');

	const { data: dataModalities, refetch: fetchModalities, isLoading } = useReadModalities();
  const { data: dataModalityRules, refetch: fetchModalityRules } = useReadModalityRules();

  const filteredModality = dataModalities?.results?.filter((item) => 
    item?.name?.toLowerCase().includes(searchModalityValue.toLowerCase())
  )

  const filteredModalityRules = dataModalityRules?.results?.filter((item) =>
     item?.field_name?.toLowerCase().includes(searchModalityRulesValue.toLowerCase())
  )

  return (
    <Box SpaceY='5'>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justifyContent='space-between'
      >
        <Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>Modalidades de Admisión</Heading>

        {tab === 1 && <AddModalityForm fetchData={fetchModalities} />}
        {tab === 2 && <AddModalityRuleForm fetchData={fetchModalityRules} />}
      </Stack>
      {isLoading && <Spinner mt={4} />}
      {!isLoading && (
        <Tabs.Root
          value={tab}
          onValueChange={(e) => setTab(e.value)}
          size={{ base: 'sm', md: 'md' }}
        >
          <>
            <Box
              overflowX='auto'
              whiteSpace='nowrap'
              css={{
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  background: '#A0AEC0', // Color del thumb
                  borderRadius: '4px',
                },
              }}
            >
              <Tabs.List minW='max-content' colorPalette='cyan'>
                <Tabs.Trigger
                  value={1}
                  color={tab === 1 ? 'uni.secondary' : ''}
                >
                  Modalidades
                </Tabs.Trigger>

                <Tabs.Trigger
                  value={2}
                  color={tab === 2 ? 'uni.secondary' : ''}
                >
                  Reglas de Modalidades
                </Tabs.Trigger>
              </Tabs.List>
            </Box>
          </>
          <Tabs.Content value={1}>
            <Stack>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'start', sm: 'center' }}
                justify='space-between'
              >
                <Heading size='md'>Gestión de Modalidades</Heading>

                <HStack>
                  <InputGroup flex='1' startElement={<FiSearch />}>
                    <Input
                      ml='1'
                      size='sm'
                      placeholder='Buscar por nombre'
                      value={searchModalityValue}
                      onChange={(e) => setSearchModalityValue(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
              </Stack>

              <AdmissionModalitiesTable 
                data={filteredModality}
                fetchData={fetchModalities}
                modalityRules={filteredModalityRules}
              />
            </Stack>
          </Tabs.Content>
          <Tabs.Content value={2}>
            <Stack>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'start', sm: 'center' }}
                justify='space-between'
              >
                <Heading size='md'>Gestión de Reglas de Modalidades</Heading>

                <HStack>
                  <InputGroup flex='1' startElement={<FiSearch />}>
                    <Input
                      ml='1'
                      size='sm'
                      placeholder='Buscar por nombre'
                      value={searchModalityRulesValue}
                      onChange={(e) => setSearchModalityRulesValue(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
              </Stack>

              <ModalityRulesTable data={filteredModalityRules} fetchData={fetchModalityRules} />
            </Stack>
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Box>
  )

};
