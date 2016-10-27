# track-action-middleware

A middleware for interfacing actions with some other event tracking or analytics system.

## Usage

```javascript
import makeTrackActionMiddleware from 'track-action-middleware';
import {
	ACTION_ONE_TYPE,
	ACTION_TWO_TYPE
} from 'actions/MyActions';

function trackAction(actionType, { action, ...rest }) {
	// YOUR CODE HERE
	// fire off requests put data somewhere
}

const trackActionMiddleware = makeTrackActionMiddleware({
	actionTypes: [
		ACTION_ONE_TYPE,
		ACTION_TWO_TYPE
	],
	trackAction
});

applyMiddleware(
	trackActionMiddleware
)
```

## Using a selector

In many cases, you'll want to grab some extra state to send along in the payload.
In a redux app, the abstraction for this is a selector. If you pass `makeTrackActionMiddleware` a
selector function, we'll call it with the store state and splat the result onto the second argument
to `trackAction`.

```javascript
const trackActionMiddleware = makeTrackActionMiddleware({
	// ...
	selector: (state) => ({
		userId: getUserId(state)
	})
});
```

The selector will also be passed the action itself, so you can switch on the action
to provide different selections.

```javascript
const trackActionMiddleware = makeTrackActionMiddleware({
	// ...
	selector: (state, action) => {
		switch (action.type) {
		case ACTION_ONE_TYPE:
			return {
				userId: getUserId(state)
			};
		case ACTION_TWO_TYPE:
			return {
				numClicks: getNumClicks(state)
			}
		default:
			return {};
		}
	}
});
```
