/* Helmbarten RPG character generator
   © Alex Schröder 2022

   Charakterbeschreibung: helmbarten(daten).character().text();
   Ausgangslage: helmbarten(daten).gegend().text();

   Im Fall von Helmbarten sind die Daten im #daten Element der HTML
   Datei gespeichert. Der Aufruf also beispielsweise:

   const daten = document.getElementById('daten').textContent;
   document.getElementById('ziel').innerHTML = helmbarten(daten).charakter().text();

*/

function helmbarten(daten) {
  const debug = false;
  let h = {};

  h.tabellen = transformieren(daten);

  function transformieren(daten) {
    let tabellen = {};
    let zeilen;
    daten.split("\n").forEach(zeile => {
      zeile.replace(/#.*/, ""); // Kommentare
      let m;
      if (zeile.startsWith(";")) { zeilen = []; tabellen[zeile.substring(1)] = zeilen; }
      else if ((m = zeile.match(/^(\d),(.*)/))) { zeilen.push([m[2], Number(m[1])]); }
    });
    return tabellen;
  }

  // Die Resultate vom letzten nimm Aufruf bleiben gespeichert
  h.resultate = {};

  // Die Liste der Namen stellt sicher, dass Resultate eindeutig sind
  h.namen;

  function eindeutig(titel) {
    let t = nimm(titel);
    while (h.namen[t]) {
      t = nimm(titel);
    }
    h.namen[t] = 1;
    return t;
  }

  function nimm(titel, level, t) {
    level = level || 1;
    if (level == 1) h.resultate = t ? { Geschlecht: t.geschlecht } : {};
    if (level > 20) { console.log(`Rekursion über 20 Stufen tief für ${titel}`); return "…"; }
    // [@a] nimmt das schon vorhandene Resultat für a
    if (titel.startsWith('@')) return h.resultate[titel.substring(1)];
    // Wähle einen Text aus der Tabelle mit dem entsprechenden Titel
    let text = gewichte(titel);
    // Merke, falls es am Ende ein Suchen und Ersetzen gibt wie /a/b/
    const m = text.match(/\/([^\/]+)\/([^\/]*)\/([gi])?$/);
    // Kürze den Text um das Suchen und Ersetzen Muster, falls nötig
    if (m) text = text.substring(0, text.length - m[0].length);
    while (true) {
      let e = false;
      // [2W6] würfelt 2W6
      text = text.replaceAll(/\[(\d+)W(\d+)(?:\+(\d+))?\]/g,
                             (m, n, d, p) => { e = true; return würfel(Number(n), Number(d), p ? Number(p) : 0); });
      if (e) continue;
      // [a@@b] fügt a der Liste b von t hinzu
      text = text.replaceAll(/\[([^\[\]]+)@@([^\[\]]+)\]/g,
                             (m, w, u) => { e = true; t[u].push(w); return ''; });
      if (e) continue;
      // [a@b] speichert a als Resultat für b
      text = text.replaceAll(/\[([^\[\]]+)@([^\[\]]+)\]/g,
                             (m, w, u) => { e = true; h.resultate[u] = w; return ''; });
      if (e) continue;
      // [a|b] wählt a oder b
      text = text.replaceAll(/\[([^\[\]]+\|[^\[\]]+)\]/g,
                             (m, w) => { e = true; return wähle(w.split('|')); });
      if (e) continue;
      // [a] wählt einen Eintrag aus der Tabelle a
      text = text.replaceAll(/\[([^@\[\]]+)\]/g,
                             (m, w) => { e = true; return nimm(w, level + 1, t); });
      if (e) continue;
      // [@b] wählt das gespeicherte Resultat b – nachdem alle [a] schon ausgeführt wurden
      text = text.replaceAll(/\[([^\[\]]+)\]/g,
                             (m, w) => { e = true; return nimm(w, level + 1, t); });
      if (e) continue;
      break;
    }
    // Führe Suchen & Ersetzen aus, falls nötig
    if (m) text = text.replace(new RegExp(m[1], m[3]), m[2]);
    // Alle bisherigen Resultate speichern
    h.resultate[titel] = text;
    return text;
  }

  function gewichte(titel) {
    const t = h.tabellen[titel];
    if (!t) { console.log(`Es gibt keine Tabelle ${titel}`); return "…"; }
    const total = t.reduce((n, x) => n + x[1], 0);
    // starte mit 1
    const n = Math.floor(Math.random() * total) + 1;
    let i = 0;
    for (const z of t) {
      i += z[1];
      if (i >= n) { return z[0]; }
    }
    console.log(`Die Tabelle ${titel} hat kein Resultat für ${n}`);
    return "…";
  }

  function wähle(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function ungeordnet(a) {
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function würfel(anzahl, seiten = 6, plus = 0) {
    let total = 0;
    for (var i = 0; i < anzahl; i++) {
      total += Math.floor(Math.random() * seiten + 1);
    }
    return total + plus;
  }

  h.charakter = function(reset = true) {
    if (reset) h.namen = {};

    /* t ist der Charakter */
    let t = { typ: 'Mensch', };

    let karrieren = 0;
    let favorit = '';

    /* Auf diese Variablen kann von aussen zugegriffen werden. */
    t.name = eindeutig(`Menschenname`);
    t.geschlecht = h.resultate.Geschlecht;
    t.gestorben = false;
    t.alter = 16;

    /* Auf all diese arrays kann man aus den Regeln heraus zugreifen, siehe [a@@b]. */
    t.geschichte = [];
    t.mitgliedschaften = [];
    t.gefährten = [];
    t.tiere = [];
    t.lehrstühle = [];
    t.stellen = [];
    t.talente = [];
    t.verboten = [];
    t.feinde = [];
    let belohnungen = [];

    t.attribute = {
      kraft: würfel(2),
      geschick: würfel(2),
      ausdauer: würfel(2),
      intelligenz: würfel(2),
      bildung: würfel(2),
      status: würfel(2),
    };

    function attribute_text() {
      // Das wird hier alles explizit aufgeführt, damit die Reihenfolge stimmt.
      return `Kraft-${t.attribute.kraft} Geschick-${t.attribute.geschick}`
        + ` Ausdauer-${t.attribute.ausdauer} Intelligenz-${t.attribute.intelligenz}`
        + ` Bildung-${t.attribute.bildung} Status-${t.attribute.status}\n`;
    };

    function attribute_hex() {
      // Das wird hier alles explizit aufgeführt, damit die Reihenfolge stimmt.
      return [t.attribute.kraft, t.attribute.geschick, t.attribute.ausdauer,
              t.attribute.intelligenz, t.attribute.bildung, t.attribute.status]
        .map(x => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[x])
        .join('');
    };

    /* s sind die Karrierendefinitionen */
    let s = {};

    s.Krieger = {
      waffe: function(t) {
        if (t.attribute.geschick > t.attribute.kraft) return 'Bogen';
        return wähle(['Messer', 'Spiess', 'Halmbarte', 'Degen']);
      },
    };

    s.Magier = {
      waffe: function(t) {
        return 'Messer';
      },
    };

    s.Taugenichts = {
      waffe: function(t) {
        return wähle(['Messer', 'Degen']);
      },
    };

    function lerne(talent) {
      if (talent == 'Kämpfen') {
        if (t.talente['Reiten']) {
          talent = favorit = 'Lanze';
        } else if (favorit) {
          talent = favorit;
        } else {
          talent = favorit = s[t.karriere].waffe(t);
        }
      }
      t.talente[talent] = t.talente[talent] ? t.talente[talent] + 1 : 1;
      return talent;
    };

    function lernen() {
      let tabelle = t.karriere;
      if (t.karriere == 'Krieger' && (t.attribute.status >= 8 || t.attribute.intelligenz >= 8)) tabelle += ' Bevorzugte';
      if (t.alter < 20) tabelle += ' Anfänger';
      let tätigkeit = nimm(tabelle);
      t.geschichte.push("4 Jahre " + tätigkeit);
      t.geschichte.push([1, 2, 3, 4].map(n => lerne(nimm(tätigkeit)) + ' gelernt.').join(" "));
      return;
    };

    function talente_text() {
      if (t.gestorben) { return ''; }
      return Object.keys(t.talente)
        .map(x => { return x + '-' + t.talente[x]; })
        .sort()
        .join(' ') + "\n";
    };

    function bestes_talent(ohne_diese) {
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

    function attribut(karriere) {
      return nimm(`${karriere} Attribut`).split(',').map(x => t.attribute[x]).reduce((a, b) => Math.max(a, b), 0);
    };

    function beste_karriere() {
      let bk;
      let bw = 0;
      for (let k of ungeordnet(Object.keys(s))) {
        if (t.verboten.includes(k)) continue;
        const w = attribut(k);
        if (w > bw) {
          bw = w;
          bk = k;
        }
      }
      if (bk) {
        if (würfel(2) <= bw) {
          t.geschichte.push(`${bk} geworden.`);
        } else {
          t.geschichte.push(`Wollte ${bk} werden, bin aber nicht aufgenommen worden.`);
          t.verboten.push(bk);
          return beste_karriere();
        }
      }
      return bk;
    };

    function bester_wert() {
      let ba;
      let bw = 0;
      for (let a of ungeordnet(Object.keys(t.attribute))) {
        if (t.attribute[a] > bw) {
          ba = a;
          bw = t.attribute[a];
        }
      }
      return bw;
    };

    function neue_karriere() {
      t.alter += 1;
      t.verboten.push(t.karriere);
      t.karriere = undefined;
    };

    function weitermachen() {
      if (t.gestorben) return false;
      if (würfel(1) < karrieren) {
        t.geschichte.push(nimm('Abenteurerleben!'));
        return false;
      }
      if (!t.karriere) t.karriere = beste_karriere();
      return t.karriere;
    };

    function karriereschritt() {
      karrieren += 1;
      t.geschichte.push(`<hr>Karriere ${karrieren}, Alter ${t.alter}`);
      lernen(t);
    };

    function alterung() {
      const faktor = t.alter < 50 ? 1 : 2;
      const a = nimm(`Alterung ${faktor}`);
      if (h.resultate.alterung) {
        t.attribute[h.resultate.alterung] = Math.max(t.attribute[h.resultate.alterung] - faktor, 0);
        t.gestorben = t.gestorben || t.attribute[h.resultate.alterung] <= 0;
        t.geschichte.push(a);
        if (debug) t.geschichte.push('Weiter mit ' + t.attribute_hex());
      }
    };

    function verloren(sterben, entkommen) {
      alterung();
      t.alter += 4;
      let jahre = 4;
      // Das Entkommen ist eine schwierige Probe mit 3W6!
      while (!t.gestorben && würfel(3) > bester_wert()) {
        jahre += 4;
        t.alter += 4;
        alterung();
      }
      if (t.gestorben) {
        t.geschichte.push(sterben.replace('${n}', jahre));
      } else {
        t.geschichte.push(entkommen.replace('${n}', jahre));
        neue_karriere();
      }
    };

    function schicksalsschlag() {
      if (t.gestorben) return;
      const w = würfel(2);
      const z = attribut(t.karriere);
      // t.geschichte.push(w + '+' + karrieren + ' ≤ ' +  z);
      if (w + karrieren > z) {
        t.geschichte.push(nimm(`${t.karriere} Schicksalsschlag`));
        if (h.resultate.feind) { t.feinde.push(h.resultate.feind); }
        if (h.resultate.alterung) { alterung() }
        if (h.resultate.karrierenwechsel) { neue_karriere(); }
        if (h.resultate.gefangenschaft) { verloren(h.resultate.verloren, h.resultate.entkommen); }
        if (h.resultate.gestorben) { t.gestorben = true; }
      }
    };

    function älter_werden() {
      if (t.gestorben) return;
      t.alter += 4;
      if (t.alter >= 36) {
        alterung();
      };
    };

    function lehrstuhl() {
      const j = bestes_talent(t.lehrstühle) || wähle(Object.keys(t.talente));
      t.lehrstühle.push(j);
      t.stellen.push(`💰 Lehrstuhl für ${j}`);
      t.geschichte.push(`Ich habe einen Lehrstuhl für ${j} bekommen.`);
    };

    function belohnungen_erhalten() {
      t.geschichte.push('<hr>Belohnungen');
      belohnungen.forEach(function (x) {
        const bonus = nimm(x, 1, t).split('+');
        if (bonus.length == 2) {
          // intelligenz+1
          t.attribute[bonus[0]] += Number(bonus[1]);
        } else if (bonus.length == 1) {
          // lehrstuhl()
          eval(bonus[0]);
        }
      });
    };

    function titel() {
      const talent = bestes_talent();
      if (!talent) return '';
      return nimm(`${talent} ${t.geschlecht}`) + ' ';
    };

    function gefährten_text() {
      if (t.gestorben || !t.gefährten.length) return '';
      return "\nGefährten\n" + t.gefährten.map(x => `${x}\n`).join('');
    };

    function tiere_text() {
      if (t.gestorben || !t.tiere.length) return '';
      return "\nTiere\n" + t.tiere.map(x => `${x}\n`).join('');
    };

    function feinde_text() {
      if (t.gestorben || !t.feinde.length) return '';
      return "\nFeinde\n" + t.feinde.map(x => `${x}\n`).join('');
    };

    function mitgliedschaften_text() {
      if (t.gestorben || !t.mitgliedschaften.length) return '';
      return "\nMitgliedschaften\n" + t.mitgliedschaften.join("\n") + "\n";
    };

    function stellen_text() {
      if (t.gestorben || !t.stellen.length) return '';
      return "\nStellen\n" + t.stellen.join("\n") + "\n";
    };

    // Charakter als Text
    t.text = function(hintergrund = true) {
      return (t.gestorben ? '† ' : '')
        + titel() + t.name
        + `    Alter: ${t.alter}`
        + `    Karrieren: ${karrieren}\n`
        + attribute_text()
        + talente_text()
        + gefährten_text()
        + tiere_text()
        + feinde_text()
        + mitgliedschaften_text()
        + stellen_text()
        + (hintergrund ? "\n\n" + t.geschichte.join("\n") + "\n" : "");
    };

    // Das Abenteuerleben!
    if (debug) t.geschichte.push('Gestartet mit ' + t.attribute_hex());
    t.karriere = beste_karriere();
    if (t.karriere)
      t.geschichte.push(lerne(nimm(`${t.karriere} Aufnahme`)) + ' gelernt.');

    while(weitermachen()) {
      karriereschritt();
      // Belohnungen werden gesammelt und am Ende ausgeführt werden.
      belohnungen.push(`${t.karriere} Belohnung`);
      älter_werden();
      schicksalsschlag();
    }

    if (!t.gestorben && belohnungen.length > 0) belohnungen_erhalten();

    return t;
  };

  function zeichen(t) {
    return t.typ == 'Drachen' ? '🐉'
      : t.typ == 'Riesen' ? '🧔'
      : t.typ == 'Mensch' && t.geschlecht == '♀' && t.alter < 60 ? '👩'
      : t.typ == 'Mensch' && t.geschlecht == '♀' ? '👵'
      : t.typ == 'Mensch' && t.geschlecht == '♂' && t.alter < 60 ? '👨'
      : t.typ == 'Mensch' && t.geschlecht == '♂' ? '👴'
      : '?';
  }

  h.monster = function(typ) {
    const m = {};
    const werte = nimm(`Werte für ${typ}`);
    const schatz = eindeutig('Bewachter Schatz');
    const beschreibung = nimm(`Beschreibung für ${typ}`);
    // von aussen sichtbar
    m.verbindungen = [];
    m.typ = typ;
    m.name = eindeutig(`${typ}name`);
    m.zu = h.resultate.zu;
    m.text = function() {
      return `${m.name}\n${werte}\n${beschreibung}\n\n${schatz}\n`;
    };
    return m;
  };

  h.festung = function() {
    let f = {
      name: eindeutig('Festung'),
      zu: h.resultate.zu,
      text: h.resultate.Standort,
      verbindungen: [],
    };
    return f;
  };

  h.turm = function() {
    let t = {
      name: eindeutig('Turm'),
      zu: h.resultate.zu,
      text: h.resultate.Standort,
      verbindungen: [],
    };
    return t;
  };

  h.gegend = function() {
    h.namen = {};

    /* g ist die Gegend */
    let g = {};

    g.festungen = Array
      .from(Array(5))
      .map(t => t = h.festung());
    g.türme = Array
      .from(Array(3))
      .map(t => t = h.turm());
    g.personen = Array
      .from(Array(12))
      .map(() => h.charakter(false))
      .filter(p => !p.gestorben)
      .sort((a, b) => (b.attribute.status - a.attribute.status) || (b.alter - a.alter));
    g.Riesen = Array
      .from(Array(3))
      .map(r => r = h.monster('Riesen'));
    g.Drachen = Array
      .from(Array(3))
      .map(d => d = h.monster('Drachen'));

    function verbinde(t, u) {
      t.verbindungen.push(u);
      u.verbindungen.push(t);
    };

    /**
     * Es gibt 5 Festungen (1-5), die es zu verbinden gilt, und bis zu
     * 3 Türme (6-8) + 3 Riesen + 3 Drachen (9-16) auf einer Karte:
     *
     *   14 12
     *    | |
     *  1-5 8  9
     *  |   |  |
     *  0---3--4-6-10
     *  |   |  |
     *  |  13  11
     *  |
     *  2-7
     */
    function erstelle_verbindungen() {
      const k = [g.festungen, g.türme, ungeordnet([g.Riesen, g.Drachen].flat())].flat();
      if (k[14]) { verbinde(k[14], k[5]); }
      if (k[13]) { verbinde(k[13], k[3]); }
      if (k[12]) { verbinde(k[12], k[8]); }
      if (k[11]) { verbinde(k[11], k[4]); }
      if (k[10]) { verbinde(k[10], k[6]); }
      if (k[9]) { verbinde(k[9], k[4]); }
      if (k[8]) { verbinde(k[8], k[3]); }
      if (k[7]) { verbinde(k[7], k[2]); }
      if (k[6]) { verbinde(k[6], k[4]); }
      if (k[5]) { verbinde(k[5], k[1]); }
      if (k[4]) { verbinde(k[4], k[3]); }
      if (k[3]) { verbinde(k[3], k[0]); }
      if (k[2]) { verbinde(k[2], k[0]); }
      if (k[1]) { verbinde(k[1], k[0]); }
    };

    function slug(t) {
      return t.toLowerCase().replace(/ +/g,'-').replace(/[^\w-]+/g,'');
    }

    function link(t) {
      return `<a href="#${slug(t)}">${t}</a>`;
    }

    function verbindungslink(t) {
      if (t.zu) return t.zu + ' ' + link(t.name);
      return 'nach ' + link(t.name);
    }

    function liste(arr) {
      if (arr.length > 1) { return arr.slice(0, -1).join(', ') + ' und ' + arr[arr.length - 1]; }
      else if (arr.length == 1) { return arr[0]; }
      else { return ''; };
    }

    function verbindungen(t) {
      if (t.verbindungen.length > 1) {
        return '<p>Wege führen '
          + liste(t.verbindungen.map(x => verbindungslink(x)).reverse())
          + '.';
      } else if (t.verbindungen.length == 1) {
        return `<p>Ein Weg führt ${verbindungslink(t.verbindungen[0])}.`;
      } else {
        return '';
      }
    };

    function besitzer(x) {
      if (!x.besitzer) return '';
      return `<p>${zeichen(x.besitzer)} ${x.besitzer.text(false)}`;
    };

    function festung(t) {
      return `<h2 id="${slug(t.name)}">${t.name}</h2><p>${t.text}` + besitzer(t) + verbindungen(t);
    };

    function festungen() {
      return g.festungen.map(t => ungeordnet(festung(t))).join('');
    };

    function turm(t) {
      return `<h2 id="${slug(t.name)}">${t.name}</h2><p>${t.text}` + besitzer(t) + verbindungen(t);
    };

    function türme() {
      return g.türme.map(t => ungeordnet(turm(t))).join('');
    };

    function monster(t) {
      return `<h3 id="${slug(t.name)}">${t.name}</h3><p>${zeichen(t)} ${t.text()}`
        + '<p>' + nimm('Verfluchter Ort')
        + verbindungen(t);
    }

    function riesen() {
      if (g.Riesen.length == 0) return '';
      return '<h2>Riesen in der Wildnis</h2>'
        + g.Riesen.map(t => monster(t)).join('');
    };

    function drachen() {
      if (g.Drachen.length == 0) return '';
      return '<h2>Drachen in der Wildnis</h2>'
        + g.Drachen.map(t => monster(t)).join('');
    };

    function personen() {
      if (g.personen.length == 0) return '';
      return '<h2>Weitere Personen</h2>'
        + g.personen.map(p => `<h3>${p.name}</h3><p>` + p.text(false)).join('');
    };

    function besitzer_finden(t, k) {
      for (const p of g.personen) {
        if (k && p.karriere != k || p.attribute.status < 8) continue;
        t.besitzer = p;
        g.personen = g.personen.filter(x => x != p);
        return;
      }
      const m = wähle([g.Drachen, g.Riesen].flat());
      if (!m) return;
      t.name = 'Ruine von ' + t.name;
      t.zu = 'zur'
      t.besitzer = m;
      g[m.typ] = g[m.typ].filter(x => x != m);
    };

    g.türme.forEach(t => besitzer_finden(t, 'Magier'));
    g.festungen.forEach(t => besitzer_finden(t));

    erstelle_verbindungen();

    g.text = function() {
      return festungen()
        + türme()
        + riesen()
        + drachen()
        + personen();
    };

    return g;
  };

  // Zugänge zu internen Attributen
  h.nimm = nimm;

  return h;
}
