import {
	Button,
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui';
import { Box, Heading, Icon, VStack } from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { useContrastingColor } from '@/components/ui';
import { HiPaperAirplane } from 'react-icons/hi2';
import { BsSendArrowUp } from 'react-icons/bs';

export const Modal = ({
	title,
	children,
	trigger,
	onSave,
	hiddenFooter,
	contentRef,
	loading,
	loadingText,
	cancelLabel,
	saveLabel,
	size,
	sizeH,
	disabledSave,
	...props
}) => {
	return (
		<DialogRoot {...props}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				ref={contentRef}
				w={size} // Ancho personalizado
				maxW={size}
				maxH={sizeH}
				overflow='hidden'
				pb='8px'
			>
				<DialogHeader>
					{title && <DialogTitle color='uni.secondary'>{title}</DialogTitle>}
				</DialogHeader>
				<DialogBody
					overflowY='auto'
					style={{
						scrollbarWidth: 'thin', // Soporte para Firefox
						scrollbarColor: '#B3B3B3 transparent',
					}}
				>
					{children}
				</DialogBody>
				{!hiddenFooter && (
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant='outline' colorPalette='red'>
								{cancelLabel ? cancelLabel : 'Cancelar'}
							</Button>
						</DialogActionTrigger>
						<Button
							onClick={onSave}
							bg='uni.secondary'
							color='white'
							loading={loading}
							loadingText={loadingText ? loadingText : 'Guardando...'}
							disabled={disabledSave ? disabledSave : false}
						>
							{saveLabel ? saveLabel : 'Guardar'}
						</Button>
					</DialogFooter>
				)}
				<DialogCloseTrigger bg='transparent' />
			</DialogContent>
		</DialogRoot>
	);
};

export const ModalSimple = ({
	title,
	children,
	trigger,
	onSave,
	hiddenFooter,
	contentRef,
	loading,
	size,
	sizeH,
	...props
}) => {
	return (
		<DialogRoot {...props}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				ref={contentRef}
				w={size} // Ancho personalizado
				maxW={size}
				maxH={sizeH}
				//overflow="hidden"
				pb='8px'
			>
				<DialogHeader>
					{title && <DialogTitle color='uni.secondary'>{title}</DialogTitle>}
				</DialogHeader>
				<DialogBody>{children}</DialogBody>
				{!hiddenFooter && (
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant='outline' colorPalette='red'>
								Cancelar
							</Button>
						</DialogActionTrigger>
						<Button
							onClick={onSave}
							bg='uni.secondary'
							color='white'
							loading={loading}
							loadingText='Guardando...'
						>
							Guardar
						</Button>
					</DialogFooter>
				)}
				<DialogCloseTrigger bg='transparent' />
			</DialogContent>
		</DialogRoot>
	);
};

export const ConfirmModal = ({
	children,
	trigger,
	onConfirm,
	contentRef,
	loading,
	loadingText,
	cancelLabel,
	confirmLabel,
	...props
}) => {
	return (
		<DialogRoot {...props}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				ref={contentRef}
			>
				<DialogBody pt='4'>
					<VStack>
						<Icon fontSize='5xl' color={{ base: 'red.500', _dark: 'red.600' }}>
							<FiAlertCircle />
						</Icon>
						{children}
					</VStack>
				</DialogBody>
				<DialogFooter justifyContent='space-evenly'>
					<DialogActionTrigger asChild>
						<Button variant='outline' colorPalette='red'>
							{cancelLabel ? cancelLabel : 'No, cancelar'}
						</Button>
					</DialogActionTrigger>
					<Button
						onClick={onConfirm}
						bg='uni.secondary'
						color='white'
						loading={loading}
						loadingText={loadingText ? loadingText : 'Eliminando...'}
					>
						{confirmLabel ? confirmLabel : 'Si, eliminar'}
					</Button>
				</DialogFooter>
				<DialogCloseTrigger bg='transparent' />
			</DialogContent>
		</DialogRoot>
	);
};

export const SendModal = ({
	children,
	trigger,
	onConfirm,
	contentRef,
	loading,
	loadingText,
	cancelLabel,
	confirmLabel,
	...props
}) => {
	return (
		<DialogRoot {...props}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				ref={contentRef}
			>
				<DialogBody pt='4'>
					<VStack>
						<Icon
							fontSize='5xl'
							color={{ base: 'green.500', _dark: 'red.600' }}
						>
							<BsSendArrowUp />
						</Icon>
						{children}
					</VStack>
				</DialogBody>
				<DialogFooter justifyContent='space-evenly'>
					<DialogActionTrigger asChild>
						<Button variant='outline' colorPalette='red'>
							{cancelLabel ? cancelLabel : 'No, cancelar'}
						</Button>
					</DialogActionTrigger>
					<Button
						onClick={onConfirm}
						bg='uni.secondary'
						color='white'
						loading={loading}
						loadingText={loadingText ? loadingText : 'Enviando...'}
					>
						{confirmLabel ? confirmLabel : 'Si, Enviar'}
					</Button>
				</DialogFooter>
				<DialogCloseTrigger bg='transparent' />
			</DialogContent>
		</DialogRoot>
	);
};

export const ControlledModal = ({
	title,
	children,
	onSave,
	hiddenFooter,
	contentRef,
	loading,
	size,
	sizeH,
	ribbon,
	...props
}) => {
	const { contrast } = useContrastingColor();

	return (
		<DialogRoot {...props}>
			<DialogTrigger asChild>
				<div></div>
			</DialogTrigger>
			<DialogContent
				zIndex={1000} // 🔥 Debe ser menor que CallToast
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				ref={contentRef}
				w={size} // Ancho personalizado
				maxW={size}
				h={sizeH}
				maxH={sizeH}
				// overflow='hidden'
				pb='8px'
			>
				<DialogHeader>
					{title && <DialogTitle color='uni.secondary'>{title}</DialogTitle>}
				</DialogHeader>
				{ribbon && (
					<Box
						position='absolute'
						top='11px'
						left='-35px'
						bg={ribbon.color}
						color={contrast(ribbon.color)}
						px={calculatePx(ribbon.name)}
						py='1'
						maxW='150px'
						textAlign='center'
						whiteSpace='nowrap'
						fontSize='xs'
						fontWeight='bold'
						zIndex={9999}
						transform='rotate(-45deg)'
						clipPath='polygon(0 100%, 100% 100%, 75% 0, 25% 0)'
						boxShadow='lg'
						pointerEvents='none'
					>
						{ribbon.name}
					</Box>
				)}
				<DialogBody
					overflowY='auto'
					style={{
						scrollbarWidth: 'thin', // Soporte para Firefox
						scrollbarColor: '#B3B3B3 transparent',
					}}
				>
					{children}
				</DialogBody>
				{!hiddenFooter && (
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant='outline' colorPalette='red'>
								Cancelar
							</Button>
						</DialogActionTrigger>
						<Button
							onClick={onSave}
							bg='uni.secondary'
							color='white'
							loading={loading}
							loadingText='Guardando...'
						>
							Guardar
						</Button>
					</DialogFooter>
				)}
				<DialogCloseTrigger bg='transparent' />
			</DialogContent>
		</DialogRoot>
	);
};

const calculatePx = (name) => {
	const len = name.length;
	const maxPx = 10;
	const minPx = 6;
	const maxLen = 11; // Longitud de "Seguimiento"

	// Si es corto, usar máximo padding
	if (len <= 5) return maxPx;
	// Si es largo, reducir progresivamente
	if (len >= maxLen) return minPx;

	// Interpolación lineal
	const px = maxPx - ((len - 6) * (maxPx - minPx)) / (maxLen - 6);
	return Math.round(px);
};
