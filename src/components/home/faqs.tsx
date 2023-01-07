import { ChangeEventHandler, useState } from "react";

import { TFAQ } from "@types";
import { Search } from "@icons";
import Input from "@components/common/input";
import Accordion from "@components/common/accordion";

type Props = {
	faqs: TFAQ[];
};

export default function FAQs({ faqs }: Props) {
	const [list, setList] = useState(faqs);

	const filterFAQs: ChangeEventHandler<HTMLInputElement> = e => {
		if (e.target.value) {
			const cache = faqs.filter(q =>
				q.question.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setList(cache);
		} else {
			setList(faqs);
		}
	};

	return (
		<div className="mb-36" id="faqs">
			<div className="space-y-2 md:space-y-4">
				<h1 className="text-2xl md:text-6xl leading-tight">FAQs</h1>
				<p className="text-sm md:text-3xl text-grey leading-10">
					List of Frequently asked questions.
				</p>
			</div>
			<div className="mt-8">
				<Input
					onChange={filterFAQs}
					placeholder="Search assets"
					LeadingIcon={() => <Search />}
					className="self-center max-w-md"
				/>
			</div>
			<div>
				{list.map((faq, key) => (
					<Accordion key={key} {...faq} />
				))}
			</div>
		</div>
	);
}
