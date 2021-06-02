/* @flow */

type MakeMiddlewareArgs = {
	actionTypes: Array<string>;
	environment: string;
	getEventName?: (action: { type: string }, Object) => string;
	product: string;
	selector?: (state: Object, action: Action) => Object;
	segmentKey: string;
	trackAction: Function;
};

type Store = {
	getState: Function;
};

type Action = {
	type: string;
};


const makeMiddleware = ({
	actionTypes,
	getEventName = action => action.type,
	selector = () => ({}),
	trackAction
}: MakeMiddlewareArgs): Function => {
	return (store: Store) => (next: Function) => (action: Action) => {
		if (actionTypes.indexOf(action.type) >= 0) {
			const selection = selector(store.getState(), action);
			trackAction(getEventName(action, selection), {
				action,
				...selection
			});
		}

		return next(action);
	};
};

export default makeMiddleware;
