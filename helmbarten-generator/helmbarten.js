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
        name = eins(['Gyso', 'Dodo', 'Gregor', 'Siggo', 'Ardo']);
      }
    } else {
      let teil1 = ['Adal', 'Amal', 'Bald', 'Bert', 'Brun', 'Ger', 'Chlodo', 'Charde', 'Gunde', 'Os', 'Sigi', 'Theude'];
      if (geschlecht == '♀' && würfel(1) <= 4) {
        name = eins(teil1) + eins(['burg', 'gard', 'gund', 'hild', 'lind', 'trud']);
      } else {
        name = eins(teil1) + eins(['ger', 'man', 'mund', 'ric', 'hard', 'sind']);
        if (geschlecht == '♀') {
          name += eins(['a', 'e']);
        }
      }
    }
    return name;
  }

  function dämon() {
    return eins(['Herr', 'Herrin', 'Auge', 'Zahn', 'Wolf', 'Rabe', 'Mühle'])
      + eins('der Zeit', 'des Zorns', 'der Pest', 'der Fäulnis', 'des Abgrunds');
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
    t.talente[talent] = t.talente[talent] ? t.talente[talent] + 1 : 1;
    return talent;
  };

  t.talente_text = function () {
    if (t.gestorben) { return 'keine Talente'; }
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
      'Wache geschoben': ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      'Reiter gemacht': ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      'Offizier gemacht': ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
    },
    gratis: 'Kämpfen',
    lernen: function(t) {
      let gruppe = t.alter < 20 ? eins(['Söldner', 'Wache']) : eins(Object.keys(this.talente));
      t.geschichte.push("4 Jahre " + gruppe);
      t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(eins(this.talente[gruppe])) + ' gelernt.').join(" "));
      return;
    },
    schicksalsschlag: function(t) {
      switch(würfel(1)) {
      case 1: {
        t.geschichte.push('Der Feldzug war ein Erfolg. Ich habe drei Tage lang mit geplündert. 😱');
        let f = name(geschlecht());
        t.feinde.push(f);
        t.geschichte.push(`${f} wird mir das nie verzeihen. 💀`);
        break;
      }
      case 2: {
        t.geschichte.push('Die Belagerung war fürchterlich. Es gab nur wenig zu essen.');
        t.alterung()
        break;
      }
      case 3: {
        t.geschichte.push('Auf dem Feldzug sind wir in einen Hinterhalt geraten und ich bin schwer verletzt worden.');
        t.alterung()
        break;
      }
      case 4: {
        t.geschichte.push('Nach einem Unfall ist das Knie nie wieder so geworden wie früher. 🙁');
        t.neue_karriere();
        break;
      }
      case 5: {
        t.geschichte.push('Der Feldzug war ein Fiasko.');
        let w = eins(['in einer Silbermine', 'auf einer Galeere', 'in einem Kerker']);
        t.verloren(`${w} verstorben. 💀`,
                   `${w} entkommen. 😌`);
        break;
      }
      case 6: {
        t.geschichte.push('Der Feldzug war ein grosser Fehler. Die Armee wurde zerschlagen.');
        t.geschichte.push('Die Fliehenden wurden niedergeritten. Verschollen. 💀');
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
        t.geschichte.push('Ich habe einen Mitschüler blossgestellt. 😏');
        let f = name(geschlecht());
        t.feinde.push(f);
        t.geschichte.push(`${f} wird mir das nie verzeihen. 💀`);
        break;
      }
      case 2: {
        t.geschichte.push('Das Experiment ging schief und es hat mich getroffen.');
        t.alterung()
        break;
      }
      case 3: {
        t.geschichte.push('Die Forschung hat mich an Orte geführt, die nie wieder vergisst.');
        let f = dämon();
        t.feinde.push(f);
        t.geschichte.push(`Der Dämon ${f} kennt meinen Namen und sucht mich. 😱`);
        break;
      }
      case 4: {
        t.geschichte.push('Ich habe mich zu weit in den Raum zwischen den Welten vorgewagt.');
        t.geschichte.push('Ich habe fast auf Yggdrasil fast den Verstand verloren. 🙁');
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
        t.geschichte.push('Wir haben die dünne Grenze zwischen den Ebenen untersucht, und es kam zu einem Unglück. Ich habe mich für meine Freunde geopfert. Meine Seele schreit dort noch immer. 💀');
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
        t.geschichte.push('Ich habe einen Rivalen gedemütigt. 😏');
        t.geschichte.push(name(geschlecht()) + ' wird mir das nie verzeihen. 💀');
        break;
      }
      case 2: {
        t.geschichte.push('Der Plan ist nicht aufgegangen. Man hat mich ausgetrickst.');
        t.geschichte.push('Ich schulde ' + name(geschlecht()) + ' mehr Geld als ich je zurückzahlen kann.');
        break;
      }
      case 3: {
        t.geschichte.push('Ich habe die Hilfe von falschen Freunden angenommen und mich immer weiter in ihre Sache verstricken lassen.');
        let f = name(geschlecht());
        t.feinde.push(f);
        t.geschichte.push(`Nun schulde ich ${f} mehr als nur einen Gefallen.`);
        break;
      }
      case 4: {
        t.geschichte.push('Man hat mich erwischt und an den Pranger gestellt.');
        t.geschichte.push('Jeder kennt mein Gesicht.');
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
        t.geschichte.push('Es gab einen Bandenkrieg. Die Strassenhunde sind fett geworden.');
        t.geschichte.push('Man hat mich nie mehr gesehen. 💀');
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
    t.karriere = t.beste_karriere();
  };

  t.weitermachen = function() {
    if (t.gestorben || !t.karriere) {
      return false;
    }
    if (würfel(1) < t.karrieren) {
      t.geschichte.push("Ich bin bereit für das Abenteuererleben! 💚");
      return false;
    }
    return 1;
  };

  t.karriereschritt = function() {
    t.karrieren += 1;
    t.geschichte.push('--------------------------------------------');
    t.geschichte.push(`Karriere ${t.karrieren}, Alter ${t.alter}`);
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
    let jahre = 4;
    let w = würfel(2);
    let z = s[t.karriere].attribut(t);
    while (!t.gestorben && (w + t.karrieren > z)) {
      jahre += 4;
      t.alterung();
    }
    t.alter += jahre;
    if (t.gestorben) {
      t.geschichte.push(`Nach ${jahre} Jahren ${gestorben}`);
    } else {
      t.geschichte.push(`Nach ${jahre} Jahren ${entkommen}`);
    }
  };

  t.alterung = function() {
    switch(würfel(1)) {
    case 1: {
      t.attribute.kraft -= 1;
      t.gestorben = t.gestorben || t.attribute.kraft == 0;
      t.geschichte.push("Etwas schwächer geworden.");
      break;
    }
    case 2: {
      t.attribute.geschick -= 1;
      t.gestorben = t.gestorben || t.attribute.geschick == 0;
      t.geschichte.push("Etwas ungeschickter geworden.");
      break;
    }
    case 3: {
      t.attribute.ausdauer -= 1;
      t.gestorben = t.gestorben || t.attribute.ausdauer == 0;
      t.geschichte.push("Etwas mehr ausser Atem gekommen.");
      break;
    }
    case 4: {
      t.attribute.intelligenz -= 1;
      t.gestorben = t.gestorben || t.attribute.intelligenz == 0;
      t.geschichte.push("Etwas vergesslicher geworden.");
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

  return (t.gestorben ? '† ' : '')
    + t.name
    + `    Alter: ${t.alter}`
    + `    Karrieren: ${t.karrieren}\n`
    + t.attribute_text() + "\n"
    + t.talente_text() + "\n"
    + (t.feinde.length > 0 ? 'Feinde: ' + t.feinde.join(', ') + "\n" : '')
    + "\n\n" + t.geschichte.join("\n") + "\n"
    ;
} // End wrapper function helmbartenCharacter()
