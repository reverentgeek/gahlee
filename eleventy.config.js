export default function ( eleventyConfig ) {
	// Pass through static assets
	eleventyConfig.addPassthroughCopy( "src/css" );
	eleventyConfig.addPassthroughCopy( "src/images" );
	eleventyConfig.addPassthroughCopy( { "images": "images" } );

	// Watch CSS for changes
	eleventyConfig.addWatchTarget( "src/css/" );

	// Snake case filter for URLs
	eleventyConfig.addFilter( "snake_case", ( str ) => {
		return str
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, "_" )
			.replace( /^_+|_+$/g, "" );
	} );

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
