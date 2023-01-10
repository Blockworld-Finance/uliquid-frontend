/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { toast } from "react-toastify";
import { useRef, useMemo, useState, useEffect } from "react";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";

import {
	useProtocols,
	useTokenBalance,
	useLeverageQuote,
	useTokenUSDValues,
	useProtocolMarkets,
	useNativeTokenUSDValue
} from "@hooks/useQueries";
import Alert from "@components/common/alert";
import Button from "@components/common/button";
import Slider from "@components/common/slider";
import { useNavData } from "@hooks/useNavData";
import Spinner from "@components/common/Spinner";
import { formatNumber } from "src/utils/helpers";
import { ClickOutside } from "@hooks/useClickOutside";
import { Dropdown, GasPump, Help, Info } from "@icons";
import { AssetPicker } from "@components/common/asset-picker";
import { LendingMarketUser, LeverageQuoteInput } from "@schema";

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
	const { chain } = useNetwork();
	const { data } = useProtocols();
	const [view, setView] = useState(false);
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [gasPrice, setGasPrice] = useState(0);
	const { data: balance } = useTokenBalance();
	const [slippage, setSlippage] = useState(2.0);
	const [debt, setDebt] = useState(initialDebt);
	const inputRef = useRef<HTMLInputElement>(null);
	const { chains, switchNetwork } = useSwitchNetwork();
	const [isInputValid, setInputValid] = useState(false);
	const { data: usdValue, isLoading: nativeTokenLoading } =
		useNativeTokenUSDValue();
	const [isConfirming, setIsConfirming] = useState(false);
	const [collateral, setCollateral] = useState(initialCollateral);
	const { activeChain, activeProtocol, activeVersion } = useNavData();
	const { name, logo, versions = [] } = data[activeProtocol];
	const { data: fees, isLoading: feeLoading } = useFeeData({
		chainId: versions[activeVersion].chains[activeChain].id
	});
	const [changeSlippage, setChangeSlippage] = useState(false);
	const [amount, setAmount] = useState<number>();
	const { data: markets, isLoading: marketLoading } = useProtocolMarkets(name, {
		version: versions[activeVersion].name,
		chainId: versions[activeVersion].chains[activeChain].id
	});

	const market = useMemo(() => {
		const m = markets[collateral.marketAddress];

		return {
			marketData: m,
			redThreshold: Math.ceil(
				m.minCollateralizationRatio / 2 + m.minCollateralizationRatio
			),
			orangeThreshold: Math.ceil(
				m.minCollateralizationRatio * 2 + m.minCollateralizationRatio
			)
		};
	}, [markets, collateral]);

	const [ratio, setRatio] = useState<number>(
		market.marketData.minCollateralizationRatio ?? 125
	);

	const { data: tokenValue, isLoading: tokenLoading } = useTokenUSDValues({
		token: collateral?.marketAddress,
		quoteToken: debt?.marketAddress,
		getTokenUsdValueToken2: debt?.marketAddress,
		chainId: versions[activeVersion].chains[activeChain].id,
		getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
	});

	const { data: dbttokenValue, isLoading: dbttokenLoading } = useTokenUSDValues(
		{
			token: debt?.marketAddress,
			quoteToken: collateral?.marketAddress,
			getTokenUsdValueToken2: collateral?.marketAddress,
			chainId: versions[activeVersion].chains[activeChain].id,
			getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
		}
	);

	const preparing =
		tokenLoading ||
		nativeTokenLoading ||
		feeLoading ||
		marketLoading ||
		dbttokenLoading;

	const {
		isLoading,
		isRefetching,
		data: leverage
	} = useLeverageQuote(
		{
			slippage,
			debtAddress: debt?.marketAddress,
			initialCollateralAmount: amount ?? 0,
			collateralAddress: collateral.marketAddress,
			collateralizationRatio:
				((1000 - ratio + market.marketData.minCollateralizationRatio) / 100) *
				1000000
		},
		(d: LeverageQuoteInput) => {
			const amount = Number(inputRef.current?.value ?? 0) ?? 0;
			setGasPrice(
				(Number(fees?.gasPrice._hex) *
					(500000 * d.loops) *
					usdValue.getTokenUSDValue) /
					10 ** 18
			);
			setInputValid(
				amount &&
					amount <= balance[collateral.marketAddress] &&
					debt.marketAddress !== collateral.marketAddress
			);
		}
	);

	const color = useMemo(() => {
		if (leverage?.estimatedHealthFactor < 1.09) return "#EB5757";
		if (leverage?.estimatedHealthFactor < 1.9) return "#F7931A";
		return "#32C1CC";
	}, [leverage?.estimatedHealthFactor]);

	useEffect(() => {
		if (market.marketData.minCollateralizationRatio) {
			setRatio(market.marketData.minCollateralizationRatio);
		}
	}, [market.marketData]);

	return preparing ? (
		<div className="my-8 flex justify-center items-center">
			<Spinner size={3} />
		</div>
	) : (
		<>
			<div className="max-h-[60vh] overflow-y-scroll overscroll-y-contain mt-4 text-xs md:text-base">
				<div className="flex space-x-4 md:space-x-10">
					<div className="space-y-2">
						<small className="text-tiny md:text-sm text-darkGrey">
							Protocol
						</small>
						<div className="flex space-x-2 items-center">
							<Image src={logo} alt={name} width={24} height={24} />
							<span>{name}</span>
						</div>
					</div>
					<div className="space-y-2">
						<small className="text-tiny md:text-sm text-darkGrey">
							Blockchain
						</small>
						<div className="flex space-x-2 items-center">
							<Image
								width={24}
								height={24}
								src={versions[activeVersion].chains[activeChain]?.logo ?? ""}
								alt={versions[activeVersion].chains[activeChain]?.name ?? ""}
							/>
							<p>{versions[activeVersion].chains[activeChain]?.name ?? ""}</p>
							{versions && versions.length ? (
								<div className="bg-primary text-blue text-tiny md:text-xs px-5 py-1 rounded">
									{versions[activeVersion].name}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
					{leverage && (
						<div className="space-y-2">
							<small className="text-tiny md:text-sm text-darkGrey">
								Est. Health Factor
							</small>
							<div className="flex space-x-2 items-center">
								<p style={{ color }}>
									{leverage.estimatedHealthFactor.toFixed(2) ?? 0}
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="space-y-2 my-4">
					{collateral.marketAddress === debt.marketAddress && (
						<Alert
							message={<>You can&quot;t incur a debt of the same token</>}
						/>
					)}
					{market.marketData?.[collateral.marketAddress]
						?.minCollateralizationRatio === 0 && (
						<Alert
							message={
								<>Leverage with this token has been disabled by {name}</>
							}
						/>
					)}
					{chain?.id !== versions[activeVersion].chains[activeChain].id && (
						<Alert
							message={
								<>
									Please switch to{" "}
									{versions[activeVersion].chains[activeChain].name}.{" "}
									<span
										className="underline cursor-pointer"
										onClick={() => {
											const newChain = chains.find(
												c =>
													c.id ===
													versions[activeVersion].chains[activeChain].id
											);

											console.log(newChain);

											if (newChain) {
												switchNetwork(newChain.id);
											} else {
												toast.error("This chain is currently not supported");
											}
										}}
									>
										Switch network
									</span>
								</>
							}
						/>
					)}
					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-tiny md:text-sm text-darkGrey">
							Leverage token
						</small>
						<div className="grid gap-2 grid-cols-12 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-7">
								<input
									step={0.01}
									type="number"
									ref={inputRef}
									value={amount}
									pattern="[0-9]*"
									inputMode="numeric"
									onChange={e => setAmount(Number(e.target.value))}
									onKeyDown={evt => {
										let charCode = evt.which ? evt.which : evt.keyCode;
										if (charCode > 31 && (charCode < 48 || charCode > 57))
											return false;
										return true;
									}}
									className="w-full text-xs md:text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-tiny md:text-sm text-grey">
									$
									{(
										dbttokenValue?.getTokenUSDValue *
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
										<img
											className="w-6 md:w-8 h-6 md:h-8"
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
												select={c => {
													setCollateral(c);
												}}
												close={() => setView(false)}
											/>
										</ClickOutside>
									</div>
								</div>
								<small className="text-tiny md:text-sm text-grey flex items-center justify-between">
									<span>
										Bal ={" "}
										{formatNumber(balance?.[collateral.marketAddress], 6) ?? 0}
									</span>
									<span
										className="px-1 py-[2px] bg-[#008DE4] rounded-full text-white cursor-pointer"
										onClick={() => {
											setAmount(balance?.[collateral.marketAddress] ?? 0);
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
										<img
											className="w-6 md:w-8 h-6 md:h-8"
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
								{ratio !== undefined
									? `${
											1000 - ratio + market.marketData.minCollateralizationRatio
									  }%`
									: ""}
							</h1>
							<div className="no-transition">
								<label htmlFor="" className="text-sm text-darkGrey">
									Collateral ratio
								</label>
								<Slider
									max={1000}
									color={color}
									value={ratio}
									onChange={v => {
										setRatio(typeof v === "number" ? v : v[0]);
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
									1{collateral?.marketSymbol} ={" "}
									{tokenValue?.getTokenValue.toPrecision(6) ?? 0}{" "}
									{debt?.marketSymbol} ($
									{(
										(tokenValue?.getTokenValue ?? 0) *
											tokenValue?.getTokenUSDValue ?? 0
									).toPrecision(6)}{" "}
									)
								</span>
							</div>

							<div className="flex space-x-2 items-center">
								<GasPump />
								<span>${gasPrice.toFixed(4)}</span>
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
								<h3
									className={`${
										leverage?.swapQuote?.priceImpact < -5 ? "text-red-500" : ""
									}`}
								>
									{leverage?.swapQuote?.priceImpact?.toFixed(2) ?? 0}%
								</h3>
							</div>
							<div className="flex justify-between items-center text-grey">
								<div>
									<p>Maximum debt incurred after slippage</p>
									{changeSlippage ? (
										<ClickOutside
											className="space-x-2"
											onclickoutside={() => setChangeSlippage(false)}
										>
											<Button
												size="default"
												onClick={() => {
													setSlippage(1.0);
													setChangeSlippage(false);
												}}
												className="rounded-full !text-xs !leading-3 !py-2 h-auto"
											>
												Auto
											</Button>
											<input
												max={50}
												min={0.1}
												step={0.5}
												type={"number"}
												inputMode={"numeric"}
												style={{
													appearance: "textfield"
												}}
												defaultValue={slippage}
												onChange={e => {
													setSlippage(Number(e.target.value));
													// getLeverage(ratio, Number(e.target.value), false);
												}}
												className="text-xs text-right text-white rounded-full border border-darkGrey p-1 bg-transparent"
											/>
										</ClickOutside>
									) : (
										<div className="space-x-2">
											<span>({slippage}%)</span>
											<Button
												size="default"
												onClick={() => {
													setChangeSlippage(!changeSlippage);
												}}
												className="rounded-full !text-xs !leading-3 !py-2 h-auto"
											>
												Change
											</Button>
										</div>
									)}
								</div>
								<p>
									{(leverage?.leveragedDebtAmount ?? 0) +
										((leverage?.leveragedDebtAmount ?? 0) *
											(leverage?.slippage ?? 0)) /
											10 ** 6}
								</p>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Network fee</p>
								<p>${gasPrice.toFixed(4)}</p>
							</div>
						</div>
					</div>
					{leverage?.swapQuote?.priceImpact < -5 && (
						<Alert
							type="warning"
							message={
								<div className="flex justify-between items-center">
									<span>Price impact warning: </span>
									<span>
										{leverage?.swapQuote?.priceImpact?.toFixed(2) ?? 0}%
									</span>
								</div>
							}
						/>
					)}
				</div>
			</div>
			<Button
				size="large"
				loading={isLoading || isRefetching}
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
							leveraging {leverage?.initialCollateralAmount}{" "}
							{collateral.marketSymbol} for
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
