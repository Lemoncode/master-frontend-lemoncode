# Hooks Excercise

This exercise will let you practice with a tricky hooks issue, managing closures and local variable data.

# The example

Is a simple chat example, enter your nick name, click on connect, then open a 
separate window, enter a new nickname and click connect you can now
exchange messages, BUUUUT.....

# The issue

The chatlog of the user recieving the message won't get properly updated,
just only the first message will be recieved, What's going on here?

# Running the example

First execute the backend:


```bash
cd back
```

```bash
npm install
```

```bash
npm start
```

Then run the front:

```bash
cd front
```

```bash
npm install
```

```bash
npm start
```


# Tips

Mmmm... what about UseRef? ;)

# Additional ideas & work

- Componentize this, the markup is horrible.
- Once we have componentized, what would happen if we just only useRef.
- Wew could wrap all the chatlog management in a hook making it easier
for the user to consume it (e.g. single entry point to update chatlog).

And if you want to keep on playing with this example:

- You could isolate hardcoded values into consts.
- Isolate it into APIS, so the component doesn't know about implementation
details.
- A Connecting message would be nice to implement.
- Send button should be disabled when the message to send is empty.
- What about handling connection errors, socket io will try to reconnect
and you can trap message on connectivity errors.
- ...

