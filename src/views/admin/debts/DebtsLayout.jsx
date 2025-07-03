import { useColorMode } from '@/components/ui';
import { useProvideAuth } from '@/hooks/auth';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Flex,
} from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router';

export const DebtsLayout = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  const { getProfile } = useProvideAuth();
  const profile = getProfile();

  const hasPermission = (permission) => {
    if (!permission) return true;
    const roles = profile?.roles || [];
    const permissions = roles.flatMap((r) => r.permissions || []);
    return permissions.some((p) => p.guard_name === permission);
  };

  const activeBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.200';

  const settingsItems = [
    {
      href: '/debts/payment-requests',
      label: 'Solicitudes de Pago',
      permission: 'dashboard.debt.view',
    },
    {
      href: '/debts/payment-orders',
      label: 'Ordenes de Pago',
      permission: 'dashboard.debt.view',
    }
  ];

  return (
    <Box>
      <Grid
        templateColumns={{
          base: '1fr',
          md: '200px 1fr',
        }}
        templateRows={{
          base: 'auto',
          md: '1fr',
        }}
        h={{ base: 'auto', md: 'calc(100vh - 64px)' }}
      >
        <GridItem
          bg={{ base: 'white', _dark: 'uni.gray.500' }}
          py='6'
          px={{ base: '2', md: '5' }}
          overflowY='auto'
          boxShadow='md'
          css={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Stack spaceY={5}>
            <Heading
              display={{ base: 'none', md: 'block' }}
              size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg' }}
            >
              Cobranzas
            </Heading>

            <Stack direction={{ base: 'row', md: 'column' }} gap='1'>
              {settingsItems
                .filter((item) => hasPermission(item.permission))
                .map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={index} to={item.href} cursor='pointer'>
                      <Flex
                        h={{ base: 'auto', md: '40px' }}
                        align='center'
                        px='2'
                        fontWeight='medium'
                        borderRadius='10px'
                        bg={isActive ? activeBg : 'transparent'}
                        color={isActive ? 'uni.secondary' : 'inherit'}
                        _hover={{
                          bg:
                            colorMode === 'dark' ? 'uni.gray.400' : 'gray.300',
                        }}
                      >
                        <Text
                          lineHeight='1.1'
                          fontSize={{
                            base: '10px',
                            xs: 'xs',
                            sm: 'sm',
                          }}
                        >
                          {item.label}
                        </Text>
                      </Flex>
                    </Link>
                  );
                })}
            </Stack>
          </Stack>
        </GridItem>

        <GridItem p={{ base: '3', md: '6' }} overflowY='auto'>
          <Outlet />
        </GridItem>
      </Grid>
    </Box>
  );
};
