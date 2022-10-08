import { useState } from "react";

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
				<h4 className="flex-grow font-visby-bold text-grey md:text-[20px] text-2xl">{question}</h4>
				{active ? (
					<span className="cursor-pointer flex-none">-</span>
				) : (
					<span className="cursor-pointer flex-none">+</span>
				)}
			</div>
			<div className={active ? "h-full block overflow-hidden accordion-content" : "h-0 hidden"}>
				<p className="accordion-info text-black-content px-6 py-4">{answer}</p>
			</div>
		</div>
	);
}
