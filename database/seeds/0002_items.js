exports.seed = function (knex) {
	// Inserts seed entries
	return knex('items').insert([
		{
			garment_type: 'Court Presentation Ensemble',
			begin_year: 1888,
			end_year: null,
			decade: '1880s',
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
		},
		{
			garment_type: 'Dress',
			begin_year: 1836,
			end_year: 1838,
			decade: '1830s',
			secondary_decade: null,
			culture_country: 'England',
			collection: 'Victoria and Albert Museum',
			collection_url:
				'http://m.vam.ac.uk/item/O13833/dress-unknown/',
			creator: 'Unknown',
			source: 'Given by Mrs H. M. Shepherd',
			item_collection_no: 'T.11-1935',
			description:
				'Printed wool, trimmed with printed wool, lined with cotton, hand-sewn. Wool was a popular fabric for winter day wear, as seen in this example. The dress is printed in a complicated design of shamrocks on a lilac and brown chequered ground. By the mid-1830s the puff of the full gigot sleeve was moving from the top of the arm to the elbow. (The gigot was a very full style of sleeve that tapered to a narrow circumference at the wrist.) These sleeves have stitch marks, which suggests that they were reworked from an earlier style to update the dress to the latest fashion. In order to keep the sleeve from sliding down the arm, there are tapes at the elbow holding the fullness of the puff in place.The fitted bodice has a low, round neck and a slightly high waistline. The skirt is box-pleated more tightly at the centre back. The sleeves are set low, tightly pleated below the shoulder. They have been altered by having the fullness reduced and a frill attached at the elbow. The sleeve puffs are stiffened with calico and supported with tapes. The main seams are faced, the bodice is lined with cotton and the skirt faced with glazed cotton.'
		}
	]);
};
