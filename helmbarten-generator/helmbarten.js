// Helmbarten RPG character generator
// © Alex Schröder 2022

function helmbartenCharakter() {

  function eins(a) {
    // Return random element of array a.
    let i = Math.floor(Math.random() * (a.length));
    if (typeof a[i] === 'function') {
      return a[i]();
    }
    return a[i];
  }

  function würfel(anzahl) {
    let total = 0;
    for (var i = 0; i < anzahl; i++) {
      total += Math.floor(Math.random() * 6 + 1);
    }
    return total;
  }

  function name(geschlecht) {
    let name;
    if (würfel(1) <= 2) {
      // kurzer Name
      if (geschlecht == '♀') {
        name = eins(['Ada', 'Berta', 'Hilde', 'Inge', 'Chloe', 'Frieda', 'Gisela']);
      } else {
        name = eins(['Gyso', 'Dodo', 'Gregor', 'Siggo', 'Ardo', 'Gundobad']);
      }
    } else {
      let teil1 = ['Adal', 'Amal', 'Bald', 'Bert', 'Brun', 'Ger', 'Chlodo', 'Charde', 'Gunde', 'Os', 'Sigi', 'Theude',
                   'Childe', 'Chilpe', 'Clot', 'Crot', 'Wisi', 'Chari', 'Ingo', 'Chrodo', 'Vulde', 'Mero', 'Dago'];
      if (geschlecht == '♀' && würfel(1) <= 4) {
        name = eins(teil1) + eins(['burg', 'gard', 'gund', 'hild', 'lind', 'trud', 'berga', 'fled']);
      } else {
        name = eins(teil1) + eins(['ger', 'man', 'mund', 'ric', 'hard', 'sind', 'mer', 'ald', 'tram', 'wech']);
        if (geschlecht == '♀') {
          name += eins(['a', 'e']);
        }
      }
    }
    name = name.replaceAll('[ie]a', 'oa');
    return name;
  }

  function dämon() {
    return eins(['Herr', 'Herrin', 'Auge', 'Zahn', 'Wolf', 'Rabe', 'Mühle']) + ' '
      + eins(['der Zeit', 'des Zorns', 'der Pest', 'der Fäulnis', 'des Abgrunds']);
  }

  function geschlecht() {
    return eins('♀♂');
  }

  /* t ist der Charakter */
  let t = {};

  t.attribute = {
    kraft: würfel(2),
    geschick: würfel(2),
    ausdauer: würfel(2),
    intelligenz: würfel(2),
    bildung: würfel(2),
    status: würfel(2),
  };

  t.attribute_text = function () {
    // Das wird hier alles explizit aufgeführt, damit die Reihenfolge stimmt.
    return `Kraft-${t.attribute.kraft} Geschick-${t.attribute.geschick}`
      + ` Ausdauer-${t.attribute.ausdauer} Intelligenz-${t.attribute.intelligenz}`
      + ` Bildung-${t.attribute.bildung} Status-${t.attribute.status}`;
  };

  t.talente = [];
  t.lerne = function (talent) {
    if (talent == 'Kämpfen') {
      if (t.talente['Reiten']) {
        talent = t.favorit = 'Lanze';
      } else if (t.favorit) {
        talent = t.favorit;
      } else {
        talent = t.favorit = s[t.karriere].waffe(t);
      }
    }
    t.talente[talent] = t.talente[talent] ? t.talente[talent] + 1 : 1;
    return talent;
  };

  t.talente_text = function () {
    if (t.gestorben) { return ''; }
    return Object.keys(t.talente)
      .map(x => { return x + '-' + t.talente[x]})
      .sort()
      .join(' ');
  }

  /* s sind die Karrierendefinitionen */
  let s = {};

  s.krieger = {
    name: 'Krieger',
    attribut: function(t) {
      return Math.max(t.attribute.kraft, t.attribute.ausdauer);
    },
    talente: {
      'Söldner gewesen': ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      'Wache geschoben': ['Bürokratie', 'Disziplin', 'Bauen', 'Prügeln', 'Brauen', 'Kämpfen'],
      'Reiter gemacht': ['Reiten', 'Singen', 'Taktik', 'Spionieren', 'Kultur', 'Kämpfen'],
      'Offizier gemacht': ['Schrift', 'Bürokratie', 'Taktik', 'Diplomatie', 'Benehmen', 'Kämpfen'],
    },
    waffe: function(t) {
      if (t.attribute.geschick > t.attribute.kraft) return 'Bogen';
      return eins(['Messer', 'Spiess', 'Halmbarte', 'Degen']);
    },
    gratis: 'Kämpfen',
    lernen: function(t) {
      let gruppe;
      if (t.alter < 20) {
        gruppe = eins(['Söldner gewesen', 'Wache geschoben']);
      } else if (t.attribute.status >= 8 || t.attribute.intelligenz >= 8) {
        gruppe = eins(['Reiter gemacht', 'Offizier gemacht']);
      } else { gruppe = eins(Object.keys(this.talente)); }
      t.geschichte.push("4 Jahre " + gruppe);
      t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(eins(this.talente[gruppe])) + ' gelernt.').join(" "));
      return;
    },
    schicksalsschlag: function(t) {
      switch(würfel(1)) {
      case 1: {
        let g = geschlecht();
        let f = name(g);
        t.feinde.push(f);
        let p = g == '♀' ? `sie` : `er`;
        t.geschichte.push(eins([
          `Der Feldzug war ein Erfolg. Ich habe drei Tage lang mit geplündert und ${f} schreckliches angetan. 😱`,
          `Wir mussten die Verletzten zurück lassen. Es war meine Entscheidung. ${f} hat es überlebt, aber verziehen hat ${p} mir nie. 🙁`,
        ]));
        break;
      }
      case 2: {
        t.geschichte.push(eins([
          'Die Belagerung war fürchterlich. Es gab nur wenig zu essen. 🙁',
          'Nach der Niederlage haben wir uns monatelang versteckt, haben gelebt im Wald gelebt wie Tiere. 🙁',
        ]));
        t.alterung()
        break;
      }
      case 3: {
        t.geschichte.push(eins([
          'Auf dem Feldzug sind wir in einen Hinterhalt geraten und ich bin schwer verletzt worden. 🙁',
          'Auf dem Feldzug bin ich krank geworden und fast gestorben. Man hat mich fast zurück gelassen. 🙁',
        ]));
        t.alterung()
        break;
      }
      case 4: {
        t.geschichte.push(eins([
          'Nach einem Unfall ist das Knie nie wieder so geworden wie früher. 😥',
          'Dann habe ich geheiratet. Das Söldnerleben war vorbei. 😁',
          'Nach dem Sieg habe ich geheult und gekotzt bis ich nicht mehr konnte. 🙁',
        ]));
        t.neue_karriere();
        break;
      }
      case 5: {
        t.geschichte.push('Der Feldzug war ein Fiasko.');
        let w = eins(['in einer Silbermine', 'auf einer Galeere', 'in einem Kerker', 'in der Arena']);
        t.verloren(`${w} verstorben. 💀`,
                   `${w} entkommen. 😌`);
        break;
      }
      case 6: {
        t.geschichte.push(
          eins([
            'Der Feldzug war ein Fehler, unser Feldherr total ahnungslos.',
            'Der Feldzug war ein Fehler, unsere Feldherrin total ahnungslos.',
            'Wir sind ihnen ahnungslos in die Falle gegangen.',
            'Wir gingen wie Vieh zum Schlachthof. Ahnungslos.']) + ' '
            + eins([
              'Ein blutiges Gemetzel. Es blieben nicht viele übrig.',
              'Die Armee wurde zerschlagen, und wir in alle Winde zerstreut.',
              'Die Fliehenden wurden niedergeritten, kaum mehr zu erkennen.']) + ' '
            + eins([
              'Ich blieb verschollen. 💀',
              'Man hat mich nie gefunden. 💀']));
        t.gestorben = true;
        break;
      }
      }
    }
  };

  s.magier = {
    name: 'Magier',
    attribut: function(t) {
      return Math.max(t.attribute.intelligenz, t.attribute.bildung);
    },
    talente: {
      'aggressive Magie studiert': ['Feuer', 'Luft', 'Wasser', 'Erde', 'Sturm', 'Kämpfen'],
      'passive Magie studiert': ['Heilung', 'Schlaf', 'Augen', 'Türen', 'Pflanzen', 'Brauen'],
      'manipulative Magie studiert': ['Bezaubern', 'Singen', 'Diplomatie', 'Illusion', 'Menschen', 'Schrift'],
      'transgressive Magie studiert': ['Gestaltwandlung', 'Nekromantie', 'Transmutation', 'Fusion', 'Tiere', 'Weltenwandel'],
    },
    waffe: function(t) {
      return 'Messer';
    },
    gratis: 'Schrift',
    lernen: function(t) {
      let gruppe = eins(Object.keys(this.talente));
      t.geschichte.push("4 Jahre " + gruppe);
      t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(eins(this.talente[gruppe])) + ' gelernt.').join(" "));
      return;
    },
    schicksalsschlag: function(t) {
      switch(würfel(1)) {
      case 1: {
        let g = geschlecht()
        let f = name(g);
        t.feinde.push(f);
        let m = g == '♀' ? `meine Mitschülerin ${f}` : `meinen Mitschüler ${f}`;
        t.geschichte.push(`Ich habe ${m} blossgestellt. 😏`);
        break;
      }
      case 2: {
        t.geschichte.push(eins([
          'Das Experiment ging schief und mich hat es getroffen. 🙁',
          'Es war mein Fehler, und ich habe jahrelang dafür bezahlt. 🙁',
        ]));
        t.alterung()
        break;
      }
      case 3: {
        let f = dämon();
        t.feinde.push(f);
        t.geschichte.push(
          eins([
            'Ich habe Dinge gesehen, die würdet ihr mir nicht glauben.',
            'Ich habe in den Abgrund geschaut. Es war fürchterlich.',
            'Die Forschung hat mich an schreckliche Orte geführt.',]) + ' '
            + eins([
              `Nun kennt der Dämon ${f} kennt meinen Namen und sucht mich. 😱`,
              `Ich habe den Dämon ${f} verspottet. Das war ein grosser Fehler. 😱`,
            ]));
        break;
      }
      case 4: {
        t.geschichte.push(eins([
          'Ich habe mich zu weit in den Raum zwischen den Welten vorgewagt und auf Yggdrasil fast den Verstand verloren. 😥',
          'Ich war nicht mehr bereit, all die Opfer zu bringen. Strenge Disziplin, jeden Tag, jede Stunde. 😥',
          'Ich wollte nur noch raus. In meinem Kopf schreien jeden Abend böse Geister. Ich kann nicht mehr. 😥',
        ]));
        t.neue_karriere();
        break;
      }
      case 5: {
        let w = eins(['Asgard', 'Alfheim', 'Myrkheim', 'Jötunheim', 'Vanaheim', 'Niflheim', 'Muspelheim']);
        t.geschichte.push(`Ich habe mich in ${w} verirrt.`);
        t.verloren(`in ${w} verstorben. 💀`,
                   'Wanderung den Weg zurück nach Midgard gefunden. 😌');
        break;
      }
      case 6: {
        let w = eins(['Asgard', 'Alfheim', 'Myrkheim', 'Jötunheim', 'Vanaheim', 'Niflheim', 'Muspelheim']);
        t.geschichte.push(
          eins([
            'Wir haben die dünne Grenze zwischen den Ebenen untersucht, und es kam zu einem Unglück.',
            `Wir waren unterwegs nach ${w}, als plötzlich die Hölle los ging.`,
            `Wir waren auf dem Rückweg von ${w}, als uns Yggradsil unter den Füssen weg brach.`, ]) + ' '
            + eins([
              'Ich habe mich für meine Freunde geopfert. Meine Seele schreit dort noch immer. 💀',
              'Und da habe ich einen Fehler gemacht. Die Macht war unkontrollierbar und hat mich verzehrt. 💀',
              'Ich habe alles gegeben. Bin ausgebrannt, alt geworden. Ich habe es nicht mehr nach Hause geschafft. 💀'
            ]));
        t.gestorben = true;
        break;
      }
      }
    }
  };

  s.taugenichts = {
    name: 'Taugenichts',
    attribut: function(t) {
      return Math.max(t.attribute.geschick, t.attribute.status);
    },
    talente: {
      'in einer Diebesbande gewesen': ['Schleichen', 'Spionieren', 'Rennen', 'Klettern', 'Ablenken', 'Knacken'],
      'in einer Schlägerbande verbracht': ['Kämpfen', 'Handwerk', 'Rennen', 'Feldscher', 'Taktik', 'Singen'],
      'gelogen und betrogen': ['Kultur', 'Benehmen', 'Bürokratie', 'Schrift', 'Reden', 'Handeln'],
      'Mörder gewesen': ['Kämpfen', 'Brauen', 'Feldscher', 'Schleichen', 'Benehmen', 'Tüfteln'],
    },
    waffe: function(t) {
      return eins(['Messer', 'Degen']);
    },
    gratis: 'Rennen',
    lernen: function(t) {
      let gruppe = eins(Object.keys(this.talente));
      t.geschichte.push("4 Jahre " + gruppe);
      t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(eins(this.talente[gruppe])) + ' gelernt.').join(" "));
      return;
    },
    schicksalsschlag: function(t) {
      switch(würfel(1)) {
      case 1: {
        let g = geschlecht()
        let f = name(g);
        t.feinde.push(f);
        let m = g == '♀' ? `meine Rivalin ${f}` : `meinen Rivalen ${f}`;
        t.geschichte.push(`Ich habe ${m} gedemütigt. 😏`);
        break;
      }
      case 2: {
        let f = name(geschlecht());
        t.feinde.push(f);
        t.geschichte.push(`Der Plan ist nicht aufgegangen. Man hat mich ausgetrickst. Nun schulde ich ${f} mehr Geld als ich je zurückzahlen kann.`);
        break;
      }
      case 3: {
        let f = name(geschlecht());
        t.feinde.push(f);
        t.geschichte.push(`Ich habe die Hilfe von falschen Freunden angenommen und mich immer weiter in ihre Sache verstricken lassen. Nun schulde ich ${f} mehr als nur einen Gefallen. 😒`);
        break;
      }
      case 4: {
        t.geschichte.push('Man hat mich erwischt und an den Pranger gestellt. Jeder kennt mein Gesicht. 😥');
        t.neue_karriere();
        break;
      }
      case 5: {
        t.geschichte.push(`Der Plan ist aufgeflogen. Ich wurde gefasst.`);
        let w = eins(['in einer Silbermine', 'auf einer Galeere', 'in einem Kerker']);
        t.verloren(`${w} verstorben. 💀`,
                   `${w} entkommen. 😌`);
        break;
      }
      case 6: {
        t.geschichte.push('Es gab einen Bandenkrieg. Die Strassenhunde sind fett geworden. Mich hat man nie wieder gesehen. 💀');
        t.gestorben = true;
        break;
      }
      }
    }
  };

  t.geschichte = [];
  t.alter = 16;
  t.geschlecht = geschlecht();
  t.name = name(t.geschlecht);
  t.karrieren = 0;
  t.gestorben = false;
  t.talente = [];
  t.verboten = [];
  t.feinde = [];
  t.favorit = '';

  t.beste_karriere = function() {
    let beste;
    let bestes_attribut = 0;
    for (let karriere of Object.keys(s)) {
      if (t.verboten.includes(karriere)) continue;
      let attribut = s[karriere].attribut(t);
      if (attribut > bestes_attribut) {
        bestes_attribut = attribut;
        beste = karriere;
      }
    }
    if (beste) t.geschichte.push(s[beste].name + ' geworden.');
    return beste;
  };

  t.karriere = t.beste_karriere();
  t.geschichte.push(t.lerne(s[t.karriere].gratis) + ' gelernt.');

  t.neue_karriere = function() {
    t.alter += 1;
    t.verboten.push(t.karriere);
    t.karriere = undefined;
  };

  t.weitermachen = function() {
    if (t.gestorben) return false;
    if (würfel(1) < t.karrieren) {
      t.geschichte.push("Ich bin bereit für das Abenteurerleben! 💚");
      return false;
    }
    if (!t.karriere) t.karriere = t.beste_karriere();
    return t.karriere;
  };

  t.karriereschritt = function() {
    t.karrieren += 1;
    t.geschichte.push(`<hr>Karriere ${t.karrieren}, Alter ${t.alter}`);
    s[t.karriere].lernen(t);
  };

  t.schicksalsschlag = function() {
    let w = würfel(2);
    let z = s[t.karriere].attribut(t);
    // t.geschichte.push(w + '+' + t.karrieren + ' ≤ ' +  z);
    if (w + t.karrieren > z) s[t.karriere].schicksalsschlag(t);
  }

  t.verloren = function(gestorben, entkommen) {
    t.alterung();
    t.alter += 4;
    let jahre = 4;
    let w = würfel(2);
    let z = s[t.karriere].attribut(t);
    while (!t.gestorben && (w + t.karrieren > z)) {
      jahre += 4;
      t.alter += 4;
      t.alterung();
    }
    if (t.gestorben) {
      t.geschichte.push(`Nach ${jahre} Jahren ${gestorben}`);
    } else {
      t.geschichte.push(`Nach ${jahre} Jahren ${entkommen}`);
    }
  };

  t.alterung = function() {
    let faktor = t.alter < 50 ? 1 : 2;
    let w = faktor == 1 ? "Etwas" : "Sehr viel";
    switch(würfel(1)) {
    case 1: {
      t.attribute.kraft = Math.max(t.attribute.kraft - faktor, 0);
      t.gestorben = t.gestorben || t.attribute.kraft <= 0;
      t.geschichte.push(`${w} schwächer geworden.`);
      break;
    }
    case 2: {
      t.attribute.geschick = Math.max(t.attribute.geschick - faktor, 0);
      t.gestorben = t.gestorben || t.attribute.geschick <= 0;
      t.geschichte.push(`${w} ungeschickter geworden.`);
      break;
    }
    case 3: {
      t.attribute.ausdauer = Math.max(t.attribute.ausdauer - faktor, 0);
      t.gestorben = t.gestorben || t.attribute.ausdauer <= 0;
      t.geschichte.push(`${w} mehr ausser Atem gekommen.`);
      break;
    }
    case 4: {
      t.attribute.intelligenz = Math.max(t.attribute.intelligenz - faktor, 0);
      t.gestorben = t.gestorben || t.attribute.intelligenz <= 0;
      t.geschichte.push(`${w} vergesslicher geworden.`);
      break;
    }
    }
  }

  t.älter_werden = function() {
    if (t.gestorben) return;
    t.alter += 4;
    if (t.alter >= 36) {
      t.alterung();
    };
  };

  while(t.weitermachen()) {
    t.karriereschritt();
    t.schicksalsschlag();
    t.älter_werden();
  }

  t.bestes_talent = function() {
    let bestes_talent;
    let bester_wert = 0;
    for (let talent of Object.keys(t.talente)) {
      if (t.talente[talent] > bester_wert) {
        bester_wert = t.talente[talent];
        bestes_talent = talent;
      }
    }
    if (bester_wert < 3) return undefined;
    return bestes_talent;
  };
  
  t.titel = function() {
    let talent = t.bestes_talent();
    if (!talent) return '';
    let titel = {};
    titel['♂'] = {
      Ablenken: 'Taschendieb',
      Augen: 'Seher',
      Bauen: 'Bauherr',
      Benehmen: 'Edelmann',
      Bezaubern: 'Silberzunge',
      Brauen: 'Giftmischer',
      Bürokratie: 'Verwalter',
      Diplomatie: 'Diplomat',
      Disziplin: 'Drillmeister',
      Erde: 'Geomant',
      Feldscher: 'Arzt',
      Feuer: 'Pyromantiker',
      Fusion: 'Fleischmagier',
      Gestaltwandlung: 'Gestaltwandler',
      Handeln: 'Händler',
      Handwerk: 'Meister',
      Heilung: 'Heiler',
      Illusion: 'Illusionistin',
      Klettern: 'Kletterer',
      Knacken: 'Einbrecher',
      Kultur: 'Gelehrter',
      Kämpfen: 'Reisläufer',
      Luft: 'Aeromant',
      Menschen: 'Menschenkenner',
      Nekromantie: 'Nekromant',
      Pflanzen: 'Botaniker',
      Prügeln: 'Schläger',
      Reden: 'Redner',
      Reiten: 'Ritter',
      Rennen: 'Läufer',
      Schlaf: 'Somnolog',
      Schleichen: 'Dieb',
      Schrift: 'Schreiber',
      Singen: 'Meistersänger',
      Spionieren: 'Spion',
      Sturm: 'Sturmmagier',
      Taktik: 'Feldherr',
      Tiere: 'Tierflüsterer',
      Transmutation: 'Alchemist',
      Tüfteln: 'Erfinder',
      Türen: 'Portalmagier',
      Wasser: 'Aquantiker',
      Weltenwandel: 'Weltenwandler',
      Messer: 'Messerstecher',
      Spiess: 'Pikenier',
      Halmbarte: 'Halbardier',
      Degen: 'Fechtmeister',
      Bogen: 'Bogenschütze',
      Lanze: 'Ritter',
    };
    titel['♀'] = {
      Ablenken: 'Taschendieb',
      Augen: 'Seher',
      Bauen: 'Bauherrin',
      Benehmen: 'Edelfrau',
      Bezaubern: 'Silberzunge',
      Brauen: 'Giftmischerin',
      Bürokratie: 'Verwalterin',
      Diplomatie: 'Dipomatin',
      Disziplin: 'Drillmeisterin',
      Erde: 'Geomantin',
      Feldscher: 'Ärztin',
      Feuer: 'Pyromantikerin',
      Fusion: 'Fleischmagierin',
      Gestaltwandlung: 'Gestaltwandlerin',
      Handeln: 'Händlerin',
      Handwerk: 'Meister',
      Heilung: 'Heilerin',
      Illusion: 'Illusionistin',
      Klettern: 'Kletterin',
      Knacken: 'Einbrecherin',
      Kultur: 'Gelehrte',
      Kämpfen: 'Reisläuferin',
      Luft: 'Aeromantin',
      Menschen: 'Menschenkennerin',
      Nekromantie: 'Nekromantin',
      Pflanzen: 'Botanikerin',
      Prügeln: 'Schlägerin',
      Reden: 'Rednerin',
      Reiten: 'Ritterin',
      Rennen: 'Läuferin',
      Schlaf: 'Somnologin',
      Schleichen: 'Diebin',
      Schrift: 'Schreiberin',
      Singen: 'Meistersängerin',
      Spionieren: 'Spionin',
      Sturm: 'Sturmmagierin',
      Taktik: 'Feldherrin',
      Tiere: 'Tierflüsterin',
      Transmutation: 'Alchemistin',
      Tüfteln: 'Erfinderin',
      Türen: 'Portalmagier',
      Wasser: 'Aquantikerin',
      Weltenwandel: 'Weltenwandlerin',
      Messer: 'Messerstecherin',
      Spiess: 'Pikeneuse',
      Halmbarte: 'Halbardeuse',
      Degen: 'Fechtmeisterin',
      Bogen: 'Bogenschützin',
      Lanze: 'Ritterin',
    };
    return titel[t.geschlecht][talent] + ' ';
  }
  
  return (t.gestorben ? '† ' : '')
    + t.titel() + t.name
    + `    Alter: ${t.alter}`
    + `    Karrieren: ${t.karrieren}\n`
    + t.attribute_text() + "\n"
    + t.talente_text() + "\n"
    + (!t.gestorben && t.feinde.length > 0 ? 'Feinde: ' + t.feinde.join(', ') + "\n" : '')
    + "\n\n" + t.geschichte.join("\n") + "\n"
    ;
} // End wrapper function helmbartenCharacter()
