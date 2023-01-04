import { Component, createContext, ReactNode, useContext } from "react";
import { AppData } from "@types";
import { navigate } from "src/utils/helpers";

interface Props<T extends object> {
	init: T;
	children: ReactNode;
	storageListener?: boolean;
}

export interface ConnectDataProps<P> {
	data: P;
	dispatch: (_d: Partial<P> | "clear") => void;
}

const AppContext = createContext({ data: {}, dispatch: (_: any) => {} });

export class DataProvider<T extends object> extends Component<
	Props<T>,
	T & { isMounted: boolean }
> {
	init = this.props.init;

	constructor(props: any) {
		super(props);
		const { init } = this.props;

		this.init = init;
		this.state = { ...init, isMounted: false };
		this.dispatch = this.dispatch.bind(this);
		this.updateState = this.updateState.bind(this);
	}

	componentDidMount() {
		const { storageListener = false } = this.props;
		// this.setState({ ...this.getItem(), isMounted: true });
		this.setState({ ...this.state, isMounted: true });
		if (storageListener) {
			window.addEventListener("storage", () => {
				this.setState(this.getItem());
			});
		}

		if (true)
			window.addEventListener("popstate", event => {
				this.updateState(event.state);
			});
	}

	componentWillUnmount() {
		const { storageListener = false } = this.props;
		if (storageListener) {
			window.removeEventListener("storage", () => {
				this.setState(this.getItem());
			});
		}
	}

	getItem() {
		try {
			const data = localStorage.getItem("data");
			if (data) return JSON.parse(data);
			this.persist(this.init);
			return this.init;
		} catch (e) {
			return this.init;
		}
	}

	persist = (payload: T) => {
		try {
			if (localStorage) {
				localStorage.setItem("data", JSON.stringify(payload));
			}
		} catch (e) {
			return;
		}
	};

	updateState(data: Partial<T>) {
		this.setState(p => {
			navigate({ ...p, ...data });
			return { ...p, ...data };
		});
		// this.persist({ ...this.state, ...data });
	}

	dispatch(payload: Partial<T> | "clear") {
		if (payload === "clear") {
			this.updateState(this.init);
		} else {
			this.updateState(payload);
		}
	}

	render() {
		const { isMounted } = this.state;
		const { children } = this.props;
		return (
			<AppContext.Provider
				value={{ data: this.state, dispatch: this.dispatch }}
			>
				{isMounted && children}
			</AppContext.Provider>
		);
	}
}

// Explore the possibility of mounting and
// removing contexts to enable multi store support
// by changing DataProviders context type
// Possible drawbacks are: mixture of contexts since there's a clear way
// no clear way to change the DataProvider's state and to change the key
// to persist the store with. Ideally each store should have a corresponding
// key in localstorage.
export default function useData<T extends object = AppData>() {
	const { data, dispatch } = useContext(AppContext);

	return {
		data: data as T,
		dispatch: (_: Partial<T> | "clear") => dispatch(_)
	};
}

export function connectData<T extends object = AppData>(Comp: any) {
	const ConnectData = (props: object) => {
		const { data, dispatch } = useData<T>();

		return (
			<>
				{
					// @ts-ignore
					<Comp {...props} data={data} dispatch={dispatch} />
				}
			</>
		);
	};

	return ConnectData;
}
