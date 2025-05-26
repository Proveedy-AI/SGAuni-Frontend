import { useState, useEffect } from 'react';

export const useSidebarState = () => {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
			const savedState = localStorage.getItem('isSidebarCollapsed');
			return savedState !== null ? JSON.parse(savedState) : false;
		}
		return true;
	});

	useEffect(() => {
		if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
			localStorage.setItem(
				'isSidebarCollapsed',
				JSON.stringify(isCollapsed)
			);
		}
	}, [isCollapsed]);

	const toggleSidebar = () => {
		setIsCollapsed((prev) => !prev);
	};

	return { isCollapsed, toggleSidebar };
};
