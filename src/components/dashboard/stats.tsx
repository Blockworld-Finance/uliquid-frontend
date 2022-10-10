import { Heart, Networth, Swap } from "@icons";

export default function Stats() {
	return (
		<div className="flex items-center my-10 space-x-8">
			<div className="flex items-center space-x-4">
				<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
					<Networth />
				</div>
				<div className="space-y-2">
					<div className="text-darkGrey text-[18px]">Total networth</div>
					<div className="text-2xl">6.93billion</div>
				</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
					<Swap />
				</div>
				<div className="space-y-2">
					<div className="text-darkGrey text-[18px]">Total networth</div>
					<div className="text-2xl">6.93billion</div>
				</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="border border-navy w-16 h-16 grid place-items-center rounded-lg">
					<Heart />
				</div>
				<div className="space-y-2">
					<div className="text-darkGrey text-[18px]">Health factor</div>
					<div className="text-2xl text-blue">10.25m</div>
				</div>
			</div>
		</div>
	);
}
