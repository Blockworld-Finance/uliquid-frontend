import {
	useRef,
	useEffect,
	RefObject,
	HTMLAttributes,
	DetailedHTMLProps
} from "react";

export default function useClickOutside<
	T extends HTMLElement,
	p extends HTMLElement = HTMLElement
>(
	handler: (_e?: MouseEvent) => void,
	ref: RefObject<T>,
	parent?: RefObject<p>
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler(event);
			}
		}
		if (parent && parent.current) {
			parent.current.addEventListener("mousedown", handleClickOutside);
		} else {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			if (parent && parent.current) {
				parent.current.removeEventListener("mousedown", handleClickOutside);
			} else {
				document.removeEventListener("mousedown", handleClickOutside);
			}
		};
	}, [ref]);
}

export function ClickOutside(
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		onclickoutside: () => void;
		parent?: RefObject<HTMLElement>;
	}
) {
	const { children, onclickoutside, parent, ...rest } = props;
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(onclickoutside, ref, parent);
	return (
		<div {...rest} ref={ref}>
			{children}
		</div>
	);
}
