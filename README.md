# insomnia-plugins-ai

A set of plugins for Insomnia to help work with Generative AI APIs like Stable Diffusion or Dall-E:

## Plugins in this repository

### insomnia-plugin-genai-image-preview

This simple plugin opens preview dialog displaying images returned by the GenAI endpoints like Stable Diffusion Web UI or Dall-E API.

![A screenshot of an opened dialog window in Insomnia](./insomnia-plugin-genai-image-preview/screenshot.jpg)

Read more: [insomnia-plugin-genai-image-preview](insomnia-plugin-genai-image-preview/README.md)


## Publishing new version - a checklist

1) Open a command line
2) Go to plugin directory, e.g., `cd insomnia-plugin-genai-image-preview`
3) Make sure all is ready to publish, because there will be no more steps to validate!
4) Run `npm publish`

   If you encounter an error like below, fix it and publish again:
   ```
   npm error code ENEEDAUTH
   npm error need auth This command requires you to be logged in to https://registry.npmjs.org/
   npm error need auth You need to authorize this machine using `npm adduser``
   ```
   
5) Bump up the version in package.json, so the next time you publish, the version will not be the same. 