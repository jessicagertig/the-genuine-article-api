exports.seed = function (knex) {
	// Inserts seed entries
	return knex('items').insert([
		{
			garment_type: 'Court Presentation Ensemble',
			begin_year: 1888,
			end_year: null,
			decade: '1800s',
			secondary_decade: null,
			culture_country: 'French',
			collection: 'The Metropolitan Museum of Art',
			collection_url:
				'https://www.metmuseum.org/art/collection/search/80074016?img=1',
			creator: 'The House of Worth',
			source:
				'Purchase, Friends of The Costume Institute Gifts, 2007',
			item_collection_no: '2007.385a-l',
			description:
				'This particular gown was worn by Esther Chapin, whose great-great-granduncle was George Washington. Ordered with three bodices, it can be transformed into a dinner dress, a ballgown, and, as here, with the extraordinary train, into a court presentation gown.\nThe spectacular voided velvet, woven in Lyons, is distinctive for its Aesthetic Movement palette. The pale, faintly mauve, pink satin ground contrasts with the "greenery-yallery" lilies rendered in cisele, or cut and uncut, silk velvet loops. Worth thus incorporated the advanced "artistic" taste of the period into the most formal and sartorially prescriptive dress available to a non-royal, the court presentation gown, thereby transforming the retardataire into the fashionably avant-garde.\nCharles Frederick Worth is considered the inventor of the modern fashion system, with its seasonal menu of evolving styles. The couture house he established in the mid-nineteenth century was considered the preeminent Parisian fashion establishment of its day. Its reputation was enhanced in no small way by its association with many of the aristocratic ladies of the French court. The influence of the house extended to all the royal courts of Europe, as far as Russia, and it was particularly favored by privileged American socialites.'
		}
	]);
};
