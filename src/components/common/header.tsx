import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
	return (
		<header className="p-4">
			<div className="flex items-center justify-between max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={120} height={56} />
				<ul className="menu flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
					<Link href={"/"}>
						<li>Home</li>
					</Link>
					<Link href={"/dashboard"}>
						<li>Dashboard</li>
					</Link>
					<li>Docs</li>
					<li>FAQs</li>
				</ul>
				<ConnectButton />
			</div>
		</header>
	);
}
