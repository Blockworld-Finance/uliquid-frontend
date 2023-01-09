/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState } from "react";

import { Dropdown } from "@icons";
import { ClickOutside } from "@hooks/useClickOutside";

type TabData = {
	title: string;
	icon?: string;
	render: JSX.Element;
};

type Props = {
	data: TabData[];
	className?: string;
	breakpoint?: number;
	defaultActive?: number;
	onTabChnaged?: (t: TabData, index: number) => void;
};

export default function Tabs({
	data,
	className,
	onTabChnaged,
	defaultActive,
	breakpoint = 2
}: Props) {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(defaultActive ?? 0);

	const changeTab = useCallback(
		(tabIndex: number) => {
			let index = tabIndex;
			onTabChnaged?.(data[index], index);
			if (index > breakpoint) index = breakpoint;
			setActive(index);
		},
		[data, onTabChnaged, breakpoint]
	);

	const renderTabs = useMemo(() => {
		return (
			<div className="flex items-center space-x-3 md:space-x-8 border border-none border-b-darkGrey">
				{data.map((tab, index) =>
					index <= breakpoint ? (
						<span
							key={index}
							className={`space-x-1 md:space-x-2 cursor-pointer flex items-center ${className} ${
								active === index
									? "text-blue font-semibold border-b-2 relative top-[1px] border-b-blue"
									: "text-grey hover:text-white"
							}`}
							onClick={() => {
								changeTab(index);
							}}
						>
							{tab.icon && (
								<img
									src={tab.icon}
									alt={tab.title}
									className="w-4 h-4 md:w-8 md:h-8"
								/>
							)}
							<span>{tab.title}</span>
						</span>
					) : null
				)}
				{data.length > 3 ? (
					<span
						className={`relative bg-navy cursor-pointer md:py-6 text-xs md:text-base py-2 px-2 md:px-6 rounded-lg`}
					>
						<span
							className="flex items-center space-x-1 md:space-x-2"
							onClick={() => setOpen(!open)}
						>
							<span className="text-[10px] md:text-base">Other protocols</span>
							<Dropdown />
						</span>
						<DropDown
							open={open}
							hidden={data}
							active={active}
							setOpen={setOpen}
							changeTab={changeTab}
							breakpoint={breakpoint}
						/>
					</span>
				) : null}
			</div>
		);
	}, [data, changeTab, active, open, setOpen, className, breakpoint]);

	return (
		<div>
			<div className="border-b border-b-darkGrey">{renderTabs}</div>
			<div key={data[active].title}>{data[active].render}</div>
		</div>
	);
}

type DropdownProps = {
	open: boolean;
	active: number;
	hidden: TabData[];
	breakpoint?: number;
	setOpen: (s: boolean) => void;
	changeTab: (_t: number) => void;
};

export const DropDown = ({
	open,
	active,
	hidden,
	setOpen,
	changeTab,
	breakpoint = 2
}: DropdownProps) => {
	return (
		<ClickOutside
			onclickoutside={() => setOpen(false)}
			className={`z-20 bg-navy w-full rounded-lg t-origin-t-c absolute p-3 top-20 right-0 shadow-md space-y-3 ${
				open ? "scale-y-100" : "scale-y-0"
			}`}
		>
			{hidden.map((tab, index) =>
				index > breakpoint ? (
					<div
						key={tab.title}
						className={`flex items-center space-x-2 cursor-pointer ${
							active === index ? "text-blue" : ""
						}`}
						onClick={() => {
							setOpen(false);
							changeTab(index);
						}}
					>
						<img
							src={tab.icon}
							alt={tab.title}
							className="w-4 h-4 md:w-8 md:h-8"
						/>
						<span>{tab.title}</span>
					</div>
				) : null
			)}
		</ClickOutside>
	);
};
