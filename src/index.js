/* @flow */

type MakeMiddlewareArgs = {|
	actionTypes: Array<string>;
	environment: string;
	product: string;
	selector: (state: Object) => Object;
	segmentKey: string;
	trackAction: Function;
|};

type Store = {
	getState: Function;
};

type Action = {
	type: string;
};

const makeMiddleware = ({
	actionTypes,
	selector,
	trackAction
}: MakeMiddlewareArgs) => {
	return (store: Store) => (next: Function) => (action: Action) => {
		if (actionTypes.indexOf(action.type) >= 0) {
			trackAction(action.type, {
				action,
				...selector(store.getState(), action)
			});
		}

		return next(action);
	};
};

export default makeMiddleware
