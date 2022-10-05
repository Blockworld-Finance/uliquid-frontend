import Layout from "@common/layout";
import FAQs from "@components/home/faqs";
import Hero from "@components/home/hero";
import Protocols from "@components/home/protocols";

export default function Home() {
	return (
		<Layout>
			<Hero />
			<Protocols />
			<FAQs />
		</Layout>
	);
}
