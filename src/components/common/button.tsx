import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Spinner from "./Spinner";

const variants = {
	default: "bg-blue",
	secodary: "bg-white"
};

const sizes = {
	default: "h-14",
	large: "h-20"
};

type Props = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	loading?: boolean;
	size?: keyof typeof sizes;
	variant?: keyof typeof variants;
	innerRef?: React.RefObject<HTMLButtonElement>;
};

export default function Button({
	children,
	disabled,
	innerRef,
	className = "",
	loading = false,
	type = "button",
	size = "default",
	variant = "default",
	...props
}: Props) {
	return (
		<>
			<button
				{...props}
				type={type}
				ref={innerRef}
				disabled={loading || disabled}
				className={`${variants[variant]} ${sizes[size]} ${className} rounded-md text-sm md:text-[18px] leading-6 py-3 px-4 text-primary`}
			>
				{loading ? <Spinner color="white" /> : children}
			</button>
		</>
	);
}
