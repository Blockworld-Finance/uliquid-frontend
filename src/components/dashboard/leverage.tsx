import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import useData from "@hooks/useData";
import Button from "@components/common/button";
import Slider from "@components/common/slider";
import { useProtocols } from "@hooks/useQueries";
import { ClickOutside } from "@hooks/useClickOutside";
import { Dropdown, GasPump, Help, Info } from "@icons";
import useProtocolMarkets from "@hooks/useProtocolMarkets";
import { LendingMarketUser, LiquidationQuote } from "@schema";
import { AssetPicker } from "@components/common/asset-picker";

type Props = {
	debt?: LendingMarketUser;
	collateral?: LendingMarketUser;
	getTx: (l: LiquidationQuote, _x: any) => void;
};

export default function Leverage({
	getTx,
	debt: initialDebt,
	collateral: initialCollateral
}: Props) {
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const { data } = useProtocols();
	const [view, setView] = useState(false);
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [ratio, setRatio] = useState<number>();
	const [debt, setDebt] = useState(initialDebt);
	const inputRef = useRef<HTMLInputElement>(null);
	const [tokenValue, setTokenValue] = useState<{
		getTokenValue: number;
		getTokenUSDValue: number;
	}>();
	const [liquidation, setLiquidation] = useState<LiquidationQuote>();
	const [collateral, setCollateral] = useState(initialCollateral);
	const { name, logo, versions = [] } = data[activeProtocol];
	const { data: markets } = useProtocolMarkets(name, {
		version: versions[activeVersion].name,
		chainId: versions[activeVersion].chains[activeChain].id
	});

	const [color, setColor] = useState();

	const market = useMemo(() => {
		const m = markets.getLendingProtocolMarkets.find(
			m => (m.name = debt.marketName)
		);
		return {
			marketData: m,
			redThreshold: Math.ceil(
				m.minCollateralizationRatio / 2 + m.minCollateralizationRatio
			),
			orangeThreshold: Math.ceil(
				m.minCollateralizationRatio * 2 + m.minCollateralizationRatio
			)
		};
	}, [markets, debt]);

	return (
		<>
			<div className="max-h-[60vh] overflow-y-scroll overscroll-y-contain mt-4">
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
						<small className="text-sm text-darkGrey">Leverage token</small>
						<div className="grid gap-2 grid-cols-12 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-7">
								<input
									step={0.01}
									type="number"
									ref={inputRef}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									${liquidation?.debtAmountUSD ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-5">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2 flex-initial">
										<Image
											width={32}
											height={32}
											src={collateral?.marketLogo ?? ""}
											alt={collateral?.marketName ?? ""}
										/>
										<span className="">{collateral?.marketSymbol}</span>
									</div>
									<div className="">
										<ClickOutside
											onclickoutside={() => {
												setView(false);
											}}
										>
											<div
												className="w-8 h-8 grid place-content-center cursor-pointer"
												onClick={() => setView(true)}
											>
												<Dropdown />
											</div>
											<AssetPicker
												open={view}
												select={setCollateral}
												close={() => setView(false)}
											/>
										</ClickOutside>
									</div>
								</div>
								<small className="text-sm text-grey flex items-center justify-between">
									<span>Debt = {debt?.amountBorrowed.toPrecision(6) ?? 0}</span>
									<span
										className="px-1 py-[2px] bg-[#008DE4] rounded-full text-white cursor-pointer"
										onClick={() => {
											if (inputRef.current)
												inputRef.current.value = `${debt.amountBorrowed}`;
										}}
									>
										Max
									</span>
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg">
						<div className="flex items-center justify-between">
							<small className="text-sm text-darkGrey flex items-center">
								<span>Debt</span> <Help className="ml-2" />
							</small>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Image
											width={32}
											height={32}
											src={debt?.marketLogo ?? ""}
											alt={debt?.marketName ?? ""}
										/>
										<span>{debt?.marketSymbol}</span>
									</div>
									<div className="">
										<ClickOutside
											className=""
											onclickoutside={() => {
												setOpen(false);
											}}
										>
											<div
												className="w-8 h-8 grid place-content-center cursor-pointer"
												onClick={() => setOpen(true)}
											>
												<Dropdown />
											</div>
											<AssetPicker
												open={open}
												select={setDebt}
												close={() => setOpen(false)}
											/>
										</ClickOutside>
									</div>
								</div>
							</div>
						</div>
						<div>
							<h1 className="text-3xl">
								{ratio
									? `${
											1000 - ratio + market.marketData.minCollateralizationRatio
									  }%`
									: ""}
							</h1>
							<div className="no-transition">
								<label htmlFor="" className="text-sm text-darkGrey">
									Collatreral ratio
								</label>
								<Slider
									onChange={v => {
										setRatio(typeof v === "number" ? v : v[0]);
									}}
									min={market.marketData.minCollateralizationRatio}
									max={1000}
									value={ratio}
								/>
							</div>
						</div>
						<div className="space-y-3 mt-3">
							<h2 className="text-darkGrey text-base">Output</h2>
							<div className="flex items-center justify-between">
								<span className="text-sm">Collateral</span>
								<span className="flex items-center justify-between space-x-2 font-semibold">
									<Image
										width={18}
										height={18}
										src={collateral?.marketLogo ?? ""}
										alt={collateral?.marketName ?? ""}
									/>
									<span className="">{collateral?.marketSymbol}</span>
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Debt</span>
								<span className="flex items-center space-x-2 font-semibold">
									<Image
										width={18}
										height={18}
										src={debt?.marketLogo ?? ""}
										alt={debt?.marketName ?? ""}
									/>
									<span className="">{debt?.marketSymbol}</span>
								</span>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg">
						<div className="flex justify-between items-center">
							<div className="flex space-x-2 items-center">
								<Info />
								<span>
									1{debt?.marketSymbol} ={" "}
									{tokenValue?.getTokenValue.toPrecision(6) ?? 0}{" "}
									{collateral?.marketSymbol} ($
									{(
										(tokenValue?.getTokenValue ?? 0) *
											tokenValue?.getTokenUSDValue ?? 0
									).toPrecision(6)}
									)
								</span>
							</div>

							<div className="flex space-x-2 items-center">
								<GasPump />
								<span>$0.28</span>
								{liquidation && <Dropdown onClick={() => setShow(!show)} />}
							</div>
						</div>
						<div
							className={`${
								show ? "h-min space-y-2 mt-3" : "h-0"
							} overflow-y-hidden`}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Expected output</h3>
								<h3> {debt?.marketSymbol ?? ""}</h3>
							</div>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Price impact</h3>
								<h3>
									{liquidation?.swapQuote.priceImpact > 0.00001
										? liquidation?.swapQuote.priceImpact.toPrecision(8) ?? 0
										: 0}
									%
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
								<p>{(liquidation?.fee / 1000000) * 100 ?? 0}</p>
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
