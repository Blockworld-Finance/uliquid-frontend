import { DetailedHTMLProps, InputHTMLAttributes, useState, LegacyRef } from "react";

type Props = {
	label?: string;
	helptext?: string;
	inputClassName?: string;
	activeInput?: boolean;
	LeadingIcon?: () => JSX.Element;
	TrailingIcon?: () => JSX.Element;
	innerRef?: LegacyRef<HTMLInputElement>;
	variant?: "normal" | "success" | "error";
};

const variants = {
	error: "border-accents-sunglow text-accents-sunglow",
	normal: "border-grey-platinum text-grey-granite",
	success: "border-green text-green",
};

export default function Input(
	props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & Props
) {
	const {
		id,
		label,
		disabled,
		readOnly,
		helptext,
		innerRef,
		className,
		LeadingIcon,
		TrailingIcon,
		defaultValue = "",
		variant = "normal",
		inputClassName = "",
		activeInput = false,
		...rest
	} = props;

	return (
		<div className={`${className}`}>
			{label && (
				<label className={``} htmlFor={id}>
					{label}
				</label>
			)}
			<div
				className={`border rounded-lg
        ${inputClassName}
        ${variants[variant]}
				border border-navy px-4 flex items-center space-x-4
        `}
			>
				{LeadingIcon && (
					<span>
						<LeadingIcon />
					</span>
				)}
				<div className="flex items-center">
					<input
						{...rest}
						ref={innerRef}
						defaultValue={defaultValue}
						className={`
            text-base relative flex-grow 
            min-w-64 w-full h-14 bg-transparent
            outline-none 
            ${disabled && "pointer-events-none"}
          `}
					/>
				</div>
				{TrailingIcon && (
					<span>
						<TrailingIcon />
					</span>
				)}
			</div>
			{helptext && <small className={`text-xs my-2 ${variants[variant]}`}>{helptext}</small>}
		</div>
	);
}
