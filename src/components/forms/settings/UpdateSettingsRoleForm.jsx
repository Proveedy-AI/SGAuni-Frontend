import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateRole } from '@/hooks/roles';

export const UpdateSettingsRoleForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data.name);

  const { mutateAsync: update, isPending: loading} = useUpdateRole();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
      id: data.id
		};

		try {
			await update(payload);
			toaster.create({
				title: 'Rol editado correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Modal
			title='Editar propiedades'
			placement='center'
			size='lg'
			trigger={
				<IconButton colorPalette='cyan' size='xs'>
					<FiEdit2 />
				</IconButton>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nombre del rol:'
				>
					<Input
						value={name}
						onChange={(event) => setName(event.target.value)}
						size='xs'
					/>
				</Field>
				{/* 
        <CheckboxGroup>
          <Text
            textStyle='sm'
            fontWeight='medium'>
            Funciones asignadas:
          </Text>
          <Flex
            gap='2'
            wrap='wrap'>
            {itemsFunctions.map((item) => (
              <CheckboxCard
                key={item.value}
                icon={
                  <Icon
                    fontSize='2xl'
                    mb='2'>
                    {item.icon}
                  </Icon>
                }
                label={<Text whiteSpace='nowrap'>{item.title}</Text>}
                defaultValue={item.value}
                checked={selectedFunctions.includes(item.value)}
                onChange={() => handleCheckboxChange(item.value)}
                variant='surface'
                colorPalette='cyan'
              />
            ))}
          </Flex>
        </CheckboxGroup>
         */}
			</Stack>
		</Modal>
	);
};

UpdateSettingsRoleForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};

/*
const itemsFunctions = [
  {
    value: 'general_dashboard',
    title: 'Panel (general)',
    icon: <HiShieldCheck />,
  },
  {
    value: 'advisor_dashboard',
    title: 'Panel (asesor)',
    icon: <HiShieldCheck />,
  },
  {
    value: 'dispatcher_dashboard',
    title: 'Panel (asignador)',
    icon: <HiShieldCheck />,
  },
  { value: 'marketing', title: 'Marketing', icon: <HiShieldCheck /> },
  { value: 'ventas', title: 'Ventas', icon: <HiShieldCheck /> },
  { value: 'productos', title: 'Productos', icon: <HiShieldCheck /> },
  { value: 'calendar', title: 'Calendario', icon: <HiShieldCheck /> },
  { value: 'reports', title: 'Reportes', icon: <HiShieldCheck /> },
  { value: 'users', title: 'Usuarios', icon: <HiShieldCheck /> },
  { value: 'inbox', title: 'Bandeja de entrada', icon: <HiShieldCheck /> },
  { value: 'integrations', title: 'Integraciones', icon: <HiShieldCheck /> },
  { value: 'settings', title: 'Configuración', icon: <HiShieldCheck /> },
];
*/
