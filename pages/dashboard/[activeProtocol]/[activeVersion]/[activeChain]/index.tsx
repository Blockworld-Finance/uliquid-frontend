import Aos from "aos";
import { useEffect } from "react";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import Tabs from "@components/common/tabs";
import Layout from "@components/common/layout";
import { getProtocols, getURLS } from "src/queries";
import MarketPlace from "@components/dashboard/market";
import { useProtocols, useTokenBalance } from "src/hooks/useQueries";
import useWindowDimensions from "@hooks/useWindowDimensions";

export default function Dashboard({ data: ddata, urls }) {
	const {
		query: { activeProtocol = 0 },
		push
	} = useRouter();
	const queryclient = useQueryClient();
	const { data } = useProtocols(ddata);
	const { isMobile } = useWindowDimensions();
	useTokenBalance();

	useEffect(() => {
		Aos.init();
	}, []);

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
					defaultActive={activeProtocol as number}
					className={"py-4 md:py-6 text-xs md:text-2xl"}
					onTabChnaged={(_t, tIndex) => {
						let index = tIndex;
						if (index > 2) {
							const removed = data.splice(index, 1);
							data.splice(2, 0, removed[0]);
							queryclient.setQueryData(["protocols"], data);
							index = 2;
						}
						push(`/dashboard/${index}/0/0`);
					}}
				/>
			</div>
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking" //indicates the type of fallback
	};
};

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
