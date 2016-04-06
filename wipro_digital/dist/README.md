# gh-pages
It's not the best solution to store build artifacts in the code repository. However it's necessary to be able to use `git subtree`. Thanks to that code can be easily accompanied by the deployed application. The downside is this is only for static applications. I often use it to deploy POCs in my other projects.

The `git subtree` command has to be run form the root of the repository:
`git subtree push --prefix wipro_digital/dist/ origin gh-pages`