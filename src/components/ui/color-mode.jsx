'use client';

import { Box, ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';

import * as React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { Switch } from './switch';

export function ColorModeProvider(props) {
	return (
		<ThemeProvider attribute='class' disableTransitionOnChange {...props} />
	);
}

export function useColorMode() {
	const { resolvedTheme, setTheme } = useTheme();
	const toggleColorMode = () => {
		setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	};
	return {
		colorMode: resolvedTheme,
		setColorMode: setTheme,
		toggleColorMode,
	};
}

export function useColorModeValue(light, dark) {
	const { colorMode } = useColorMode();
	return colorMode === 'light' ? light : dark;
}

export const useContrastingColor = () => {
	const getContrastingColor = (hexColor) => {
		const r = parseInt(hexColor.substr(1, 2), 16);
		const g = parseInt(hexColor.substr(3, 2), 16);
		const b = parseInt(hexColor.substr(5, 2), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? 'black' : 'white';
	};

	return {
		contrast: getContrastingColor,
	};
};

export const useRgbToHex = () => {
	const rgbToHex = React.useCallback((color) => {
		if (
			!color ||
			color.red === undefined ||
			color.green === undefined ||
			color.blue === undefined
		) {
			console.error(
				'El color no tiene propiedades red, green, blue correctamente definidas',
				color
			);
			return '#000000';
		}

		const r = color.red.toString(16).padStart(2, '0');
		const g = color.green.toString(16).padStart(2, '0');
		const b = color.blue.toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}, []);

	return { rgbToHex };
};

export const useRgbaToHex = () => {
	const rgbaToHex = React.useCallback((input) => {
		let color;

		if (typeof input === 'string') {
			const match = input.match(
				/^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)$/
			);
			if (!match) {
				console.error('Formato RGBA inválido:', input);
				return '#000000';
			}
			const [_, r, g, b, a] = match;
			color = {
				red: parseInt(r, 10),
				green: parseInt(g, 10),
				blue: parseInt(b, 10),
				alpha: Math.round(parseFloat(a) * 255),
			};
		} else {
			color = input;
		}

		if (
			!color ||
			color.red === undefined ||
			color.green === undefined ||
			color.blue === undefined ||
			color.alpha === undefined
		) {
			console.error(
				'El color no tiene propiedades red, green, blue, alpha correctamente definidas',
				color
			);
			return '#000000';
		}

		const r = color.red.toString(16).padStart(2, '0');
		const g = color.green.toString(16).padStart(2, '0');
		const b = color.blue.toString(16).padStart(2, '0');
		// const a = color.alpha.toString(16).padStart(2, '0');
		// return `#${r}${g}${b}${a}`;
		return `#${r}${g}${b}`;
	}, []);

	return { rgbaToHex };
};

export function ColorModeIcon() {
	const { colorMode } = useColorMode();
	return colorMode === 'light' ? <LuSun /> : <LuMoon />;
}

export const ColorModeButton = React.forwardRef(
	function ColorModeButton(props, ref) {
		const { toggleColorMode } = useColorMode();
		return (
			<ClientOnly fallback={<Skeleton boxSize='8' />}>
				<IconButton
					onClick={toggleColorMode}
					variant='ghost'
					aria-label='Toggle color mode'
					size='sm'
					ref={ref}
					{...props}
					css={{
						_icon: {
							width: '5',
							height: '5',
						},
					}}
				>
					<ColorModeIcon />
				</IconButton>
			</ClientOnly>
		);
	}
);

export const ColorModeToggle = React.forwardRef(
	function ColorModeToggle(props, ref) {
		const { colorMode, toggleColorMode } = useColorMode();
		return (
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				ref={ref}
				{...props}
			>
				<Box as='label' display='flex' alignItems='center' cursor='pointer'>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						border='1px solid'
						borderColor={{
							base: 'its.gray.100',
							_dark: 'its.gray.300',
						}}
						bg={{ base: 'white', _dark: 'its.gray.500' }}
						borderRadius='full'
						w='14'
						h='7'
						position='relative'
						overflow='hidden'
					>
						<Box
							as='span'
							display='flex'
							alignItems='center'
							justifyContent='center'
							w='50%'
							h='full'
							position='absolute'
							left='0'
							fontSize='sm'
							bg={colorMode === 'light' ? 'its.gray.100' : ''}
							color={{ base: 'white', _dark: 'its.gray.100' }}
							transition='all 0.3s ease-in-out'
						>
							<LuSun />
						</Box>

						<Box
							as='span'
							display='flex'
							alignItems='center'
							justifyContent='center'
							w='50%'
							h='full'
							position='absolute'
							right='0'
							fontSize='sm'
							bg={colorMode === 'dark' ? 'its.gray.300' : ''}
							color={{ base: 'its.gray.100', _dark: 'white' }}
							transition='all 0.3s ease-in-out'
						>
							<LuMoon />
						</Box>

						<Switch
							id='color-mode-toggle'
							checked={colorMode === 'dark'}
							onChange={toggleColorMode}
							size='lg'
							colorScheme='yellow'
							opacity='0'
							position='absolute'
							inset='0'
							cursor='pointer'
						/>
					</Box>
				</Box>
			</Box>
		);
	}
);
