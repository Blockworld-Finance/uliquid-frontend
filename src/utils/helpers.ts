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
