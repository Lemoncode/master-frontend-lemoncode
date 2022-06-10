# Common component

In this example we will learn how to create a common component.

# Optional excercise

This time we have identified an options dashboard, where the user sees
a list of icon and he can choose one of the options.

This needs to be flexbox based and can be something generic

We may want to implement something like this:

https://codesandbox.io/s/tender-forest-hbovz?file=/src/styles.css

or:

https://codesandbox.io/s/interesting-shadow-yivek?file=/src/mystyle.css:0-776

In our case we will use as icons the following:

- Github
- Linked in
- Twitter

And we will create a new page where we can consume the common components and let
the user navigate to the github members page if clicks on the github link.

# Tips / Steps:

- First create a new scene, we can call it _dashboard_
- Then create a _dashboard_ pod including container / component.
- Connect the container with the scene.
- Add it to the router routes, and in the login container it should redirect to the dashboard
  when the login succeeds.
- Now download the jpg of the logos and place it under the dashboard pod (they could be
  placed in a public asset folder but this would need some webpack extra plumbing).
- Try first to build a static layout withou componentizing and binding date... all shown?
  cool...
- Next step pass a list and add a map, you will realize that you have a candidate for componentization,
  one thing is the list container another is the component it self, Yeah !
- Now you realize... hey this smells like this could be promoted as a common component
  (can be reused by other app even, is not domain dependant, this is based on a real story).
- Let's create _src/common/components/dashboard_ folder.
- Let's move the dashboard container implementation to common (accepting as props a list of
  item Info, link to picture plus name to display).
- Let's move the dashboard item implementation to common.
- Let's expose the container in the index barrel.
- Time to use it in our dashboard pod.

Seems a lot of work, but next time you need an options dashboard like this you only need
to type the code in the dashboard pod to get the same results.

Some extra challenges not covered:

- We could promote this to a library, some tips: https://webpack.js.org/guides/author-libraries/
- Allowing customizing look and feel, here you have some additional options:
  - You could try to add some properties for that, this is not a good idea, because CSS is quite opened
    and we are constrain it's power
  - You could try to add like a CSS api for the component, this can be nice, but is a lot of work, and to
    avoid specifity issues is a good idea to use libraries like _css in js_.
  - You can just ask to override some classes (need extra plumbing), this is the approach material ui is
    following now.
