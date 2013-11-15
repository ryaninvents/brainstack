# brainstack
simple memory management

Save your brain for RAM and write anything you don't immediately need to disk! If you're anything like me, you're constantly getting interrupted (okay, [distracted](http://hckrnews.com)) and have trouble remembering what you were working on. This results in significant time lost trying to get back up to speed.

Brainstack is a simple command-line tool that lets you log your state of mind so you can more quickly restore your thoughts.

## tl;dr
| Command            | Description |
|--------------------|-------------|
| push &lt;text>     | Add an item as a child to the current item.
| put &lt;text>      | Add an item as a sibling to the current item.
| focus &lt;number>  | Select a given item.
| pop                | Pop the current item (and any children) off the stack.
| drop &lt;number>   | Drop the item with the given number (and any children).
| display (or no command) | Show the entire list.
| stack              | Show only the items relevant to your current thought.
| throw              | Same as `stack`, only styled like a Java Exception.

## usage

To display the contents of your BrainStack:

```
➜  ~  brain
  Empty stack
```

That's not very interesting, let's add something:

```
➜  ~  brain push "Finish writing documentation"
  Your Brainstack:
    *1. Finish writing documentation
```

Add siblings to the current item with the `put` command:

```
➜  ~  brain put "Fix bugs"
  Your Brainstack:
     1. Finish writing documentation
    *2. Fix bugs
➜  ~  brain put "Add features"
  Your Brainstack:
     1. Finish writing documentation
     2. Fix bugs
    *3. Add features
```

Let's add a couple of bugs.

```
➜  ~  brain focus 2
  Your Brainstack:
     1. Finish writing documentation
    *2. Fix bugs
     3. Add features
➜  ~  brain push "Fix renumbering"
  Your Brainstack:
     1. Finish writing documentation
     2. Fix bugs
      *4. Fix renumbering
     3. Add features
➜  ~  brain put "Double-check display code"
  Your Brainstack:
     1. Finish writing documentation
     2. Fix bugs
       4. Fix renumbering
      *5. Double-check display code
     3. Add features
```

Maybe I should finish this documentation before I get too sidetracked.

```
➜  ~  brain focus 1
  Your Brainstack:
    *1. Finish writing documentation
     2. Fix bugs
       4. Fix renumbering
       5. Double-check display code
     3. Add features
➜  ~  brain push "Add more examples"
  Your Brainstack:
     1. Finish writing documentation
      *6. Add more examples
     2. Fix bugs
       4. Fix renumbering
       5. Double-check display code
     3. Add features
➜  ~  brain put "Check spelling"
  Your Brainstack:
     1. Finish writing documentation
       6. Add more examples
      *7. Check spelling
     2. Fix bugs
       4. Fix renumbering
       5. Double-check display code
     3. Add features
```

Hooray, spell check passed! Let's pop this from the stack:
```
➜  ~  brain pop
  Your Brainstack:
    *1. Finish writing documentation
       6. Add more examples
     2. Fix bugs
       4. Fix renumbering
       5. Double-check display code
     3. Add features
```
The numbers are all messed up now, let's fix that:
```
➜  ~  brain renumber
  Your Brainstack:
    *1. Finish writing documentation
       2. Add more examples
     3. Fix bugs
       4. Fix renumbering
       5. Double-check display code
     6. Add features
```

You can also drop any item by number:
```
➜  ~  brain drop 6
  Your Brainstack:
    *1. Finish writing documentation
       2. Add more examples
     3. Fix bugs
       4. Fix renumbering
       5. Double-check display code
```

## fancy functions

Suppose your brainstack looks like this:
```
➜  ~  brain
  Your Brainstack:
     1. Finish writing documentation
       2. Add more examples
         7. Write 'more use' section
          *8. Add stack sample
     3. Fix bugs
       4. Fix renumbering
       5. Double-check display code
```

If you want to view only items related to your current task, try `stack`:
```
➜  ~  brain stack
  8. Add stack sample
  7. Write 'more use' section
  2. Add more examples
  1. Finish writing documentation
```

Or, if you get interrupted, you can `throw` a fit:
```
➜  ~  brain throw
  Exception in thread "main": io.muller.BrainOverflowException
    at Add stack sample (line 8)
    at Write 'more use' section (line 7)
    at Add more examples (line 2)
    at Finish writing documentation (line 1)
```
