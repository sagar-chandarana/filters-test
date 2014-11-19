Live: (http://sagarchandarana123.github.io/filters-test)[http://sagarchandarana123.github.io/filters-test]

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

### reverse (endAt> startAt)

- always returns empty edge object

### suggestions

- It feels like we should set a `limit` around __1000__ by default. That way `skip` would work, and the downloaded daat would be limited. Devs can set larger limits if they want.