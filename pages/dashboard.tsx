import { useQueryClient } from "react-query";

import useData from "src/hooks/useData";
import Tabs from "@components/common/tabs";
import Layout from "@components/common/layout";
import { getProtocols, getURLS } from "src/queries";
import MarketPlace from "@components/dashboard/market";
import { useProtocols, useTokenBalance } from "src/hooks/useQueries";
import useWindowDimensions from "@hooks/useWindowDimensions";

export default function Dashboard({ data: ddata, urls }) {
	const { dispatch } = useData();
	const { isMobile } = useWindowDimensions();
	const queryclient = useQueryClient();
	const { data } = useProtocols(ddata);
	useTokenBalance();

	return (
		<Layout urls={urls}>
			<div className="my-6 md:my-36">
				<Tabs
					breakpoint={isMobile ? 2 : 3}
					data={data.map(p => ({
						title: p.name,
						icon: p.logo,
						render: <MarketPlace />
					}))}
					className={"py-4 md:py-6 text-xs md:text-2xl"}
					onTabChnaged={(_t, tIndex) => {
						let index = tIndex;
						if (index > 2) {
							const removed = data.splice(index, 1);
							data.splice(2, 0, removed[0]);
							queryclient.setQueryData(["protocols"], data);
							index = 2;
						}
						dispatch({
							activeChain: 0,
							activeVersion: 0,
							activeProtocol: index
						});
					}}
				/>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const [data, urls = {}] = await Promise.all([getProtocols(), getURLS()]);

	return {
		props: {
			data,
			urls
		},
		revalidate: 3600 // In seconds
	};
}
