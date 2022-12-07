import { useState } from "react";
import { Dropdown } from "@icons";

type Props = {
	answer: string;
	question: string;
};

export default function Accordion({ question, answer }: Props) {
	const [active, setActive] = useState(false);
	const show = () => {
		return setActive(!active);
	};

	return (
		<div className={`border-b border-navy w-full`}>
			<div
				className="accordion-card__header flex items-center py-8 gap-x-10"
				onClick={() => show()}
			>
				<h4 className="flex-grow font-visby-bold text-grey md:text-[20px] text-sm md:text-2xl">
					{question}
				</h4>
				<span
					className={`cursor-pointer flex-none ${active ? "rotate-180" : ""}`}
				>
					<Dropdown />
				</span>
			</div>
			<div
				className={
					active
						? "h-full block overflow-hidden accordion-content"
						: "h-0 hidden"
				}
			>
				<p className="accordion-info text-xs md:text-base text-black-content md:px-6 py-2 md:py-4">
					{answer}
				</p>
			</div>
		</div>
	);
}
