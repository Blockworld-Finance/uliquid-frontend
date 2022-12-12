/* eslint-disable @next/next/no-img-element */
import { ClickOutside } from "@hooks/useClickOutside";
import { Dropdown } from "@icons";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

type TabData = {
	title: string;
	icon: string;
	render: JSX.Element;
};

type Props = {
	data: TabData[];
	onTabChnaged?: (t: TabData, index: number) => void;
};

export default function Tabs({ data, onTabChnaged }: Props) {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);

	const changeTab = useCallback(
		(tabIndex: number) => {
			let index = tabIndex;
			onTabChnaged?.(data[index], index);
			if (index > 2) index = 2;
			setActive(index);
		},
		[data, onTabChnaged]
	);

	const renderTabs = useMemo(() => {
		return (
			<div className="flex items-center space-x-8 border border-none border-b-darkGrey">
				{data.map((tab, index) =>
					index < 3 ? (
						<span
							key={index}
							className={`space-x-2 cursor-pointer flex items-center py-4 md:py-6 text-xs md:text-2xl ${
								active === index ? "text-blue" : "text-grey"
							}`}
							onClick={() => {
								changeTab(index);
							}}
						>
							<img
								src={tab.icon}
								alt={tab.title}
								className="w-4 h-4 md:w-8 md:h-8"
							/>
							<span>{tab.title}</span>
						</span>
					) : null
				)}
				<span
					className={`relative bg-navy cursor-pointer md:py-6 text-xs md:text-base py-4 px-6 rounded-lg`}
				>
					<span
						className="flex items-center space-x-2"
						onClick={() => setOpen(!open)}
					>
						<span>Other protocols</span>
						<Dropdown />
					</span>
					<DropDown
						open={open}
						hidden={data}
						active={active}
						setOpen={setOpen}
						changeTab={changeTab}
					/>
				</span>
			</div>
		);
	}, [data, changeTab, active, open, setOpen]);

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
	setOpen: (s: boolean) => void;
	changeTab: (_t: number) => void;
};

export const DropDown = ({
	open,
	active,
	hidden,
	setOpen,
	changeTab
}: DropdownProps) => {
	return (
		<ClickOutside
			onclickoutside={() => setOpen(false)}
			className={`z-20 bg-navy w-full rounded-lg t-origin-t-c absolute p-3 top-20 right-0 shadow-md space-y-3 ${
				open ? "scale-y-100" : "scale-y-0"
			}`}
		>
			{hidden.map((tab, index) =>
				index > 2 ? (
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
