/* eslint-disable @next/next/no-img-element */
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
		protocol?.versions?.forEach(version => chains.push(...version.chains));
		return chains.slice(0, 3);
	}, [protocol]);

	return (
		<div className="bg-navy rounded-xl py-8 px-2 md:px-6 space-y-10 hover:bg-white hover:text-darkGrey">
			<div className="space-y-3 md:space-y-6">
				<div className="flex items-center space-x-2">
					<img
						src={protocol.logo}
						alt={protocol.name}
						className="w-5 h-5 md:w-8 md:h-8"
					/>
					<h3 className="text-sm text-[18px]">{protocol.name}</h3>
				</div>
				<div className="bg-primary rounded-full flex items-center text-darkGrey p-2 w-min whitespace-nowrap space-x-2">
					{chains.map((chain, key) => (
						<div key={key} className="items-center w-4 h-4 md:w-8 md:h-8">
							<img
								className="w-4 h-4 md:w-8 md:h-8"
								src={chain.logo}
								alt={chain.name}
							/>
						</div>
					))}
					<span className="text-xs">and so on</span>
				</div>
				<p className="text-grey text-xs md:text-base leading-6 line-clamp-3 tx">
					{protocol.description}
				</p>
			</div>
			<div className="flex justify-between items-end">
				{/* <div className="text-darkGrey space-y-3">
					<span className="text-xs">Assets up for liquidation</span>
					<div className="flex items-center space-x-1">
						<BitCoin />
						<BitCoin />
						<BitCoin />
						<BitCoin />
					</div>
				</div> */}
				<div>
					<span className="text-sm underline">See more</span>
				</div>
			</div>
		</div>
	);
}
