import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

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
			<div className="flex items-center space-x-8 border border-none border-b-darkGrey">
				{data.map((tab, index) => (
					<span
						key={index}
						className={`space-x-2 flex items-center py-6 text-2xl ${
							active === index ? "text-blue" : "text-grey"
						}`}
						onClick={() => {
							changeTab(index);
						}}
					>
						<Image src={tab.icon} alt={tab.title} width={32} height={32} />
						<span>{tab.title}</span>
					</span>
				))}
			</div>
		);
	}, [data, changeTab, active]);

	return (
		<div>
			<div className="border-b border-b-darkGrey">{renderTabs}</div>
			<div>{data[active].render}</div>
		</div>
	);
}
