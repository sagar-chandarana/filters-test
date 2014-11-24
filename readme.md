Live: http://sagarchandarana123.github.io/filters-test

# Observations

### No filters

- Edges are returned sorted by order (priority) in Postman (post request), but not in Socket. In socket they are sorted by timestamp.

### limit

Limit set to | Existing No. of Edges | Fired existing Edges | Fired new edges | Properly Sorted | Correct Behaviour? | Comment
--- | --- | --- | --- | --- | --- | ---
3 | 0 | 0 | Yes | No  | No | -
3 | 5 | 3 | No  | Yes | Yes| -
3 | 1 | 1 | No  | Yes | Yes| -
0 | 0 | 0 | Yes | No  | No | -
0 | 5 | 5 | Yes | No  | No | -

### reverse (endAt > startAt)

- always returns empty edge object

# Filter API - redesigned

A new method `filter()` applies on the whole reference, meaning 'edge_added' will fire only filtered edges and `edge_changed`/ `edge_removed` will be fired if one of these edges are changed/removed.

```js
var tweetsRef = Appbase.ns('user').v('sagar/tweets');
tweetsRef.filter(<filters object>);
```

#### Listening

filter: onlyNew (fires only new edges)
```js
var tweetsRef = Appbase.ns('user').v('sagar/tweets');
tweetsRef.filter({onlyNew: true});
tweetsRef.on(<event>, <callback>);
```

#### Pagination

filters: startAt, endAt, limit, skip
new methods: `next()`, `previous()`

When these filters are used, newly added edges are NEVER fired.

```js
var tweetsRef = Appbase.ns('user').v('sagar/tweets');
tweetsRef.filter({limit: 10}); // assumes startAt lowest and endAt highest. Fetches first 10 edges

tweetsRef.on('edge_added', addEdgeToView);
tweetsRef.on('edge_removed', removeEdgeFromView);
tweetsRef.on('edge_changed', updateEdgeInView);

// new filters applied to fetch next 10 edges.
tweetsRef.filter({startAt: <priority of the first edge that was fired previously>, limit: 10, skip: 10});
/* 
1) Notice startAt filter here. We have set this to a priority of the first edge. This is necessary, because it gives a point of reference, from which limit and skip are counted. Otherwise, there might be new edges (which become existing egdes when applying new filters) and limit, skip would fire unexpected edges. 

2) Whenever new filters are applied, `edge_removed` is fired on current edges and `edge_added` for next 10 edges. That means, in the view, the current data is automatically removed and new data is automatically added.
*/

tweetsRef.next(10); // Which does exactly what the above call does. A shortcut for fetching next set of edges for currently applied filters. Makes pagination really easy.

tweetsRef.previous(10); // another shortcut similar to `next()`

```

Firing edges in reverse. I.e. edges with higher priorities are fired first.

```js
var tweetsRef = Appbase.ns('user').v('sagar/tweets');

tweetsRef.filter({limit: 10, startAt: +Infinity, endAt: -Infinity}); 
/*
Notice here that 
1) start, endAt accept Infinity values. 
2) endAt < startAt, meaning reverse.
A filter `reverse` was proposed by Sacheendra, but I think it may lead to confusing/unexpected user input, like endAt < startAt and reverse is also set true. 
*/

tweetsRef.on('edge_added', addEdgeToView);
tweetsRef.on('edge_removed', removeEdgeFromView);
tweetsRef.on('edge_changed', updateEdgeInView);

tweetsRef.next(10);
//similar to `filter({startAt: <priority of the first edge fired>, endAt: -Infinity, limit: 10, skip: 10})`

tweetsRef.previous(10);
```

### suggestions

- We should set a default serverside `limit` around __1000__. That way `skip` would work (currently skip requires specifying a limit, and can't work without limit), and the downloaded data would be limited. Devs can set larger limits if they want.