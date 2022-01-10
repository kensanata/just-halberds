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

  t.hex = function (val) {
    var xhex = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
    if (val < 34) {
        return xhex[val];
    } else {
        return '?';
    }
  }
  
  t.attribute_text = function () {
    return t.hex(t.attribute.kraft) +
      t.hex(t.attribute.geschick) +
      t.hex(t.attribute.ausdauer) +
      t.hex(t.attribute.intelligenz) +
      t.hex(t.attribute.bildung) +
      t.hex(t.attribute.status);
  };

  t.talente = [];
  t.lerne = function (talent) {
    t.talente[talent] = t.talente[talent] ? t.talente[talent] + 1 : 1;
    t.geschichte.push(talent + ' gelernt.');
  };

  t.talente_text = function () {
    if (t.gestorben) { return ''; }
    return "\nTalente: "
      + Object.keys(t.talente)
      .map(x => { return x + '-' + t.talente[x]})
      .sort()
      .join(', ')
      + "\n";
  }
  
  /* s sind die Karrierendefinitionen */
  let s = {};
  s.krieger = {
    name: 'Krieger',
    attribut: function(t) {
      return Math.max(t.attribute.kraft, t.attribute.ausdauer);
    },
    talente: {
      Söldner: ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      Wache: ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      Reiter: ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
      Offizier: ['Bauen', 'Rennen', 'Taktik', 'Feldscher', 'Handwerk', 'Kämpfen'],
    },
    lernen: function(t) {
      let gruppe = t.alter < 20 ? eins(['Söldner', 'Wache']) : eins(Object.keys(this.talente));
      t.geschichte.push("4 Jahre " + gruppe);
      for (let i = 0, limite = 4; i < limite; i++) {
        t.lerne(eins(this.talente[gruppe]));
      }
      return;
    }
  };

  t.geschichte = [];
  t.alter = 16;
  t.geschlecht = geschlecht();
  t.name = name(t.geschlecht);
  t.karrieren = 0;
  t.gestorben = false;
  t.talente = [];
  
  t.beste_karriere = function() {
    let beste;
    let bestes_attribut = 0;
    for (let karriere of Object.keys(s)) {
      let attribut = s[karriere].attribut(t);
      if (attribut > bestes_attribut) {
        beste = karriere;
      }
    }
    return beste;
  };
  
  let karriere = t.beste_karriere.call();

  t.karriereschritt = function () {
    t.karrieren += 1;
    t.geschichte.push('--------------------------------------------');
    t.geschichte.push('Karriere ' + t.karrieren + ', Alter ' + t.alter);
    s[karriere].lernen(t);
    t.alter += 4;
  };

  t.karriereschritt();
  
  return (t.gestorben ? '† ' : '')
    + t.name + '    ' + t.attribute_text() + '    Alter: ' + t.alter + "\n"
    + (t.karrieren == 1 ? '1 Karriere' : t.karrieren + ' Karrieren')
    + t.talente_text()
    + "\n\n" + t.geschichte.join("\n") + "\n"
    ;
} // End wrapper function helmbartenCharacter()
