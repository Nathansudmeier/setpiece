import type { CmsCopy } from "./schema";
export function sharedContent(copy: CmsCopy) {
  const WORKSPOOR_NAV = [
    {
      href: copy.link_001 ?? "/kansenscan",
      label: copy.tekst_002 ?? "Kansenscan",
    },
    {
      href: copy.link_003 ?? "/werkwijze",
      label: copy.tekst_004 ?? "Werkwijze",
    },
    {
      href: copy.link_005 ?? "/praktijkvoorbeelden",
      label: copy.tekst_006 ?? "Praktijkvoorbeelden",
    },
    {
      href: copy.link_007 ?? "/over",
      label: copy.tekst_008 ?? "Over Setpiece",
    },
  ] as const;

  const HOME_PROOF = [
    {
      result: copy.tekst_009 ?? "Tot 80%",
      title: copy.tekst_010 ?? "minder tijd nodig",
      body:
        copy.tekst_011 ??
        "Bij opstellingen, trainingsvoorbereiding en spelersontwikkeling binnen Nankaro.",
      context:
        copy.tekst_012 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
    },
    {
      result: copy.tekst_013 ?? "Dagelijks",
      title: copy.tekst_014 ?? "sneller kunnen beslissen",
      body:
        copy.tekst_015 ??
        "Markt- en verkoopinformatie kwam sneller beschikbaar voor beleidsbeslissers bij Cameranu.",
      context:
        copy.tekst_016 ??
        "Analyse en samenvatting van terugkerende marktinformatie.",
    },
    {
      result: copy.tekst_017 ?? "Circa 70%",
      title: copy.tekst_018 ?? "tijdwinst in productie",
      body:
        copy.tekst_019 ??
        "Nieuwsbriefproductie bij A.Vogel versnelde door website-inhoud geschikt te maken voor hergebruik.",
      context:
        copy.tekst_020 ?? "E-mailmarketing binnen de toegepaste werkwijze.",
    },
  ] as const;

  const WORKLINE_STEPS = [
    {
      label: copy.tekst_021 ?? "Begrijpen",
      state: copy.tekst_022 ?? "Terugkerend verlies wordt zichtbaar.",
      action:
        copy.tekst_023 ??
        "Bedrijfsdoel, werkproces en nulmeting concreet maken.",
      owner: copy.tekst_024 ?? "Beslisser + proceseigenaar",
    },
    {
      label: copy.tekst_025 ?? "Kiezen",
      state: copy.tekst_026 ?? "De eerste haalbare prioriteit is onderbouwd.",
      action:
        copy.tekst_027 ??
        "Maximaal drie processen vergelijken op waarde, risico en uitvoerbaarheid.",
      owner: copy.tekst_028 ?? "Setpiece",
    },
    {
      label: copy.tekst_029 ?? "Werkend maken",
      state: copy.tekst_030 ?? "Eén kleine verbetering is in echt werk getest.",
      action:
        copy.tekst_031 ??
        "De werkwijze inrichten, gebruiken en bijstellen met een medewerker.",
      owner: copy.tekst_032 ?? "Medewerker + Setpiece",
    },
    {
      label: copy.tekst_033 ?? "Borgen",
      state: copy.tekst_034 ?? "De organisatie kan zelfstandig verder.",
      action:
        copy.tekst_035 ??
        "Eigenaarschap, instructie, meting en vervolgbesluit vastleggen.",
      owner: copy.tekst_036 ?? "Proceseigenaar",
    },
  ] as const;

  const SERVICE_ROUTE = [
    {
      name: copy.tekst_037 ?? "Kansenscan",
      when:
        copy.tekst_038 ??
        "Je weet dat werk beter kan, maar nog niet waar je verantwoord begint.",
      result:
        copy.tekst_039 ??
        "Prioriteit, 90-dagenroute en één kleine werkende AI-oplossing.",
      price: copy.tekst_040 ?? "€ 1.250",
      note: copy.tekst_041 ?? "Vaste eerste stap",
    },
    {
      name: copy.tekst_042 ?? "Implementatiesprint",
      when:
        copy.tekst_043 ??
        "De prioriteit is duidelijk en moet werkend en overdraagbaar worden.",
      result:
        copy.tekst_044 ??
        "Maximaal twee samenhangende AI-workflows, getest met medewerkers.",
      price: copy.tekst_045 ?? "€ 7.500",
      note: copy.tekst_046 ?? "Gericht vervolg",
    },
    {
      name: copy.tekst_047 ?? "Groeipartnerschap",
      when:
        copy.tekst_048 ??
        "De werkwijze moet blijven werken en gecontroleerd verbeteren.",
      result:
        copy.tekst_049 ??
        "Borging, optimalisatie en nieuwe AI-kansen binnen vaste capaciteit.",
      price: copy.tekst_050 ?? "Vanaf € 2.250 p/m",
      note: copy.tekst_051 ?? "Minimaal zes maanden",
    },
  ] as const;

  const PRACTICE_CASES = [
    {
      id: "set-in",
      name: copy.tekst_052 ?? "Set In",
      summary:
        copy.tekst_053 ?? "Van zichtbare kansen naar een werkende AI-workflow.",
      before:
        copy.tekst_054 ??
        "AI-kansen waren zichtbaar, maar moesten worden vertaald naar een werkende workflow en gerichte uitvoering.",
      change:
        copy.tekst_055 ??
        "Een werksessie, eerste AI-workflow en marketingplan vormden de basis voor tijdelijke aansturing en overdracht.",
      result: copy.tekst_056 ?? "De eerste AI-workflow is gerealiseerd.",
      context:
        copy.tekst_057 ??
        "Nulmeting en vervolgmeting zijn nog niet afgerond. Er wordt geen effectcijfer geclaimd.",
    },
    {
      id: "nankaro",
      name: copy.tekst_058 ?? "Nankaro",
      summary:
        copy.tekst_059 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
      before:
        copy.tekst_060 ??
        "Trainers besteedden veel tijd aan opstellingen, trainingsvoorbereiding en het bijhouden van spelersontwikkeling.",
      change:
        copy.tekst_061 ??
        "Een AI-ondersteunde toepassing verbond planning, communicatie en voortgang rond het team.",
      result:
        copy.tekst_062 ??
        "Tot 80 procent tijdwinst binnen opstellingen, trainingsvoorbereiding en spelersontwikkeling.",
      context:
        copy.tekst_063 ??
        "Gemeten binnen de genoemde werkzaamheden en productcontext.",
    },
    {
      id: "cameranu",
      name: copy.tekst_064 ?? "Cameranu",
      summary:
        copy.tekst_065 ??
        "Dagelijkse marktinformatie voor beleids- en salesbeslissingen.",
      before:
        copy.tekst_066 ??
        "Beleids- en salesbeslissers moesten marktinformatie verzamelen voordat zij konden handelen.",
      change:
        copy.tekst_067 ??
        "Een AI-workflow analyseerde marktontwikkelingen en maakte de samenvatting dagelijks beschikbaar.",
      result:
        copy.tekst_068 ??
        "Sneller beschikbare relevante informatie voor dagelijkse beleids- en salesbeslissingen.",
      context:
        copy.tekst_069 ??
        "Geen publiek tijdscijfer. De uitkomst wordt daarom kwalitatief beschreven.",
    },
    {
      id: "avogel",
      name: copy.tekst_070 ?? "A.Vogel",
      summary:
        copy.tekst_071 ?? "Hergebruik van website-inhoud in e-mailmarketing.",
      before:
        copy.tekst_072 ??
        "Het samenstellen van nieuwsbrieven vroeg veel handmatige voorbereiding.",
      change:
        copy.tekst_073 ??
        "Een AI-workflow maakte website-inhoud geschikt voor hergebruik in e-mailmarketing.",
      result:
        copy.tekst_074 ??
        "Circa 70 procent tijdwinst bij nieuwsbriefproductie.",
      context:
        copy.tekst_075 ??
        "Binnen de toegepaste werkwijze voor het samenstellen van nieuwsbrieven.",
    },
  ] as const;

  const FAQ_ITEMS = [
    {
      question:
        copy.tekst_076 ?? "Moeten we al weten welke oplossing we nodig hebben?",
      answer:
        copy.tekst_077 ??
        "Nee. De scan begint bij het bedrijfsdoel en het huidige werk. Pas daarna wordt bepaald welke AI-oplossing of workflow past.",
    },
    {
      question: copy.tekst_078 ?? "Wat is een kleine werkende AI-oplossing?",
      answer:
        copy.tekst_079 ??
        "Een afgebakende AI-oplossing die een medewerker met een representatief voorbeeld kan gebruiken en testen. Zo wordt de waarde zichtbaar zonder het hele proces ineens te vervangen.",
    },
    {
      question:
        copy.tekst_080 ?? "Hoeveel tijd vraagt de scan van onze medewerkers?",
      answer:
        copy.tekst_081 ??
        "De vaste kern is een voorbereidingsvragenlijst, een werksessie van maximaal 90 minuten, drie representatieve voorbeelden en een korte gebruikstest. Er worden maximaal drie sleutelpersonen betrokken.",
    },
    {
      question: copy.tekst_082 ?? "Wat gebeurt er met gevoelige gegevens?",
      answer:
        copy.tekst_083 ??
        "Setpiece vraagt alleen wat noodzakelijk is. Waar mogelijk werken we met veilige testgegevens of geminimaliseerde voorbeelden. Zonder duidelijke rollen, grondslag of beveiliging stopt de uitvoering.",
    },
    {
      question:
        copy.tekst_084 ?? "Zijn we na de scan verplicht om verder te gaan?",
      answer:
        copy.tekst_085 ??
        "Nee. De kansenscan is een zelfstandige dienst. Het advies kan zijn om te stoppen, zelf verder te gaan, een implementatiesprint te starten of eerst een aparte verkenning te doen.",
    },
  ] as const;

  return {
    WORKSPOOR_NAV,
    HOME_PROOF,
    WORKLINE_STEPS,
    SERVICE_ROUTE,
    PRACTICE_CASES,
    FAQ_ITEMS,
  };
}
