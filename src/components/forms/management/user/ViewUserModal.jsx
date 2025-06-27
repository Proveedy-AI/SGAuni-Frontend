import { Field, Modal, Tooltip } from '@/components/ui';
import { useReadUserById } from '@/hooks/users/useReadUserById';
import {
	Badge,
	Box,
	IconButton,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEye } from 'react-icons/fi';

export const ViewUserModal = ({ selectedUser }) => {
	const [open, setOpen] = useState(false);
	const { data: dataUser, refetch: fetchUser } = useReadUserById({
		id: selectedUser?.id,
		enabled: open,
	});

	return (
		<Modal
			title='Detalle de Usuario'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Mas información'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='blue'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			size='2xl'
		>
			<Stack css={{ '--field-label-width': '140px' }} fontSize={'md'}>
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field color={'uni.secondary'} label='Nombre completo:'>
						<Text color={'black'} fontWeight='medium'>
							{dataUser?.full_name ||
								`${dataUser?.first_name || ''} ${dataUser?.last_name || ''}`}
						</Text>
					</Field>

					<Field color={'uni.secondary'} label='Usuario:'>
						<Text color='black' fontWeight='medium'>
							{dataUser?.user?.username}
						</Text>
					</Field>

					<Field color={'uni.secondary'} label='Correo Institucional:'>
						<Text
							color={dataUser?.uni_email ? 'black' : 'gray.500'}
							fontWeight='medium'
						>
							{dataUser?.uni_email || 'Sin datos'}
						</Text>
					</Field>
					<Field color={'uni.secondary'} label='Número de documento:'>
						<Text
							color={dataUser?.num_doc ? 'black' : 'gray.500'}
							fontWeight='medium'
						>
							{dataUser?.num_doc}
						</Text>
					</Field>
					<Field color={'uni.secondary'} label='Categoría:'>
						<Text
							color={dataUser?.category ? 'black' : 'gray.500'}
							fontWeight='medium'
						>
							{dataUser?.category}
						</Text>
					</Field>
					<Field color='uni.secondary' label='Teléfono:'>
						<Text
							color={dataUser?.phone ? 'black' : 'gray.500'}
							fontWeight='medium'
						>
							{dataUser?.phone || 'Sin datos'}
						</Text>
					</Field>
					<Field color='uni.secondary' label='Curriculum:'>
						{dataUser?.path_cv ? (
							<Badge
								as='a'
								href={dataUser.path_cv}
								target='_blank'
								rel='noopener noreferrer'
								colorPalette='green'
								variant='solid'
								px={3}
								py={1}
								borderRadius='md'
								cursor='pointer'
								_hover={{ textDecoration: 'underline', bg: 'uni.secondary' }}
							>
								Ver archivo
							</Badge>
						) : (
							<Text color='gray.500' fontWeight='medium'>
								Sin datos
							</Text>
						)}
					</Field>
					<Field color='uni.secondary' label='Título o grado:'>
						{dataUser?.path_grade ? (
							<Badge
								as='a'
								href={dataUser.path_grade}
								target='_blank'
								rel='noopener noreferrer'
								colorPalette='blue'
								variant='solid'
								px={3}
								py={1}
								borderRadius='md'
								cursor='pointer'
								_hover={{ textDecoration: 'underline', bg: 'uni.secondary' }}
							>
								Ver archivo
							</Badge>
						) : (
							<Text color='gray.500' fontWeight='medium'>
								Sin datos
							</Text>
						)}
					</Field>
				</SimpleGrid>
			</Stack>
		</Modal>
	);
};

ViewUserModal.propTypes = {
	selectedUser: PropTypes.object,
};
