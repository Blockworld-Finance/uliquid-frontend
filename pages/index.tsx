import Layout from "@common/layout";
import FAQs from "@components/home/faqs";
import Hero from "@components/home/hero";
import Protocols from "@components/home/protocols";
import HowItWorks from "@components/home/how-it-works";
import {
	getFAQs,
	getProtocols,
	getURLS,
	TGetFAQsResponse,
	TGetURLsResponse
} from "src/queries";
import { NormalizedProtocols } from "@types";

type Props = {
	urls: TGetURLsResponse;
	faqs: TGetFAQsResponse;
	protocols: NormalizedProtocols;
};

export default function Home({ protocols, urls, faqs }: Props) {
	return (
		<Layout urls={urls}>
			<Hero />
			<Protocols protocols={protocols} />
			<HowItWorks />
			<FAQs faqs={faqs.getFAQs} />
		</Layout>
	);
}

export async function getStaticProps() {
	const [protocols, urls = {}, faqs = {}] = await Promise.all([
		getProtocols(),
		getURLS(),
		getFAQs()
	]);

	return {
		props: {
			faqs,
			urls,
			protocols
		},
		revalidate: 5 // In seconds
	};
}
