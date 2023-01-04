import { AnyObject } from "@types";

export const navigate = (params: AnyObject) => {
	const keys = Object.keys(params);
	let query = "";
	keys.forEach(k => {
		query += `${k}=${params[k]}&`;
	});
	if (window)
		window.history.pushState({ ...params }, "", `${window.location.href}`);
};

export const formatNumber = (
	num: number,
	decimalPlaces: number = 4,
	rounding: "toFixed" | "toPrecision" = "toFixed"
) => {
	// console.log(num);

	if (typeof num !== "number") return 0;
	return Number(num[rounding](decimalPlaces)).toLocaleString("en-UK", {
		minimumFractionDigits: decimalPlaces
	});
};
