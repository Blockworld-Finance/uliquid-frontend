import { useCallback, useMemo, useState } from "react";

type TabData = {
	title: string;
	icon: JSX.Element;
	render: JSX.Element;
};

type Props = {
	data: TabData[];
	onTabChnaged?: (t: TabData, index: number) => void;
};

export default function Tabs({ data, onTabChnaged }: Props) {
	const [active, setActive] = useState(0);

	const changeTab = useCallback(
		(tabIndex: number) => {
			setActive(tabIndex);
			onTabChnaged?.(data[tabIndex], tabIndex);
		},
		[data, onTabChnaged]
	);

	const renderTabs = useMemo(() => {
		return (
			<div className="flex items-center space-x-8 border border-none border-b-grey">
				{data.map((tab, index) => (
					<span
						key={index}
						className={`space-x-2 flex items-center text-2xl ${
							active === index ? "text-blue" : "text-grey"
						}`}
						onClick={() => {
							changeTab(index);
						}}
					>
						{tab.icon}
						<span>{tab.title}</span>
					</span>
				))}
			</div>
		);
	}, [data, changeTab, active]);

	return (
		<div>
			<div className="border-b border-b-grey">{renderTabs}</div>
			<div>{data[active].render}</div>
		</div>
	);
}
