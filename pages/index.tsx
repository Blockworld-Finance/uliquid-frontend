import Layout from "@common/layout";
import FAQs from "@components/home/faqs";
import Hero from "@components/home/hero";
import Protocols from "@components/home/protocols";
import HowItWorks from "@components/home/how-it-works";
import {
	getFAQs,
	getURLS,
	getGuide,
	getProtocols,
	TGetFAQsResponse,
	TGetURLsResponse,
	TGetGuideResponse
} from "src/queries";
import { NormalizedProtocols } from "@types";

type Props = {
	urls: TGetURLsResponse;
	faqs: TGetFAQsResponse;
	guide: TGetGuideResponse;
	protocols: NormalizedProtocols;
};

export default function Home({ protocols, urls, faqs, guide }: Props) {
	return (
		<Layout urls={urls}>
			<Hero />
			<Protocols protocols={protocols} />
			<HowItWorks guide={guide} />
			<FAQs faqs={faqs.getFAQs} />
		</Layout>
	);
}

export async function getStaticProps() {
	const [protocols, urls = {}, faqs = {}, guide = {}] = await Promise.all([
		getProtocols(),
		getURLS(),
		getFAQs(),
		getGuide()
	]);

	return {
		props: {
			faqs,
			urls,
			guide,
			protocols
		},
		revalidate: 600 // In seconds
	};
}
