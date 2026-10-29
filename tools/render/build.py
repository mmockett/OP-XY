#!/usr/bin/env python3
"""Builds every machine's browser preview for render.mjs, then (with --publish)
copies the rendered screens into the site.

    python3 tools/render/build.py            # previews, SDK modules, font, kit labels
    node tools/render/render.mjs [id ...]    # render the screens to tools/render/out
    python3 tools/render/build.py --publish  # copy them to assets/media, rebuild the grids

The machine repositories and SDK checkouts sit beside this one (../opxy-pads,
../opxy-nonagon, ../OP-XY-MNMD, ../opxy-grains, ../OP-XY-Macro (OP-XY-ModFX), ../open-xy-staging,
../open-xy, ../open-xy-pr3, ../open-xy-aux on sdk/effect-screens).
The screen font is the OP-XY's, Univers Next Pro Light: set XY_FONT to its file.
It is copied into tools/render/font for rendering only and never committed.
"""
import argparse
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent.parent
REPOS = SITE.parent
FONT = pathlib.Path(os.environ.get("XY_FONT", pathlib.Path.home() / "Downloads/univers-next-pro/Univers Next Pro Light.ttf"))

# Which SDK checkout each machine builds against, as each repository's README says.
SDKS = {"staging": REPOS / "open-xy-staging", "fork": REPOS / "open-xy", "pr3": REPOS / "open-xy-pr3",
        "aux": REPOS / "open-xy-aux"}
MODFX = REPOS / "OP-XY-Macro"
HEXAGON = ["wane", "bloom", "hollow", "orbit", "bend", "moth"]
NONAGON = ["sand", "cocoa", "ghost", "coin", "recur", "fermi", "mach", "butterfly", "drop"]
# Nonagon's sample engines, and the files their screens are drawn from.
NONAGON_SAMPLE = {
    "ghost": ["display.cpp", "display.h", "captions.h", "figure.h", "tables.h", "ghost.h", "panel.svg.fragment"],
    "recur": ["display.cpp", "display.h", "layout.h", "recur.h", "panel.svg.fragment"],
}
KITS = ["mdtrx", "mdefm", "mdpi", "mde12"]
# The stand-in synth for Grains' screen: the catalog holds "grains" itself.
WRAP_ID = "grainsview"

# The site's media: each project's folder, its machines, and its grid of screens.
MEDIA = {
    "hexagon": {"ids": HEXAGON, "grid": ("hexagon", HEXAGON, 3)},
    "nonagon": {"ids": NONAGON, "grid": ("nonagon", NONAGON, 3)},
    "grains": {"ids": ["grains"]},
    "modfx": {"ids": ["omnifilter", "lint"]},
    "mnmd": {"ids": None, "grid": ("overview", ["mdtrx", "mdefm", "mmsid", "mmvo6", "mmstat", "mmpulse", "mmwave", "mmdens"], 4)},
}


def run(*args, **kw):
    subprocess.run([str(a) for a in args], check=True, **kw)


def clang():
    try:
        return subprocess.run(["brew", "--prefix", "llvm"], capture_output=True, text=True, check=True).stdout.strip() + "/bin/clang++"
    except (OSError, subprocess.CalledProcessError):
        return "clang++"


def preview(sdk, flag, folder, out):
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    shutil.rmtree(out, ignore_errors=True)
    result = subprocess.run([str(python), str(SDKS[sdk] / "sdk.py"), "preview", "--cxx", clang(), flag, str(folder), "--out", str(out)],
                            capture_output=True, text=True)
    if result.returncode:
        sys.exit(f"{folder.name}: preview failed\n{result.stdout[-2000:]}{result.stderr[-2000:]}")
    print(f"built {out.name}")


def grains_wrap():
    """Grains is a sample engine, which the SDK can't preview: its real display
    code goes into a stand-in synth, with the sample's overview written by render.html."""
    wrap = HERE / "grains-wrap"
    shutil.rmtree(wrap, ignore_errors=True)
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    # Made away from the checkouts: the SDK refuses an ID another local machine has.
    with tempfile.TemporaryDirectory() as scratch:
        run(python, SDKS["pr3"] / "sdk.py", "new", "--repository", "--kind", "synth", "--controls", "8",
            "--id", WRAP_ID, "--name", "Grains", "--out", pathlib.Path(scratch) / WRAP_ID, stdout=subprocess.DEVNULL)
        shutil.copytree(pathlib.Path(scratch) / WRAP_ID, wrap)
    source = REPOS / "opxy-grains"
    # Grains' own files, renamed into the stand-in's namespace and artwork prefix.
    rename = lambda text: re.sub(r"\bnamespace grains\b", f"namespace {WRAP_ID}", text).replace("grains::", f"{WRAP_ID}::")
    for name in ("display.cpp", "display.h", "tables.h"):
        (wrap / name).write_text(rename((source / name).read_text()))
    (wrap / "panel.svg.fragment").write_text((source / "panel.svg.fragment").read_text().replace('id="grains_', f'id="{WRAP_ID}_'))
    display = (wrap / "display.cpp").read_text().replace('#include "core.h"', '#include "grains_core.h"')
    (wrap / "display.cpp").write_text(display)
    core = rename((source / "core.h").read_text()).replace("#include <opxy/sample_engine.hpp>", "#include <opxy/types.hpp>")
    core = re.sub(r"// One grain:.*?\n};\n", "", core, flags=re.S)
    core = re.sub(r"// A voice:.*?\n};\n", "", core, flags=re.S)
    core = re.sub(r"void initialize\(.*?\n.*?\n.*?\n", "", core)
    (wrap / "grains_core.h").write_text(core)
    real = json.loads((source / "definition.json").read_text())
    synth = json.loads((wrap / "definition.json").read_text())
    synth["parameters"] = real["parameters"]
    for i, p in enumerate(synth["parameters"]):
        if i >= 4:
            p["control"] = i - 4
    synth["press"] = real.get("press", "page")
    synth["presets"] = real.get("presets") or {"Default": {p["id"]: p["default"] for p in real["parameters"]}}
    synth["resources"]["display"] = real["resources"]["display"]
    (wrap / "definition.json").write_text(json.dumps(synth, indent=1))
    return wrap


def sample_wrap(mid):
    """A Nonagon sample engine's screen in a stand-in synth, as for Grains: its own
    display files, and the sample's overview written by render.html."""
    wrap = HERE / "nonagon-wrap" / mid
    shutil.rmtree(wrap, ignore_errors=True)
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    with tempfile.TemporaryDirectory() as scratch:
        run(python, SDKS["pr3"] / "sdk.py", "new", "--repository", "--kind", "synth", "--controls", "8",
            "--id", mid, "--name", mid.capitalize(), "--out", pathlib.Path(scratch) / mid, stdout=subprocess.DEVNULL)
        shutil.copytree(pathlib.Path(scratch) / mid, wrap)
    source = REPOS / "opxy-nonagon" / mid
    for name in NONAGON_SAMPLE[mid]:
        shutil.copy(source / name, wrap / name)
    real = json.loads((source / "definition.json").read_text())
    synth = json.loads((wrap / "definition.json").read_text())
    synth["parameters"] = real["parameters"]
    for i, p in enumerate(synth["parameters"]):
        if i >= 4:
            p["control"] = i - 4
    synth["press"] = real.get("press", "page")
    synth["presets"] = real.get("presets") or {"Default": {p["id"]: p["default"] for p in real["parameters"]}}
    synth["resources"]["display"] = real["resources"]["display"]
    (wrap / "definition.json").write_text(json.dumps(synth, indent=1))
    return wrap


def effect_wrap(mid):
    """A send effect's screen in a stand-in synth: its own display files, with
    the shift row render.html hands the display."""
    wrap = HERE / "effect-wrap" / mid
    shutil.rmtree(wrap, ignore_errors=True)
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    with tempfile.TemporaryDirectory() as scratch:
        run(python, SDKS["aux"] / "sdk.py", "new", "--repository", "--kind", "synth", "--controls", "8",
            "--id", mid, "--name", mid.capitalize(), "--out", pathlib.Path(scratch) / mid, stdout=subprocess.DEVNULL)
        shutil.copytree(pathlib.Path(scratch) / mid, wrap)
    source = MODFX / mid
    for name in ("display.cpp", "display.h", "panel.h", "tables.h", "panel.svg.fragment"):
        shutil.copy(source / name, wrap / name)
    real = json.loads((source / "definition.json").read_text())
    synth = json.loads((wrap / "definition.json").read_text())
    synth["parameters"] = real["parameters"]
    synth["press"] = real.get("press", "page")
    synth["presets"] = real.get("presets") or {"Default": {p["id"]: p["default"] for p in real["parameters"]}}
    synth["resources"]["display"] = real["resources"]["display"]
    (wrap / "definition.json").write_text(json.dumps(synth, indent=1))
    # The shift row's labels and choices, for the header while Shift is held.
    (HERE / "m").mkdir(exist_ok=True)
    (HERE / "m" / f"{mid}-shift.json").write_text(json.dumps(
        [{"label": r["label"], "choices": r["mapping"]["labels"]} for r in real.get("shift", [])]))
    return wrap


def kit_labels():
    labels = {}
    for kit in KITS:
        text = (REPOS / "OP-XY-MNMD" / "machines" / kit / "kit.h").read_text()
        body = text[text.index("const Model model[models]"):]
        body = body[:body.index("};")]
        rows = re.findall(r'\{\s*"([^"]*)"\s*,.*?\{([^}]*)\}', body, re.S)
        labels[kit] = [re.findall(r'"([^"]*)"', row) for _, row in rows]
    (HERE / "kit-labels.json").write_text(json.dumps(labels))


def build():
    if not FONT.exists():
        sys.exit(f"No screen font at {FONT}; set XY_FONT to Univers Next Pro Light")
    (HERE / "font").mkdir(exist_ok=True)
    shutil.copy(FONT, HERE / "font" / "UniversNextPro-Light.ttf")
    for name, checkout in SDKS.items():
        (HERE / "sdk" / name).mkdir(parents=True, exist_ok=True)
        for module in ("display.mjs", "controls.mjs"):
            shutil.copy(checkout / "sdk" / "browser" / module, HERE / "sdk" / name / module)
    kit_labels()
    for mid in HEXAGON:
        preview("staging", "--machine", REPOS / "opxy-pads" / mid, HERE / "m" / mid)
    for folder in sorted((REPOS / "OP-XY-MNMD" / "machines").iterdir()):
        if not (folder / "machine.json").exists():
            continue
        kind = json.loads((folder / "machine.json").read_text())["kind"]
        preview("fork", "--machine" if kind == "drum" else "--source", folder, HERE / "m" / folder.name)
    preview("pr3", "--source", grains_wrap(), HERE / "m" / "grains")
    for mid in NONAGON:
        if mid in NONAGON_SAMPLE:
            preview("pr3", "--source", sample_wrap(mid), HERE / "m" / mid)
        else:
            preview("staging", "--machine", REPOS / "opxy-nonagon" / mid, HERE / "m" / mid)
    preview("aux", "--machine", MODFX / "omnifilter", HERE / "m" / "omnifilter")
    preview("aux", "--source", effect_wrap("lint"), HERE / "m" / "lint")


def grid(ids, columns, out):
    args, scale = [], ""
    for k, mid in enumerate(ids):
        args += ["-i", HERE / "out" / f"{mid}.mp4"]
        scale += f"[{k}]scale=480:220[v{k}];"
    layout = "|".join(f"{(k % columns) * 484}_{(k // columns) * 224}" for k in range(len(ids)))
    graph = scale + "".join(f"[v{k}]" for k in range(len(ids))) + f"xstack=inputs={len(ids)}:layout={layout}:fill=black"
    run("ffmpeg", "-loglevel", "error", "-y", *args, "-filter_complex", graph, "-movflags", "+faststart",
        "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-an", f"{out}.mp4")
    run("ffmpeg", "-loglevel", "error", "-y", "-ss", "4", "-i", f"{out}.mp4", "-frames:v", "1", "-q:v", "3", f"{out}.jpg")


def publish():
    for project, spec in MEDIA.items():
        target = SITE / "assets" / "media" / project
        target.mkdir(parents=True, exist_ok=True)
        ids = spec["ids"] or [p.name for p in sorted((REPOS / "OP-XY-MNMD" / "machines").iterdir()) if (p / "machine.json").exists()]
        for mid in ids:
            for ext in ("mp4", "jpg"):
                shutil.copy(HERE / "out" / f"{mid}.{ext}", target / f"{mid}.{ext}")
        if "grid" in spec:
            name, members, columns = spec["grid"]
            grid(members, columns, target / name)
        print(f"published {project}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--publish", action="store_true", help="copy rendered screens into assets/media")
    args = parser.parse_args()
    publish() if args.publish else build()
