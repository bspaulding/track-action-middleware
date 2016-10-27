/* @flow */

import assert from 'assert';
import sinon from 'sinon';
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
	beforeEach(function() {
		this.sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		this.sandbox.restore();
	});

	it('calls trackAction if action in actionTypes', function() {
		const trackAction = sinon.stub();
		const store = makeStoreWithMiddleware({ trackAction });

		const action = { type: TRACKED_ACTION, payload: 'PAYLOAD' };
		store.dispatch(action);

		assert.equal(trackAction.callCount, 1);
		const [type, props] = trackAction.getCall(0).args;
		assert.equal(type, TRACKED_ACTION);
		assert.strictEqual(props.action, action);
	});

	it('does not call trackAction if action in actionTypes', function() {
		const trackAction = sinon.stub();
		const store = makeStoreWithMiddleware({ trackAction });

		store.dispatch({ type: 'UNTRACKED_ACTION' });

		assert.equal(trackAction.callCount, 0);
	});

	it('splats selector props onto properties', function() {
		const trackAction = sinon.stub();
		const selector = () => ({ foo: 'bar', baz: 'buzz' });
		const store = makeStoreWithMiddleware({ selector, trackAction });

		store.dispatch({ type: TRACKED_ACTION });

		const props = trackAction.getCall(0).args[1];
		assert.equal(props.foo, 'bar');
		assert.equal(props.baz, 'buzz');
	});
});
