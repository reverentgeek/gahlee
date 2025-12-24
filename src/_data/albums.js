import fs from "fs";
import path from "path";

export default function () {
	const dataDir = path.join( process.cwd(), "src", "_data" );

	// Read the JSON files (strip BOM if present)
	const stripBom = ( str ) => str.replace( /^\uFEFF/, "" );
	const albumsRaw = JSON.parse( stripBom( fs.readFileSync( path.join( dataDir, "tblPhotoAlbum.json" ), "utf-8" ) ) );
	const photosRaw = JSON.parse( stripBom( fs.readFileSync( path.join( dataDir, "tblPhoto.json" ), "utf-8" ) ) );

	// Create a map of photos by album ID
	const photosByAlbum = {};
	for ( const photo of photosRaw ) {
		if ( !photo.PhotoIsEnabled ) continue;

		const albumId = photo.PhotoAlbumID;
		if ( !photosByAlbum[albumId] ) {
			photosByAlbum[albumId] = [];
		}

		// Format the photo date
		let dateFormatted = null;
		if ( photo.PhotoDate ) {
			const dateObj = new Date( photo.PhotoDate );
			dateFormatted = dateObj.toLocaleDateString( "en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "UTC"
			} );
		}

		photosByAlbum[albumId].push( {
			id: photo.PhotoID,
			filename: photo.PhotoFileName,
			src: `/images/albums/${ photo.PhotoFileName }`,
			title: photo.PhotoTitle || "",
			description: photo.PhotoDescription || "",
			date: photo.PhotoDate,
			dateFormatted,
			sortNum: photo.SortNum,
			width: photo.PhotoWidth,
			height: photo.PhotoHeight
		} );
	}

	// Sort photos within each album by SortNum
	for ( const albumId in photosByAlbum ) {
		photosByAlbum[albumId].sort( ( a, b ) => a.sortNum - b.sortNum );
	}

	// Build albums array
	const albumsProcessed = albumsRaw
		.filter( album => album.PhotoAlbumIsEnabled )
		.map( album => {
			const photos = photosByAlbum[album.PhotoAlbumID] || [];

			// Format the album date
			let dateFormatted = null;
			let year = null;
			if ( album.PhotoAlbumDate ) {
				const dateObj = new Date( album.PhotoAlbumDate );
				year = dateObj.getUTCFullYear();
				dateFormatted = dateObj.toLocaleDateString( "en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					timeZone: "UTC"
				} );
			}

			// Generate a URL-friendly slug from the album name or ID
			let baseSlug = album.PhotoAlbumName
				? album.PhotoAlbumName
					.toLowerCase()
					.replace( /['']/g, "" )
					.replace( /[^a-z0-9]+/g, "-" )
					.replace( /^-|-$/g, "" )
				: "";

			// If slug is empty, use the ID
			if ( !baseSlug ) {
				baseSlug = album.PhotoAlbumID;
			}

			return {
				id: album.PhotoAlbumID,
				name: album.PhotoAlbumName || "Untitled Album",
				baseSlug,
				date: album.PhotoAlbumDate,
				dateFormatted,
				year,
				description: album.PhotoAlbumDescription || "",
				sortNum: album.SortNum,
				photos,
				photoCount: photos.length,
				coverPhoto: photos[0] || null
			};
		} )
		// Filter out albums with no photos
		.filter( album => album.photoCount > 0 )
		// Sort by SortNum (lower = more recent based on the data pattern)
		.sort( ( a, b ) => a.sortNum - b.sortNum );

	// Ensure unique slugs by appending index for duplicates
	const slugCounts = {};
	const albums = albumsProcessed.map( album => {
		let slug = album.baseSlug;
		if ( slugCounts[slug] !== undefined ) {
			slugCounts[slug]++;
			slug = `${ slug }-${ slugCounts[slug] }`;
		} else {
			slugCounts[slug] = 0;
		}
		return { ...album, slug };
	} );

	// Add "Gahlee v1" album from the v1 subfolder
	const v1Dir = path.join( process.cwd(), "images", "albums", "v1" );
	if ( fs.existsSync( v1Dir ) ) {
		const v1Files = fs.readdirSync( v1Dir )
			.filter( file => /\.(jpg|jpeg|png|gif|webp)$/i.test( file ) )
			.sort();

		const v1Photos = v1Files.map( ( filename, index ) => {
			// Parse date from filename (format: YYYYMMDD_##.ext)
			const match = filename.match( /^(\d{4})(\d{2})(\d{2})_/ );
			let date = null;
			let dateFormatted = null;

			if ( match ) {
				const [ , year, month, day ] = match;
				date = `${ year }-${ month }-${ day }`;
				const dateObj = new Date( Date.UTC( parseInt( year ), parseInt( month ) - 1, parseInt( day ) ) );
				dateFormatted = dateObj.toLocaleDateString( "en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					timeZone: "UTC"
				} );
			}

			return {
				id: `v1-${ index }`,
				filename,
				src: `/images/albums/v1/${ filename }`,
				title: "",
				description: dateFormatted ? `Photo from ${ dateFormatted }` : "",
				date,
				dateFormatted,
				sortNum: index,
				width: null,
				height: null
			};
		} );

		if ( v1Photos.length > 0 ) {
			albums.push( {
				id: "gahlee-v1",
				name: "Gahlee v1",
				slug: "gahlee-v1",
				date: "2001-12-22T00:00:00.000Z",
				dateFormatted: "December 22, 2001",
				year: 2001,
				description: "Photos from the original Gahlee website (2001-2004).",
				sortNum: 1000,
				photos: v1Photos,
				photoCount: v1Photos.length,
				coverPhoto: v1Photos[0] || null
			} );
		}
	}

	return albums;
}
