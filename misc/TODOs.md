# Main tasks

0. Rework Spells class on frontend, I need to have all the DOM things in one place to make animations possible
1. Animation of sliding card:
   - from hand to board
   - from hand to spell pool
   - from spell pool to board
   - from air to board
   - from air to spell pool
2. Scoring after all cards are finished.
3. Implement passive card effects.
4. Implement immediate card effects.

# Refactorings

- Decide what to do with SQL access, active record or repository pattern?
- Rethink frontend architecture, it might use some improvements.
  - Example: register listener on card only once, and then react to clicks differently based on status, somewhere else
- State pattern on frontend, state object updated on state enter/exit, state object has methods for each event, for example, how to react to a spell being clicked. When during spell picking state, it sends a request. Otherwise it is ignored

# Ideas after studying GosuX

1. More constants in material. State indexes, card indexes etc can be extracted to constants.
2. Consider mass requiring/autoloading files in a directory.

```php
$swdNamespaceAutoload = function ($class) {
    $classParts = explode('\\', $class);
    if ($classParts[0] == 'GOSUX') {
        array_shift($classParts);
        $file = dirname(__FILE__) . '/modules/' . implode(DIRECTORY_SEPARATOR, $classParts) . '.php';
        if (file_exists($file)) {
            require_once $file;
        } else {
            var_dump('Cannot find file : ' . $file);
        }
    }
};
spl_autoload_register($swdNamespaceAutoload, true, true);
```

# Ideas after studying Tisaac's Boilerplate
