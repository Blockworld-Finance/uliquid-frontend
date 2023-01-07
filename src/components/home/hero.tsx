import {
	Boom,
	Assets,
	Protocol,
	Protocols,
	AllAssets,
	AssetsText,
	LendingProtocol,
	LiquidateOverlay
} from "@images";
import { init } from "aos";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import Button from "../common/button";

export default function Hero() {
	return (
		<div className="md:h-[80vh] md:min-h-[772px] flex items-center">
			<div className="max-w-2xl w-full space-y-3 md:space-y-8">
				<div
					data-aos="fade-up"
					data-aos-anchor-placement="center-bottom"
					className="text-2xl md:text-6xl md:space-y-3"
				>
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
				<p
					data-aos="fade-up"
					data-aos-delay="200"
					data-aos-anchor-placement="center-bottom"
					className="text-grey text-sm md:text-2xl"
				>
					Avoid loosing a portion of your collateral when it falls in value,
					perform the liquidation of your assets yourself.
				</p>
				<div
					data-aos="fade-up"
					data-aos-delay="400"
					data-aos-anchor-placement="center-bottom"
				>
					<Link href={"/dashboard"}>
						<Button>Get started</Button>
					</Link>
				</div>
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
		<div className="max-w-2xl hidden md:flex max-h-[244px] w-full h-full relative items-center justify-center">
			<div
				data-aos="fade-right"
				className="absolute -top-44 left-4 z-10 "
				data-aos-anchor-placement="center-bottom"
			>
				<Image src={LendingProtocol} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
				className="absolute left-32 -top-48"
			>
				<Image src={Protocol} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-left"
				className="absolute -top-40 left-64 z-10 "
				data-aos-anchor-placement="center-center"
			>
				<Image src={Protocols} alt="boom" layout="intrinsic" />
			</div>
			{/* <div className="invisible">
				<Protocol />
			</div> */}
			<div
				data-aos="fade-up"
				data-aos-delay="500"
				data-aos-anchor-placement="center-bottom"
				className="absolute  -translate-x-1/2 -translate-y-1/2 z-10"
			>
				<Image src={AllAssets} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-right"
				data-aos-delay="500"
				className="absolute z-20 -left-16 -top-8"
				data-aos-anchor-placement="center-bottom"
			>
				<Image src={Assets} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-left"
				data-aos-delay="500"
				className="absolute z-20 -right-4 -top-8"
				data-aos-anchor-placement="center-bottom"
			>
				<Image src={AssetsText} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-up"
				data-aos-delay="1000"
				data-aos-anchor-placement="center-bottom"
				className="absolute -bottom-40 z-20 right-0"
			>
				<Image src={LiquidateOverlay} alt="boom" layout="intrinsic" />
			</div>
			<div
				data-aos="fade-right"
				data-aos-delay="1000"
				data-aos-anchor-placement="center-bottom"
				className="absolute -bottom-32 z-20 right-60"
			>
				<Image src={Boom} alt="boom" layout="intrinsic" />
			</div>
		</div>
	);
};
