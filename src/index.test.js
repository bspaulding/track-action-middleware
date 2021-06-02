/* @flow */

import { applyMiddleware, createStore } from 'redux';
import makeMiddleware from './index';

const TRACKED_ACTION = 'TRACKED_ACTION';

function makeStoreWithMiddleware(args: Object) {
	return createStore(
		() => ({}),
		applyMiddleware(
			makeMiddleware({
				actionTypes: [TRACKED_ACTION],
				environment: 'localhost',
				product: 'ConsentAdminUITests',
				segmentKey: 'FAKEKEY',
				...args
			})
		)
	);
}

describe('makeMiddleware', function() {
	it('calls trackAction if action in actionTypes', function() {
		const trackAction = jest.fn();
		const store = makeStoreWithMiddleware({ trackAction });

		const action = { type: TRACKED_ACTION, payload: 'PAYLOAD' };
		store.dispatch(action);

		expect(trackAction.mock.calls.length).toBe(1);
		const [type, props] = trackAction.mock.calls[0];
		expect(type).toBe(TRACKED_ACTION);
		expect(props.action).toBe(action);
	});

	it('does not call trackAction if action in actionTypes', function() {
		const trackAction = jest.fn();
		const store = makeStoreWithMiddleware({ trackAction });

		store.dispatch({ type: 'UNTRACKED_ACTION' });

		expect(trackAction.mock.calls.length).toBe(0);
	});

	it('splats selector props onto properties', function() {
		const trackAction = jest.fn();
		const selector = () => ({ foo: 'bar', baz: 'buzz' });
		const store = makeStoreWithMiddleware({ selector, trackAction });

		store.dispatch({ type: TRACKED_ACTION });

		const props = trackAction.mock.calls[0][1];
		expect(props.foo).toBe('bar');
		expect(props.baz).toBe('buzz');
	});

	it('maps action types to event names via getEventName', function() {
		const trackAction = jest.fn();
		const getEventName = action => `MYACTION_${action.type}`;
		const store = makeStoreWithMiddleware({ trackAction, getEventName });

		const action = { type: TRACKED_ACTION, payload: 'PAYLOAD' };
		store.dispatch(action);

		expect(trackAction.mock.calls.length).toBe(1);
		const [type, props] = trackAction.mock.calls[0];
		expect(type).toBe('MYACTION_TRACKED_ACTION');
		expect(props.action).toBe(action);
	});

	it('passes selection to getEventName', function() {
		const trackAction = jest.fn();
		const getEventName = (action, selection) => `${action.type}-${selection.companyId}`;
		const selector = () => ({ companyId: 'companyId' });
		const store = makeStoreWithMiddleware({ selector, trackAction, getEventName });

		store.dispatch({ type: TRACKED_ACTION });

		expect(trackAction.mock.calls[0][0]).toBe('TRACKED_ACTION-companyId');
	});
});
