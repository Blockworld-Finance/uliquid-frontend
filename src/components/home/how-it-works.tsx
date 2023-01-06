/* eslint-disable @next/next/no-img-element */
import Button from "@components/common/button";
import { BitCoin, BNB, Solana } from "@icons";
import { TGuide } from "@types";
import Image from "next/image";
import Link from "next/link";
import { TGetGuideResponse } from "src/queries";

const HIWData = Array(4).fill(0);

type Props = {
	guide: TGetGuideResponse;
};

export default function HowItWorks({ guide }: Props) {
	return (
		<div className="flex flex-col md:flex-row md:space-x-36 my-10 md:my-36">
			<div className="max-w-lg space-y-4 md:space-y-10 flex-none">
				<p className="text-sm md:text-3xl text-grey md:leading-10">
					How it works
				</p>
				<h1 className="text-2xl md:text-6xl leading-tight">
					A quick guide on how Uliquid works.
				</h1>
				<Link href={"/dashboard"}>
					<Button className="hidden md:block">Get started</Button>
				</Link>
			</div>
			<div className="hiw my-10 md:my-0 grid grid-cols-2 gap-2 md:gap-16">
				{guide.getGuide.map((_d, index) => (
					<HowItWorksCard key={index} index={index} data={_d} />
				))}
			</div>
		</div>
	);
}

type HIWCProps = {
	data: TGuide;
	index: number;
};

function HowItWorksCard({ index, data }: HIWCProps) {
	return (
		<div
			className={`relative ${(index + 1) % 2 === 0 ? "top-14 md:top-20" : ""}`}
		>
			<div
				className={`bg-navy rounded-xl py-4 md:py-8 px-2 md:px-6 h-60 md:h-80`}
			>
				<h3 className="text-sm text-[18px]">{data.heading}</h3>
				<div className="bg-primary rounded-full flex items-center text-darkGrey p-2 mt-3 mb-6 w-min whitespace-nowrap space-x-2">
					{data.images.map((img, ind) => (
						<div
							key={ind}
							className={`flex items-center h-4 ${
								index === 2 ? "w-8 md:w-16" : "w-4 md:w-8"
							} md:h-8 space-x-2`}
						>
							<img className="w-4 h-4 md:w-8 md:h-8" src={img} alt={img} />
							{index === 2 && (
								<span className="text-xs">
									{ind === 0 && "1k"}
									{ind === 1 && "1.01k"}
								</span>
							)}
						</div>
					))}
					<span className="text-xs">
						{index === 0 && "and so on"}
						{index === 1 && "version 2"}
					</span>
				</div>
				<p className="text-grey text-xs md:text-base">{data.text}</p>
			</div>
			<div className="h-[1px] bg-darkGrey mt-3 md:mt-6">
				<div
					className="h-[1px] bg-blue"
					style={{
						width: `${25 * (index + 1)}%`
					}}
				></div>
			</div>
		</div>
	);
}
