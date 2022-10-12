import { Close } from "@icons";
import { ReactNode } from "react";

type Props = {
	open: boolean;
	children: ReactNode;
	type?: "default" | "dark";
	setOpen: (_v: boolean) => void;
};

export default function Modal({ open, setOpen, children, type = "default" }: Props) {
	return (
		<>
			<div
				className={`${
					open ? "fixed" : "hidden"
				} w-screen h-screen top-0 left-0 bg-black bg-opacity-60`}
				onClick={() => setOpen(false)}
			/>
			<div
				className={`w-full ${
					type === "default" ? "bg-navy max-w-lg py-10" : "bg-primary py-6 max-w-md"
				} rounded-lg fixed ${
					open ? "top-1/2" : "-top-[150%]"
				} -translate-x-1/2 left-1/2 -translate-y-1/2  px-6`}
			>
				<div className="relative">
					<Close className="absolute top-0 right-0" onClick={() => setOpen(false)} />
					<div>{children}</div>
				</div>
			</div>
		</>
	);
}
