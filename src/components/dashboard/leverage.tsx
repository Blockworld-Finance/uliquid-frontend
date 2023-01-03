import Image from "next/image";
import { useAccount, useFeeData } from "wagmi";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import useProtocolMarkets, {
	useProtocols,
	useTokenBalance
} from "@hooks/useQueries";
import useData from "@hooks/useData";
import Button from "@components/common/button";
import Slider from "@components/common/slider";
import { ClickOutside } from "@hooks/useClickOutside";
import { Dropdown, GasPump, Help, Info } from "@icons";
import { AssetPicker } from "@components/common/asset-picker";
import { LendingMarketUser, LeverageQuoteInput } from "@schema";
import { getLeverageQuote, getTokenUSDValue } from "src/queries";

type Props = {
	debt?: LendingMarketUser;
	collateral?: LendingMarketUser;
	getTx: (l: LeverageQuoteInput, _x: any) => void;
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
	const { address } = useAccount();
	const [view, setView] = useState(false);
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [gasPrice, setGasPrice] = useState(0);
	const { data: balance } = useTokenBalance();
	let control = useRef(new AbortController());
	const [debt, setDebt] = useState(initialDebt);
	const inputRef = useRef<HTMLInputElement>(null);
	const [tokenValue, setTokenValue] = useState<{
		getTokenUSDValue: number;
		getTokenValue: number;
	}>();
	const [isInputValid, setInputValid] = useState(false);
	const { data: fees, isError, isLoading } = useFeeData();
	const [isConfirming, setIsConfirming] = useState(false);
	const { name, logo, versions = [] } = data[activeProtocol];
	const [leverage, setLeverage] = useState<LeverageQuoteInput>();
	const [collateral, setCollateral] = useState(initialCollateral);
	const { data: markets } = useProtocolMarkets(name, {
		version: versions[activeVersion].name,
		chainId: versions[activeVersion].chains[activeChain].id
	});

	const [color, setColor] = useState();

	console.log(data[activeProtocol].versions[activeVersion].chains[activeChain]);

	const market = useMemo(() => {
		const m =
			markets?.getLendingProtocolMarkets.find(
				m => (m.name = debt.marketName)
			) ?? ({} as any);

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
	const [ratio, setRatio] = useState<number>(
		market.marketData.minCollateralizationRatio ?? 125
	);

	const getLeverage = useCallback(
		(ratio: number) => {
			control.current.abort();
			setShow(false);
			setIsConfirming(false);
			const amount = Number(inputRef.current?.value ?? 0) ?? 0;
			control.current = new AbortController();
			getLeverageQuote({
				user: address,
				protocol: name,
				debt: debt.marketAddress,
				slippage: (2 / 100) * 1000000,
				signal: control.current.signal,
				collateral: collateral.marketAddress,
				version: versions[activeVersion].name,
				initialCollateralAmount: Number(inputRef.current?.value),
				collateralizationRatio:
					((1000 - ratio + market.marketData.minCollateralizationRatio) / 100) *
					1000000,
				chainId: versions[activeVersion].chains[activeChain].id
			})
				.then(d => {
					setLeverage(d);
					console.log(
						Number(fees?.gasPrice._hex),
						500000 * d.loops,
						tokenValue.getTokenUSDValue,
						(Number(fees?.gasPrice._hex) *
							(500000 * d.loops) *
							tokenValue.getTokenUSDValue) /
							10 ** 18
					);

					setGasPrice(
						(Number(fees?.gasPrice._hex) *
							(500000 * d.loops) *
							tokenValue.getTokenUSDValue) /
							10 ** 18
					);
					setInputValid(amount && amount <= balance[collateral.marketAddress]);
				})
				.catch(e => {});
		},
		[
			debt,
			name,
			address,
			balance,
			versions,
			collateral,
			activeChain,
			activeVersion,
			fees?.gasPrice,
			tokenValue?.getTokenUSDValue,
			market.marketData.minCollateralizationRatio
		]
	);

	useEffect(() => {
		if (debt && collateral)
			getTokenUSDValue({
				token: debt?.marketAddress,
				quoteToken: collateral?.marketAddress,
				getTokenUsdValueToken2: collateral?.marketAddress,
				chainId: versions[activeVersion].chains[activeChain].id,
				getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
			}).then(d => {
				setTokenValue(d);
			});
	}, [activeChain, activeVersion, debt, collateral, versions]);

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
					{leverage && (
						<div className="space-y-2">
							<small className="text-sm text-darkGrey">
								Est. Health Factor
							</small>
							<div className="flex space-x-2 items-center">
								<p className="text-blue">
									{leverage.estimatedHealthFactor.toFixed(2) ?? 0}
								</p>
							</div>
						</div>
					)}
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
									pattern="[0-9]*"
									inputMode="numeric"
									onChange={() => getLeverage(ratio)}
									defaultValue={balance?.[collateral.marketAddress] ?? 0}
									onKeyDown={evt => {
										let charCode = evt.which ? evt.which : evt.keyCode;
										if (charCode > 31 && (charCode < 48 || charCode > 57))
											return false;
										return true;
									}}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									$
									{(
										tokenValue?.getTokenUSDValue *
										Number(
											inputRef.current?.value ??
												balance?.[collateral.marketAddress] ??
												0
										)
									).toPrecision(6) ?? 0}
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
									<span>Bal = {balance?.[collateral.marketAddress] ?? 0}</span>
									<span
										className="px-1 py-[2px] bg-[#008DE4] rounded-full text-white cursor-pointer"
										onClick={() => {
											if (inputRef.current) {
												inputRef.current.value = `${
													balance?.[collateral.marketAddress] ?? 0
												}`;
												getLeverage(ratio);
											}
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
									max={1000}
									value={ratio}
									onChange={v => {
										setRatio(typeof v === "number" ? v : v[0]);
										getLeverage(typeof v === "number" ? v : v[0]);
									}}
									min={market.marketData.minCollateralizationRatio}
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
									<span className="">
										{leverage?.leveragedCollateralAmount.toPrecision(6)}{" "}
										{collateral?.marketSymbol}
									</span>
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
									<span className="">
										{leverage?.leveragedDebtAmount.toPrecision(6)}{" "}
										{debt?.marketSymbol}
									</span>
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
								<span>${gasPrice}</span>
								{leverage && <Dropdown onClick={() => setShow(!show)} />}
							</div>
						</div>
						<div
							className={`${
								show ? "h-min space-y-2 mt-3" : "h-0"
							} overflow-y-hidden`}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Price impact</h3>
								<h3>
									{leverage?.swapQuote.priceImpact > 0.00001
										? leverage?.swapQuote.priceImpact.toPrecision(8) ?? 0
										: 0}
									%
								</h3>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Maximum debt incurred after slippage (0.3%)</p>
								<p>
									{(leverage?.leveragedDebtAmount ?? 0) +
										((leverage?.leveragedDebtAmount ?? 0) *
											(leverage?.slippage ?? 0)) /
											10 ** 6}
								</p>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Network fee</p>
								<p>$0.28</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Button
				size="large"
				disabled={!isInputValid}
				className="w-full font-semibold"
				onClick={() => {
					if (!isConfirming) {
						setIsConfirming(true);
						setShow(true);
						return;
					}

					getTx(
						leverage,
						<p className="text-grey">
							leveraging {leverage?.initialCollateralAmount} collateral symbol
							for
							{leverage?.leveragedCollateralAmount} {collateral.marketSymbol}{" "}
							collateral and
							{leverage?.leveragedDebtAmount} {debt.marketSymbol} debt
						</p>
					);
				}}
			>
				{isConfirming ? "Confirm Leverage" : "Leverage"}
			</Button>
		</>
	);
}
