# Code organization
I absolutely hate when people organize their module by their function, and then end up with directories like controllers, views, services - all with multiple modules that have nothing to do with each other. I use a different approach, I organize code by features/modules. In this exercive all the forecast code is in a `forecast` directory. With a growing codebase I would probably consider putting things like `constants.js`, and `config.js` into a separate directory. The main app leaves in the root of `app` directory.