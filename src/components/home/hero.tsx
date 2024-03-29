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
		<div className="md:h-[80vh] md:min-h-[772px] grid md:grid-cols-5 lg:grid-cols-2 gap-0 items-center">
			<div className="max-w-2xl w-full space-y-3 md:space-y-8 md:col-span-3 lg:col-span-1">
				<div
					data-aos="fade-up"
					data-aos-anchor-placement="center-bottom"
					className="text-2xl md:text-[42px] md:space-y-3 md:leading-tight lg:text-6xl lg:space-y-4"
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
					className="text-grey text-sm md:text-[18px] lg:text-2xl"
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
		<div className="max-w-2xl hidden md:col-span-2 lg:col-span-1 md:flex md:scale-75 lg:scale-100 max-h-[244px] w-full h-full relative items-center justify-center">
			<div
				data-aos="fade-right"
				className="absolute -top-44 left-4 z-10 "
				data-aos-anchor-placement="center-bottom"
			>
				<Image
					src={LendingProtocol}
					alt="boom"
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-up"
				data-aos-anchor-placement="center-bottom"
				className="absolute left-32 -top-48"
			>
				<Image
					src={Protocol}
					alt="boom"
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-left"
				className="absolute -top-40 left-64 z-10 "
				data-aos-anchor-placement="center-center"
			>
				<Image
					src={Protocols}
					alt="boom"
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-up"
				data-aos-delay="300"
				data-aos-anchor-placement="center-bottom"
				className="absolute  -translate-x-1/2 -translate-y-1/2 z-10"
			>
				<Image
					src={AllAssets}
					alt="boom"
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-right"
				data-aos-delay="300"
				className="absolute z-20 -left-16 -top-8"
				data-aos-anchor-placement="center-bottom"
			>
				<Image src={Assets} alt="boom" layout="intrinsic" placeholder="blur" />
			</div>
			<div
				data-aos="fade-left"
				data-aos-delay="300"
				className="absolute z-20 -right-4 -top-8"
				data-aos-anchor-placement="center-bottom"
			>
				<Image
					alt="boom"
					src={AssetsText}
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-up"
				data-aos-delay="600"
				data-aos-anchor-placement="center-bottom"
				className="absolute -bottom-40 z-20 right-0"
			>
				<Image
					src={LiquidateOverlay}
					alt="boom"
					layout="intrinsic"
					placeholder="blur"
				/>
			</div>
			<div
				data-aos="fade-right"
				data-aos-delay="600"
				data-aos-anchor-placement="center-bottom"
				className="absolute -bottom-32 z-20 right-60"
			>
				<Image src={Boom} alt="boom" layout="intrinsic" placeholder="blur" />
			</div>
		</div>
	);
};
