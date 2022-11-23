import {
	AllAssets,
	LendingProtocol,
	Liquidate,
	Protocol,
	Protocols,
	Asset,
	Assets,
	Boom
} from "@icons";
import { init } from "aos";
import Link from "next/link";
import { useEffect } from "react";

import Button from "../common/button";

export default function Hero() {
	return (
		<div className="h-[80vh] min-h-[772px] flex items-center">
			<div className="max-w-2xl w-full space-y-8">
				<div className="text-6xl space-y-3">
					<h1 className="text-blue">Be in-charge</h1>
					<h1>
						Manage your{" "}
						<span className="underline underline-offset-8 decoration-2 decoration-blue">
							Debts
						</span>{" "}
						&amp;{" "}
						<span className="underline underline-offset-8 decoration-2 decoration-blue">
							Collaterals
						</span>
						.
					</h1>
				</div>
				<p className="text-grey text-2xl">
					Avoid loosing a portion of your collateral when it falls in value,
					perform the liquidation of your assets yourself.
				</p>
				<Link href={"/dashboard"}>
					<Button>Get started</Button>
				</Link>
			</div>
			<LeftImage />
		</div>
	);
}

const LeftImage = () => {
	useEffect(() => {
		init({
			duration: 1200,
			easing: "ease-in-out-back"
		});
	});
	return (
		<div className="max-w-2xl max-h-[244px] w-full h-full relative flex items-center justify-center">
			<LendingProtocol
				className="absolute -top-44 left-4 z-10 "
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Protocol
				className="absolute left-32 -top-48"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Protocols
				className="absolute -top-40 left-64 z-10 "
				data-aos="fade-up"
				data-aos-anchor-placement="center-center"
			/>
			<Protocol className="invisible" />
			<AllAssets
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Assets
				className="absolute z-20 -left-16 -top-8"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Asset
				className="absolute z-20 -right-4 -top-8"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Liquidate
				className="absolute -bottom-40 z-20 right-0"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
			<Boom
				className="absolute -bottom-32 z-20 right-60"
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
			/>
		</div>
	);
};
