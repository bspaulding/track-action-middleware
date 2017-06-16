/* @flow */

import assert from 'assert';
import {
  applyMiddleware,
  createStore
} from 'redux';
import makeMiddleware from './index';

const TRACKED_ACTION = 'TRACKED_ACTION';

type MakeStoreArgs = {
  selector?: Function;
  trackAction: Function;
};

function makeStoreWithMiddleware({ selector = () => ({}), trackAction }: MakeStoreArgs) {
	return createStore(
    () => ({}),
    applyMiddleware(
      makeMiddleware({
	actionTypes: [TRACKED_ACTION],
	environment: 'localhost',
	product: 'ConsentAdminUITests',
	selector,
	segmentKey: 'FAKEKEY',
	trackAction
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
});
