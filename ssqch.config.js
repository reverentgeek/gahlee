import { defineConfig } from "ssqch";

export default defineConfig( {
	dirs: { input: "src", output: "_site", includes: "_includes", layouts: "_layouts", data: "_data" },
	templateFormats: [ "njk" ],

	// src/images holds the site's own icons; the root images/ folder holds the
	// historical photo archive. Both land in /images/.
	passthrough: [ "src/css", "src/images", { images: "images" } ],

	filters: {
		// URL slugs for recipes: "Pine Cone Crunch!" -> "pine_cone_crunch"
		snake_case: str => str
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, "_" )
			.replace( /^_+|_+$/g, "" )
	}
} );
