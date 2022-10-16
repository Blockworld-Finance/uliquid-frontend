import Accordion from "@components/common/accordion";
import Input from "@components/common/input";
import { Search } from "@icons";

const faqs = Array(5).fill({
	question: "What is the meaning of crytocurrencies?",
	answer:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac enim sem. Vivamus ultrices posuere lacus, id facilisis justo tempus eu. Nulla ullamcorper, sem eu mattis mattis, lectus ligula dapibus lectus, et porttitor purus orci sed turpis. In eget velit a nisi mattis tempus eget vulputate magna. Vestibulum pulvinar est ut nisl venenatis eleifend. Duis fermentum ornare laoreet. Aenean finibus felis massa, sollicitudin dignissim odio dapibus tristique. Sed tincidunt odio in auctor finibus. Nulla ut finibus lorem.",
});

export default function FAQs() {
	return (
		<div className="mb-36">
			<div className="space-y-4">
				<h1 className="text-6xl leading-tight">FAQs</h1>
				<p className="text-3xl text-grey leading-10">List of Frequently asked questions.</p>
			</div>
			<div className="mt-8">
				<Input className="self-center max-w-md" LeadingIcon={() => <Search />} placeholder="Search assets" />
			</div>
			<div>
				{faqs.map((faq, key) => (
					<Accordion key={key} {...faq} />
				))}
			</div>
		</div>
	);
}
