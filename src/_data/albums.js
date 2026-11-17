import { files, readData, slugger, slugify } from "ssqch";

export default function () {
	// The historical table exports (readData skips their UTF-8 byte-order mark)
	const albumsRaw = readData( "src/_data/tblPhotoAlbum.json" );
	const photosRaw = readData( "src/_data/tblPhoto.json" );

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
		.map( ( album ) => {
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

			return {
				id: album.PhotoAlbumID,
				name: album.PhotoAlbumName || "Untitled Album",
				// Slug from the name, or the ID when the name has nothing to slug
				slugSource: album.PhotoAlbumName && slugify( album.PhotoAlbumName ) ? album.PhotoAlbumName : album.PhotoAlbumID,
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

	// Unique slugs, in sort order: the second "Misc Pictures" is misc-pictures-1
	const slug = slugger();
	const albums = albumsProcessed.map( ( { slugSource, ...album } ) => ( { ...album, slug: slug( slugSource ) } ) );

	// Add "Gahlee v1" album from the legacy photos in images/albums/v1/
	const v1Photos = files( "images/albums/v1/*.{jpg,jpeg,png,gif,webp}" )
		.map( ( file, index ) => {
			// Only names like 20011222_08.JPG carry a date; for the rest, files() falls
			// back to the modification time, which isn't when the photo was taken
			const dated = file.dateFrom === "name";
			const dateFormatted = dated
				? file.date.toLocaleDateString( "en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					timeZone: "UTC"
				} )
				: null;

			return {
				id: `v1-${ index }`,
				filename: file.name,
				src: file.url,
				title: "",
				description: dateFormatted ? `Photo from ${ dateFormatted }` : "",
				date: dated ? file.date.toISOString().slice( 0, 10 ) : null,
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

	return albums;
}
