/* @flow */

import assert from 'assert';
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

		assert.equal(trackAction.mock.calls.length, 1);
		const [type, props] = trackAction.mock.calls[0];
		assert.equal(type, TRACKED_ACTION);
		assert.strictEqual(props.action, action);
	});

	it('does not call trackAction if action in actionTypes', function() {
		const trackAction = jest.fn();
		const store = makeStoreWithMiddleware({ trackAction });

		store.dispatch({ type: 'UNTRACKED_ACTION' });

		assert.equal(trackAction.mock.calls.length, 0);
	});

	it('splats selector props onto properties', function() {
		const trackAction = jest.fn();
		const selector = () => ({ foo: 'bar', baz: 'buzz' });
		const store = makeStoreWithMiddleware({ selector, trackAction });

		store.dispatch({ type: TRACKED_ACTION });

		const props = trackAction.mock.calls[0][1];
		assert.equal(props.foo, 'bar');
		assert.equal(props.baz, 'buzz');
	});

	it('maps action types to event names via getEventName', function() {
		const trackAction = jest.fn();
		const getEventName = action => `MYACTION_${action.type}`;
		const store = makeStoreWithMiddleware({ trackAction, getEventName });

		const action = { type: TRACKED_ACTION, payload: 'PAYLOAD' };
		store.dispatch(action);

		assert.equal(trackAction.mock.calls.length, 1);
		const [type, props] = trackAction.mock.calls[0];
		assert.equal(type, 'MYACTION_TRACKED_ACTION');
		assert.strictEqual(props.action, action);
	});
});
