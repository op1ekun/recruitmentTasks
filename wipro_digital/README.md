# Status
Accepted. The company rejected mu application due to lack of so called "client facing", and leadership skills.

# TLDR;
I spent most of the time learning new stuff about ES6 that's why it took a bit longer than I anticipated ;) but I had a lot of fun. The app uses a variation of MVC pattern. Normally I would have event emiiters implemented by both model and view, but I wanted to test something different (even if older). I'm not entirely happy about exposing viewState, and definitely in the final product the rendering should be optimized. For and MVP it's ok.

# The goal
The given task was one thing, the other one was to see what can be achieved with ES6 alone (plus some devtools). I said during the interview that I like bleeding edge and that was, in my personal opinin, the best way to do it. I'm pretty happy to say that ES6 does the trick. There are no 3rd party dependencies in the production code. There's only a fetch polyfill which is transparent for the actual application. The whole thing is handled by webpack which bundles, minifies, and builds the artifacts. The artifacts are depolyed to github pages as ES5 static application.

# Why U have no tests?
Because it was purely research project it was really hard to decide how the spec should look like, what actually is going to be built. On the other hand I was strugling with the idea on how to stub/mock the imports for Unit Testing. I can't rely on factory pattern here to provide dependencies from the outside because of module static resolution. Normally I run my mocha tests using karma on both frontend, and backend.

# The repository
Please have a closer look at the code. I added README files to all important places to explain my choices.