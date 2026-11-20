import { DossierTabItem, GalleryItem } from "@/types/botanical";

export const DOSSIER_TABS: DossierTabItem[] = [
  {
    id: "history",
    labelKa: "ისტორია",
    labelEn: "History",
    eyebrowKa: "01 / ბოტანიკური მემკვიდრეობა",
    eyebrowEn: "01 / BOTANICAL HERITAGE",
    titleKa: "იმპერატორთა სიმბოლოდან თანამედროვე აგრო-ინვესტიციამდე",
    titleEn: "From Imperial Symbol to Modern Agro-Investment",
    paragraphsKa: [
      "პავლოვნია (Paulownia Tomentosa), რომელსაც აღმოსავლეთში „იმპერატორის ხეს“ და „ფენიქსის ხეს“ უწოდებენ, საუკუნეების განმავლობაში კეთილდღეობისა და განახლების სიმბოლოდ მიიჩნეოდა. სახელწოდება მან ნიდერლანდების დედოფლის, ანა პავლოვნას პატივსაცემად მიიღო.",
      "დღეს სელექციური პავლოვნია მსოფლიოში ყველაზე სწრაფად მზარდი სამრეწველო მერქნის კულტურაა. საქართველოს კლიმატური ზონები — განსაკუთრებით ქართლი და კასპის რაიონი — იდეალურ პირობებს ქმნის მისი ელიტარული პლანტაციების გასაშენებლად.",
    ],
    paragraphsEn: [
      "Paulownia Tomentosa, revered in the East as the 'Empress Tree' and 'Phoenix Tree', has symbolized prosperity and regeneration for centuries, named in honor of Queen Anna Pavlovna of the Netherlands.",
      "Today, selectively bred Paulownia stands as the fastest-growing industrial timber crop globally. Georgia's microclimates—especially Kartli and the Kaspi region—offer optimal conditions for high-yield plantations.",
    ],
    metrics: [
      { value: "4–5 მ", labelKa: "ზრდა პირველ წელს", labelEn: "First-Year Growth" },
      { value: "5–7 წელი", labelKa: "სამრეწველო ჭრის ციკლი", labelEn: "Harvest Cycle" },
      { value: "4×", labelKa: "რეგენერაცია ერთი ფესვიდან", labelEn: "Regrowth Cycles" },
    ],
  },
  {
    id: "care",
    labelKa: "დარგვა და მოვლა",
    labelEn: "Cultivation",
    eyebrowKa: "02 / აგროტექნიკური პროტოკოლი",
    eyebrowEn: "02 / AGRONOMIC PROTOCOL",
    titleKa: "სწორი დარგვა, წვეთოვანი რწყვა და ტექნიკური გასხვლა",
    titleEn: "Precision Planting, Drip Irrigation & Technical Pruning",
    paragraphsKa: [
      "სამრეწველო პლანტაციისთვის ოპტიმალური სქემაა 4×4 მეტრი (625 ნერგი 1 ჰექტარზე), რაც ხეს აძლევს მაქსიმალურ სინათლესა და სწორი, უკვანძო ღეროს ჩამოყალიბების საშუალებას.",
      "პირველი ორი წლის განმავლობაში აუცილებელია წვეთოვანი სარწყავი სისტემა და გაზაფხულზე ტექნიკური გადაჭრა (ე.წ. „კოპისინგი“), რის შემდეგაც ფესვთა ძლიერი სისტემა ერთ სეზონში 4-5 მეტრიან იდეალურად სწორ ტანს ამოიყრის.",
    ],
    paragraphsEn: [
      "For industrial timber plantations, the optimal spacing is 4×4 meters (625 seedlings per hectare), ensuring maximum sunlight exposure and straight, knot-free trunk development.",
      "During the first two years, drip irrigation and early spring technical coppicing are essential, enabling the established root system to shoot a straight 4–5 meter trunk within a single growing season.",
    ],
    metrics: [
      { value: "4 × 4 მ", labelKa: "დარგვის სტანდარტი", labelEn: "Planting Grid" },
      { value: "625", labelKa: "ნერგი / 1 ჰექტარზე", labelEn: "Trees / Hectare" },
      { value: "pH 5.5–8", labelKa: "ნიადაგის ადაპტაცია", labelEn: "Soil Tolerance" },
    ],
  },
  {
    id: "properties",
    labelKa: "თვისებები",
    labelEn: "Properties",
    eyebrowKa: "03 / მერქნის ინჟინერია",
    eyebrowEn: "03 / TIMBER ENGINEERING",
    titleKa: "ულტრა-მსუბუქი, ცეცხლგამძლე და ტენმედეგი სტრუქტურა",
    titleEn: "Ultra-Light, Fire-Resistant & Moisture-Stable Timber",
    paragraphsKa: [
      "პავლოვნიის მერქანი ცნობილია როგორც „მერქნის ალუმინი“ — მისი სიმკვრივე მხოლოდ 260–300 კგ/მ³-ია, თუმცა გააჩნია უმაღლესი სიმტკიცისა და წონის თანაფარდობა და არ დეფორმირდება შრობისას.",
      "აალების მაღალი ტემპერატურის (420°C+) და ბუნებრივი ტანინების გამო, მასალა მდგრადია ტენის, მავნებლებისა და ლპობის მიმართ, ხოლო მისი 70 სმ-იანი ფოთლები ჰექტარზე 100 ტონამდე CO₂-ს შთანთქავს.",
    ],
    paragraphsEn: [
      "Known as the 'aluminum of timber', Paulownia wood weighs just 260–300 kg/m³ while maintaining an exceptional strength-to-weight ratio with virtually zero warping during drying.",
      "With a high ignition point (420°C+) and natural tannins, it resists moisture and pests, while its massive 70 cm leaves absorb up to 100 tons of CO₂ per hectare annually.",
    ],
    metrics: [
      { value: "280 კგ/მ³", labelKa: "მერქნის სიმკვრივე", labelEn: "Wood Density" },
      { value: "420 °C", labelKa: "აალების ზღვარი", labelEn: "Ignition Point" },
      { value: "100 ტ", labelKa: "CO₂ შთანთქმა / ჰა", labelEn: "CO₂ Capture / Ha" },
    ],
  },
  {
    id: "usage",
    labelKa: "გამოყენება",
    labelEn: "Applications",
    eyebrowKa: "04 / მულტი-ინდუსტრიული ღირებულება",
    eyebrowEn: "04 / MULTI-INDUSTRY VALUE",
    titleKa: "ავეჯის წარმოებიდან იახტმშენებლობამდე და მეფუტკრეობამდე",
    titleEn: "From Bespoke Furniture to Yacht Building & Apiculture",
    paragraphsKa: [
      "მაღალი ხარისხის უკვანძო მერქანი აქტიურად გამოიყენება პრემიუმ ავეჯში, იახტებისა და თვითმფრინავების ინტერიერში, სერფბორდებში, მუსიკალურ ინსტრუმენტებსა და ეკო-მშენებლობაში.",
      "გარდა მერქნისა, გაზაფხულზე იასამნისფერი ყვავილობისას 1 ჰექტარი პლანტაცია იძლევა 700 კგ-მდე უიშვიათეს სამკურნალო თაფლს, ხოლო ცილით მდიდარი ფოთლები საუკეთესო საკვებია მეცხოველეობისთვის.",
    ],
    paragraphsEn: [
      "High-grade knot-free timber is prized in luxury furniture, yacht and aircraft interiors, surfboards, musical instruments, and sustainable architectural paneling.",
      "Beyond timber, spring violet blossoms yield up to 700 kg of rare medicinal honey per hectare, while protein-rich foliage serves as high-value livestock fodder.",
    ],
    metrics: [
      { value: "700 კგ", labelKa: "თაფლი / 1 ჰექტარზე", labelEn: "Honey / Hectare" },
      { value: "18%", labelKa: "პროტეინი ფოთოლში", labelEn: "Leaf Protein" },
      { value: "350+ მ³", labelKa: "მერქანი / ჰა (6 წ.)", labelEn: "Timber / Ha (6 Yr)" },
    ],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "nursery-01",
    code: "01 / NURSERY",
    categoryKa: "სანერგე მეურნეობა",
    categoryEn: "ELITE NURSERY",
    titleKa: "ელიტარული ნერგების სანერგე",
    titleEn: "Elite Seedling Nursery",
    descriptionKa:
      "სერტიფიცირებული 1-წლიანი ნერგები ძლიერი ფესვთა სისტემით — კასპის რაიონი, სოფ. ახალქალაქი.",
    descriptionEn:
      "Certified 1-year seedlings with vigorous root architecture — Akhalkalaki, Kaspi Municipality.",
    imageUrl:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=85",
    spanWide: true,
  },
  {
    id: "plantation-02",
    code: "02 / AKHALKALAKI ESTATE",
    categoryKa: "სამრეწველო პლანტაცია",
    categoryEn: "COMMERCIAL PLANTATION",
    titleKa: "სამრეწველო პლანტაცია საქართველოში",
    titleEn: "Commercial Plantation in Georgia",
    descriptionKa:
      "4×4 მეტრიან სტანდარტზე გაშენებული სწორღეროიანი პავლოვნიის კორომი წვეთოვანი რწყვით.",
    descriptionEn:
      "4×4m grid straight-trunk Paulownia grove engineered with automated drip irrigation.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=85",
    spanWide: true,
  },
  {
    id: "blossom-03",
    code: "03 / SPRING BLOOM",
    categoryKa: "იასამნისფერი ყვავილობა",
    categoryEn: "VIOLET BLOSSOM",
    titleKa: "სურნელოვანი ყვავილობა და თაფლოვანება",
    titleEn: "Fragrant Blossom & Honey Yield",
    descriptionKa:
      "გაზაფხულის იასამნისფერი ყვავილები, რომლებიც 700 კგ-მდე პრემიუმ თაფლს იძლევა ჰექტარზე.",
    descriptionEn:
      "Spring violet panicles producing up to 700 kg of rare medicinal honey per hectare.",
    imageUrl:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "timber-04",
    code: "04 / TIMBER HARVEST",
    categoryKa: "მერქნის ხარისხი",
    categoryEn: "TIMBER GRADE",
    titleKa: "უკვანძო საექსპორტო მერქანი",
    titleEn: "Knot-Free Export Timber",
    descriptionKa:
      "მსუბუქი, მტკიცე და ტენმედეგი მერქანი ავეჯისა და არქიტექტურული პროექტებისთვის.",
    descriptionEn:
      "Ultra-light, moisture-resistant timber engineered for luxury furniture and architecture.",
    imageUrl:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85",
  },
];