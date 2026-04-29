const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, options = {}) {
  const {
    sizes,
    loading = "lazy",
    class: className = "",
    widths = [400, 800, 1200, 1600],
    formats = ["webp", "jpeg"],
    fetchpriority,
    decoding = "async"
  } = options;

  const metadata = await Image(src, {
    widths,
    formats,
    outputDir: "./_site/assets/images/",
    urlPath: "/assets/images/",
    filenameFormat: function (id, src, width, format) {
      const pathParts = src.split("/");
      const originalName = pathParts.pop().split(".")[0];
      return `${originalName}-${width}.${format}`;
    }
  });

  const imageAttributes = {
    alt,
    loading,
    decoding
  };

  if (sizes) imageAttributes.sizes = sizes;
  if (className) imageAttributes.class = className;
  if (fetchpriority) imageAttributes.fetchpriority = fetchpriority;

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/favicon");

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};