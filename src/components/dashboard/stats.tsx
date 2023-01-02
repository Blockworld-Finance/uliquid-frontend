import { useAccount } from "wagmi";

import { Heart, Networth, Swap } from "@icons";
import { useUserData } from "src/hooks/useQueries";

export default function Stats() {
	const { isConnected } = useAccount();
	const { data } = useUserData();
	const {
		healthFactor = "",
		totalBorrowedUSD = 0,
		totalSuppliedUSD = 0,
		markets
	} = data?.getLendingProtocolUserData ?? {};

	// console.log(markets);

	return (
		<div className="flex items-center my-10 space-x-3 md:space-x-8">
			<div className="flex items-center space-x-2 md:space-x-4">
				<div className="border border-navy w-8 h-8 md:w-16 md:h-16 grid place-items-center rounded-lg">
					<Networth />
				</div>
				<div className="md:space-y-2">
					<div className="text-darkGrey text-[10px] md:text-[18px] whitespace-nowrap">
						Total networth
					</div>
					<div className="text-sm md:text-2xl">
						{isConnected
							? (totalSuppliedUSD - totalBorrowedUSD).toPrecision(7)
							: "--:--"}
					</div>
				</div>
			</div>
			<div className="flex items-center space-x-2 md:space-x-4">
				<div className="border border-navy w-8 h-8 md:w-16 md:h-16 grid place-items-center rounded-lg">
					<Swap />
				</div>
				<div className="md:space-y-2">
					<div className="text-darkGrey text-[10px] md:text-[18px] whitespace-nowrap">
						Total Borrows
					</div>
					<div className="text-sm md:text-2xl">
						{isConnected ? totalBorrowedUSD.toPrecision(7) : "--:--"}
					</div>
				</div>
			</div>
			{isConnected && (
				<div className="flex items-center space-x-2 md:space-x-4">
					<div className="border border-navy w-8 h-8 md:w-16 md:h-16 grid place-items-center rounded-lg">
						<Heart />
					</div>
					<div className="md:space-y-2">
						<div className="text-darkGrey text-[10px] md:text-[18px] whitespace-nowrap">
							Health factor
						</div>
						<div className="text-sm md:text-2xl text-blue">
							{(data && healthFactor.toString().substring(0, 5)) ?? 0}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
