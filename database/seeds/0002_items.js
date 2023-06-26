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
      garment_type: 'One piece, second day',
      begin_year: '1860',
      end_year: null,
      decade: '1860s',
      secondary_decade: null,
      culture_country: 'American',
      collection: 'Smithsonian',
      collection_url:
        'https://www.si.edu/object/womans-dress-1860:nmah_881659',
      creator: 'Unknown',
      source: 'Frederick D. Wampler',
      item_collection_no: '1989.0295.014',
      description:
        "This dress was worn by Emeline Butler Posey, who was born September 12, 1836, as a 'second day' dress when she married Henry Dixon Posey in November 1860 in Henderson County, Kentucky. She was the daughter of Harbison Butler, a prosperous farmer in the area. In addition to Emeline, Harbison and Mary Butler had seven children. The last was born in 1854, and Mrs. Butler died before the 1860 Census. Henry's parents were also farmers, and in addition to Henry Dixon, his parents had twelve children. It does not appear that Emeline saved her wedding dress, but both the 'second day' dress with headdress and Mr. Posey's wedding vest were passed down through the family until they were donated to the Smithsonian Institution in 1989. From what little we know about the 'second day' tradition, we believe that this special dress was worn for wedding festivities the day after the wedding. Many women, especially in the South, had their photographs taken in their 'second day'dress. The photograph pictured here shows Emeline Posey wearing this dress. We do not have the collar which would have been a separate piece. The dress itself is very fashionable for the period. The skirt is very full and would have required a very large hoop, circular in form, to create the proper silhouette. Even then, it is evident from the dress that Mrs. Posey was a tall and very slender woman, and the skirt is much longer than usual.This one-piece 'second day' dress is constructed from deep green, black, and gold thread plaid silk with a woven pattern stripe. The fitted bodice has a center front opening with twelve pairs of brass hooks-and-eyes and eight deep green acorn-shaped buttons with silk thread covering and tassels for a closure. It has a round neckline and sloping shoulders with dropped, shaped long sleeves with capped over sleeves and diagonal cuffs at the wrist. One and one-eighth-inch wide trim consisting of vertical green moiré embroidered silk thread lozenges and one-eighth-inch wide black silk pleated with a picot-edge border is applied to the cuffs and the cap over sleeves. The waistline is straight with inserted piping, and the attached pleated skirt section is very full. The bodice is lined with glazed white cotton with green glazed cotton lining the sleeves. Four stays are inserted in the front bodice. The dress measures 55 1/4 inches at the center back."
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
      begin_year: '1888',
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
    },
    {
      garment_title: 'Evening Dress',
      garment_type: 'Evening dress',
      begin_year: '1830',
      end_year: null,
      decade: '1830s',
      secondary_decade: null,
      culture_country: 'American',
      collection: 'Museum, Maryland Center for History and Culture',
      collection_url:
        'https://www.mdhistory.org/resources/dress-21/',
      creator: 'Unknown',
      source: 'Gift of Mrs. Addison F. Worthington',
      item_collection_no: 'Object id: 1949.4.1. Resource id: 292',
      description:
        "Purple silk damask dress worn by Elizabeth Evans Hoogewerff (1803-1888). Distinguishing features of this dress's construction include its fan-pleated bodice, sleeves, and draw-loom silk damask that dates to the 1740s."
    }
  ]);
};
