/* @flow */

type MakeMiddlewareArgs = {
	actionTypes: Array<string>;
	environment: string;
	getEventName?: (action: { type: string }) => string;
	product: string;
	selector?: (state: Object) => Object;
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
}: MakeMiddlewareArgs) => {
	return (store: Store) => (next: Function) => (action: Action) => {
		if (actionTypes.indexOf(action.type) >= 0) {
			trackAction(getEventName(action), {
				action,
				...selector(store.getState(), action)
			});
		}

		return next(action);
	};
};

export default makeMiddleware;
