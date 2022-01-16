/* Helmbarten RPG character generator
   © Alex Schröder 2022

   Um eine Charakterbeschreibung zu generieren: helmbarten().character().text();
*/

function helmbarten(daten) {
  let h = {};

  h.tabellen = transformieren(daten);
  
  function transformieren(daten) {
    let d = {}
    let t;
    daten.split("\n").forEach(zeile => {
      zeile.replace(/#.*/, ""); // Kommentare
      let m;
      if (zeile.startsWith(";")) { t = []; d[zeile.substring(1)] = t }
      else if (m = zeile.match(/^(\d),(.*)/)) { t.push([m[2], Number(m[1])]) }
    });
    return d;
  }

  function nimm(titel, level) {
    level = level || 1;
    if (level > 20) { console.log(`Rekursion über 20 Stufen tief für ${titel}`); return "…" }
    // Wähle einen Text aus der Tabelle mit dem entsprechenden Titel
    let text = gewichte(titel);
    // Merke, falls es am Ende ein Suchen und Ersetzen gibt wie /a/b/
    let m = text.match(/\/([^\/]+)\/([^\/]*)\/([gi])?$/);
    // Kürze den Text um das Suchen und Ersetzen Muster, falls nötig
    if (m) text = text.substring(0, text.length - m[0].length);
    // Auswahl [a|b] wählt a oder b
    text = text.replaceAll(/\[([^\[\]]+\|[^\[\]]+)\]/g, (m, t) => wähle(t.split('|')));
    // Tabelle [a] wählt einen Eintrag aus der Tabelle a
    text = text.replaceAll(/\[([^\[\]]+)\]/g, (m, t) => nimm(t, level + 1));
    // Führe Suchen & Ersetzen aus, falls nötig
    if (m) text = text.replace(new RegExp(m[1], m[3]), m[2]);
    return text;
  }

  function gewichte(titel) {
    let t = h.tabellen[titel];
    if (!t) { console.log(`Es gibt keine Tabelle ${titel}`); return "…" }
    let total = t.reduce((n, x) => n + x[1], 0);
    // starte mit 1
    let n = Math.floor(Math.random() * total) + 1;
    let i = 0;
    for (const z of t) {
      i += z[1];
      if (i >= n) { return(z[0]) }
    }
    console.log(`Die Tabelle ${titel} hat kein Resultat für ${n}`);
    return "…";
  }
  
  function wähle(...arr) {
    return arr
      .map(a => a[Math.floor(Math.random() * (a.length))])
      .join(' ');
  }

  function ungeordnet(a) {
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function würfel(anzahl) {
    let total = 0;
    for (var i = 0; i < anzahl; i++) {
      total += Math.floor(Math.random() * 6 + 1);
    }
    return total;
  }

  function name(geschlecht) {
    return nimm(`Menschenname ${geschlecht}`);
  }

  function geschlecht() {
    return nimm('Geschlecht');
  }

  function dämon() {
    return nimm('Dämon');
  }

  function welt() {
    return nimm('Welt');
  }

  function geheimbund() {
    return nimm('Geheimbund');
  }

  function posten(geschlecht) {
    return nimm(`Posten ${geschlecht}`);
  }

  function hund() {
    let h = 'ein '
        + wähle([ 'kläffender', 'aggressiver', 'bissiger', 'verspielter', 'fauler', 'jaulender', 'aktiver', 'wilder' ],
                [ 'Hund', 'Strassenhund', 'Jagdhund', 'Wachhund', 'Schosshund', 'Hirtenhund', 'Spürhund' ]);
    if (würfel(1) <= 3) h = h.replace(/^ein/, 'eine').replace(/r\b/, '').replace(/und$/, 'ündin');
    return h;
  }

  function pferd() {
    let p = 'ein '
        + wähle([ 'stoischer', 'aggressiver', 'bissiger', 'verspielter', 'lahmer', 'freundlicher', 'aktiver' ])
        + ' ';
    if (würfel(1) <= 4) {
      p += wähle([ 'Rappen', 'Schimmel', 'Hengst', 'Gaul', 'Klappergaul' ]);
    } else {
      p = p.replace(/r\b/, 's');
      p += wähle([ 'Reitpferd', 'Kriegspferd' ]);
    }
    return p;
  }

  function gute() {
    return wähle(['gutmütige', 'intelligente', 'freche', 'vorlaute', 'anhängliche', 'neugierige', 'ständig lästernde',
                  'weise', 'vorsichtige', 'verspielte']);
  }

  function land() {
    return wähle([ 'ein Waldfleck', 'ein Stück Wald mit Teich', 'ein karger Fels mit Burgruine',
                   'ein verwaldetes Stück Weideland', 'ein versumpftes Stück Ackerland',
                   'eine Burgruine voller Banditen' ]);
  }

  h.charakter = function() {
    /* t ist der Charakter */
    let t = {};
    
    t.geschichte = [];
    t.alter = 16;
    t.geschlecht = geschlecht();
    t.name = name(t.geschlecht);
    t.karrieren = 0;
    t.gestorben = false;
    t.belohnungen = [];
    t.mitgliedschaften = [];
    t.gefährten = [];
    t.tiere = [];
    t.lehrstühle = [];
    t.stellen = [];
    t.talente = [];
    t.verboten = [];
    t.feinde = [];
    t.favorit = '';

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
        + ` Bildung-${t.attribute.bildung} Status-${t.attribute.status}\n`;
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
        .join(' ') + "\n";
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
        return wähle(['Messer', 'Spiess', 'Halmbarte', 'Degen']);
      },
      gratis: 'Kämpfen',
      belohnung: function(t) {
        switch(würfel(1)) {
        case 1: {
          t.attribute.intelligenz += 1;
          t.geschichte.push("Bin etwas schlauer geworden.");
          break;
        }
        case 2: {
          t.attribute.bildung += 2;
          t.geschichte.push("Habe ziemlich dazu gelernt.");
          break;
        }
        case 3: {
          t.attribute.status += 1;
          t.geschichte.push("Bin etwas aufgestiegen in der Welt.");
          break;
        }
        case 4: {
          let g = geheimbund();
          t.mitgliedschaften.push(`${g}`);
          t.geschichte.push(`${g} haben mich aufgenommen.`);
          break;
        }
        case 5: {
          let p = pferd();
          t.tiere.push(`🐎 ${p}`);
          t.geschichte.push("Ich habe ein Pferd bekommen.");
          break;
        }
        case 6: {
          t.stellen.push(land());
          t.geschichte.push("Ich habe etwas Land zugewiesen bekommen.");
          break;
        }
        }
      },
      lernen: function(t) {
        let gruppe;
        if (t.alter < 20) {
          gruppe = wähle(['Söldner gewesen', 'Wache geschoben']);
        } else if (t.attribute.status >= 8 || t.attribute.intelligenz >= 8) {
          gruppe = wähle(['Reiter gemacht', 'Offizier gemacht']);
        } else { gruppe = wähle(Object.keys(this.talente)); }
        t.geschichte.push("4 Jahre " + gruppe);
        t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(wähle(this.talente[gruppe])) + ' gelernt.').join(" "));
        return;
      },
      schicksalsschlag: function(t) {
        switch(würfel(1)) {
        case 1: {
          let g = geschlecht();
          let f = name(g);
          let u = g == '♀' ? '👩' : '👨';
          t.feinde.push(`${u} ${f}`);
          let p = g == '♀' ? `sie` : `er`;
          t.geschichte.push(wähle(
            [ `Der Feldzug war ein Erfolg. Ich habe drei Tage lang mit geplündert und ${f} schreckliches angetan. 😱`,
              `Wir mussten die Verletzten zurück lassen. Es war meine Entscheidung. ${f} hat es überlebt, aber verziehen hat ${p} mir nie. 🙁`, ]));
          break;
        }
        case 2: {
          t.geschichte.push(wähle(
            [ 'Die Belagerung war fürchterlich. Es gab nur wenig zu essen. 🙁',
              'Nach der Niederlage haben wir uns monatelang versteckt, haben im Wald gelebt wie Tiere. 🙁', ]));
          t.alterung()
          break;
        }
        case 3: {
          t.geschichte.push(wähle(
            [ 'Auf dem Feldzug sind wir in einen Hinterhalt geraten und ich bin schwer verletzt worden. 🙁',
              'Auf dem Feldzug bin ich krank geworden und fast gestorben. Man hat mich fast zurück gelassen. 🙁', ]));
          t.alterung()
          break;
        }
        case 4: {
          t.geschichte.push(wähle(
            [ 'Nach einem Unfall ist das Knie nie wieder so geworden wie früher. 😥',
              'Dann habe ich geheiratet. Das Söldnerleben ist vorbei. 😁',
              'Nach dem Sieg habe ich geheult und gekotzt bis ich nicht mehr konnte. 🙁', ]));
          t.neue_karriere();
          break;
        }
        case 5: {
          t.geschichte.push('Der Feldzug war ein Fiasko. Ich geriet in Gefangenschaft.');
          let w = wähle(
            [ 'in einer Silbermine',
              'auf einer Galeere',
              'in einem Kerker',
              'in der Arena', ]);
          t.verloren(`${w} verstorben. 💀`,
                     `${w} entkommen. 😌`);
          break;
        }
        case 6: {
          t.geschichte.push(wähle(
            [ 'Der Feldzug war ein Fehler, unser Feldherr total ahnungslos.',
              'Der Feldzug war ein Fehler, unsere Feldherrin total ahnungslos.',
              'Wir sind ihnen ahnungslos in die Falle gegangen.',
              'Wir gingen wie Vieh zum Schlachthof. Ahnungslos.'],
            [ 'Ein blutiges Gemetzel. Es blieben nicht viele übrig.',
              'Die Armee wurde zerschlagen, und wir in alle Winde zerstreut.',
              'Die Fliehenden wurden niedergeritten. Die Leichen waren kaum mehr zu erkennen.'],
            [ 'Ich blieb verschollen. 💀',
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
        'passive Magie studiert': ['Heilung', 'Schlaf', 'Augen', 'Türen', 'Botanik', 'Brauen'],
        'manipulative Magie studiert': ['Bezaubern', 'Singen', 'Diplomatie', 'Illusion', 'Psychologie', 'Schrift'],
        'transgressive Magie studiert': ['Gestaltwandlung', 'Nekromantie', 'Transmutation', 'Fusion', 'Zoologie', 'Weltenwandel'],
      },
      waffe: function(t) {
        return 'Messer';
      },
      gratis: 'Schrift',
      belohnung: function(t) {
        switch(würfel(1)) {
        case 1: {
          t.attribute.intelligenz += 2;
          t.geschichte.push("Bin ziemlich schlauer geworden.");
          break;
        }
        case 2: {
          t.attribute.bildung += 1;
          t.geschichte.push("Habe etwas dazu gelernt.");
          break;
        }
        case 3: {
          t.attribute.status += 2;
          t.geschichte.push("Bin ziemlich aufgestiegen in der Welt.");
          break;
        }
        case 4: {
          let g = geheimbund();
          t.mitgliedschaften.push(`${g}`);
          t.geschichte.push(`${g} haben mich aufgenommen.`);
          break;
        }
        case 5: {
          switch (würfel(1)) {
          case 1: {
            let g = gute();
            t.tiere.push(`🐦 eine ${g} Krähe`);
            t.geschichte.push("Ich habe eine Krähe adoptiert.");
            break;
          }
          case 2: {
            let g = gute();
            t.tiere.push(`🦉 eine ${g} Eule`);
            t.geschichte.push("Ich habe eine Eule adoptiert.");
            break;
          }
          case 3: {
            let g = gute();
            t.tiere.push(`🐈 eine ${g} Katze`);
            t.geschichte.push("Ich habe eine Katze adoptiert.");
            break;
          }
          case 4:
          case 5:
          case 6: {
            let g = geschlecht();
            let f = name(g);
            let u = g == '♀' ? '👩' : '👨';
            t.gefährten.push(`${u} ${f}` + ' (' +
                             ['Kraft', 'Geschick', 'Ausdauer', 'Intelligenz', 'Bildung', 'Status', ]
                             .map(x => x + ' ' + würfel(2)).join(' ') + ')');
            let p = g == '♀' ? `eine treue Gefährtin` : `einen treuen Gefährten`;
            t.geschichte.push(`Ich habe in ${f} ${p} gefunden.`);
            break;
          }
          }
          break;
        }
        case 6: {
          let j = t.bestes_talent(t.lehrstühle) || wähle(Object.keys(t.talente));
          t.lehrstühle.push(j);
          t.stellen.push(`Lehrstuhl für ${j}`);
          t.geschichte.push(`Ich habe einen Lehrstuhl für ${j} bekommen.`);
          break;
        }
        }
      },
      lernen: function(t) {
        let gruppe = wähle(Object.keys(this.talente));
        t.geschichte.push("4 Jahre " + gruppe);
        t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(wähle(this.talente[gruppe])) + ' gelernt.').join(" "));
        return;
      },
      schicksalsschlag: function(t) {
        switch(würfel(1)) {
        case 1: {
          let g = geschlecht()
          let f = name(g);
          let u = g == '♀' ? '👩' : '👨';
          t.feinde.push(`${u} ${f}`);
          let m = g == '♀' ? `meine Mitschülerin ${f}` : `meinen Mitschüler ${f}`;
          t.geschichte.push(`Ich habe ${m} blossgestellt. 😏`);
          break;
        }
        case 2: {
          t.geschichte.push(wähle(
            [ 'Das Experiment ging schief und mich hat es getroffen. 🙁',
              'Es war mein Fehler, und ich habe jahrelang dafür bezahlt. 🙁', ]));
          t.alterung()
          break;
        }
        case 3: {
          let f = dämon();
          t.feinde.push(`👹 ${f}`);
          t.geschichte.push(wähle(
            [ 'Ich habe Dinge gesehen, die würdet ihr mir nicht glauben.',
              'Ich habe in den Abgrund geschaut. Es war fürchterlich.',
              'Die Forschung hat mich an schreckliche Orte geführt.', ],
            [ `Nun kennt der Dämon ${f} kennt meinen Namen und sucht mich. 😱`,
              `Ich habe den Dämon ${f} verspottet. Das war ein grosser Fehler. 😱`, ]));
          break;
        }
        case 4: {
          t.geschichte.push(wähle(
            [ 'Ich habe auf dem Weltenbaum Yggdrasil fast den Verstand verloren. 😥',
              'Ich war nicht mehr bereit, all die Opfer zu bringen. Strenge Disziplin, jeden Tag, jede Stunde. 😥',
              'Ich wollte nur noch raus. In meinem Kopf schreien jeden Abend böse Geister. Ich kann nicht mehr. 😥', ]));
          t.neue_karriere();
          break;
        }
        case 5: {
          let w = welt();
          t.geschichte.push(`Ich habe mich in ${w} verirrt.`);
          t.verloren(`in ${w} verstorben. 💀`,
                     'Wanderung habe ich den Weg zurück nach Midgard gefunden. 😌');
          break;
        }
        case 6: {
          let w = welt();
          t.geschichte.push(wähle(
            [ 'Wir haben die dünne Grenze zwischen den Ebenen untersucht, und es kam zu einem Unglück.',
              `Wir waren unterwegs nach ${w}, als plötzlich die Hölle los ging.`,
              `Wir waren auf dem Rückweg von ${w}, als uns Yggradsil unter den Füssen weg brach.`, ],
            [ 'Ich habe mich für meine Freunde geopfert. Meine Seele schreit dort noch immer. 💀',
              'Und da habe ich einen Fehler gemacht. Die Macht war unkontrollierbar und hat mich verzehrt. 💀',
              'Ich habe alles gegeben. Bin ausgebrannt, alt geworden. Ich habe es nicht mehr nach Hause geschafft. 💀', ]));
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
        return wähle(['Messer', 'Degen']);
      },
      gratis: 'Rennen',
      belohnung: function(t) {
        switch(würfel(1)) {
        case 1: {
          t.attribute.intelligenz += 1;
          t.geschichte.push("Bin etwas schlauer geworden.");
          break;
        }
        case 2: {
          t.attribute.bildung += 2;
          t.geschichte.push("Habe ziemlich dazu gelernt.");
          break;
        }
        case 3: {
          t.attribute.status += 2;
          t.geschichte.push("Bin ziemlich aufgestiegen in der Welt.");
          break;
        }
        case 4: {
          let g = geheimbund();
          t.mitgliedschaften.push(`${g}`);
          t.geschichte.push(`${g} haben mich aufgenommen.`);
          break;
        }
        case 5: {
          t.tiere.push("🐕 " + hund());
          t.geschichte.push("Ich habe einen Hund adoptiert.");
          break;
        }
        case 6: {
          let p = posten(t.geschlecht);
          t.stellen.push(p);
          t.geschichte.push(`Ich habe einen sicheren Posten als ${p}.`);
          break;
        }
        }
      },
      lernen: function(t) {
        let gruppe = wähle(Object.keys(this.talente));
        t.geschichte.push("4 Jahre " + gruppe);
        t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(wähle(this.talente[gruppe])) + ' gelernt.').join(" "));
        return;
      },
      schicksalsschlag: function(t) {
        switch(würfel(1)) {
        case 1: {
          let g = geschlecht()
          let f = name(g);
          let u = g == '♀' ? '👩' : '👨';
          t.feinde.push(`${u} ${f}`);
          let m = g == '♀' ? `meine Rivalin ${f}` : `meinen Rivalen ${f}`;
          t.geschichte.push(wähle(
            [ `Ich habe ${m} öffentlich gedemütigt. 😏`,
              `Ich habe ${m} um viel Geld betrogen. 😏`,
              `Ich habe ${m} an die Obrigkeit verraten. 😏`, ]));
          break;
        }
        case 2: {
          let g = geschlecht();
          let f = name(g);
          let u = g == '♀' ? '👩' : '👨';
          t.feinde.push(`${u} ${f}`);
          t.geschichte.push(wähle(
            [ 'Der Plan ist nicht aufgegangen.',
              'Man hat mich ausgetrickst.', ,
              'Ich wurde ausmanövriert.', ],
            [ `Nun schulde ich ${f} mehr Geld als ich je zurückzahlen kann. 😒`,
              `${f} hat mir daraufhin viel Geld geliehen, aber das kann ich nie zurückzahlen. 😒`, ]));
          break;
        }
        case 3: {
          let g = geschlecht();
          let f = name(g);
          let u = g == '♀' ? '👩' : '👨';
          t.feinde.push(`${u} ${f}`);
          t.geschichte.push(wähle(
            [ 'Ich habe die Hilfe von falschen Freunden angenommen.',
              'Ich liess mich von falschen Freunden blenden.',
              'Ich habe mich auf falsche Freunde verlassen.', ],
            [ `Nun schulde ich ${f} mehr als nur einen Gefallen. 😒`,
              `Jetzt habe ich mich bei ${f} tief verschuldet. 😒`, ]));
          break;
        }
        case 4: {
          t.geschichte.push(wähle(
            [ 'Man hat mich erwischt und an den Pranger gestellt.',
              'Ich wurde erwischt und durch die Strassen gejagt.',
              'Ich liess mich erwischen und jetzt zahle ich den Preis.', ],
            [ 'Jeder kennt mein Gesicht. 😥',
              'Jeder erkennt in mir den Verbrecher. 😥',
              'Mir traut niemand mehr. 😥', ]));
          t.neue_karriere();
          break;
        }
        case 5: {
          t.geschichte.push('Mein Plan ist aufgeflogen. Ich wurde gefasst.');
          let w = wähle(
            [ 'in einer Silbermine',
              'auf einer Galeere',
              'in einem Kerker',
              'in der Arena', ]);
          t.verloren(`${w} verstorben. 💀`,
                     `${w} entkommen. 😌`);
          break;
        }
        case 6: {
          t.geschichte.push(wähle(
            [ 'Es gab einen Bandenkrieg.',
              'Es gab einen Aufstand.',
              'Die Meute machte mit uns kurzen Prozess.' ],
            [ 'Die Strassenhunde sind fett geworden.',
              'Die Bäume trugen damals seltsame Früchte.',
              'Die Fische sind fett geworden.' ],
            [ 'Mich hat man nie wieder gesehen. 💀',
              'Ich blieb unauffindbar. 💀', ]));
          t.gestorben = true;
          break;
        }
        }
      }
    };

    t.bestes_talent = function(ohne_diese) {
      let bestes_talent;
      let bester_wert = 0;
      for (let talent of ungeordnet(Object.keys(t.talente))) {
        if (ohne_diese && ohne_diese.includes(talent)) continue;
        if (t.talente[talent] > bester_wert) {
          bester_wert = t.talente[talent];
          bestes_talent = talent;
        }
      }
      if (bester_wert < 3) return undefined;
      return bestes_talent;
    };

    t.beste_karriere = function() {
      let beste_karriere;
      let bester_wert = 0;
      for (let karriere of ungeordnet(Object.keys(s))) {
        if (t.verboten.includes(karriere)) continue;
        let wert = s[karriere].attribut(t);
        if (wert > bester_wert) {
          bester_wert = wert;
          beste_karriere = karriere;
        }
      }
      if (beste_karriere) t.geschichte.push(s[beste_karriere].name + ' geworden.');
      return beste_karriere;
    };

    t.bestes_attribut = function() {
      let bestes_attribut;
      let bester_wert = 0;
      for (let attribut of ungeordnet(Object.keys(t.attribute))) {
        if (t.attribute[attribut] > bester_wert) {
          bestes_attribut = attribut;
          bester_wert = t.attribute[attribut];
        }
      }
      return bestes_attribut;
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
      // Das Entkommen ist eine schwierige Probe mit 3W6!
      while (!t.gestorben && würfel(3) > t.bestes_attribut()) {
        jahre += 4;
        t.alter += 4;
        t.alterung();
      }
      if (t.gestorben) {
        t.geschichte.push(`Nach ${jahre} Jahren ${gestorben}`);
      } else {
        t.geschichte.push(`Nach ${jahre} Jahren ${entkommen}`);
        t.neue_karriere();
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

    // Belohnungen sind callbacks, die gesammelt werden und am Ende ein Mal ausgeführt werden.
    t.belohnung_merken = function() {
      t.belohnungen.push(s[t.karriere].belohnung);
    };

    while(t.weitermachen()) {
      t.karriereschritt();
      t.belohnung_merken();
      t.schicksalsschlag();
      t.älter_werden();
    }

    t.belohnungen_erhalten = function() {
      t.geschichte.push('<hr>Belohnungen');
      t.belohnungen.forEach(x => x(t));
    };

    if (!t.gestorben) t.belohnungen_erhalten();

    t.titel = function() {
      let talent = t.bestes_talent();
      if (!talent) return '';
      let titel = {};
      titel['♂'] = {
        Ablenken: 'Taschendieb', Augen: 'Seher', Bauen: 'Bauherr', Benehmen: 'Edelmann',
        Bezaubern: 'Silberzunge', Brauen: 'Giftmischer', Bürokratie: 'Verwalter', Diplomatie: 'Diplomat',
        Disziplin: 'Drillmeister', Erde: 'Geomant', Feldscher: 'Arzt', Feuer: 'Pyromant',
        Fusion: 'Fleischmagier', Gestaltwandlung: 'Gestaltwandler', Handeln: 'Händler', Handwerk: 'Meister',
        Heilung: 'Heiler', Illusion: 'Illusionist', Klettern: 'Akrobat', Knacken: 'Einbrecher',
        Kultur: 'Gelehrter', Kämpfen: 'Reisläufer', Luft: 'Aeromant', Psychologie: 'Menschenkenner',
        Nekromantie: 'Nekromant', Botanik: 'Botaniker', Prügeln: 'Schläger', Reden: 'Redner',
        Reiten: 'Reiter', Rennen: 'Läufer', Schlaf: 'Somnolog', Schleichen: 'Dieb',
        Schrift: 'Schreiber', Singen: 'Meistersänger', Spionieren: 'Spion', Sturm: 'Sturmmagier',
        Taktik: 'Feldherr', Zoologie: 'Tierflüsterer', Transmutation: 'Alchemist', Tüfteln: 'Erfinder',
        Türen: 'Portalmagier', Wasser: 'Aquamant', Weltenwandel: 'Weltenwandler', Messer: 'Messerstecher',
        Spiess: 'Pikenier', Halmbarte: 'Halbardier', Degen: 'Fechtmeister', Bogen: 'Bogenschütze',
        Lanze: 'Ritter', };
      titel['♀'] = {
        Ablenken: 'Taschendiebin', Augen: 'Seherin', Bauen: 'Bauherrin', Benehmen: 'Edelfrau',
        Bezaubern: 'Silberzunge', Brauen: 'Giftmischerin', Bürokratie: 'Verwalterin', Diplomatie: 'Diplomatin',
        Disziplin: 'Drillmeister', Erde: 'Geomantin', Feldscher: 'Ärztin', Feuer: 'Pyromantin',
        Fusion: 'Fleischmagierin', Gestaltwandlung: 'Gestaltwandlerin', Handeln: 'Händlerin', Handwerk: 'Meister',
        Heilung: 'Heilerin', Illusion: 'Illusionistin', Klettern: 'Akrobatin', Knacken: 'Einbrecherin',
        Kultur: 'Gelehrte', Kämpfen: 'Reisläuferin', Luft: 'Aeromantin', Psychologie: 'Menschenkennerin',
        Nekromantie: 'Nekromantin', Botanik: 'Botanikerin', Prügeln: 'Schlägerin', Reden: 'Rednerin',
        Reiten: 'Reiterin', Rennen: 'Läuferin', Schlaf: 'Somnologin', Schleichen: 'Diebin',
        Schrift: 'Schreiberin', Singen: 'Meistersängerin', Spionieren: 'Spionin', Sturm: 'Sturmmagierin',
        Taktik: 'Feldherrin', Zoologie: 'Tierflüsterin', Transmutation: 'Alchemistin', Tüfteln: 'Erfinderin',
        Türen: 'Portalmagier', Wasser: 'Aquamantin', Weltenwandel: 'Weltenwandlerin', Messer: 'Messerstecherin',
        Spiess: 'Pikeneuse', Halmbarte: 'Halbardeuse', Degen: 'Fechtmeister', Bogen: 'Bogenschützin',
        Lanze: 'Ritterin',
      };
      return titel[t.geschlecht][talent] + ' ';
    };

    t.gefährten_text = function() {
      if (t.gestorben || !t.gefährten.length) return '';
      return "\nGefährten\n" + t.gefährten.map(x => `${x}\n`).join('');
    }

    t.tiere_text = function() {
      if (t.gestorben || !t.tiere.length) return '';
      return "\nTiere\n" + t.tiere.map(x => `${x}\n`).join('');
    }

    t.feinde_text = function() {
      if (t.gestorben || !t.feinde.length) return '';
      return "\nFeinde\n" + t.feinde.map(x => `${x}\n`).join('');
    }

    t.mitgliedschaften_text = function() {
      if (t.gestorben || !t.mitgliedschaften.length) return '';
      return "\nMitgliedschaften\n" + t.mitgliedschaften.map(x => `🤝 ${x}\n`).join('');
    }

    t.stellen_text = function() {
      if (t.gestorben || !t.stellen.length) return '';
      return "\nStellen\n" + t.stellen.map(x => `💰 ${x}\n`).join('');
    }

    t.text = function() {
      return (t.gestorben ? '† ' : '')
        + t.titel() + t.name
        + `    Alter: ${t.alter}`
        + `    Karrieren: ${t.karrieren}\n`
        + t.attribute_text()
        + t.talente_text()
        + t.gefährten_text()
        + t.tiere_text()
        + t.feinde_text()
        + t.mitgliedschaften_text()
        + t.stellen_text()
        + "\n\n" + t.geschichte.join("\n") + "\n";
    }

    return t;
  }

  return h;
}
