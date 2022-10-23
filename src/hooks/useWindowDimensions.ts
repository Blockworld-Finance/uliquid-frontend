import { maxMobileWidth } from "@utils/constants";
import { useState, useEffect } from "react";

export default function useWindowDimensions() {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [isMobile, setMobile] = useState(false);

	useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
			setMobile(window.innerWidth < maxMobileWidth);
		}

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return { width, height, isMobile };
}
