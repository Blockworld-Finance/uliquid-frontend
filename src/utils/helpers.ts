import { toast } from "react-toastify";

export const formatNumber = (
	num: number,
	decimalPlaces: number = 4,
	rounding: "toFixed" | "toPrecision" = "toFixed"
) => {
	if (typeof num !== "number") return 0;
	return Number(num[rounding](decimalPlaces)).toLocaleString("en-UK", {
		minimumFractionDigits: decimalPlaces
	});
};

function fallbackCopyTextToClipboard(text: string) {
	var textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.display = "none";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand("copy");
		var msg = successful ? "successful" : "unsuccessful";
		console.log("Fallback: Copying text command was " + msg);
		toast.success("Copied successfully");
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err);
	}

	document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}

	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Async: Copying to clipboard was successful!");
			toast.success("Copied successfully");
		},
		function (err) {
			console.error("Async: Could not copy text: ", err);
			fallbackCopyTextToClipboard(text);
		}
	);
}

export const removeSpecialChars = (str: string) => {
	return str.replace(/[^a-zA-Z0-9]/g, "-");
};
