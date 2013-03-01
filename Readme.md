# SimpleNote

SimpleNote API wrapper

## Example

```js
var Note = SimpleNote(email, pass)
Note.all(function(err, notes) {
  var keys = notes.select('blog').map('key');
  note.get(keys[0], function(err, note) {
    console.log(note.content);
  })
});
```

## API

### all([n], fn)

Get `n` note indexes from the server. Defaults to 100. `fn` has the signature `function(err, notes)` where `notes` is an [array](matthewmueller/array)

### get(key, fn)

Get a note's data by key. `key` corresponds to the `key` returned by the index.

## TODO

- update
- delete
- create
- tag
