import { BNB } from "@icons";

const data = Array(10).fill(10);

export default function Assets() {
	return (
		<div className="bg-navy p-10 rounded-xl">
			<div className="space-y-6">
				{data.map((_x, i) => (
					<Asset key={i} />
				))}
			</div>
		</div>
	);
}

const Asset = () => {
	return (
		<div className="border border-darkGrey rounded-lg px-8 py-3 flex space-x-3">
			<BNB />
			<div className="flex flex-grow items-center justify-between">
				<div className="w-1/3 space-y-1">
					<span className="text-[18px] block">Binance USD</span>
					<span className="text-sm text-grey block">BUSD</span>
				</div>
				<div className="w-1/3 space-y-1">
					<span className="text-[18px] block">$29.03m</span>
					<span className="text-sm text-grey block">$28.92m</span>
				</div>
				<div className="w-1/3 space-y-1">
					<span className="text-[18px] block">$29.03m</span>
					<span className="text-sm text-grey block">$28.92m</span>
				</div>
			</div>
		</div>
	);
};
