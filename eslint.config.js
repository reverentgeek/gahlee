import { defineConfig, globalIgnores } from "eslint/config";
import rg from "eslint-config-reverentgeek";

export default defineConfig( [
	globalIgnores( [ "_site/", ".cache/" ] ),
	{
		// Node.js ES modules: ssqch config and _data scripts
		files: [ "**/*.{js,mjs}" ],
		extends: [ rg.configs["node-esm"] ],
		rules: {
			// This is a website, not a published package, so devDependencies are fine
			"n/no-unpublished-import": "off"
		}
	}
] );
