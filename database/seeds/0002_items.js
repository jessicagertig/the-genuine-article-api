exports.seed = function (knex) {
	// Inserts seed entries
	return knex('items').insert([
		{
			garment_title: 'Morning Dress',
			garment_type: 'One piece',
			begin_year: 1828,
			end_year: null,
			decade: '1820s',
			secondary_decade: null,
			culture_country: 'American',
			collection: 'The Metropolitan Museum of Art',
			collection_url:
				'https://www.metmuseum.org/art/collection/search/108029',
			creator: 'Unknown',
			source: 'Gift of Mrs. Howard E. Cox, 1978',
			item_collection_no: '1978.359',
			description: 'Cotton Morning Dress circa 1828. '
		},
		{
			garment_title: 'Dress',
			garment_type: 'One piece',
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
		},
		{
			garment_title: 'Dress',
			garment_type: 'One piece',
			begin_year: 1867,
			end_year: null,
			decade: '1860s',
			secondary_decade: null,
			culture_country: 'Western',
			collection: 'Colonial Williamsburg',
			collection_url:
				'https://emuseum.history.org/objects/5792/dress?ctx=146625e9a5ad296fe848b9f0f3aeb9ba7cee142b&idx=459',
			creator: 'Unknown',
			source: 'Gift of Tasha Tudor',
			item_collection_no: '1998-236',
			description:
				"Woman's gown of soft blue green ribbed changeable silk, woven with floral sprigs, trimmed with solid green silk fringe and puffed bands of self fabric. High round neckline and center front button closure. Upper sleeves trimmed with puffed and fringed self fabric with extra fringe at wrist. Flounced overskirt trimmed with fringe. Attached belt. Lined with glazed cotton. Characteristic of nineteenth-century dresses, this bodice is shaped by a series of boned darts from the waist to the bust. Some time after the dress was first made, the wearer had to enlarge the waist by opening the side seams; the waistline now measures 26 inches. "
		},
		{
			garment_title: 'Mourning Dress',
			garment_type: 'Two piece',
			begin_year: 1872,
			end_year: 1874,
			decade: '1870s',
			secondary_decade: null,
			culture_country: 'American',
			collection: 'The Metropolitan Museum of Art',
			collection_url:
				'https://www.metmuseum.org/art/collection/search/159230',
			creator: 'Unknown',
			source:
				' Brooklyn Museum Costume Collection at The Metropolitan Museum of Art, Gift of the Brooklyn Museum, 2009; Gift of Mrs. Clarence E. Van Buren, 1944',
			item_collection_no: '2009.300.673a, b',
			description:
				'Black mourning dress reached its peak during the reign of Queen Victoria (1819-1901) of the United Kingdom in the second half of the 19th century. Queen Victoria wore mourning from the death of her husband, Prince Albert (1819-1861), until her own death. With these standards in place, it was considered a social requisite to don black from anywhere between three months to two and a half years while grieving for a loved one or monarch. The stringent social custom existed for all classes and was available at all price points. Those who could not afford the change of dress often altered and dyed their regular garments black. The amount of black to be worn was dictated by several different phases of mourning; full mourning ensembles were solid black while half mourning allowed the wearer to add a small amount of white or purple.  This half mourning dress made of cotton and silk shows the care with which additional colors were implemented in mourning attire with the white accents carefully placed to not overwhelm the black and create a visually appealing transitional garment.. '
		},
		{
			garment_title: 'Court Dress',
			garment_type:
				'Court Presentation Ensemble, skirt, train, three(3) bodices.',
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
				'This particular gown was worn by Esther Chapin, whose great-great-granduncle was George Washington. Ordered with three bodices, it can be transformed into a dinner dress, a ballgown, and, as here, with the extraordinary train, into a court presentation gown. The spectacular voided velvet, woven in Lyons, is distinctive for its Aesthetic Movement palette. The pale, faintly mauve, pink satin ground contrasts with the "greenery-yallery" lilies rendered in cisele, or cut and uncut, silk velvet loops. Worth thus incorporated the advanced "artistic" taste of the period into the most formal and sartorially prescriptive dress available to a non-royal, the court presentation gown, thereby transforming the retardataire into the fashionably avant-garde. Charles Frederick Worth is considered the inventor of the modern fashion system, with its seasonal menu of evolving styles. The couture house he established in the mid-nineteenth century was considered the preeminent Parisian fashion establishment of its day. Its reputation was enhanced in no small way by its association with many of the aristocratic ladies of the French court. The influence of the house extended to all the royal courts of Europe, as far as Russia, and it was particularly favored by privileged American socialites.'
		}
	]);
};
