import Image from "next/image";
import { useMemo } from "react";

import { Chain } from "@schema";
import { NormalizedProtocol } from "@types";
import { BitCoin } from "../../assets/icons";

type Props = {
	protocol: NormalizedProtocol;
};

export default function ProtocolCard({ protocol }: Props) {
	const chains: Chain[] = useMemo(() => {
		const chains = [];
		console.log(protocol);

		protocol?.versions?.forEach(version => chains.push(...version.chains));
		console.log(chains, chains.slice(0, 3));

		return chains.slice(0, 3);
	}, [protocol]);

	return (
		<div className="bg-navy rounded-xl py-8 px-6 space-y-10 hover:bg-white hover:text-darkGrey">
			<div className="space-y-6">
				<div className="flex items-center space-x-2">
					<Image
						width={32}
						height={32}
						src={protocol.logo}
						alt={protocol.name}
					/>
					<h3>{protocol.name}</h3>
				</div>
				<div className="bg-primary rounded-full flex items-center text-darkGrey p-2 w-min whitespace-nowrap space-x-2">
					{chains.map((chain, key) => (
						<div key={key} className="items-center w-6 h-6">
							<Image width={24} height={24} src={chain.logo} alt={chain.name} />
						</div>
					))}
					<span className="text-xs">and so on</span>
				</div>
				<p className="text-grey leading-6 line-clamp-3">
					{protocol.description}
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
