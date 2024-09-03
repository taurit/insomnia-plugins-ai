// *************************************
// insomnia-plugin-genai-image-preview
// See README.md for more information
// *************************************

module.exports.responseHooks = [
  (context) => {
    // first sanity check to see if this plugin should be activated
    let isJson = context.response
      .getHeader("Content-Type")
      .includes("application/json");

    if (isJson) {
      TryHandleStableDiffusionResponse(context);
      TryHandleOpenAiResponse(context);

      // otherwise do nothing, i.e. don't display any dialog - request seems unrelated to Generative AI image generation
    }
  },
];

// Checks whether response seem to be from Stable Diffusion Web UI API, and if it is, displays image preview in a dialog
function TryHandleStableDiffusionResponse(context) {
  // a typical URL for Stable Diffusion local URL is http://localhost:7860/sdapi/v1/txt2img
  let isStableDiffusionApi = context.request
    .getUrl()
    .includes("sdapi/v1/txt2img");
  if (!isStableDiffusionApi) return;

  const responseBody = context.response.getBody();
  const responseBodyJson = JSON.parse(responseBody);
  const base64Images = responseBodyJson.images;
  DisplayImagesInDialog(context, base64Images);
}

// Checks whether response seem to be from OpenAI Image Generation API, and if it is, displays image preview in a dialog
function TryHandleOpenAiResponse(context) {
  // a typical URL for Stable Diffusion local URL is https://api.openai.com/v1/images/generations
  let isOpenAIApi = context.request
    .getUrl()
    .includes("api.openai.com/v1/images/generations");
  if (!isOpenAIApi) return;

  const responseBody = context.response.getBody();
  const responseBodyJson = JSON.parse(responseBody);

  // convert response json to array of strings containing base64 images. Response has format like:
  // {
  //   "created": 1725356725,
  //   "data": [
  //     { "b64_json": "base 64 image 1 here" },
  //     { "b64_json": "base 64 image 2 here" }
  //   ]
  // }

  if (!responseBodyJson.data) return;
  // sanity check: user requested response as base64, not URL (which is unsupported because of authentication difficulties)
  if (!responseBodyJson.data[0].b64_json) return;
  const base64Images = responseBodyJson.data.map((item) => item.b64_json);

  DisplayImagesInDialog(context, base64Images);
}

// Opens a dialog with images
function DisplayImagesInDialog(context, base64Images) {
  if (base64Images) {
    var container = document.createElement("div");

    for (let i = 0; i < base64Images.length; i++) {
      const image = document.createElement("img");

      image.src = `data:image/png;base64,${base64Images[i]}`;

      container.appendChild(image);
      container.appendChild(document.createElement("br"));
    }

    context.app.dialog("GenAI Image Preview", container);
  }
}
