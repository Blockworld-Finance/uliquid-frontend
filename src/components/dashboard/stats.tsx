import { Heart, Networth, Swap } from "@icons";
import { useUserData } from "src/hooks/useQueries";
import { useAccount } from "wagmi";

export default function Stats() {
	const { isConnected } = useAccount();
	const { data } = useUserData();

	return (
		<div className="flex items-center my-10 space-x-8">
			<div className="flex items-center space-x-4">
				<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
					<Networth />
				</div>
				<div className="space-y-2">
					<div className="text-darkGrey text-[18px]">Total networth</div>
					<div className="text-2xl">
						{isConnected
							? (data && data.getLendingProtocolUserData.totalSuppliedUSD) ?? 0
							: "--:--"}
					</div>
				</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
					<Swap />
				</div>
				<div className="space-y-2">
					<div className="text-darkGrey text-[18px]">Total Borrows</div>
					<div className="text-2xl">
						{isConnected
							? (data && data.getLendingProtocolUserData.totalBorrowedUSD) ?? 0
							: "--:--"}
					</div>
				</div>
			</div>
			{isConnected && (
				<div className="flex items-center space-x-4">
					<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
						<Heart />
					</div>
					<div className="space-y-2">
						<div className="text-darkGrey text-[18px]">Health factor</div>
						<div className="text-2xl text-blue">
							{(data &&
								data.getLendingProtocolUserData.healthFactor
									.toString()
									.substring(0, 5)) ??
								0}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
