// Owner-editable business settings. Change values here to update the whole site.
export const site = {
  name: "Subday Pizza",
  phone: "8796130029",
  whatsapp: "918796130029",
  mapsUrl: "https://maps.app.goo.gl/3UzzP3ZSu8RxQLte7?g_st=ac",
  city: "Gurugram, Haryana",
  delivery: { minOrder: 399, radiusKm: 3 },
  partyHall: {
    packagePrice: 1500,
    hourlyRate: 400,
    threeHourRate: 1000,
    packageItems: [
      "One large pizza",
      "One sandwich",
      "One burger",
      "One plate of pasta",
      "One cold coffee",
      "One plate of fries",
      "One stick garlic bread",
    ],
  },
};

export const telHref = `tel:+91${site.phone}`;
