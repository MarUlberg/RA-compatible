console.log("=== RA Checker START ===");

// Decode URL so %20 etc become normal text
const url = decodeURIComponent(location.href).toLowerCase();
console.log("URL:", url);

// ===== PLATFORM TABLE =====
const platforms = [

  { name: "Sega 32X", file: "ra-sega-32x-files.json",
    keys: ["32x", "nointro.32x"] },

  { name: "Game Gear", file: "ra-sega-gamegear-files.json",
    keys: ["game gear", "nointro.gg"] },

  { name: "Master System", file: "ra-sega-mastersystem-files.json",
    keys: ["master system", "mark iii", "nointro.ms-mkiii"] },

  { name: "Genesis", file: "ra-sega-megadrive-files.json",
    keys: ["mega drive", "genesis", "nointro.md"] },

  { name: "Dreamcast", file: "ra-sega-dreamcast-files.json",
    keys: ["dreamcast"] },

  { name: "Sega Saturn", file: "ra-sega-saturn-files.json",
    keys: ["saturn"] },

  { name: "Sega CD", file: "ra-sega-cd-files.json",
    keys: ["mega cd", "sega cd"] },

  { name: "PlayStation", file: "ra-sony-playstation-files.json",
    keys: ["sony - playstation", "psx"] },

  { name: "PlayStation 2", file: "ra-sony-playstation2-files.json",
    keys: ["playstation 2", "ps2"] },

  { name: "PlayStation Portable", file: "ra-sony-playstationportable-files.json",
    keys: ["playstation portable", "psp"] },

  { name: "Game Boy", file: "ra-nintendo-gb-files.json",
    keys: ["nintendo - game boy/"] },

  { name: "Game Boy Color", file: "ra-nintendo-gbc-files.json",
    keys: ["game boy color"] },

  { name: "Game Boy Advance", file: "ra-nintendo-gba-files.json",
    keys: ["game boy advance"] },

  { name: "Nintendo DS", file: "ra-nintendo-ds-files.json",
    keys: ["nintendo ds"] },

  { name: "Nintendo DSi", file: "ra-nintendo-dsi-files.json",
    keys: ["nintendo dsi"] },

  { name: "Nintendo", file: "ra-nintendo-nes-files.json",
    keys: ["nintendo entertainment system"] },

  { name: "Super Nintendo", file: "ra-nintendo-snes-files.json",
    keys: ["super nintendo"] },

  { name: "Virtual Boy", file: "ra-nintendo-vb-files.json",
    keys: ["virtual boy"] },

  { name: "Nintendo 64", file: "ra-nintendo-n64-files.json",
    keys: ["nintendo 64"] },

  { name: "GameCube", file: "ra-nintendo-ngc-files.json",
    keys: ["gamecube"] }
];

// ===== DETECT PLATFORM =====

let dbFile = null;
let consoleName = null;

for (const p of platforms) {
  if (p.keys.some(k => url.includes(k))) {
    dbFile = p.file;
    consoleName = p.name;
    break;
  }
}

if (!dbFile) {
  console.log("❌ No platform detected for this page.");
} else {

  console.log("Detected:", consoleName);
  console.log("Using DB:", dbFile);

  // ===== NORMALIZE FILENAMES =====
  function normalize(name) {
    return name
      .replace(/\.[^.]+$/, "")      // remove extension
      .replace(/\[.*?\]/g, "")      // remove [!] etc
      .replace(/\s+/g, " ")
      .trim();
  }

  // ===== LOAD RA DATABASE =====
  fetch(chrome.runtime.getURL(dbFile))
    .then(r => {
      if (!r.ok) throw new Error("Missing JSON: " + dbFile);
      return r.json();
    })
    .then(list => {

      console.log("Loaded RA entries:", list.length);

      const raSet = new Set(list.map(normalize));

      // ===== CHECK PAGE LINKS =====
      document.querySelectorAll("a").forEach(link => {

        const text = normalize(link.textContent || "");

        if (raSet.has(text)) {

          if (!link.dataset.raMarked) {

            link.dataset.raMarked = "true";

            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL("icon.png");
            icon.style.width = "14px";
            icon.style.height = "14px";
            icon.style.marginLeft = "6px";
            icon.style.verticalAlign = "middle";
            icon.title =
              "RetroAchievements supported (" + consoleName + ")";

            link.appendChild(icon);
          }
        }
      });

    })
    .catch(e => console.error("RA load failed:", e));
}
