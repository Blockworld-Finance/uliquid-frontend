import Tabs from "@components/common/tabs";
import Layout from "@components/common/layout";
import MarketPlace from "@components/dashboard/market";
import { useProtocols } from "src/hooks/useQueries";
import { getProtocols } from "src/queries";
import useData from "src/hooks/useData";

export default function Dashboard({ data: ddata }) {
	const { data } = useProtocols(ddata);
	const { dispatch } = useData();

	return (
		<Layout>
			<div className="my-36">
				<Tabs
					data={data.map(p => ({
						title: p.name,
						icon: p.logo,
						render: <MarketPlace />
					}))}
					onTabChnaged={(_t, index) =>
						dispatch({
							activeChain: 0,
							activeVersion: 0,
							activeProtocol: index
						})
					}
				/>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const data = await getProtocols();

	return {
		props: {
			data
		},
		revalidate: 3600 // In seconds
	};
}
