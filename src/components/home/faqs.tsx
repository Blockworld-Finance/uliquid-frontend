import Accordion from "@components/common/accordion";
import Input from "@components/common/input";
import { Search } from "@icons";
import { TFAQ } from "@types";

type Props = {
	faqs: TFAQ[];
};

export default function FAQs({ faqs }: Props) {
	return (
		<div className="mb-36" id="faqs">
			<div className="space-y-4">
				<h1 className="text-6xl leading-tight">FAQs</h1>
				<p className="text-3xl text-grey leading-10">
					List of Frequently asked questions.
				</p>
			</div>
			<div className="mt-8">
				<Input
					className="self-center max-w-md"
					LeadingIcon={() => <Search />}
					placeholder="Search assets"
				/>
			</div>
			<div>
				{faqs.map((faq, key) => (
					<Accordion key={key} {...faq} />
				))}
			</div>
		</div>
	);
}
