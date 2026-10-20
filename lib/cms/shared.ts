import type { CmsCopy } from "./schema";
export function sharedContent(copy: CmsCopy) {
  const WORKSPOOR_NAV = [
    { href: copy.link_001 ?? "/diensten", label: copy.tekst_002 ?? "Diensten" },
    {
      href: copy.link_003 ?? "/ai-geletterdheid",
      label: copy.tekst_004 ?? "AI-geletterdheid",
    },
    { href: copy.link_005 ?? "/kennis", label: copy.tekst_006 ?? "Kennis" },
    {
      href: copy.link_007 ?? "/praktijkvoorbeelden",
      label: copy.tekst_008 ?? "Praktijkvoorbeelden",
    },
    {
      href: copy.link_009 ?? "/over",
      label: copy.tekst_010 ?? "Over Setpiece",
    },
  ] as const;

  const HOME_PROOF = [
    {
      result: copy.tekst_011 ?? "Tot 80%",
      title: copy.tekst_012 ?? "minder tijd nodig",
      body:
        copy.tekst_013 ??
        "Bij opstellingen, trainingsvoorbereiding en spelersontwikkeling binnen Nankaro.",
      context:
        copy.tekst_014 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
    },
    {
      result: copy.tekst_015 ?? "Dagelijks",
      title: copy.tekst_016 ?? "sneller kunnen beslissen",
      body:
        copy.tekst_017 ??
        "Markt- en verkoopinformatie kwam sneller beschikbaar voor beleidsbeslissers bij Cameranu.",
      context:
        copy.tekst_018 ??
        "Analyse en samenvatting van terugkerende marktinformatie.",
    },
    {
      result: copy.tekst_019 ?? "Circa 70%",
      title: copy.tekst_020 ?? "tijdwinst in productie",
      body:
        copy.tekst_021 ??
        "Nieuwsbriefproductie bij A.Vogel versnelde door website-inhoud geschikt te maken voor hergebruik.",
      context:
        copy.tekst_022 ?? "E-mailmarketing binnen de toegepaste werkwijze.",
    },
  ] as const;

  const WORKLINE_STEPS = [
    {
      label: copy.tekst_023 ?? "Begrijpen",
      state: copy.tekst_024 ?? "Terugkerend verlies wordt zichtbaar.",
      action:
        copy.tekst_025 ??
        "Bedrijfsdoel, werkproces en nulmeting concreet maken.",
      owner: copy.tekst_026 ?? "Beslisser + proceseigenaar",
    },
    {
      label: copy.tekst_027 ?? "Kiezen",
      state: copy.tekst_028 ?? "De eerste haalbare prioriteit is onderbouwd.",
      action:
        copy.tekst_029 ??
        "Maximaal drie processen vergelijken op waarde, risico en uitvoerbaarheid.",
      owner: copy.tekst_030 ?? "Setpiece",
    },
    {
      label: copy.tekst_031 ?? "Werkend maken",
      state: copy.tekst_032 ?? "Eén kleine verbetering is in echt werk getest.",
      action:
        copy.tekst_033 ??
        "De werkwijze inrichten, gebruiken en bijstellen met een medewerker.",
      owner: copy.tekst_034 ?? "Medewerker + Setpiece",
    },
    {
      label: copy.tekst_035 ?? "Borgen",
      state: copy.tekst_036 ?? "De organisatie kan zelfstandig verder.",
      action:
        copy.tekst_037 ??
        "Eigenaarschap, instructie, meting en vervolgbesluit vastleggen.",
      owner: copy.tekst_038 ?? "Proceseigenaar",
    },
  ] as const;

  const SERVICE_ROUTE = [
    {
      name: copy.tekst_039 ?? "Kansenscan",
      href: copy.link_040 ?? "/kansenscan",
      when:
        copy.tekst_041 ??
        "Je weet dat werk beter kan, maar nog niet waar je verantwoord begint.",
      result:
        copy.tekst_042 ??
        "Prioriteit, 90-dagenroute en één kleine werkende AI-oplossing.",
      price: copy.tekst_043 ?? "€ 1.250",
      note: copy.tekst_044 ?? "Vaste eerste stap",
    },
    {
      name: copy.tekst_045 ?? "Implementatiesprint",
      href: copy.link_046 ?? "/ai-implementatie",
      when:
        copy.tekst_047 ??
        "De prioriteit is duidelijk en moet werkend en overdraagbaar worden.",
      result:
        copy.tekst_048 ??
        "Maximaal twee samenhangende AI-workflows, getest met medewerkers.",
      price: copy.tekst_049 ?? "€ 7.500",
      note: copy.tekst_050 ?? "Gericht vervolg",
    },
    {
      name: copy.tekst_051 ?? "Groeipartnerschap",
      href: copy.link_052 ?? "/ai-groeipartner",
      when:
        copy.tekst_053 ??
        "De werkwijze moet blijven werken en gecontroleerd verbeteren.",
      result:
        copy.tekst_054 ??
        "Borging, optimalisatie en nieuwe AI-kansen binnen vaste capaciteit.",
      price: copy.tekst_055 ?? "Vanaf € 2.250 p/m",
      note: copy.tekst_056 ?? "Minimaal zes maanden",
    },
  ] as const;

  const PRACTICE_CASES = [
    {
      id: "set-in",
      name: copy.tekst_057 ?? "Set In",
      summary:
        copy.tekst_058 ?? "Van zichtbare kansen naar een werkende AI-workflow.",
      before:
        copy.tekst_059 ??
        "AI-kansen waren zichtbaar, maar moesten worden vertaald naar een werkende workflow en gerichte uitvoering.",
      change:
        copy.tekst_060 ??
        "Een werksessie, eerste AI-workflow en marketingplan vormden de basis voor tijdelijke aansturing en overdracht.",
      result: copy.tekst_061 ?? "De eerste AI-workflow is gerealiseerd.",
      context:
        copy.tekst_062 ??
        "Nulmeting en vervolgmeting zijn nog niet afgerond. Er wordt geen effectcijfer geclaimd.",
    },
    {
      id: "nankaro",
      name: copy.tekst_063 ?? "Nankaro",
      summary:
        copy.tekst_064 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
      before:
        copy.tekst_065 ??
        "Trainers besteedden veel tijd aan opstellingen, trainingsvoorbereiding en het bijhouden van spelersontwikkeling.",
      change:
        copy.tekst_066 ??
        "Een AI-ondersteunde toepassing verbond planning, communicatie en voortgang rond het team.",
      result:
        copy.tekst_067 ??
        "Tot 80 procent tijdwinst binnen opstellingen, trainingsvoorbereiding en spelersontwikkeling.",
      context:
        copy.tekst_068 ??
        "Gemeten binnen de genoemde werkzaamheden en productcontext.",
    },
    {
      id: "cameranu",
      name: copy.tekst_069 ?? "Cameranu",
      summary:
        copy.tekst_070 ??
        "Dagelijkse marktinformatie voor beleids- en salesbeslissingen.",
      before:
        copy.tekst_071 ??
        "Beleids- en salesbeslissers moesten marktinformatie verzamelen voordat zij konden handelen.",
      change:
        copy.tekst_072 ??
        "Een AI-workflow analyseerde marktontwikkelingen en maakte de samenvatting dagelijks beschikbaar.",
      result:
        copy.tekst_073 ??
        "Sneller beschikbare relevante informatie voor dagelijkse beleids- en salesbeslissingen.",
      context:
        copy.tekst_074 ??
        "Geen publiek tijdscijfer. De uitkomst wordt daarom kwalitatief beschreven.",
    },
    {
      id: "avogel",
      name: copy.tekst_075 ?? "A.Vogel",
      summary:
        copy.tekst_076 ?? "Hergebruik van website-inhoud in e-mailmarketing.",
      before:
        copy.tekst_077 ??
        "Het samenstellen van nieuwsbrieven vroeg veel handmatige voorbereiding.",
      change:
        copy.tekst_078 ??
        "Een AI-workflow maakte website-inhoud geschikt voor hergebruik in e-mailmarketing.",
      result:
        copy.tekst_079 ??
        "Circa 70 procent tijdwinst bij nieuwsbriefproductie.",
      context:
        copy.tekst_080 ??
        "Binnen de toegepaste werkwijze voor het samenstellen van nieuwsbrieven.",
    },
  ] as const;

  const FAQ_ITEMS = [
    {
      question:
        copy.tekst_081 ?? "Moeten we al weten welke oplossing we nodig hebben?",
      answer:
        copy.tekst_082 ??
        "Nee. De scan begint bij het bedrijfsdoel en het huidige werk. Pas daarna wordt bepaald welke AI-oplossing of workflow past.",
    },
    {
      question: copy.tekst_083 ?? "Wat is een kleine werkende AI-oplossing?",
      answer:
        copy.tekst_084 ??
        "Een afgebakende AI-oplossing die een medewerker met een representatief voorbeeld kan gebruiken en testen. Zo wordt de waarde zichtbaar zonder het hele proces ineens te vervangen.",
    },
    {
      question:
        copy.tekst_085 ?? "Hoeveel tijd vraagt de scan van onze medewerkers?",
      answer:
        copy.tekst_086 ??
        "De vaste kern is een voorbereidingsvragenlijst, een werksessie van maximaal 90 minuten, drie representatieve voorbeelden en een korte gebruikstest. Er worden maximaal drie sleutelpersonen betrokken.",
    },
    {
      question: copy.tekst_087 ?? "Wat gebeurt er met gevoelige gegevens?",
      answer:
        copy.tekst_088 ??
        "Setpiece vraagt alleen wat noodzakelijk is. Waar mogelijk werken we met veilige testgegevens of geminimaliseerde voorbeelden. Zonder duidelijke rollen, grondslag of beveiliging stopt de uitvoering.",
    },
    {
      question:
        copy.tekst_089 ?? "Zijn we na de scan verplicht om verder te gaan?",
      answer:
        copy.tekst_090 ??
        "Nee. De kansenscan is een zelfstandige dienst. Het advies kan zijn om te stoppen, zelf verder te gaan, een implementatiesprint te starten of eerst een aparte verkenning te doen.",
    },
  ] as const;

  const LITERACY_PATH = "/ai-geletterdheid";
  const LITERACY_REQUEST_PATH = "/ai-geletterdheid/aanvragen";
  const LITERACY_ARTICLE_PATH = "/kennis/ai-geletterdheid-verplicht";
  const LITERACY_REVIEW_DATE = "2026-09-25";
  const LITERACY_DESCRIPTION =
    copy.literacy_tekst_001 ??
    "Praktische training AI-geletterdheid voor je team. Oefen met dagelijks werk, maak veilige werkafspraken en bespreek het gebruik na 30 dagen. Ook lezingen.";

  const LITERACY_FAQ = [
    {
      question:
        copy.literacy_tekst_002 ?? "Voor wie is deze AI-training bedoeld?",
      answer:
        copy.literacy_tekst_003 ??
        "Voor medewerkers en leidinggevenden van B2B-dienstverleners die AI gebruiken of ermee beginnen. Setpiece richt zich op organisaties met ongeveer 15 tot 75 medewerkers. We trainen maximaal twaalf deelnemers tegelijk, zodat iedereen kan oefenen. Technische voorkennis is niet nodig.",
    },
    {
      question:
        copy.literacy_tekst_004 ?? "Wat kost een training AI-geletterdheid?",
      answer:
        copy.literacy_tekst_005 ??
        "Je ontvangt vooraf een vaste offerte op basis van de groepsgrootte, werkvorm, locatie en voorbereiding. De teamtraining omvat intake, drie uur training, materiaal, werkafspraken en één online gebruiksgesprek na ongeveer dertig dagen. Reis- en eventuele licentiekosten spreken we vooraf af.",
    },
    {
      question:
        copy.literacy_tekst_006 ??
        "Kunnen we werken met ChatGPT of Microsoft Copilot?",
      answer:
        copy.literacy_tekst_007 ??
        "Ja, wanneer je organisatie de hulpmiddelen en accounts heeft goedgekeurd. We kiezen vooraf maximaal twee hulpmiddelen. De vaardigheden zijn breder toepasbaar: opdrachten geven, bronnen controleren, gegevens beschermen en zelf beslissen. We oefenen met fictieve of aantoonbaar vrijgegeven voorbeelden.",
    },
    {
      question:
        copy.literacy_tekst_008 ??
        "Is de training ook op locatie of online mogelijk?",
      answer:
        copy.literacy_tekst_009 ??
        "Beide zijn mogelijk. Setpiece werkt vanuit Almere, met bijzondere aandacht voor Flevoland, Friesland, Groningen en Drenthe. Opdrachten elders in Nederland zijn mogelijk in overleg. Deelnemers hebben voor de oefeningen een laptop en toegang tot de afgesproken hulpmiddelen nodig.",
    },
    {
      question:
        copy.literacy_tekst_010 ?? "Is één lezing genoeg voor ons team?",
      answer:
        copy.literacy_tekst_011 ??
        "Een lezing helpt bij bewustwording en een gedeeld vertrekpunt. Voor leren toepassen en controleren is oefenen nodig. We bespreken vooraf of een lezing bij jullie doel past of dat een teamtraining met opvolging geschikter is.",
    },
    {
      question:
        copy.literacy_tekst_012 ??
        "Krijgen we een certificaat of garantie op naleving?",
      answer:
        copy.literacy_tekst_013 ??
        "Je ontvangt een overzicht van de behandelde onderwerpen, deelname en werkafspraken. Dat is geen officieel certificaat of garantie dat je organisatie aan alle wetgeving voldoet. De organisatie blijft verantwoordelijk voor de eigen keuzes en toepassing.",
    },
    {
      question:
        copy.literacy_tekst_014 ?? "Moeten we eerst een kansenscan afnemen?",
      answer:
        copy.literacy_tekst_015 ??
        "Nee. De training is zelfstandig af te nemen. Wil je daarna een volledig werkproces onderzoeken of verbeteren, dan kan een betaalde kansenscan een passende vervolgstap zijn. Je zit nergens aan vast.",
    },
  ] as const;

  const LITERACY_SOURCES = {
    commission:
      copy.literacy_tekst_016 ??
      "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers",
    policy:
      copy.literacy_tekst_017 ??
      "https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy",
    authority:
      copy.literacy_tekst_018 ??
      "https://autoriteitpersoonsgegevens.nl/actueel/verder-bouwen-aan-ai-geletterdheid",
  };

  const KNOWLEDGE_REVIEW_DATE = "2026-09-25";
  const KNOWLEDGE_ARTICLES = [
    {
      slug: "bedrijfsprocessen-automatiseren",
      title:
        copy.knowledge_tekst_001 ??
        "Welke bedrijfsprocessen kun je automatiseren met AI?",
      description:
        copy.knowledge_tekst_002 ??
        "Kies een herhaalbaar werkproces, toets de gegevens en bepaal waar menselijke controle nodig blijft.",
      label: copy.knowledge_tekst_003 ?? "Proceskeuze",
    },
    {
      slug: "ai-resultaat-meten",
      title:
        copy.knowledge_tekst_004 ??
        "Wat kost AI-implementatie en hoe meet je het resultaat?",
      description:
        copy.knowledge_tekst_005 ??
        "Vergelijk investering, controletijd, kwaliteit en dagelijks gebruik. Met de tarieven en meetaanpak van Setpiece.",
      label: copy.knowledge_tekst_006 ?? "Kosten en resultaat",
    },
    {
      slug: "ai-werkafspraken",
      title:
        copy.knowledge_tekst_007 ??
        "AI-werkafspraken voor medewerkers: wat leg je vast?",
      description:
        copy.knowledge_tekst_008 ??
        "Een praktisch voorbeeld voor toegestane hulpmiddelen, gegevens, controle, verantwoordelijkheid en opvolging.",
      label: copy.knowledge_tekst_009 ?? "Werken met AI",
    },
    {
      slug: "ai-geletterdheid-verplicht",
      title:
        copy.knowledge_tekst_010 ??
        "AI-geletterdheid verplicht: wat moeten bedrijven regelen?",
      description:
        copy.knowledge_tekst_011 ??
        "Actuele uitleg over artikel 4, de keuze van een werkvorm en de betekenis van een cursus of certificaat.",
      label: copy.knowledge_tekst_012 ?? "AI-geletterdheid",
    },
  ] as const;

  return {
    WORKSPOOR_NAV,
    HOME_PROOF,
    WORKLINE_STEPS,
    SERVICE_ROUTE,
    PRACTICE_CASES,
    FAQ_ITEMS,
    LITERACY_PATH,
    LITERACY_REQUEST_PATH,
    LITERACY_ARTICLE_PATH,
    LITERACY_REVIEW_DATE,
    LITERACY_DESCRIPTION,
    LITERACY_FAQ,
    LITERACY_SOURCES,
    KNOWLEDGE_REVIEW_DATE,
    KNOWLEDGE_ARTICLES,
  };
}
