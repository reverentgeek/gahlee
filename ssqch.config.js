import { defineConfig, slugify } from "ssqch";

export default defineConfig( {
	dirs: { input: "src", output: "_site", includes: "_includes", layouts: "_layouts", data: "_data" },
	templateFormats: [ "njk" ],

	// src/images holds the site's own icons; the root images/ folder holds the
	// historical photo archive. Both land in /images/. src/favicon.ico is copied
	// to the site root, where browsers look for it by default.
	passthrough: [ "src/css", "src/images", "src/favicon.ico", { images: "images" } ],

	filters: {
		// URL slugs for recipes: "Drew's Brownies" -> "drew_s_brownies". The live URLs
		// split words at apostrophes, which slugify drops by default.
		snake_case: str => slugify( str, { separator: "_", apostrophes: "separate" } )
	}
} );
