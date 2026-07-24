export const WORKSPOOR_NAV = [
  { href: "/kansenscan", label: "Kansenscan" },
  { href: "/werkwijze", label: "Werkwijze" },
  { href: "/praktijkvoorbeelden", label: "Praktijkvoorbeelden" },
  { href: "/over", label: "Over Setpiece" },
] as const;

export const HOME_PROOF = [
  {
    result: "Tot 80%",
    title: "minder tijd nodig",
    body: "Bij opstellingen, trainingsvoorbereiding en spelersontwikkeling binnen Nankaro.",
    context: "Productontwikkeling en procesverbetering binnen voetbalclubs.",
  },
  {
    result: "Dagelijks",
    title: "sneller kunnen beslissen",
    body: "Markt- en verkoopinformatie kwam sneller beschikbaar voor beleidsbeslissers bij Cameranu.",
    context: "Analyse en samenvatting van terugkerende marktinformatie.",
  },
  {
    result: "Circa 70%",
    title: "tijdwinst in productie",
    body: "Nieuwsbriefproductie bij A.Vogel versnelde door website-inhoud geschikt te maken voor hergebruik.",
    context: "E-mailmarketing binnen de toegepaste werkwijze.",
  },
] as const;

export const WORKLINE_STEPS = [
  {
    label: "Begrijpen",
    state: "Terugkerend verlies wordt zichtbaar.",
    action: "Bedrijfsdoel, werkproces en nulmeting concreet maken.",
    owner: "Beslisser + proceseigenaar",
  },
  {
    label: "Kiezen",
    state: "De eerste haalbare prioriteit is onderbouwd.",
    action: "Maximaal drie processen vergelijken op waarde, risico en uitvoerbaarheid.",
    owner: "Setpiece",
  },
  {
    label: "Werkend maken",
    state: "Eén kleine verbetering is in echt werk getest.",
    action: "De werkwijze inrichten, gebruiken en bijstellen met een medewerker.",
    owner: "Medewerker + Setpiece",
  },
  {
    label: "Borgen",
    state: "De organisatie kan zelfstandig verder.",
    action: "Eigenaarschap, instructie, meting en vervolgbesluit vastleggen.",
    owner: "Proceseigenaar",
  },
] as const;

export const SERVICE_ROUTE = [
  {
    name: "Kansenscan",
    when: "Je weet dat werk beter kan, maar nog niet waar je verantwoord begint.",
    result: "Prioriteit, 90-dagenroute en één kleine werkende AI-oplossing.",
    price: "€ 1.250",
    note: "Vaste eerste stap",
  },
  {
    name: "Implementatiesprint",
    when: "De prioriteit is duidelijk en moet werkend en overdraagbaar worden.",
    result: "Maximaal twee samenhangende AI-workflows, getest met medewerkers.",
    price: "€ 7.500",
    note: "Gericht vervolg",
  },
  {
    name: "Groeipartnerschap",
    when: "De werkwijze moet blijven werken en gecontroleerd verbeteren.",
    result: "Borging, optimalisatie en nieuwe AI-kansen binnen vaste capaciteit.",
    price: "Vanaf € 2.250 p/m",
    note: "Minimaal zes maanden",
  },
] as const;

export const PRACTICE_CASES = [
  {
    id: "set-in",
    name: "Set In",
    summary: "Van zichtbare kansen naar een werkende AI-workflow.",
    before:
      "AI-kansen waren zichtbaar, maar moesten worden vertaald naar een werkende workflow en gerichte uitvoering.",
    change:
      "Een werksessie, eerste AI-workflow en marketingplan vormden de basis voor tijdelijke aansturing en overdracht.",
    result: "De eerste AI-workflow is gerealiseerd.",
    context: "Nulmeting en vervolgmeting zijn nog niet afgerond. Er wordt geen effectcijfer geclaimd.",
  },
  {
    id: "nankaro",
    name: "Nankaro",
    summary: "Productontwikkeling en procesverbetering binnen voetbalclubs.",
    before:
      "Trainers besteedden veel tijd aan opstellingen, trainingsvoorbereiding en het bijhouden van spelersontwikkeling.",
    change:
      "Een AI-ondersteunde toepassing verbond planning, communicatie en voortgang rond het team.",
    result:
      "Tot 80 procent tijdwinst binnen opstellingen, trainingsvoorbereiding en spelersontwikkeling.",
    context: "Gemeten binnen de genoemde werkzaamheden en productcontext.",
  },
  {
    id: "cameranu",
    name: "Cameranu",
    summary: "Dagelijkse marktinformatie voor beleids- en salesbeslissingen.",
    before:
      "Beleids- en salesbeslissers moesten marktinformatie verzamelen voordat zij konden handelen.",
    change:
      "Een AI-workflow analyseerde marktontwikkelingen en maakte de samenvatting dagelijks beschikbaar.",
    result:
      "Sneller beschikbare relevante informatie voor dagelijkse beleids- en salesbeslissingen.",
    context: "Geen publiek tijdscijfer. De uitkomst wordt daarom kwalitatief beschreven.",
  },
  {
    id: "avogel",
    name: "A.Vogel",
    summary: "Hergebruik van website-inhoud in e-mailmarketing.",
    before: "Het samenstellen van nieuwsbrieven vroeg veel handmatige voorbereiding.",
    change:
      "Een AI-workflow maakte website-inhoud geschikt voor hergebruik in e-mailmarketing.",
    result: "Circa 70 procent tijdwinst bij nieuwsbriefproductie.",
    context: "Binnen de toegepaste werkwijze voor het samenstellen van nieuwsbrieven.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Moeten we al weten welke oplossing we nodig hebben?",
    answer:
      "Nee. De scan begint bij het bedrijfsdoel en het huidige werk. Pas daarna wordt bepaald welke AI-oplossing of workflow past.",
  },
  {
    question: "Wat is een kleine werkende AI-oplossing?",
    answer:
      "Een afgebakende AI-oplossing die een medewerker met een representatief voorbeeld kan gebruiken en testen. Zo wordt de waarde zichtbaar zonder het hele proces ineens te vervangen.",
  },
  {
    question: "Hoeveel tijd vraagt de scan van onze medewerkers?",
    answer:
      "De vaste kern is een voorbereidingsvragenlijst, een werksessie van maximaal 90 minuten, drie representatieve voorbeelden en een korte gebruikstest. Er worden maximaal drie sleutelpersonen betrokken.",
  },
  {
    question: "Wat gebeurt er met gevoelige gegevens?",
    answer:
      "Setpiece vraagt alleen wat noodzakelijk is. Waar mogelijk werken we met veilige testgegevens of geminimaliseerde voorbeelden. Zonder duidelijke rollen, grondslag of beveiliging stopt de uitvoering.",
  },
  {
    question: "Zijn we na de scan verplicht om verder te gaan?",
    answer:
      "Nee. De kansenscan is een zelfstandige dienst. Het advies kan zijn om te stoppen, zelf verder te gaan, een implementatiesprint te starten of eerst een aparte verkenning te doen.",
  },
] as const;
