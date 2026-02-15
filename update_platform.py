import requests
import time
import json
import sys
import os
import re

USERNAME = "MarUlberg"
API_KEY = "2LuaObfDjmOCVDZFlBfNpZ9treDbwt99"
SYSTEM_LIST_FILE = "system_list.txt"   # <-- MUST be here

BASE_URL = "https://retroachievements.org/API"

PLATFORM_MAP = {
    1: "sega-megadrive",
    2: "nintendo-n64",
    3: "nintendo-snes",
    4: "nintendo-gb",
    5: "nintendo-gba",
    6: "nintendo-gbc",
    7: "nintendo-nes",
    8: "pc-engine-turbografx-16",
    9: "sega-cd",
    10: "sega-32x",
    11: "sega-mastersystem",
    12: "sony-playstation",
    13: "atari-lynx",
    14: "neo-geo-pocket",
    15: "sega-gamegear",
    16: "nintendo-ngc",
    17: "atari-jaguar",
    18: "nintendo-ds",
    19: "nintendo-wii",
    20: "nintendo-wiiu",
    21: "sony-playstation2",
    22: "xbox",
    23: "magnavox-odyssey-2",
    24: "pokemon-mini",
    25: "atari-2600",
    26: "dos",
    27: "arcade",
    28: "nintendo-vb",
    29: "msx",
    30: "commodore-64",
    31: "zx81",
    32: "oric",
    33: "sg-1000",
    34: "vic-20",
    35: "amiga",
    36: "atari-st",
    37: "amstrad-cpc",
    38: "apple-ii",
    39: "sega-saturn",
    40: "sega-dreamcast",
    41: "sony-playstationportable",
    42: "philips-cd-i",
    43: "3do-interactive-multiplayer",
    44: "colecovision",
    45: "intellivision",
    46: "vectrex",
    47: "pc-8000-8800",
    48: "pc-9800",
    49: "pc-fx",
    50: "atari-5200",
    51: "atari-7800",
    52: "sharp-x68000",
    53: "wonderswan",
    54: "cassette-vision",
    55: "super-cassette-vision",
    56: "neo-geo-cd",
    57: "fairchild-channel-f",
    58: "fm-towns",
    59: "zx-spectrum",
    60: "game-watch",
    61: "nokia-n-gage",
    62: "nintendo-3ds",
    63: "watara-supervision",
    64: "sharp-x1",
    65: "tic-80",
    66: "thomson-to8",
    67: "pc-6000",
    68: "sega-pico",
    69: "mega-duck",
    70: "zeebo",
    71: "arduboy",
    72: "wasm-4",
    73: "arcadia-2001",
    74: "interton-vc-4000",
    75: "elektor-tv-games-computer",
    76: "pc-engine-cd-turbografx-cd",
    77: "atari-jaguar-cd",
    78: "nintendo-dsi",
    79: "ti-83",
    80: "uzebox",
    81: "famicom-disk-system",
    100: "hubs",
    101: "events",
    102: "standalone",
}

def console_from_filename(path):
    name = os.path.basename(path)
    name = name.replace("ra-", "").replace("-files.json", "")
    name = name.lower()

    for cid, slug in PLATFORM_MAP.items():
        if slug == name:
            return cid, slug

    return None, name

def safe_results(data):
    return data["Results"] if isinstance(data, dict) else data


def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip("-")


def get_next_system():
    if not os.path.exists(SYSTEM_LIST_FILE):
        print("system_list.txt not found")
        return None, None

    with open(SYSTEM_LIST_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if not lines:
        print("System list empty")
        return None, None

    first_line = lines[0].strip()
    rest = lines[1:]

    parts = first_line.split(maxsplit=1)
    console_id = int(parts[0])
    platform_name = parts[1] if len(parts) > 1 else f"system-{console_id}"

    with open(SYSTEM_LIST_FILE, "w", encoding="utf-8") as f:
        f.writelines(rest)

    return console_id, platform_name

def get_game_list(console_id):
    url = f"{BASE_URL}/API_GetGameList.php"
    params = {"u": USERNAME, "y": API_KEY, "i": console_id, "f": 1}
    r = requests.get(url, params=params)
    r.raise_for_status()
    data = r.json()
    return data["Results"] if isinstance(data, dict) else data


def get_hashes(game_id):
    url = f"{BASE_URL}/API_GetGameHashes.php"
    params = {"u": USERNAME, "y": API_KEY, "i": game_id}
    r = requests.get(url, params=params)
    r.raise_for_status()
    data = r.json()
    return data["Results"] if isinstance(data, dict) else data


def get_next_system():
    if not os.path.exists(SYSTEM_LIST_FILE):
        print("system_list.txt not found")
        return None, None

    with open(SYSTEM_LIST_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if not lines:
        print("System list empty")
        return None, None

    first_line = lines[0].strip()
    rest = lines[1:]

    parts = first_line.split(maxsplit=1)
    console_id = int(parts[0])
    platform_name = parts[1] if len(parts) > 1 else f"system-{console_id}"

    # Remove processed system
    with open(SYSTEM_LIST_FILE, "w", encoding="utf-8") as f:
        f.writelines(rest)

    return console_id, platform_name

def main():
    if len(sys.argv) < 2:
        print("Drag a ra-<platform>-files.json onto this script.")
        return

    filepath = sys.argv[1]

    console_id, platform = console_from_filename(filepath)

    if not console_id:
        print(f"Platform not found in list: {platform}")
        return

    print(f"\n===== Updating {platform} (System {console_id}) =====\n")

    games = get_game_list(console_id)
    rom_names = set()

    total_games = len(games)

    for idx, game in enumerate(games, start=1):
        game_id = game.get("ID") or game.get("GameID")
        title = game.get("Title") or game.get("Name", "Unknown")

        print(f"[{idx}/{total_games}] Fetching {title} ({game_id})")

        try:
            hashes = get_hashes(game_id)

            if not hashes:
                print("   → No supported ROMs")
            else:
                for h in hashes:
                    name = h.get("Name")
                    if name:
                        print(f"   → {name}")
                        rom_names.add(name.strip())

        except Exception as e:
            print("   Error:", e)

        time.sleep(0.4)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(sorted(rom_names), f, indent=2, ensure_ascii=False)

    print(f"\nUpdated → {filepath}")

if __name__ == "__main__":
    main()
