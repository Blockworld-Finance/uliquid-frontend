import Image from "next/image";
import Button from "./button";

export default function Header() {
	return (
		<header className="p-4">
			<div className="flex items-center justify-between max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={120} height={56} />
				<ul className="flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
					<li>Home</li>
					<li>Dashboard</li>
					<li>Docs</li>
					<li>FAQs</li>
				</ul>
				<Button variant={"secodary"} size="default">
					Connect wallet
				</Button>
			</div>
		</header>
	);
}
