/**
 * The client's real portfolio photographs.
 *
 * GENERATED — do not edit by hand. Produced from the studio's photo library
 * (11 category folders, 131 images) and committed to public/images/decor/.
 * Regenerate only if the source library changes.
 *
 * Dimensions are read from each JPEG's own header so <Image> reserves the
 * correct box and CLS stays at zero. Orientation is mixed, so consumers should
 * place these in a fixed-aspect container with object-cover rather than trusting
 * any single ratio.
 *
 * ⚠ REMOVED: theme-birthday-09.jpg was a phone screenshot, 720x1600, with the
 * content rotated 90° and the status bar (clock, signal, battery) still in
 * frame. Aspect ratio alone does not identify these — five other portrait
 * photographs share the same 9:20 shape and are perfectly good; this one was
 * found by looking.
 *
 * ⚠ REMOVED: anniversary-12.jpg was a screenshot of another vendor's social
 * post — it carried "shop4party" branding, a social-media UI strip and a
 * carousel indicator. Publishing it would have passed off someone else's work
 * as the studio's. The library needs a human review pass for others like it;
 * this one was found by eye, not by any check that can be automated.
 *
 * ⚠ CLIENT NOTE: some photographs include personalised signage with real
 * customer names (children's names on backdrops). The studio owns the images,
 * but publishing a named child on a public site is the client's call — ask
 * before launch and drop any they are not comfortable with.
 */

export type Photo = { src: string; w: number; h: number; alt: string };

export type PhotoCategory =
  | "adult"
  | "annaprashan"
  | "anniversary"
  | "baby-boy"
  | "baby-boy-theme"
  | "baby-girl"
  | "baby-shower"
  | "birthday"
  | "surprise-birthday"
  | "theme-birthday"
  | "welcome-baby";

export const photoCategoryLabel: Record<PhotoCategory, string> = {
  "adult": "Adult Birthday",
  "annaprashan": "Annaprashan",
  "anniversary": "Anniversary",
  "baby-boy": "Baby Boy",
  "baby-boy-theme": "Baby Boy Theme",
  "baby-girl": "Baby Girl",
  "baby-shower": "Baby Shower",
  "birthday": "Birthday",
  "surprise-birthday": "Surprise Birthday",
  "theme-birthday": "Themed Birthday",
  "welcome-baby": "Welcome Baby",
};

export const photos: Record<PhotoCategory, Photo[]> = {
  "adult": [
    { src: "/images/decor/adult/adult-01.jpg", w: 1080, h: 1322, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-02.jpg", w: 1080, h: 1246, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-03.jpg", w: 706, h: 769, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-04.jpg", w: 1080, h: 1113, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-05.jpg", w: 1080, h: 1206, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-06.jpg", w: 1080, h: 1137, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-07.jpg", w: 706, h: 660, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-08.jpg", w: 1080, h: 1214, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-09.jpg", w: 1080, h: 1171, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-10.jpg", w: 1080, h: 1224, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-11.jpg", w: 1181, h: 1332, alt: "Adult birthday balloon decoration setup in Patna" },
    { src: "/images/decor/adult/adult-12.jpg", w: 1127, h: 1395, alt: "Adult birthday balloon decoration setup in Patna" },
  ],
  "annaprashan": [
    { src: "/images/decor/annaprashan/annaprashan-01.jpg", w: 1080, h: 1452, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-02.jpg", w: 1080, h: 800, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-03.jpg", w: 1080, h: 1152, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-04.jpg", w: 1080, h: 1397, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-05.jpg", w: 706, h: 693, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-06.jpg", w: 706, h: 920, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-07.jpg", w: 1080, h: 808, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-08.jpg", w: 1080, h: 1052, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-09.jpg", w: 1080, h: 724, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-10.jpg", w: 961, h: 1600, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-11.jpg", w: 1080, h: 1264, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-12.jpg", w: 1080, h: 724, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-13.jpg", w: 1080, h: 1072, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-14.jpg", w: 1080, h: 1092, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-15.jpg", w: 1040, h: 1280, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-16.jpg", w: 1080, h: 996, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
    { src: "/images/decor/annaprashan/annaprashan-17.jpg", w: 1080, h: 808, alt: "Annaprashan rice ceremony decoration with name backdrop in Patna" },
  ],
  "anniversary": [
    { src: "/images/decor/anniversary/anniversary-01.jpg", w: 1080, h: 1096, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-02.jpg", w: 1156, h: 1360, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-03.jpg", w: 706, h: 720, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-04.jpg", w: 706, h: 706, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-05.jpg", w: 1080, h: 1068, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-06.jpg", w: 706, h: 1098, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-07.jpg", w: 853, h: 1280, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-08.jpg", w: 1080, h: 1080, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-09.jpg", w: 1080, h: 1048, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-10.jpg", w: 973, h: 1280, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-11.jpg", w: 1080, h: 1120, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-13.jpg", w: 1080, h: 1092, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-14.jpg", w: 1080, h: 1106, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-15.jpg", w: 1080, h: 856, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-16.jpg", w: 735, h: 833, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-17.jpg", w: 960, h: 1280, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-18.jpg", w: 1080, h: 1171, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-19.jpg", w: 706, h: 769, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-20.jpg", w: 1181, h: 1332, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-21.jpg", w: 706, h: 660, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-22.jpg", w: 1080, h: 1206, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-23.jpg", w: 1127, h: 1395, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-24.jpg", w: 1080, h: 1113, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-25.jpg", w: 1080, h: 1246, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-26.jpg", w: 1080, h: 1137, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-27.jpg", w: 1080, h: 1214, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
    { src: "/images/decor/anniversary/anniversary-28.jpg", w: 1080, h: 1224, alt: "Anniversary balloon decoration with heart backdrop and lighting in Patna" },
  ],
  "baby-boy": [
    { src: "/images/decor/baby-boy/baby-boy-01.jpg", w: 1080, h: 917, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-02.jpg", w: 990, h: 1280, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-03.jpg", w: 1080, h: 1052, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-04.jpg", w: 1080, h: 1140, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-05.jpg", w: 721, h: 1600, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-06.jpg", w: 964, h: 1600, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-07.jpg", w: 1076, h: 1176, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-08.jpg", w: 1080, h: 1583, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-09.jpg", w: 1080, h: 1068, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
    { src: "/images/decor/baby-boy/baby-boy-10.jpg", w: 720, h: 1600, alt: "Baby boy welcome decoration in blue and white balloons in Patna" },
  ],
  "baby-boy-theme": [
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-01.jpg", w: 1080, h: 784, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-02.jpg", w: 1076, h: 1272, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-03.jpg", w: 1080, h: 1076, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-04.jpg", w: 1080, h: 588, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-05.jpg", w: 1080, h: 896, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-06.jpg", w: 1076, h: 1200, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
    { src: "/images/decor/baby-boy-theme/baby-boy-theme-07.jpg", w: 1080, h: 1180, alt: "Themed baby boy decoration with balloon backdrop in Patna" },
  ],
  "baby-girl": [
    { src: "/images/decor/baby-girl/baby-girl-01.jpg", w: 1080, h: 956, alt: "Baby girl welcome decoration in pink and pastel balloons in Patna" },
    { src: "/images/decor/baby-girl/baby-girl-02.jpg", w: 1280, h: 577, alt: "Baby girl welcome decoration in pink and pastel balloons in Patna" },
    { src: "/images/decor/baby-girl/baby-girl-03.jpg", w: 800, h: 640, alt: "Baby girl welcome decoration in pink and pastel balloons in Patna" },
    { src: "/images/decor/baby-girl/baby-girl-04.jpg", w: 1022, h: 1280, alt: "Baby girl welcome decoration in pink and pastel balloons in Patna" },
    { src: "/images/decor/baby-girl/baby-girl-05.jpg", w: 1080, h: 1020, alt: "Baby girl welcome decoration in pink and pastel balloons in Patna" },
  ],
  "baby-shower": [
    { src: "/images/decor/baby-shower/baby-shower-01.jpg", w: 1080, h: 968, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-02.jpg", w: 1080, h: 784, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-03.jpg", w: 1080, h: 948, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-04.jpg", w: 1080, h: 760, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-05.jpg", w: 1080, h: 1008, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-06.jpg", w: 1080, h: 1130, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-07.jpg", w: 1080, h: 1236, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-08.jpg", w: 1064, h: 1112, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-09.jpg", w: 1080, h: 1012, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-10.jpg", w: 1028, h: 1104, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-11.jpg", w: 1080, h: 712, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
    { src: "/images/decor/baby-shower/baby-shower-12.jpg", w: 1080, h: 1176, alt: "Baby shower balloon decoration with pastel arch and seating in Patna" },
  ],
  "birthday": [
    { src: "/images/decor/birthday/birthday-01.jpg", w: 964, h: 672, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-02.jpg", w: 1080, h: 1080, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-03.jpg", w: 1600, h: 715, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-04.jpg", w: 576, h: 1280, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-05.jpg", w: 720, h: 1600, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-06.jpg", w: 720, h: 1600, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-07.jpg", w: 1076, h: 1184, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-08.jpg", w: 1122, h: 1402, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-09.jpg", w: 736, h: 566, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-10.jpg", w: 1536, h: 1024, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
    { src: "/images/decor/birthday/birthday-11.jpg", w: 1076, h: 668, alt: "Birthday balloon decoration with backdrop and cake table in Patna" },
  ],
  "surprise-birthday": [
    { src: "/images/decor/surprise-birthday/surprise-birthday-01.jpg", w: 1080, h: 943, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-02.jpg", w: 1076, h: 1224, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-03.jpg", w: 1080, h: 1368, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-04.jpg", w: 1080, h: 1135, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-05.jpg", w: 1031, h: 1019, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-06.jpg", w: 1080, h: 818, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-07.jpg", w: 1080, h: 736, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-08.jpg", w: 1080, h: 1268, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-09.jpg", w: 1080, h: 1136, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-10.jpg", w: 1080, h: 1352, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-11.jpg", w: 1080, h: 1324, alt: "Surprise birthday room decoration set up at home in Patna" },
    { src: "/images/decor/surprise-birthday/surprise-birthday-12.jpg", w: 1080, h: 1112, alt: "Surprise birthday room decoration set up at home in Patna" },
  ],
  "theme-birthday": [
    { src: "/images/decor/theme-birthday/theme-birthday-01.jpg", w: 1589, h: 990, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-02.jpg", w: 1600, h: 908, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-03.jpg", w: 1572, h: 1001, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-04.jpg", w: 1498, h: 1050, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-05.jpg", w: 1358, h: 1159, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-06.jpg", w: 1080, h: 744, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-07.jpg", w: 1600, h: 1200, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
    { src: "/images/decor/theme-birthday/theme-birthday-08.jpg", w: 1080, h: 492, alt: "Themed birthday balloon decoration with props and backdrop in Patna" },
  ],
  "welcome-baby": [
    { src: "/images/decor/welcome-baby/welcome-baby-01.jpg", w: 970, h: 1600, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-02.jpg", w: 1080, h: 980, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-03.jpg", w: 1080, h: 916, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-04.jpg", w: 1076, h: 1012, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-05.jpg", w: 1080, h: 648, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-06.jpg", w: 1076, h: 1060, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-07.jpg", w: 1080, h: 1524, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-08.jpg", w: 1076, h: 944, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-09.jpg", w: 1080, h: 1416, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
    { src: "/images/decor/welcome-baby/welcome-baby-10.jpg", w: 1080, h: 1104, alt: "Welcome baby home decoration with balloons and name lettering in Patna" },
  ],
};

/** Flat list, useful for the gallery. */
export const allPhotos: (Photo & { category: PhotoCategory })[] = (
  Object.entries(photos) as [PhotoCategory, Photo[]][]
).flatMap(([category, list]) => list.map((p) => ({ ...p, category })));

/**
 * Photographs where a customer's name is legible on the backdrop or in
 * marquee letters.
 *
 * Checked by eye, one file at a time — two of them (SHREEJA in light-up
 * letters, "Welcome Baby Balhara") read as generic at thumbnail size and only
 * gave themselves up when zoomed, so this list cannot be rebuilt by pattern
 * matching. Add to it after looking, not after guessing.
 */
const NAMED_BACKDROPS = new Set([
  "theme-birthday-01", "theme-birthday-02", "theme-birthday-03", "theme-birthday-04",
  "theme-birthday-05", "theme-birthday-06", "theme-birthday-08",
  "baby-boy-theme-02", "baby-boy-theme-04", "baby-boy-theme-05", "baby-boy-theme-07",
  "annaprashan-01", "annaprashan-07", "annaprashan-11", "annaprashan-14",
  "annaprashan-16", "annaprashan-17",
  "welcome-baby-01", "welcome-baby-03", "welcome-baby-04",
  "birthday-01", "birthday-03", "birthday-08", "birthday-11",
  "surprise-birthday-06", "surprise-birthday-09",
  "anniversary-04", "anniversary-06", "anniversary-18", "anniversary-19",
  "adult-01", "adult-03", "adult-09",
  "baby-girl-04", "baby-girl-05", "baby-shower-11",
]);

/** True when a customer's name is legible in the photograph. */
export const isNamedBackdrop = (src: string) => {
  const file = src.split("/").pop()?.replace(".jpg", "") ?? "";
  return NAMED_BACKDROPS.has(file);
};

const isNamed = isNamedBackdrop;

/**
 * First n photos of a category, with named backdrops filtered out.
 *
 * The filter lives here rather than at each call site because every marketing
 * surface — occasion heroes, decoration showcases, the mega menu, card
 * fallbacks — resolves through this one function. Fixing them individually
 * meant chasing the same leak across nine pages and missing some.
 *
 * `allPhotos` is deliberately NOT filtered: /gallery is the studio's portfolio
 * and shows the work as it was shot. This is about not putting somebody's
 * child's name on a page selling a package.
 */
export const photosFor = (category: PhotoCategory, n = 99): Photo[] =>
  (photos[category] ?? []).filter((p) => !isNamed(p.src)).slice(0, n);

/** Look up a single photograph by its src, for hand-picked selections. */
const bySrc = new Map<string, Photo>(allPhotos.map((p) => [p.src, p]));
export const photoBySrc = (src: string): Photo | undefined => bySrc.get(src);

/**
 * Resolve an explicit list of picked photo srcs into full Photo objects,
 * dropping any that no longer exist (e.g. an image removed from the library).
 */
export const pickPhotos = (srcs: string[] | undefined): Photo[] =>
  (srcs ?? []).map((s) => bySrc.get(s)).filter((p): p is Photo => Boolean(p));
