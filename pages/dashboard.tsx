import Layout from "@components/common/layout";
import Tabs from "@components/common/tabs";
import MarketPlace from "@components/dashboard/market";
import { Aave } from "@icons";

const data = [
	{
		title: "Aave",
		icon: <Aave />,
		render: <MarketPlace />,
	},
	{
		title: "Compound",
		icon: <Aave />,
		render: <>Compound</>,
	},
	{
		title: "Starlay",
		icon: <Aave />,
		render: <>Starlay</>,
	},
	{
		title: "Uniswap",
		icon: <Aave />,
		render: <>Uniswap</>,
	},
];

export default function Dashboard() {
	return (
		<Layout>
			<div className="my-36">
				<Tabs data={data} />
			</div>
		</Layout>
	);
}
