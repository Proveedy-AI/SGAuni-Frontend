'use client';

import {
	Button,
	Pagination as ChakraPagination,
	IconButton,
	Text,
	createContext,
	usePaginationContext,
} from '@chakra-ui/react';
import * as React from 'react';
import {
	HiChevronLeft,
	HiChevronRight,
	HiMiniEllipsisHorizontal,
} from 'react-icons/hi2';
import { LinkButton } from './link-button';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const [RootPropsProvider, useRootProps] = createContext({
	name: 'RootPropsProvider',
});

const variantMap = {
	outline: { default: 'ghost', ellipsis: 'plain', current: 'outline' },
	solid: { default: 'outline', ellipsis: 'outline', current: 'solid' },
	subtle: { default: 'ghost', ellipsis: 'plain', current: 'subtle' },
};

export const PaginationRoot = React.forwardRef(
	function PaginationRoot(props, ref) {
		const { size = 'sm', variant = 'outline', getHref, ...rest } = props;
		return (
			<RootPropsProvider
				value={{ size, variantMap: variantMap[variant], getHref }}
			>
				<ChakraPagination.Root
					ref={ref}
					type={getHref ? 'link' : 'button'}
					{...rest}
				/>
			</RootPropsProvider>
		);
	}
);

export const PaginationEllipsis = React.forwardRef(
	function PaginationEllipsis(props, ref) {
		const { size, variantMap } = useRootProps();
		return (
			<ChakraPagination.Ellipsis ref={ref} {...props} asChild>
				<Button as='span' variant={variantMap.ellipsis} size={size}>
					<HiMiniEllipsisHorizontal />
				</Button>
			</ChakraPagination.Ellipsis>
		);
	}
);

export const PaginationFirstTrigger = React.forwardRef(
	function PaginationFirstTrigger(props, ref) {
		const { size, variantMap, getHref } = useRootProps();
		const { page } = usePaginationContext();

		const handleFirstPage = () => {
			props.onClick && props.onClick(1);
		};

		if (getHref) {
			return (
				<LinkButton
					href={getHref(1)}
					variant={variantMap.default}
					size={size}
					ref={ref}
					{...props}
				>
					<HiChevronDoubleLeft />
				</LinkButton>
			);
		}

		return (
			<Button
				variant={variantMap.default}
				size={size}
				onClick={handleFirstPage}
				disabled={page === 1}
				{...props}
			>
				<HiChevronDoubleLeft />
			</Button>
		);
	}
);

export const PaginationLastTrigger = React.forwardRef(
	function PaginationLastTrigger(props, ref) {
		const { size, variantMap, getHref } = useRootProps();
		const { totalPages, page } = usePaginationContext();

		const handleLastPage = () => {
			props.onClick && props.onClick(totalPages);
		};

		if (getHref) {
			return (
				<LinkButton
					href={getHref(totalPages)}
					variant={variantMap.default}
					size={size}
					ref={ref}
					{...props}
				>
					<HiChevronDoubleRight />
				</LinkButton>
			);
		}

		return (
			<Button
				variant={variantMap.default}
				size={size}
				onClick={handleLastPage}
				disabled={page === totalPages}
				{...props}
			>
				<HiChevronDoubleRight />
			</Button>
		);
	}
);

export const PaginationItem = React.forwardRef(
	function PaginationItem(props, ref) {
		const { page } = usePaginationContext();
		const { size, variantMap, getHref } = useRootProps();

		const current = page === props.value;
		const variant = current ? variantMap.current : variantMap.default;

		if (getHref) {
			return (
				<LinkButton
					href={getHref(props.value)}
					variant={variant}
					size={size}
				>
					{props.value}
				</LinkButton>
			);
		}

		return (
			<ChakraPagination.Item ref={ref} {...props} asChild>
				<Button variant={variant} size={size}>
					{props.value}
				</Button>
			</ChakraPagination.Item>
		);
	}
);

export const PaginationPrevTrigger = React.forwardRef(
	function PaginationPrevTrigger(props, ref) {
		const { size, variantMap, getHref } = useRootProps();
		const { previousPage } = usePaginationContext();

		if (getHref) {
			return (
				<LinkButton
					href={
						previousPage != null ? getHref(previousPage) : undefined
					}
					variant={variantMap.default}
					size={size}
				>
					<HiChevronLeft />
				</LinkButton>
			);
		}

		return (
			<ChakraPagination.PrevTrigger ref={ref} asChild {...props}>
				<IconButton variant={variantMap.default} size={size}>
					<HiChevronLeft />
				</IconButton>
			</ChakraPagination.PrevTrigger>
		);
	}
);

export const PaginationNextTrigger = React.forwardRef(
	function PaginationNextTrigger(props, ref) {
		const { size, variantMap, getHref } = useRootProps();
		const { nextPage } = usePaginationContext();

		if (getHref) {
			return (
				<LinkButton
					href={nextPage != null ? getHref(nextPage) : undefined}
					variant={variantMap.default}
					size={size}
				>
					<HiChevronRight />
				</LinkButton>
			);
		}

		return (
			<ChakraPagination.NextTrigger ref={ref} asChild {...props}>
				<IconButton variant={variantMap.default} size={size}>
					<HiChevronRight />
				</IconButton>
			</ChakraPagination.NextTrigger>
		);
	}
);

export const PaginationItems = (props) => {
	return (
		<ChakraPagination.Context>
			{({ pages }) =>
				pages.map((page, index) => {
					return page.type === 'ellipsis' ? (
						<PaginationEllipsis
							key={index}
							index={index}
							{...props}
						/>
					) : (
						<PaginationItem
							key={index}
							type='page'
							value={page.value}
							{...props}
						/>
					);
				})
			}
		</ChakraPagination.Context>
	);
};

export const PaginationPageText = React.forwardRef(
	function PaginationPageText(props, ref) {
		const { format = 'compact', ...rest } = props;
		const { page, totalPages, pageRange, count, pageSize } =
			usePaginationContext();

		const content = React.useMemo(() => {
			const start = (page - 1) * pageSize + 1;
			const end = Math.min(page * pageSize, count);

			if (format === 'short') return `${page} / ${totalPages}`;
			if (format === 'compact') return `${page} de ${totalPages}`;
			return `${start} - ${end} de ${count}`;
		}, [format, page, totalPages, count, pageSize]);

		return (
			<Text fontWeight='medium' ref={ref} {...rest}>
				{content}
			</Text>
		);
	}
);
