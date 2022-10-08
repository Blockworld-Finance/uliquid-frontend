import Layout from "@common/layout";
import FAQs from "@components/home/faqs";
import Hero from "@components/home/hero";
import Protocols from "@components/home/protocols";
import HowItWorks from "@components/home/how-it-works";

export default function Home() {
	return (
		<Layout>
			<Hero />
			<Protocols />
			<HowItWorks />
			<FAQs />
		</Layout>
	);
}
