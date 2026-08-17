import { formatFormName, formatPokemonName } from "./formNames";

describe("formatFormName", () => {
  describe("labelling a form beside its species", () => {
    it("calls the base form Default, so there is a way back to it", () => {
      expect(formatFormName("pikachu", "pikachu")).toBe("Default");
    });

    it("names the form alone, since the species is already in the heading", () => {
      expect(formatFormName("pikachu-gmax", "pikachu")).toBe("Gigantamax");
      expect(formatFormName("aegislash-blade", "aegislash")).toBe("Blade");
    });

    it("keeps a multi-word suffix whole", () => {
      expect(formatFormName("charizard-mega-x", "charizard")).toBe("Mega X");
      expect(formatFormName("charizard-mega-y", "charizard")).toBe("Mega Y");
    });

    it("spells regional variants the way people say them", () => {
      expect(formatFormName("vulpix-alola", "vulpix")).toBe("Alolan");
      expect(formatFormName("meowth-galar", "meowth")).toBe("Galarian");
      expect(formatFormName("growlithe-hisui", "growlithe")).toBe("Hisuian");
      expect(formatFormName("wooper-paldea", "wooper")).toBe("Paldean");
    });

    it("strips the species rather than splitting on the first hyphen", () => {
      expect(formatFormName("mr-mime", "mr-mime")).toBe("Default");
      expect(formatFormName("mr-mime-galar", "mr-mime")).toBe("Galarian");
      expect(formatFormName("ho-oh", "ho-oh")).toBe("Default");
      expect(formatFormName("porygon-z", "porygon-z")).toBe("Default");
      expect(formatFormName("tapu-koko", "tapu-koko")).toBe("Default");
    });

    it("falls back to the whole slug for a form that does not extend its species", () => {
      expect(formatFormName("darmanitan-galar-standard", "darmanitan")).toBe("Galarian Standard");
      expect(formatFormName("unrelated", "pikachu")).toBe("Unrelated");
    });
  });

  describe("labelling a Pokemon on its own", () => {
    it("names the species and the form together", () => {
      expect(formatFormName("pikachu-gmax")).toBe("Pikachu Gigantamax");
      expect(formatFormName("charizard-mega-x")).toBe("Charizard Mega X");
    });

    it("capitalizes a plain name", () => {
      expect(formatFormName("bulbasaur")).toBe("Bulbasaur");
    });

    it("reads a hyphenated species as its own name", () => {
      expect(formatFormName("mr-mime")).toBe("Mr Mime");
      expect(formatFormName("porygon-z")).toBe("Porygon Z");
    });
  });

  it("passes an empty name straight through", () => {
    expect(formatFormName("")).toBe("");
    expect(formatFormName("", "pikachu")).toBe("");
  });
});

describe("formatPokemonName", () => {
  const pokemon = (id: string, speciesId: string, speciesName: string, name: string) => ({
    id,
    speciesId,
    speciesName,
    name,
  });

  it("names an ordinary Pokemon", () => {
    expect(formatPokemonName(pokemon("1", "1", "bulbasaur", "bulbasaur"))).toBe("Bulbasaur");
  });

  it("names a base form by its species, not by the suffix the API spells", () => {
    expect(formatPokemonName(pokemon("681", "681", "aegislash", "aegislash-shield"))).toBe(
      "Aegislash",
    );
    expect(formatPokemonName(pokemon("778", "778", "mimikyu", "mimikyu-disguised"))).toBe(
      "Mimikyu",
    );
    expect(formatPokemonName(pokemon("386", "386", "deoxys", "deoxys-normal"))).toBe("Deoxys");
  });

  it("keeps an alternate form's full label, since that is what tells it apart", () => {
    expect(formatPokemonName(pokemon("10199", "25", "pikachu", "pikachu-gmax"))).toBe(
      "Pikachu Gigantamax",
    );
    expect(formatPokemonName(pokemon("10026", "681", "aegislash", "aegislash-blade"))).toBe(
      "Aegislash Blade",
    );
  });

  it("leaves a hyphenated species whole rather than reading it as a form", () => {
    expect(formatPokemonName(pokemon("122", "122", "mr-mime", "mr-mime"))).toBe("Mr Mime");
    expect(formatPokemonName(pokemon("250", "250", "ho-oh", "ho-oh"))).toBe("Ho Oh");
    expect(formatPokemonName(pokemon("474", "474", "porygon-z", "porygon-z"))).toBe("Porygon Z");
    expect(formatPokemonName(pokemon("772", "772", "type-null", "type-null"))).toBe("Type Null");
  });

  it("names a regional variant of a hyphenated species", () => {
    expect(formatPokemonName(pokemon("10168", "122", "mr-mime", "mr-mime-galar"))).toBe(
      "Mr Mime Galarian",
    );
  });
});
