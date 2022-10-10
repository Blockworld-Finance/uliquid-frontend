import Button from "@components/common/button";
import { Aave, BitCoin, Close, Dropdown, Ethereum, GasPump, Info } from "@icons";

type Props = {
	open: boolean;
	setOpen: (_v: boolean) => void;
};

export default function Modal({ open, setOpen }: Props) {
	return (
		<>
			<div
				className={`${
					open ? "fixed" : "hidden"
				} w-screen h-screen top-0 left-0 bg-black bg-opacity-60`}
				onClick={() => setOpen(false)}
			/>
			<div
				className={`w-full max-w-lg bg-navy rounded-lg fixed ${
					open ? "top-1/2" : "-top-[150%]"
				} -translate-x-1/2 left-1/2 -translate-y-1/2 py-10 px-6`}
			>
				<div className="relative">
					<Close className="absolute top-0 right-0" onClick={() => setOpen(false)} />
					<div>
						<Liquidate />
					</div>
				</div>
			</div>
		</>
	);
}

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

				<div className="bg-primary p-3 rounded-lg flex justify-between">
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
			</div>

			<Button size="large" className="w-full font-semibold">
				Liquidate
			</Button>
		</>
	);
}
