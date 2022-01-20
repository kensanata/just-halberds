/* Helmbarten RPG character generator
   © Alex Schröder 2022

   Um eine Charakterbeschreibung zu generieren: helmbarten().character().text();
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
      // [a@b] speichert a als Resultat für b
      text = text.replaceAll(/\[([^\[\]]+)@([^\[\]]+)\]/g,
                             (m, w, u) => { e = true; h.resultate[u] = w; return ''; });
      if (e) continue;
      // [a|b] wählt a oder b
      text = text.replaceAll(/\[([^\[\]]+\|[^\[\]]+)\]/g,
                             (m, w) => { e = true; return wähle(w.split('|')); });
      if (e) continue;
      // [a] wählt einen Eintrag aus der Tabelle a
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

  function würfel(anzahl, seiten = 6, plus = 0) {
    let total = 0;
    for (var i = 0; i < anzahl; i++) {
      total += Math.floor(Math.random() * seiten + 1);
    }
    return total + plus;
  }

  h.charakter = function() {
    /* t ist der Charakter */
    let t = {};
    
    t.geschichte = [];
    t.alter = 16;
    t.name = nimm(`Menschenname`);
    t.geschlecht = h.resultate.Geschlecht;
    t.karrieren = 0;
    t.gestorben = false;
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

    t.attribute_hex = function () {
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

    function lernen() {
      let tabelle = t.karriere;
      if (t.karriere == 'Krieger' && (t.attribute.status >= 8 || t.attribute.intelligenz >= 8)) tabelle += ' Bevorzugte';
      if (t.alter < 20) tabelle += ' Anfänger';
      let tätigkeit = nimm(tabelle);
      t.geschichte.push("4 Jahre " + tätigkeit);
      t.geschichte.push([1, 2, 3, 4].map(n => t.lerne(nimm(tätigkeit)) + ' gelernt.').join(" "));
      return;
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
        .map(x => { return x + '-' + t.talente[x]; })
        .sort()
        .join(' ') + "\n";
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

    function attribut(karriere) {
      return nimm(`${karriere} Attribut`).split(',').map(x => t.attribute[x]).reduce((a, b) => Math.max(a, b), 0);
    };

    t.beste_karriere = function() {
      let beste_karriere;
      let bester_wert = 0;
      for (let karriere of ungeordnet(Object.keys(s))) {
        if (t.verboten.includes(karriere)) continue;
        let wert = attribut(karriere);
        if (wert > bester_wert) {
          bester_wert = wert;
          beste_karriere = karriere;
        }
      }
      if (beste_karriere) {
        if (würfel(2) <= bester_wert) {
          t.geschichte.push(`${beste_karriere} geworden.`);
        } else {
          t.geschichte.push(`Wollte ${beste_karriere} werden, bin aber nicht aufgenommen worden.`);
          t.verboten.push(beste_karriere);
          return t.beste_karriere();
        }
      }
      return beste_karriere;
    };

    t.bester_wert = function() {
      let bestes_attribut;
      let bester_wert = 0;
      for (let attribut of ungeordnet(Object.keys(t.attribute))) {
        if (t.attribute[attribut] > bester_wert) {
          bestes_attribut = attribut;
          bester_wert = t.attribute[attribut];
        }
      }
      return bester_wert;
    };

    if (debug) t.geschichte.push('Gestartet mit ' + t.attribute_hex());
    t.karriere = t.beste_karriere();
    if (t.karriere)
      t.geschichte.push(t.lerne(nimm(`${t.karriere} Aufnahme`)) + ' gelernt.');

    t.neue_karriere = function() {
      t.alter += 1;
      t.verboten.push(t.karriere);
      t.karriere = undefined;
    };

    t.weitermachen = function() {
      if (t.gestorben) return false;
      if (würfel(1) < t.karrieren) {
        t.geschichte.push(nimm('Abenteurerleben!'));
        return false;
      }
      if (!t.karriere) t.karriere = t.beste_karriere();
      return t.karriere;
    };

    t.karriereschritt = function() {
      t.karrieren += 1;
      t.geschichte.push(`<hr>Karriere ${t.karrieren}, Alter ${t.alter}`);
      lernen(t);
    };

    t.schicksalsschlag = function() {
      let w = würfel(2);
      let z = attribut(t.karriere);
      // t.geschichte.push(w + '+' + t.karrieren + ' ≤ ' +  z);
      if (w + t.karrieren > z) {
        t.geschichte.push(nimm(`${t.karriere} Schicksalsschlag`));
        if (h.resultate.feind) { t.feinde.push(h.resultate.feind); }
        if (h.resultate.alterung) { t.alterung() }
        if (h.resultate.karrierenwechsel) { t.neue_karriere(); }
        if (h.resultate.gefangenschaft) { t.verloren(h.resultate.verloren, h.resultate.entkommen); }
        if (h.resultate.gestorben) { t.gestorben = true; }
      }
    };

    t.verloren = function(gestorben, entkommen) {
      t.alterung();
      t.alter += 4;
      let jahre = 4;
      // Das Entkommen ist eine schwierige Probe mit 3W6!
      while (!t.gestorben && würfel(3) > t.bester_wert()) {
        jahre += 4;
        t.alter += 4;
        t.alterung();
      }
      if (t.gestorben) {
        t.geschichte.push(gestorben.replace('${n}', jahre));
      } else {
        t.geschichte.push(entkommen.replace('${n}', jahre));
        t.neue_karriere();
      }
    };

    t.alterung = function() {
      const faktor = t.alter < 50 ? 1 : 2;
      const a = nimm(`Alterung ${faktor}`);
      if (h.resultate.alterung) {
        t.attribute[h.resultate.alterung] = Math.max(t.attribute[h.resultate.alterung] - faktor, 0);
        t.gestorben = t.gestorben || t.attribute[h.resultate.alterung] <= 0;
        t.geschichte.push(a);
        if (debug) t.geschichte.push('Weiter mit ' + t.attribute_hex());
      }
    };

    t.älter_werden = function() {
      if (t.gestorben) return;
      t.alter += 4;
      if (t.alter >= 36) {
        t.alterung();
      };
    };

    let belohnungen = [];
    while(t.weitermachen()) {
      t.karriereschritt();
      // Belohnungen werden gesammelt und am Ende ein Mal ausgeführt werden.
      belohnungen.push(`${t.karriere} Belohnung`);
      t.schicksalsschlag();
      t.älter_werden();
    }

    function lehrstuhl() {
      let j = t.bestes_talent(t.lehrstühle) || wähle(Object.keys(t.talente));
      t.lehrstühle.push(j);
      t.stellen.push(`💰 Lehrstuhl für ${j}`);
      t.geschichte.push(`Ich habe einen Lehrstuhl für ${j} bekommen.`);
    };

    belohnungen_erhalten = function() {
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

    if (!t.gestorben && belohnungen.length > 0) belohnungen_erhalten();

    t.titel = function() {
      let talent = t.bestes_talent();
      if (!talent) return '';
      return nimm(`${talent} ${t.geschlecht}`) + ' ';
    };

    t.gefährten_text = function() {
      if (t.gestorben || !t.gefährten.length) return '';
      return "\nGefährten\n" + t.gefährten.map(x => `${x}\n`).join('');
    };

    t.tiere_text = function() {
      if (t.gestorben || !t.tiere.length) return '';
      return "\nTiere\n" + t.tiere.map(x => `${x}\n`).join('');
    };

    t.feinde_text = function() {
      if (t.gestorben || !t.feinde.length) return '';
      return "\nFeinde\n" + t.feinde.map(x => `${x}\n`).join('');
    };

    t.mitgliedschaften_text = function() {
      if (t.gestorben || !t.mitgliedschaften.length) return '';
      return "\nMitgliedschaften\n" + t.mitgliedschaften.join("\n") + "\n";
    };

    t.stellen_text = function() {
      if (t.gestorben || !t.stellen.length) return '';
      return "\nStellen\n" + t.stellen.join("\n") + "\n";
    };

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
    };

    return t;
  };

  return h;
}
