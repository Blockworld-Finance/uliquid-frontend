import Button from "@components/common/button";
import { Aave, BitCoin, Close, Dropdown, Ethereum, GasPump, Info } from "@icons";

export function Liquidate() {
	return (
		<>
			<h1 className="text-3xl text-darkGrey mb-6">Liquidate</h1>
			<div className="flex space-x-10">
				<div className="space-y-2">
					<small className="text-sm text-darkGrey">Protocol</small>
					<div className="flex space-x-2 items-center">
						<Aave />
						<span>Aave</span>
					</div>
				</div>
				<div className="space-y-2">
					<small className="text-sm text-darkGrey">Blockchain</small>
					<div className="flex space-x-2 items-center">
						<Ethereum />
						<span>Ethereum </span>
						<div className="bg-primary text-blue text-sm px-5 py-2 rounded">version 2</div>
					</div>
				</div>
			</div>

			<div className="space-y-2 my-4">
				<div className="bg-primary p-3 rounded-lg space-y-3">
					<small className="text-sm text-darkGrey">Debt</small>
					<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
						<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
							<input className="w-full text-3xl text-white bg-primary border-none focus:outline-none" />
							<small className="text-sm text-grey">$19750.70</small>
						</div>
						<div className="space-y-2 col-span-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-1">
									<BitCoin />
									<span>BTC</span>
								</div>
								<Dropdown />
							</div>
							<small className="text-sm text-grey">Debt = 2</small>
						</div>
					</div>
				</div>

				<div className="bg-primary p-3 rounded-lg space-y-3">
					<small className="text-sm text-darkGrey">Collateral</small>
					<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
						<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
							<input className="w-full text-3xl text-white bg-primary border-none focus:outline-none" />
							<small className="text-sm text-grey">$19750.70</small>
						</div>
						<div className="space-y-2 col-span-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-1">
									<Ethereum />
									<span>ETH</span>
								</div>
								<Dropdown />
							</div>
							<small className="text-sm text-grey">Bal = 27.48</small>
						</div>
					</div>
				</div>

				<div className="bg-primary p-3 rounded-lg">
					<div className="flex justify-between items-center">
						<div className="flex space-x-2 items-center">
							<Info />
							<span>1ETH = 0.072 BTC ($1431.47)</span>
						</div>

						<div className="flex space-x-2 items-center">
							<GasPump />
							<span>$0.28</span>
							<Dropdown />
						</div>
					</div>
					<div className="space-y-2 mt-3">
						<div className="flex justify-between items-center">
							<h3 className="text-grey">Expected output</h3>
							<h3>13.80 ETH</h3>
						</div>
						<div className="flex justify-between items-center">
							<h3 className="text-grey">Price impact</h3>
							<h3>0.07%</h3>
						</div>
						<div className="flex justify-between items-center text-grey">
							<p>Minimum received after slippage (1.0%)</p>
							<p>0.0000016 ETH</p>
						</div>
						<div className="flex justify-between items-center text-grey">
							<p>Network fee</p>
							<p>$0.28</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Protocol fee</p>
							<p>1%</p>
						</div>
					</div>
				</div>
			</div>

			<Button size="large" className="w-full font-semibold">
				Liquidate
			</Button>
		</>
	);
}
