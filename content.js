console.log("=== RA Checker START ===");

// Decode URL so %20 etc become normal text
const url = decodeURIComponent(location.href).toLowerCase();
console.log("URL:", url);

// ===== PLATFORM TABLE =====
const platforms = [

  { name: "Sega Dreamcast", file: "ra-sega-dreamcast-files.json",
    keys: ["dreamcast"],
    breadcrumbKeys: ["dreamcast"],
		myrientFolder: "Sega - Dreamcast" },

  { name: "Sega Saturn", file: "ra-sega-saturn-files.json",
    keys: ["saturn"],
    breadcrumbKeys: ["saturn"],
		myrientFolder: "Sega - Saturn" },

  { name: "Sega 32X", file: "ra-sega-32x-files.json",
    keys: ["32x", "nointro.32x"],
    breadcrumbKeys: ["32x"],
		myrientFolder: "Sega - 32X" },

  { name: "Sega Mega CD", file: "ra-sega-cd-files.json",
    keys: ["mega cd", "sega cd"],
    breadcrumbKeys: ["sega cd"],
		myrientFolder: "Sega - Mega CD & Sega CD" },
		
  { name: "Sega Megadrive / Genesis", file: "ra-sega-megadrive-files.json",
    keys: ["mega drive", "genesis", "nointro.md"],
    breadcrumbKeys: ["genesis/mega drive"],
    myrientFolder: "Sega - Mega Drive - Genesis" },

  { name: "Sega Master System", file: "ra-sega-mastersystem-files.json",
    keys: ["master system", "mark iii", "nointro.ms-mkiii"],
    breadcrumbKeys: ["master system"],
    myrientFolder: "Sega - Master System - Mark III" },

  { name: "Sega Game Gear", file: "ra-sega-gamegear-files.json",
    keys: ["game gear", "nointro.gg"],
    breadcrumbKeys: ["game gear"],
    myrientFolder: "Sega - Game Gear" },

  { name: "Sony PlayStation Portable", file: "ra-sony-playstationportable-files.json",
    keys: ["playstation portable", "psp"],
    breadcrumbKeys: ["playstation portable"],
		myrientFolder: "Sony - PlayStation Portable" },

  { name: "Sony PlayStation 2", file: "ra-sony-playstation2-files.json",
    keys: ["playstation 2", "ps2"],
    breadcrumbKeys: ["playstation 2"],
		myrientFolder: "Sony - PlayStation 2" },
		
  { name: "Sony PlayStation", file: "ra-sony-playstation-files.json",
    keys: ["sony - playstation", "psx"],
    breadcrumbKeys: ["playstation"],
		myrientFolder: "Sony - PlayStation" },

  { name: "Nintendo DSi", file: "ra-nintendo-dsi-files.json",
    keys: ["nintendo dsi"],
    breadcrumbKeys: ["dsi"],
    myrientFolder: "Nintendo - Nintendo DSi (Digital)" },

  { name: "Nintendo DS", file: "ra-nintendo-ds-files.json",
    keys: ["nintendo ds"],
    breadcrumbKeys: ["nintendo ds"],
    myrientFolder: "Nintendo - Nintendo DS (Decrypted)" },

  { name: "Nintendo Game Boy Advance", file: "ra-nintendo-gba-files.json",
    keys: ["game boy advance"],
    breadcrumbKeys: ["game boy advance"],
    myrientFolder: "Nintendo - Game Boy Advance" },

  { name: "Nintendo Game Boy Color", file: "ra-nintendo-gbc-files.json",
    keys: ["game boy color"],
    breadcrumbKeys: ["game boy color"],
    myrientFolder: "Nintendo - Game Boy Color" },

  { name: "Nintendo Game Boy", file: "ra-nintendo-gb-files.json",
    keys: ["nintendo - game boy/"],
    breadcrumbKeys: ["game boy"],
    myrientFolder: "Nintendo - Game Boy" },

  { name: "Nintendo GameCube", file: "ra-nintendo-ngc-files.json",
    keys: ["gamecube"],
    breadcrumbKeys: ["gamecube"],
		myrientFolder: "Nintendo - GameCube - NKit RVZ [zstd-19-128k]" },

  { name: "Nintendo 64", file: "ra-nintendo-n64-files.json",
    keys: ["nintendo 64"],
    breadcrumbKeys: ["nintendo 64"],
    myrientFolder: "Nintendo - Nintendo 64 (BigEndian)" },

  { name: "Nintendo Virtual Boy", file: "ra-nintendo-vb-files.json",
    keys: ["virtual boy"],
    breadcrumbKeys: ["virtual boy"],
    myrientFolder: "Nintendo - Virtual Boy" },
		
  { name: "Super Nintendo Entertainment System", file: "ra-nintendo-snes-files.json",
    keys: ["super nintendo"],
    breadcrumbKeys: ["snes/super famicom"],
    myrientFolder: "Nintendo - Super Nintendo Entertainment System" },
		
  { name: "Nintendo Entertainment System", file: "ra-nintendo-nes-files.json",
    keys: ["nintendo entertainment system"],
    breadcrumbKeys: ["nes/famicom"],
    myrientFolder: "Nintendo - Nintendo Entertainment System (Headered)" },

  { name: "3DO Interactive Multiplayer", file: "ra-3do-interactive-multiplayer-files.json",
    keys: ["panasonic - 3do"],
    breadcrumbKeys: ["3do interactive multiplayer"],
    myrientFolder: "Panasonic - 3DO Interactive Multiplayer" },

  { name: "Atari Jaguar CD", file: "ra-atari-jaguar-cd-files.json",
    keys: ["jaguar cd"],
    breadcrumbKeys: ["atari jaguar cd"],
    myrientFolder: "Atari - Jaguar CD Interactive Multimedia System" },

  { name: "Atari Jaguar", file: "ra-atari-jaguar-files.json",
    keys: ["atari - jaguar"],
    breadcrumbKeys: ["atari jaguar"],
    archive: "-", myrientFolder: "Atari - Jaguar" },

  { name: "Atari 7800", file: "ra-atari-7800-files.json",
    keys: ["atari - 7800", "nointro.atari-7800"],
    breadcrumbKeys: ["atari 7800"],
    myrientFolder: "Atari - 7800",
		
		host: "https://archive.org/download",
		archivePath: "nointro.atari-7800",
		extension: ".7z"},

  { name: "Atari 2600", file: "ra-atari-2600-files.json",
    keys: ["atari - 2600", "nointro.atari-2600"],
    breadcrumbKeys: ["atari 2600"],
    myrientFolder: "Atari - 2600",
		
		host: "https://archive.org/download",
		archivePath: "nointro.atari-2600",
		extension: ".7z"},

  { name: "PC Engine CD / TurboGrafx CD", file: "ra-pc-engine-cd-turbografx-cd-files.json",
    keys: ["pc engine cd"],
    breadcrumbKeys: ["pc engine cd/turbografx-cd"],
    myrientFolder: "NEC - PC Engine CD & TurboGrafx CD" },

  { name: "PC Engine / TurboGrafx-16", file: "ra-pc-engine-turbografx-16-files.json",
    keys: ["turbografx-16"],
    breadcrumbKeys: ["pc engine/turbografx-16"],
    myrientFolder: "NEC - PC Engine - TurboGrafx-16" },

  { name: "Neo Geo CD", file: "ra-neogeo-cd-files.json",
    keys: ["neo geo cd"],
    breadcrumbKeys: ["neo geo cd"],
    myrientFolder: "SNK - Neo Geo CD" }
];

// ===== RETROACHIEVEMENTS HASH PAGE SUPPORT =====

function detectPlatformFromBreadcrumb() {

  const systemLink = document.querySelector(
    'nav[aria-label="breadcrumb"] a[href*="/system/"]'
  );

  if (!systemLink) return null;

  const breadcrumb = systemLink.innerText.toLowerCase();

  for (const p of platforms) {

    if (!p.breadcrumbKeys) continue;

    for (const key of p.breadcrumbKeys) {
      const parts = key.split("/");
      if (parts.some(k => breadcrumb.includes(k.trim()))) {
        return p;
      }
    }
  }

  return null;
}

function detectArchiveFromRow(li) {
  if (li.querySelector('img[alt="redump"]')) return "Redump";
  if (li.querySelector('img[alt="nointro"]')) return "No-Intro";
  return null;
}

function processRAHashesPage() {

  if (
    !location.hostname.includes("retroachievements.org") ||
    !location.pathname.includes("/hashes")
  ) return;

  const rows = document.querySelectorAll(
    '[data-testid="named-hashes"] li'
  );

  if (!rows.length) return;

  const platform = detectPlatformFromBreadcrumb();

  if (!platform || !platform.myrientFolder) {
    console.log("Platform not mapped yet");
    return;
  }

	// ===== RULE 1: skip platforms without Myrient folder
	if (!platform.myrientFolder || platform.myrientFolder === "-") {
		console.log("Skipping platform with no Myrient folder:", platform.name);
		return;
	}

  console.log("Detected platform:", platform.name);

  const archive = platform.archive || "No-Intro";
  const folder  = platform.myrientFolder;

	rows.forEach(li => {

		const el = li.querySelector("span.font-bold");
		if (!el || el.dataset.raLinked) return;

		const archive = detectArchiveFromRow(li);

		if (!archive) {
			console.log("Unknown archive, skipping:", el.innerText);
			return;
		}

		// ===== RULE 2: skip entries with patch file
		if (li.querySelector('a[href*="Download+Patch+File"], a[href*="RAPatches"]')) {
			console.log("Skipping patched ROM:", el.innerText);
			return;
		}

		// ===== RULE 3: skip FBNeo roms
		if (li.querySelector('img[alt="fbneo"]')) {
			console.log("Skipping FBNeo ROM:", el.innerText);
			return;
		}

    let text = el.innerText.trim();
    if (!text) return;

    let base = text;

    if (base.includes(".")) {
      base = base.replace(/\.[^.]+$/, "");
    }

    base = base.replace(/track\s*\d+/i, "").trim();
    if (!base || base.length < 3) return;

    if (archive === "Redump") {
      if (/^slus|scus|sles|track/i.test(base)) return;
    }

    const encode = s =>
      encodeURIComponent(s)
        .replace(/\(/g,"%28")
        .replace(/\)/g,"%29");

    let url;

    if (platform.host && platform.archivePath) {
      url =
        platform.host + "/" +
        platform.archivePath + "/" +
        encode(base) +
        (platform.extension || ".zip");

    } else {
      url =
        "https://myrient.erista.me/files/" +
        archive + "/" +
        encode(folder) + "/" +
        encode(base) +
        (platform.extension || ".zip");
    }

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerText = text;
    a.style.color = "#6cf";

    el.dataset.raLinked = "1";
    el.innerText = "";
    el.appendChild(a);
  });
}


// ===== ROBUST HASH PAGE WATCHER =====

function startRAWatcher() {

  if (!location.hostname.includes("retroachievements.org"))
    return;

  let lastUrl = location.href;
  let debounce = null;

  const observer = new MutationObserver(() => {

    // Detect SPA navigation
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("RA navigation detected");
    }

    // Debounce to avoid spam
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      processRAHashesPage();
    }, 200);

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run once after load
  setTimeout(processRAHashesPage, 500);
}

window.addEventListener("load", startRAWatcher);


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

if (!dbFile && !location.hostname.includes("retroachievements.org")) {
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

