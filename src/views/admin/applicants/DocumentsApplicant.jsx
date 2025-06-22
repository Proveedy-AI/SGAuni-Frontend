import {
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import React from 'react';
import { RequiredDocumentsSections } from '@/data';
import { Tooltip } from '@/components/ui';
import { FiHelpCircle } from 'react-icons/fi';

export const DocumentsApplicant = () => {
	const { data: dataUser } = useReadUserLogged();
	const item = EncryptedStorage.load('selectedApplicant');

	const documentRulesMap = item?.rules?.reduce((acc, rule) => {
		acc[rule.id] = rule;
		return acc;
	}, {});

	const documentStatus = {
		1: 'Subido',
		dni: 'Pendiente',
		voucher: 'Aprobado',
		bachelor_degree: '—',
		// etc.
	};

	const shouldShowDocument = (doc) => {
		if (doc.key) {
			const rule = documentRulesMap?.[doc.key];
			return rule?.is_visible ?? false;
		}
		return true;
	};

	const renderDocumentList = (section) =>
		section.filter(shouldShowDocument).map(({ key, label, tooltip }) => {
			const rule = key ? documentRulesMap?.[key] : null;
			const value = documentStatus[key] || '—';
			const isRequired = rule?.is_required ?? false;

			return (
				<React.Fragment key={`${key || 'no-key'}-${label}`}>
					<Text fontWeight='medium'>
						{label}{' '}
						{tooltip && (
							<Tooltip
								content={tooltip}
								positioning={{ placement: 'top-center' }}
								showArrow
								openDelay={0}
							>
								<span>
									<FiHelpCircle
										style={{
											display: 'inline',
											verticalAlign: 'middle',
											cursor: 'pointer',
										}}
									/>
								</span>
							</Tooltip>
						)}
						{isRequired && (
							<Text as='span' color='red.500'>
								{' '}
								*
							</Text>
						)}
					</Text>
					<Text fontWeight='semibold'>{value}</Text>
				</React.Fragment>
			);
		});

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
			mb={10}
			mt={1}
		>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'center', sm: 'center' }}
				justify='space-between'
				mb={5}
			>
				<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }} color='gray.500'>
					Subir documentos requeridos
				</Heading>
			</Stack>
			<Stack p={10} spacing={4} css={{ '--field-label-width': '150px' }}>
				<SimpleGrid columns={[1, 2]} spacingY={2} columnGap={6}>
					<Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
						{renderDocumentList(RequiredDocumentsSections.leftColumn)}
					</Grid>
					<Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
						{renderDocumentList(RequiredDocumentsSections.rightColumn)}
					</Grid>
				</SimpleGrid>
			</Stack>
			<Flex justify='flex-end' mt={6}>
				<Button bg='uni.secondary' onClick={() => {}}>
					Guardar cambios
				</Button>
			</Flex>
		</Box>
	);
};
