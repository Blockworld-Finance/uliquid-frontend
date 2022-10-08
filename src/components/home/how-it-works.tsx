import Button from "@components/common/button";
import { BitCoin, BNB, Solana } from "@icons";

const HIWData = Array(4).fill(0);

export default function HowItWorks() {
	return (
		<div className="flex space-x-36 my-36">
			<div className="max-w-lg space-y-10 flex-none">
				<p className="text-3xl text-grey leading-10">How it works</p>
				<h1 className="text-6xl leading-tight">A quick guide on how Uliquid works.</h1>
				<Button>Get started</Button>
			</div>
			<div className="hiw grid grid-cols-2 gap-16">
				{HIWData.map((_d, index) => (
					<HowItWorksCard key={index} index={index} />
				))}
			</div>
		</div>
	);
}

function HowItWorksCard({ index }) {
	return (
		<div className={`relative ${(index + 1) % 2 === 0 ? "top-20" : ""}`}>
			<div className={`bg-navy rounded-xl py-8 px-6 h-80`}>
				<h3>Select a lending protocol.</h3>
				<div className="bg-primary rounded-full flex items-center text-darkGrey p-2 mt-3 mb-6 w-min whitespace-nowrap space-x-2">
					<BitCoin />
					<BNB />
					<Solana />
					<span className="text-xs">and so on</span>
				</div>
				<p className="text-grey ">
					Avoid loosing a portion of your collateral without your consent, start doing the
					liquidation process yourself.
				</p>
			</div>
			<div className="h-[1px] bg-darkGrey mt-6">
				<div
					className="h-[1px] bg-blue"
					style={{
						width: `${25 * (index + 1)}%`,
					}}
				></div>
			</div>
		</div>
	);
}
