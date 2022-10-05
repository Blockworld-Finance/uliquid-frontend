import { Aave, BitCoin, BNB, Solana } from "../../assets/icons";

export default function ProtocolCard() {
	return (
		<div className="bg-navy rounded-xl py-8 px-6 space-y-10">
			<div className="space-y-6">
				<div className="flex items-center space-x-2">
					<Aave />
					<h3>Aave</h3>
				</div>
				<div className="bg-primary rounded-full flex items-center text-darkGrey p-2 w-min whitespace-nowrap space-x-2">
					<BitCoin />
					<BNB />
					<Solana />
					<span className="text-xs">and so on</span>
				</div>
				<p className="text-grey leading-6">
					A decentralized lending protocol that lets users lend or borrow cryptocurrency without
					going to a centralized intermediary.
				</p>
			</div>
			<div className="flex justify-between items-end">
				<div className="text-darkGrey space-y-3">
					<span className="text-xs">Assets up for liquidation</span>
					<div className="flex items-center space-x-1">
						<BitCoin />
						<BitCoin />
						<BitCoin />
						<BitCoin />
					</div>
				</div>
				<div>
					<span className="text-sm underline">See more</span>
				</div>
			</div>
		</div>
	);
}
