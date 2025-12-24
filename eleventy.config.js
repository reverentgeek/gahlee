export default function ( eleventyConfig ) {
	// Pass through static assets
	eleventyConfig.addPassthroughCopy( "src/css" );
	eleventyConfig.addPassthroughCopy( "images" );

	// Watch CSS for changes
	eleventyConfig.addWatchTarget( "src/css/" );

	return {
		dir: {
			input: "src",
			output: "_site",
			includes: "_includes",
			layouts: "_layouts",
			data: "_data"
		},
		templateFormats: [ "njk", "md", "html" ],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk"
	};
}
