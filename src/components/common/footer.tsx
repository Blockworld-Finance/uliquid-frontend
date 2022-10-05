import Image from "next/image";
import { Discord, Github, Twitter } from "@icons";

export default function Footer() {
	return (
		<footer className="bg-navy h-80 flex justify-center">
			<div className="flex items-center justify-between w-full max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={185} height={108} />
				<ul className="flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
					<li>Home</li>
					<li>Dashboard</li>
					<li>Docs</li>
					<li>FAQs</li>
					<li>Privacy policy</li>
				</ul>
				<div className="flex items-center space-x-4">
					<Twitter />
					<Github />
					<Discord />
				</div>
			</div>
		</footer>
	);
}
