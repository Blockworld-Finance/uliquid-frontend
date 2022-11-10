import Image from "next/image";
import {
	useRef,
	useState,
	ChangeEventHandler,
	useCallback,
	useEffect
} from "react";

import useData from "@hooks/useData";
import Button from "@components/common/button";
import { LendingMarketUser } from "src/schema";
import { useProtocols } from "@hooks/useQueries";
import { Info, GasPump, Dropdown, Ethereum, Search } from "@icons";
import Input from "@components/common/input";
import { getLiquidation, getTokenUSDValue } from "src/queries";
import { useAccount } from "wagmi";
import { GetLiquidationResult } from "@types";

type Props = {
	asset?: LendingMarketUser;
	collateral?: LendingMarketUser;
};

export function Liquidate({ asset, collateral }: Props) {
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const { address } = useAccount();
	const { data } = useProtocols();
	const [show, setShow] = useState(false);
	let { current: control } = useRef(new AbortController());
	const [tokenValue, setTokenValue] = useState<{
		getTokenValue: number;
		getTokenUSDValue: number;
	}>();
	const { name, logo, versions = [] } = data[activeProtocol];
	const [liquidation, setLiquidation] = useState<GetLiquidationResult>();

	useEffect(() => {
		if (asset && collateral)
			getTokenUSDValue({
				token: asset.marketAddress,
				quoteToken: collateral.marketAddress,
				getTokenUsdValueToken2: collateral.marketAddress,
				chainId: versions[activeVersion].chains[activeChain].id,
				getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
			}).then(d => {
				console.log(d);
				setTokenValue(d);
			});
	}, [activeChain, activeVersion, asset, collateral, versions]);

	const getLiquidationQuote: ChangeEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (e.target.value.length) {
				control.abort();
				control = new AbortController();
				getLiquidation({
					user: address,
					protocol: name,
					signal: control.signal,
					debt: asset.marketAddress,
					slippage: (0.3 / 100) * 1000000,
					debtAmount: Number(e.target.value),
					collateral: collateral.marketAddress,
					version: versions[activeVersion].name,
					chainId: versions[activeVersion].chains[activeChain].id
				})
					.then(d => {
						console.log(d);
						setLiquidation(d);
					})
					.catch(e => {});
			}
		},
		[]
	);

	return (
		<>
			<h1 className="text-3xl text-darkGrey mb-6">Liquidate</h1>
			<div className="max-h-[60vh] overflow-y-scroll">
				<div className="flex space-x-10">
					<div className="space-y-2">
						<small className="text-sm text-darkGrey">Protocol</small>
						<div className="flex space-x-2 items-center">
							<Image src={logo} alt={name} width={24} height={24} />
							<span>{name}</span>
						</div>
					</div>
					<div className="space-y-2">
						<small className="text-sm text-darkGrey">Blockchain</small>
						<div className="flex space-x-2 items-center">
							<Image
								width={24}
								height={24}
								src={versions[activeVersion].chains[activeChain]?.logo ?? ""}
								alt={versions[activeVersion].chains[activeChain]?.name ?? ""}
							/>
							<p>{versions[activeVersion].chains[activeChain]?.name ?? ""}</p>
							{versions && versions.length ? (
								<div className="bg-primary text-blue text-xs px-5 py-1 rounded">
									{versions[activeVersion].name}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-2 my-4">
					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-sm text-darkGrey">Debt</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
								<input
									step={0.01}
									type="number"
									onChange={getLiquidationQuote}
									max={asset?.amountBorrowed}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									${liquidation?.debtAmountUSD ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2 flex-initial">
										<Image
											width={32}
											height={32}
											src={asset?.marketLogo ?? ""}
											alt={asset?.marketName ?? ""}
										/>
										<span className="">{asset?.marketSymbol}</span>
									</div>
									<Dropdown className="flex-none" />
								</div>
								<small className="text-sm text-grey">
									<span>
										Debt = {asset?.amountBorrowed.toPrecision(8) ?? 0}
									</span>
									<span>Max</span>
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-sm text-darkGrey">Collateral</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
								<input
									readOnly
									value={liquidation?.collateralAmount ?? 0}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									${liquidation?.collateralAmountUSD ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Image
											width={32}
											height={32}
											src={collateral?.marketLogo ?? ""}
											alt={collateral?.marketName ?? ""}
										/>
										<span>{collateral?.marketSymbol}</span>
									</div>
									<Dropdown />
								</div>
								<small className="text-sm text-grey">
									Bal = ${collateral?.amountSuppliedUSD.toPrecision(8) ?? 0}
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg">
						<div className="flex justify-between items-center">
							<div className="flex space-x-2 items-center">
								<Info />
								<span>
									1{asset?.marketSymbol} ={" "}
									{tokenValue?.getTokenValue.toPrecision(6) ?? 0}{" "}
									{collateral?.marketSymbol} ($
									{(
										tokenValue?.getTokenValue ??
										0 / tokenValue?.getTokenUSDValue ??
										0
									).toPrecision(6)}
									)
								</span>
							</div>

							<div className="flex space-x-2 items-center">
								<GasPump />
								<span>$0.28</span>
								<Dropdown onClick={() => setShow(!show)} />
							</div>
						</div>
						<div
							className={`${
								show ? "h-min space-y-2 mt-3" : "h-0"
							} overflow-y-hidden`}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Expected output</h3>
								<h3> {asset?.marketSymbol ?? ""}</h3>
							</div>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Price impact</h3>
								<h3>
									{liquidation?.swapQuote.priceImpact.toPrecision(8) ?? 0}%
								</h3>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Maximum spent after slippage (0.3%)</p>
								<p>
									{liquidation?.collateralAmount ?? 0}{" "}
									{collateral?.marketSymbol}
								</p>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Network fee</p>
								<p>$0.28</p>
							</div>
							<div className="flex justify-between items-center">
								<p>Protocol fee</p>
								<p>{(liquidation?.fee / 1000000) * 100 ?? 0}%</p>
							</div>
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

const AssetPicker = () => {
	return (
		<div className="">
			<div>
				<p>Change Asset</p>
				<Input
					className="self-center"
					LeadingIcon={() => <Search />}
					placeholder="Search assets or paste address"
				/>
			</div>
			<div>
				<p>Recent searches</p>
			</div>
			<div></div>
		</div>
	);
};
