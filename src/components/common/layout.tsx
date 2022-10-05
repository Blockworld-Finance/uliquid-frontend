import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			<main className="bg-primary min-h-screen pattern max-w-[1440px] mx-auto">
				<Header />
				<section className="max-w-[1240px] mx-auto">{children}</section>
			</main>
			<Footer />
		</>
	);
}
