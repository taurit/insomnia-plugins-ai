module.exports.responseHooks = [
  (context) => {
    // first sanity check to see if this plugin should be activated
    let isJson = context.response
      .getHeader("Content-Type")
      .includes("application/json");

    if (isJson) {
      TryHandleStableDiffusionResponse(context);
    }
  },
];

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
