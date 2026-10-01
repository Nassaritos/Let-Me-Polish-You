/**
 * Short, factual "what life here feels like" notes for larger cities.
 * Which cities have pages is decided by live GIS data — this only adds
 * colour when we have it. Places without an entry get a computed
 * "nearest big city" line instead of invented copy.
 */
export const CITY_GUIDE: Record<string, { vibe: string; notes: string[] }> = {
  warsaw: {
    vibe: "Big-city energy, skyline included.",
    notes: ["Poland's capital and biggest city", "Home to many international companies", "Summer evenings on the Vistula boulevards", "An Old Town rebuilt brick by brick (UNESCO)"],
  },
  krakow: {
    vibe: "History on every corner, students on every other.",
    notes: ["One of Poland's biggest student cities", "Medieval Old Town (UNESCO)", "Cafés and bars in Kazimierz", "Closest big city to the Tatra Mountains"],
  },
  lodz: {
    vibe: "Old factories, new ideas.",
    notes: ["A former textile capital reinvented as a creative city", "Piotrkowska Street — the long main drag", "Street art and huge murals", "Right in the middle of Poland"],
  },
  poznan: {
    vibe: "Compact, friendly, full of students.",
    notes: ["Mechanical billy goats butt heads above the Old Market Square at noon", "A big university city", "Lake Malta for running, rowing and summer"],
  },
  wroclaw: {
    vibe: "A city of islands, bridges and tiny dwarfs.",
    notes: ["Built across islands on the Oder river", "Hundreds of small dwarf statues to hunt", "Lively student and nightlife scene"],
  },
  gdansk: {
    vibe: "Port city by the Baltic.",
    notes: ["Part of the Tricity with Sopot and Gdynia", "Beaches a tram ride away", "Colourful waterfront on the Motława"],
  },
  katowice: {
    vibe: "Industrial roots, modern sound.",
    notes: ["Heart of the Silesian metropolis", "The Spodek arena, shaped like a flying saucer", "A strong live-music culture"],
  },
  lublin: {
    vibe: "Eastern Poland's student capital.",
    notes: ["Several universities and a young population", "An atmospheric Old Town", "Festivals in the streets in summer"],
  },
};
