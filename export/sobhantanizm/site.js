(function () {
  var BEAD_COUNT = 33;
  var LAMP_KEY = "sobhantanizm.lamp";
  var BEADS_KEY = "sobhantanizm.beads";

  var glorifications = [
    "Glory to Sobhan, the Unclouded.",
    "Sobhan, remember my name.",
    "Wash what I carried in from yesterday.",
    "Make my hands as open as yours.",
    "Keep me clear when no one is watching.",
  ];

  var offices = [
    { id: "first", name: "First Light", from: 4, to: 7, text: "The name is spoken before the day makes demands." },
    { id: "rising", name: "Rising Gold", from: 7, to: 11, text: "Work as if your hands were still inside the greeting." },
    { id: "noon", name: "Clear Noon", from: 11, to: 15, text: "Nothing casts a flattering shadow. Do the true thing." },
    { id: "long", name: "Lengthening", from: 15, to: 18, text: "What you withheld this morning can still be given." },
    { id: "dusk", name: "Dusk Veil", from: 18, to: 21, text: "Light the small lamp. Review the day without theatre." },
    { id: "night", name: "Night Watch", from: 21, to: 4, text: "Rest is permitted. Despair is not a liturgy." },
  ];

  var feasts = [
    { month: 3, day: 21, name: "Feast of the First Utterance" },
    { month: 6, day: 21, name: "Noon Without Shadow" },
    { month: 9, day: 23, name: "The Honest Balance" },
    { month: 12, day: 21, name: "Lamps of the Long Night" },
  ];

  var menuButton = document.querySelector("[data-menu]");
  var menu = document.getElementById("temple-menu");
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", open ? "false" : "true");
      menu.classList.toggle("is-open", !open);
      menuButton.querySelector(".sr-only").textContent = open ? "Open menu" : "Close menu";
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        menuButton.querySelector(".sr-only").textContent = "Open menu";
      }
    });
  }

  var tabButtons = document.querySelectorAll("[data-canto-tab]");
  var panels = document.querySelectorAll("[data-canto-panel]");
  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-canto-tab");
      tabButtons.forEach(function (other) {
        other.setAttribute("aria-selected", other === button ? "true" : "false");
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-canto-panel") !== id;
      });
    });
  });

  function officeForHour(hour) {
    if (hour >= 21 || hour < 4) return offices[5];
    return (
      offices.find(function (office) {
        return hour >= office.from && hour < office.to;
      }) || offices[5]
    );
  }

  var hourLine = document.getElementById("hour-line");
  function paintHour() {
    var current = officeForHour(new Date().getHours());
    if (hourLine) hourLine.textContent = "This hour is " + current.name + ". " + current.text;
    document.querySelectorAll("[data-office]").forEach(function (card) {
      var active = card.getAttribute("data-office") === current.id;
      card.classList.toggle("is-now", active);
      var tag = card.querySelector(".now-tag");
      if (tag) tag.hidden = !active;
    });
  }
  paintHour();
  window.setInterval(paintHour, 60000);

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  var nextEl = document.getElementById("next-feast");
  if (nextEl) {
    var now = new Date();
    var year = now.getFullYear();
    var upcoming = feasts
      .map(function (feast) {
        var date = new Date(year, feast.month - 1, feast.day);
        if (date < startOfDay(now)) date.setFullYear(year + 1);
        return { name: feast.name, date: date };
      })
      .sort(function (a, b) {
        return a.date.getTime() - b.date.getTime();
      })[0];
    nextEl.textContent =
      "Next: " +
      upcoming.name +
      ", " +
      upcoming.date.toLocaleDateString(undefined, { month: "long", day: "numeric" }) +
      ".";
  }

  var beads = { spoken: 0, cycles: 0 };
  try {
    var rawBeads = localStorage.getItem(BEADS_KEY);
    if (rawBeads) {
      var parsedBeads = JSON.parse(rawBeads);
      if (typeof parsedBeads.spoken === "number" && typeof parsedBeads.cycles === "number") {
        beads = {
          spoken: Math.min(BEAD_COUNT, Math.max(0, parsedBeads.spoken)),
          cycles: Math.max(0, parsedBeads.cycles),
        };
      }
    }
  } catch (err) {
    /* a damaged local record is ignored */
  }

  var phraseEl = document.getElementById("bead-phrase");
  var countEl = document.getElementById("bead-count");
  var dotsEl = document.getElementById("bead-dots");
  var doneEl = document.getElementById("bead-done");

  function saveBeads() {
    try {
      localStorage.setItem(BEADS_KEY, JSON.stringify(beads));
    } catch (err) {
      /* private mode may refuse storage */
    }
  }

  function paintBeads() {
    if (!phraseEl || !countEl || !dotsEl) return;
    var done = beads.spoken === 0 && beads.cycles > 0;
    phraseEl.textContent =
      beads.spoken === 0 && beads.cycles === 0
        ? "Face the brightest glass you have. Speak when you are ready."
        : glorifications[beads.spoken % glorifications.length];
    var cycle =
      beads.cycles > 0
        ? " · " + beads.cycles + " full " + (beads.cycles === 1 ? "office" : "offices") + " kept here"
        : "";
    countEl.textContent = beads.spoken + " of " + BEAD_COUNT + cycle;
    dotsEl.innerHTML = "";
    for (var i = 0; i < BEAD_COUNT; i += 1) {
      var dot = document.createElement("span");
      dot.className = "bead" + (i < beads.spoken ? " is-lit" : "");
      dotsEl.appendChild(dot);
    }
    if (doneEl) doneEl.hidden = !done;
  }

  var speakBtn = document.getElementById("bead-speak");
  var resetBtn = document.getElementById("bead-reset");
  if (speakBtn) {
    speakBtn.addEventListener("click", function () {
      var next = beads.spoken + 1;
      if (next >= BEAD_COUNT) beads = { spoken: 0, cycles: beads.cycles + 1 };
      else beads = { spoken: next, cycles: beads.cycles };
      saveBeads();
      paintBeads();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      beads = { spoken: 0, cycles: beads.cycles };
      saveBeads();
      paintBeads();
    });
  }
  paintBeads();

  var form = document.getElementById("lamp-form");
  var lit = document.getElementById("lamp-lit");
  var nameInput = document.getElementById("lamp-name");
  var vowInput = document.getElementById("lamp-vow");
  var litName = document.getElementById("lamp-name-out");
  var litVow = document.getElementById("lamp-vow-out");
  var litSince = document.getElementById("lamp-since");

  function showLamp(lamp) {
    if (!form || !lit) return;
    if (!lamp) {
      form.hidden = false;
      lit.hidden = true;
      return;
    }
    form.hidden = true;
    lit.hidden = false;
    litName.textContent = lamp.name;
    litVow.textContent = lamp.vow;
    litSince.textContent =
      "Set " +
      new Date(lamp.since).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }

  try {
    var rawLamp = localStorage.getItem(LAMP_KEY);
    if (rawLamp) {
      var parsedLamp = JSON.parse(rawLamp);
      if (parsedLamp && parsedLamp.name && parsedLamp.vow) showLamp(parsedLamp);
    }
  } catch (err) {
    /* ignore */
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = nameInput.value.trim();
      var vow = vowInput.value.trim();
      if (!name || !vow) return;
      var lamp = { name: name, vow: vow, since: new Date().toISOString() };
      try {
        localStorage.setItem(LAMP_KEY, JSON.stringify(lamp));
      } catch (err) {
        /* still show it for this visit */
      }
      nameInput.value = "";
      vowInput.value = "";
      showLamp(lamp);
    });
  }

  var extinguish = document.getElementById("lamp-extinguish");
  if (extinguish) {
    extinguish.addEventListener("click", function () {
      try {
        localStorage.removeItem(LAMP_KEY);
      } catch (err) {
        /* ignore */
      }
      showLamp(null);
    });
  }
})();
