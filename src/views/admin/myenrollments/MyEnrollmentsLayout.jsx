import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Link, Outlet, useLocation } from 'react-router';
import { FiCalendar, FiBookOpen, FiCheckSquare, FiClipboard } from 'react-icons/fi';
import { ApplicantHasDebts } from '@/components/control';

const menuItems = [
{
  href: '/myschedule',
  label: 'Mi horario',
  icon: FiCalendar,
  permission: null,
},
{
  href: '/myevaluations',
  label: 'Mis evaluaciones',
  icon: FiClipboard,
  permission: null,
},
{
  href: '/mycourses',
  label: 'Mis cursos',
  icon: FiBookOpen,
  permission: null,
},
{
  href: '/myassistance',
  label: 'Mi asistencias',
  icon: FiCheckSquare,
  permission: null,
},
];

export const MyEnrollmentsLayout = () => {
const { colorMode } = useColorMode();
const location = useLocation();
const { data: profile } = useReadUserLogged();

const hasPermission = (permission) => {
  if (!permission) return true;
  const roles = profile?.roles || [];
  const permissions = roles.flatMap((r) => r.permissions || []);
  return permissions.some((p) => p.guard_name === permission);
};

const activeBg = colorMode === 'dark' ? 'uni.gray.400' : 'gray.200';

/*
  const {
    data: dataEnrollment,
    isLoading: isLoadingEnrollment,
    isError: isErrorEnrollment,
  } = useReadMyEnrollment();

  Se espera
    {
      "id": 1,
      "student": 1,
      "student_full_name": "Victor Valdivia Zeta",
      "enrollment_period_program": 1,
      "program_period": "2025-1",
      "program_uuid": "uuid-1234-5678-9012", <- Agregar el campo program_uuid
      "payment_verified": true,
      "is_first_enrollment": true,
      "status": 1,
      "status_display": "Pago pendiente",
      "verified_at": "2025-07-17T16:04:20.478000-05:00"
    }

  const {
    data: dataHasDebts,
    isLoading: isLoadingDebts,
    isError: isErrorDebts,
  } = useReadDebtStatus(
    { program_uuid: dataEnrollment?.program_uuid },
    { enabled: !!dataHasEnrollment }
  );

  se espera:
    {
      has_debt: boolean
    }

*/
const has_debt = false; // Placeholder, replace with actual data fetching logic

return (
  
  <Box>
    {has_debt ? <ApplicantHasDebts /> : (
			<Grid
				templateColumns={{ base: '1fr', md: '240px 1fr' }}
				templateRows={{ base: 'auto', md: '1fr' }}
				h={{ base: 'auto', md: 'calc(100vh - 64px)' }}
			>
				<GridItem
					bg={{ base: 'white', _dark: 'uni.gray.500' }}
					py='6'
					px={{ base: 2, md: 4 }}
					overflowY='auto'
					boxShadow='md'
					borderRightWidth='1px'
				>
          <Stack gap={6}>
            <Heading
              display={{ base: 'none', md: 'block' }}
              size={{ base: 'sm', md: 'md' }}
              px='2'
            >
              Mis Matrículas
            </Heading>
            <Stack gap={2}>
              {menuItems
                .filter((item) => hasPermission(item.permission))
                .map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={index} to={item.href}>
                      <Flex
                        align='center'
                        gap={3}
                        px={3}
                        py={2}
                        borderRadius='md'
                        bg={isActive ? activeBg : 'transparent'}
                        color={isActive ? 'uni.secondary' : 'inherit'}
                        _hover={{
                          bg:
                            colorMode === 'dark' ? 'uni.gray.400' : 'gray.300',
                        }}
                        transition='background 0.2s'
                      >
                        <Icon as={item.icon} boxSize={4} />
                        <Text fontSize='sm' fontWeight='medium'>
                          {item.label}
                        </Text>
                      </Flex>
                    </Link>
                  );
                })}
            </Stack>
          </Stack>
        </GridItem>

        <GridItem
          p={{ base: 3, md: 6 }}
          overflowY='auto'
          bg={{ base: 'gray.50', _dark: 'uni.gray.600' }}
        >
          <Outlet />
        </GridItem>
      </Grid>
    )}
  </Box>
);
};