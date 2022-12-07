/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useMemo, useState } from "react";
import { prepareSendTransaction, sendTransaction } from "@wagmi/core";

import useData from "@hooks/useData";
import { Liquidate } from "./liquidate";
import Modal from "@components/common/Modal";
import Button from "@components/common/button";
import Spinner from "@components/common/Spinner";
import { getLendingProtocolLiquidateTx } from "src/queries";
import { useProtocols, useUserData } from "src/hooks/useQueries";
import { LendingMarketUser, LiquidationQuote } from "src/schema";
import {
	Dropdown,
	Filter,
	Info,
	Send,
	Sortable,
	Starlay,
	Wallet
} from "@icons";

const data = Array(10).fill(10);

export default function Assets() {
	const {
		data: { activeChain, activeProtocol, activeVersion }
	} = useData();
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(false);
	const [show, setShow] = useState(false);
	const [shown, setShown] = useState(false);
	const { data, isLoading } = useUserData();
	const { data: protocols } = useProtocols();
	const { isConnected, address } = useAccount();
	const [asset, setAsset] = useState<LendingMarketUser>();
	const hasNoAsset = useMemo(
		() =>
			data &&
			data?.getLendingProtocolUserData?.totalSuppliedUSD === 0 &&
			data?.getLendingProtocolUserData?.totalBorrowedUSD === 0,
		[data]
	);
	const {
		url = "",
		name = "",
		logo = "",
		versions = []
	} = protocols[activeProtocol];

	const defaultCollateral = useMemo(() => {
		if (data) {
			const vals = data.getLendingProtocolUserData.markets.map(
				m => m.amountSupplied
			);
			const max = Math.max(...vals);
			return (
				data.getLendingProtocolUserData.markets.find(
					m => m.amountSupplied === max
				) ?? data.getLendingProtocolUserData.markets[0]
			);
		}
	}, [data]);

	const getLiquidateTx = (liquidationQuote: LiquidationQuote) => {
		setView(true);
		setOpen(false);
		getLendingProtocolLiquidateTx({
			user: address,
			protocol: name,
			liquidationQuote,
			version: versions[activeVersion].name,
			chainId: versions[activeVersion].chains[activeChain].id
		})
			.then(async d => {
				let x = 0;
				for (let tx in d.getLendingProtocolLiquidateTx) {
					const config = await prepareSendTransaction({
						request: {
							to: d.getLendingProtocolLiquidateTx[tx].to,
							data: d.getLendingProtocolLiquidateTx[tx].data,
							from: d.getLendingProtocolLiquidateTx[tx].from,
							chainId: versions[activeVersion].chains[activeChain].id
						},
						chainId: versions[activeVersion].chains[activeChain].id
					});

					const result = await sendTransaction(config);
					const receipt = await result.wait();
				}

				setView(false);
				setShow(true);
			})
			.catch(e => {
				console.log(e);
				setView(false);
			});
	};

	const selectAsset = useCallback((asset: LendingMarketUser) => {
		if (asset.amountBorrowed === 0 && asset.amountSupplied === 0) {
			setShown(true);
			return;
		}
		setOpen(true);
		setAsset(asset);
	}, []);

	return (
		<div className="bg-navy p-4 md:p-10 rounded-xl">
			{isConnected ? (
				hasNoAsset ? (
					<div className="text-center space-y-5 py-24">
						<Image width={90} height={90} src={logo} alt={name} />
						<h2 className="font-semibold text-4xl">No debt</h2>
						<p className="mb-14 text-2xl text-grey">
							You have not borrowed from {name} yet, Kindly do so to access this
							page.
						</p>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-auto block w-max"
						>
							<Button variant="secodary">Go to {name}</Button>
						</a>
					</div>
				) : (
					<div className="space-y-3 md:space-y-6">
						<div className="text-darkGrey">
							<ul className="md:px-8 grid grid-cols-4 md:grid-cols-6 items-center text-xs md:text-base">
								<li className="col-span-2">Asset</li>
								<li className="col-span-1 md:col-span-2 flex space-x-3">
									<span>Total supplied</span>
									<Sortable className="hidden md:block" />
								</li>
								<li className="col-span-1 md:col-span-2 flex items-center justify-between">
									<div className="flex space-x-3">
										<span className="">Total borrowed</span>
										<Sortable className="hidden md:block" />
									</div>
									<div className="block md:hidden">
										<Filter />
									</div>
									<div className="bg-primary text-sm px-3 py-2 space-x-7 rounded md:flex items-center justify-between hidden">
										<span>Filter</span>
										<Dropdown />
									</div>
								</li>
							</ul>
						</div>
						{isLoading && (
							<div className="grid place-items-center py-10">
								<Spinner size={4} />
							</div>
						)}
						{data && data.getLendingProtocolUserData.markets
							? data.getLendingProtocolUserData.markets.map((m, i) => (
									<Asset key={i} setOpen={selectAsset} market={m} />
							  ))
							: !isLoading && (
									<div className="text-center space-y-5 py-24">
										<p className="mb-14 text-2xl text-grey">No assets found</p>
									</div>
							  )}
					</div>
				)
			) : (
				<div className="text-center space-y-5 py-24">
					<Wallet className="mx-auto" />
					<h2 className="font-semibold text-4xl">No wallet found</h2>
					<p className="mb-14 text-2xl text-grey">
						Please connect your wallet to see supplies and borrowings
					</p>
					<span className="mx-auto block w-max">
						<ConnectButton />
					</span>
				</div>
			)}
			<Modal open={shown} setOpen={setShown} type="dark">
				<NoAsset protocolURL={url} />
			</Modal>
			<Modal open={view} setOpen={setView} type="dark">
				<Confirmation />
			</Modal>
			<Modal open={show} setOpen={setShow} type="dark">
				<Submitted />
			</Modal>
			<Modal open={open} setOpen={setOpen}>
				<Liquidate
					asset={asset}
					getTx={getLiquidateTx}
					collateral={defaultCollateral}
					key={`${asset?.marketSymbol ?? "NOASSET"}-${open}`}
				/>
			</Modal>
		</div>
	);
}

type AssetProps = {
	market: LendingMarketUser;
	setOpen: (v: LendingMarketUser) => void;
};

const Asset = ({ market, setOpen }: AssetProps) => {
	return (
		<div
			className="border border-darkGrey rounded-lg p-2 md:px-8 md:py-3 cursor-pointer grid grid-cols-4 md:grid-cols-3"
			onClick={() => setOpen(market)}
		>
			<div className="flex space-x-2 items-center col-span-2 md:col-span-1 flex-grow">
				<img
					className="w-4 h-4 md:w-8 md:h-8"
					src={market.marketLogo ?? ""}
					alt={market.marketName ?? ""}
				/>
				<div className="space-y-1">
					<span className="text-xs md:text-[18px] block whitespace-nowrap truncate">
						{market.marketName}
					</span>
					<span className="text-[10px] md:text-sm text-grey block">
						{market.marketSymbol}
					</span>
				</div>
			</div>
			<div className="space-y-1 flex-shrink">
				<span className="text-xs md:text-[18px] block">
					{market.amountSupplied.toPrecision(7)}
				</span>
				<span className="text-[10px] md:text-sm text-grey block">
					${market.amountSuppliedUSD.toPrecision(7)}
				</span>
			</div>
			<div className="space-y-1 flex-shrink">
				<span className="text-xs md:text-[18px] block">
					{market.amountBorrowed.toPrecision(7)}
				</span>
				<span className="text-[10px] md:text-sm text-grey block">
					${market.amountBorrowedUSD.toPrecision(7)}
				</span>
			</div>
		</div>
	);
};

const Confirmation = () => {
	return (
		<div className="text-center">
			<Spinner size={4} className="mx-auto mt-3" />
			<h3 className="text-[18px] my-5">Waiting for confirmation</h3>
			<p className="text-grey">
				Paying <span className="text-white">1BTC</span> out of{" "}
				<span className="text-white">2BTC</span> debt, using ETH collateral.
			</p>
			<p className="text-grey">Service charge of 1% included</p>
			<div className="flex justify-center items-center space-x-2 mt-6">
				<Info />
				<p className="text-grey">Confirm this transaction in your wallet</p>
			</div>
		</div>
	);
};

const Submitted = () => {
	return (
		<div className="text-center">
			<Send className="mx-auto mt-3" />
			<h3 className="text-[18px] my-5">Transaction submitted</h3>
			<p className="text-grey">
				Click dashboard button below to perform another transaction or return
				home.
			</p>

			<div className="flex justify-center items-center space-x-2 mt-6">
				<Link passHref href={"/"}>
					<a className="px-8 py-4 text-blue">Go home</a>
				</Link>
				<Button>Dashboard</Button>
			</div>
		</div>
	);
};

const NoAsset = ({ protocolURL }) => {
	return (
		<div className="text-center">
			<Starlay className="mx-auto mt-3" />
			<h3 className="text-[18px] my-5">
				Yet to lend the asset on this protocol.
			</h3>
			<p className="text-grey">
				Visit starlay to make your first borrow of this asset.
			</p>

			<div className="flex justify-center items-center space-x-2 mt-6">
				<a
					href={protocolURL}
					target="_blank"
					rel="noopener noreferrer"
					className="mx-auto block w-max"
				>
					<Button>Go to starlay</Button>
				</a>
			</div>
		</div>
	);
};
