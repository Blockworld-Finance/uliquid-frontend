import Button from "@components/common/button";
import Modal from "@components/common/Modal";
import Spinner from "@components/common/Spinner";
import { BNB, Dropdown, Info, Send, Sortable, Starlay } from "@icons";
import Link from "next/link";
import { useState } from "react";
import { Liquidate } from "./liquidate";

const data = Array(10).fill(10);

export default function Assets() {
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(false);
	const [show, setShow] = useState(false);
	const [shown, setShown] = useState(false);

	return (
		<div className="bg-navy p-10 rounded-xl">
			<div className="space-y-6">
				<div className="text-darkGrey">
					<ul className="px-8 grid grid-cols-6 items-center">
						<li className="col-span-2">Asset</li>
						<li className="col-span-2 flex space-x-3">
							<span>Total supplied</span>
							<Sortable />
						</li>
						<li className="col-span-2 flex items-center justify-between">
							<div className="flex space-x-3">
								<span className="whitespace-nowrap">Total borrowed</span>
								<Sortable />
							</div>
							<div className="bg-primary text-sm px-3 py-2 space-x-7 rounded flex items-center justify-between">
								<span>Filter</span>
								<Dropdown />
							</div>
						</li>
					</ul>
				</div>
				{data.map((_x, i) => (
					<Asset key={i} setOpen={() => setOpen(true)} />
				))}
			</div>
			<Modal open={open} setOpen={setOpen}>
				<Liquidate />
			</Modal>
			<Modal open={view} setOpen={setView} type="dark">
				<Confirmation />
			</Modal>
			<Modal open={show} setOpen={setShow} type="dark">
				<Submitted />
			</Modal>
			<Modal open={shown} setOpen={setShown} type="dark">
				<NoAsset />
			</Modal>
		</div>
	);
}

const Asset = ({ setOpen }) => {
	return (
		<div
			className="border border-darkGrey rounded-lg px-8 py-3 cursor-pointer grid grid-cols-3"
			onClick={setOpen}
		>
			<div className="flex space-x-2 items-center col-span-1">
				<BNB />
				<div className="space-y-1">
					<span className="text-[18px] block">Binance USD</span>
					<span className="text-sm text-grey block">BUSD</span>
				</div>
			</div>
			<div className=" space-y-1">
				<span className="text-[18px] block">$29.03m</span>
				<span className="text-sm text-grey block">$28.92m</span>
			</div>
			<div className=" space-y-1">
				<span className="text-[18px] block">$29.03m</span>
				<span className="text-sm text-grey block">$28.92m</span>
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
				Click dashboard button below to perform another transaction or return home.
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

const NoAsset = () => {
	return (
		<div className="text-center">
			<Starlay className="mx-auto mt-3" />
			<h3 className="text-[18px] my-5">Yet to lend the asset on this protocol.</h3>
			<p className="text-grey">Visit starlay to make your first borrow of this asset.</p>

			<div className="flex justify-center items-center space-x-2 mt-6">
				<Button>Go to starlay</Button>
			</div>
		</div>
	);
};
