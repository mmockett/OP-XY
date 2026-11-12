#!/usr/bin/env python3
"""Builds every machine's browser preview for render.mjs, then (with --publish)
copies the rendered screens into the site.

    python3 tools/render/build.py [project ...]            # previews, SDK modules, font, kit labels
    node tools/render/render.mjs [id ...]                  # render the screens to tools/render/out
    python3 tools/render/build.py --publish [project ...]  # copy them to assets/media, rebuild the grids

Name projects (hexagon, nonagon, grains, modfx, conductor, mnmd, tetragon, trigon) to
build or publish only those; with none, every project, and the hero.

The machine repositories and SDK checkouts sit beside this one (../opxy-pads,
../opxy-nonagon, ../OP-XY-MNMD, ../opxy-grains, ../OP-XY-Macro (OP-XY-ModFX), ../open-xy-staging,
../open-xy, ../open-xy-pr3, ../open-xy-aux-machines-lfo (Omnifilter: #234 with #230,
#182 and the LFO names, as the device firmware), ../open-xy-effects on
sdk/effect-screens, ../open-xy-control-notes-2 on sdk/control-notes-2 (Conductor:
staging's SDK 1.9 with #346's track-control notes); the drum kits build on etcetc000/open-xy's staging,
fetched into ../open-xy-staging and read with git archive). The Tetragon kits
build on the per-key mixer channels (open-xy #399, drum/pad-channel on the
mmockett/open-xy fork, fetched into ../open-xy as "fork" and read with git
archive); Tetragon itself is read from a checkout of mmockett/OP-XY-Tetragon at
../OP-XY-Tetragon, or wherever XY_TETRAGON points. The Trigon kits build on the
same branch, read at their release from ../opxy-trigon, or wherever XY_TRIGON points.
Building a preview compiles with clang: where host compiles can't run, build the
previews in CI (sdk.py preview --cxx clang++ --machine <kit> --out m/<kit>), put them
in m/, write kit-labels.json and render here.
Each suite is read at its commit in SOURCES with git archive, so its checkouts
are left alone. MD KIT and MD E12 build on the drum kind's SDK (open-xy #143).
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
        "aux": REPOS / "open-xy-aux-machines-lfo", "effects": REPOS / "open-xy-effects", "drum": HERE / "src" / "open-xy-upstream",
        "control": REPOS / "open-xy-control-notes-2", "pad": HERE / "src" / "open-xy-pad-channel"}
# The per-key mixer channels' SDK (open-xy #399), the Tetragon kits' (their README).
PAD_SDK = ("fork", "drum/pad-channel")
# These draw the waves captured from the owner's ROM, which no repository holds:
# from a checkout they are flat lines, so their screens stay as first rendered.
ROM_SCREENS = ["mmbbox", "mmdens", "mmwave", "mmddrw"]
# The machines on the drum kind's SDK.
MDKIT = ["mdkit", "mde12"]
# MD KIT replaces these three kits on the site.
MDKIT_REPLACES = ["mdtrx", "mdefm", "mdpi"]
# Its grid: nine of its machines, across its four families.
MDKIT_GRID = ["mdkit-bd", "mdkit-cb", "mdkit-cp", "mdkit-xt", "mdkit-oh", "mdkit-ma", "mdkit-ml", "mdkit-sn", "mdkit-ns"]
MODFX = REPOS / "OP-XY-Macro"
# The commits the suites' screens are finalised at, read with git archive.
SOURCES = {"opxy-pads": "v1.5.0", "opxy-nonagon": "v0.7.2", "OP-XY-Macro": "v1.8.0", "OP-XY-MNMD": "v1.2.3", "opxy-grains": "v1.1.0",
           # Conductor's SDK 1.9 port (port/sdk-1.9), with M3's own voices and notes and M4's track and midi columns.
           "opxy-conductor": "a80dde4",
           # Tetragon's first public release, main at 70771ca.
           "OP-XY-Tetragon": "70771ca",
           # Trigon's release with Scramble's ranges.
           "OP-XY-Trigon": "v1.1.1"}
# Where each suite is checked out, when not beside this repository under its own name.
CHECKOUTS = {"OP-XY-Tetragon": pathlib.Path(os.environ.get("XY_TETRAGON", REPOS / "OP-XY-Tetragon")),
             "OP-XY-Trigon": pathlib.Path(os.environ.get("XY_TRIGON", REPOS / "opxy-trigon"))}
# The hero at the top of the page: nine machines from three suites.
HERO = ["moth", "hollow", "wane", "chroma", "ghost", "recur", "bloom", "orbit", "lint"]
HEXAGON = ["wane", "bloom", "hollow", "orbit", "bend", "moth"]
NONAGON = ["sand", "cocoa", "ghost", "coin", "recur", "fermi", "mach", "butterfly", "drop"]
# Nonagon's sample engines, and the files their screens are drawn from.
NONAGON_SAMPLE = {
    "ghost": ["display.cpp", "display.h", "captions.h", "figure.h", "tables.h", "ghost.h", "panel.svg.fragment"],
    "recur": ["display.cpp", "display.h", "layout.h", "recur.h", "panel.svg.fragment"],
}
KITS = ["mde12"]
# The Tetragon Suite: four drum kits on the per-key mixer channels' SDK.
TETRAGON = ["thunder", "curio", "galileo", "syahi"]
# The Trigon Suite: three drum kits on the same SDK.
TRIGON = ["felt", "flicker", "dust"]
# The stand-in synth for Grains' screen: the catalog holds "grains" itself.
WRAP_ID = "grainsview"

# The site's media: each project's folder, its machines, and its grid of screens.
MEDIA = {
    "hexagon": {"ids": HEXAGON, "grids": [("hexagon", HEXAGON, 3)]},
    "nonagon": {"ids": NONAGON, "grids": [("nonagon", NONAGON, 3)]},
    "grains": {"ids": ["grains"]},
    "modfx": {"ids": ["chroma", "lint", "omnifilter"]},
    "conductor": {"ids": ["conductor"]},
    "tetragon": {"ids": TETRAGON, "grids": [("tetragon", TETRAGON, 2)]},
    "trigon": {"ids": TRIGON, "grids": [("trigon", TRIGON, 3)]},
    "mnmd": {"ids": None, "grids": [("mdkit", MDKIT_GRID, 3),
                                     ("overview", ["mdkit-bd", "mde12", "mmsid", "mmvo6", "mmstat", "mmpulse", "mmwave", "mmdens"], 4)]},
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
    source = HERE / "src" / "opxy-grains"
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


def upstream():
    """The drum kits' SDK: etcetc000/open-xy's staging, where drum kits are SDK 1.8,
    fetched into open-xy-staging and read with git archive."""
    out = SDKS["drum"]
    run("git", "-C", REPOS / "open-xy-staging", "fetch", "-q", "origin", "staging")
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    archive = subprocess.run(["git", "-C", REPOS / "open-xy-staging", "archive", "origin/staging"], capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", out], input=archive, check=True)


def pad_sdk():
    """The Tetragon kits' SDK: the per-key mixer channels' branch, fetched into
    ../open-xy and read with git archive, so no checkout of it changes."""
    remote, branch = PAD_SDK
    out = SDKS["pad"]
    run("git", "-C", REPOS / "open-xy", "fetch", "-q", remote, branch)
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    archive = subprocess.run(["git", "-C", REPOS / "open-xy", "archive", f"{remote}/{branch}"], capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", out], input=archive, check=True)


def source(repo):
    """A suite at its finalised commit, as files: its checkouts are left alone."""
    out = HERE / "src" / repo
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    archive = subprocess.run(["git", "-C", CHECKOUTS.get(repo, REPOS / repo), "archive", SOURCES[repo]], capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", out], input=archive, check=True)
    return out


def sample_wrap(mid, nonagon):
    """A Nonagon sample engine's screen in a stand-in synth, as for Grains: its own
    display files, and the sample's overview written by render.html. The stand-in
    takes its own ID, as Grains' does: the SDK refuses one a local machine has."""
    wrap = HERE / "nonagon-wrap" / mid
    shutil.rmtree(wrap, ignore_errors=True)
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    with tempfile.TemporaryDirectory() as scratch:
        run(python, SDKS["pr3"] / "sdk.py", "new", "--repository", "--kind", "synth", "--controls", "8",
            "--id", f"{mid}view", "--name", mid.capitalize(), "--out", pathlib.Path(scratch) / mid, stdout=subprocess.DEVNULL)
        shutil.copytree(pathlib.Path(scratch) / mid, wrap)
    machine = nonagon / mid
    # The display code's namespace, and the artwork's IDs, follow the stand-in's.
    for name in NONAGON_SAMPLE[mid]:
        text = (machine / name).read_text()
        if name == "panel.svg.fragment":
            (wrap / name).write_text(text.replace(f'id="{mid}_', f'id="{mid}view_'))
        else:
            (wrap / name).write_text(re.sub(rf"\bnamespace {mid}\b", f"namespace {mid}view", text).replace(f"{mid}::", f"{mid}view::"))
    real = json.loads((machine / "definition.json").read_text())
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


def effect_wrap(mid, modfx):
    """A send effect's screen in a stand-in synth: its own display files, with
    the shift row render.html hands the display. The stand-in takes its own ID,
    as Grains' does: the catalog holds the effect's."""
    wrap = HERE / "effect-wrap" / mid
    shutil.rmtree(wrap, ignore_errors=True)
    python = REPOS / "open-xy" / ".venv" / "bin" / "python"
    with tempfile.TemporaryDirectory() as scratch:
        run(python, SDKS["effects"] / "sdk.py", "new", "--repository", "--kind", "synth", "--controls", "8",
            "--id", f"{mid}view", "--name", mid.capitalize(), "--out", pathlib.Path(scratch) / mid, stdout=subprocess.DEVNULL)
        shutil.copytree(pathlib.Path(scratch) / mid, wrap)
    machine = modfx / mid
    # The display code's namespace, and the artwork's node, text and palette
    # IDs, follow the stand-in's.
    for name in ("display.cpp", "display.h", "panel.h", "tables.h"):
        text = (machine / name).read_text()
        (wrap / name).write_text(text.replace(f"namespace {mid} ", f"namespace {mid}view ").replace(f"{mid}::", f"{mid}view::"))
    (wrap / "panel.svg.fragment").write_text((machine / "panel.svg.fragment").read_text().replace(f'id="{mid}_', f'id="{mid}view_'))
    real = json.loads((machine / "definition.json").read_text())
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


def conductor():
    """Conductor plays other tracks from its control code, which the browser
    preview doesn't run: its own control and display code are compiled on the
    host into a harness (conductor.cpp) that render.mjs plays its scene through."""
    src = source("opxy-conductor")
    out = HERE / "m" / "conductor"
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    run(clang(), "-std=c++11", "-O2", "-I", SDKS["control"] / "sdk" / "include", "-I", src, HERE / "conductor.cpp", "-o", out / "conductor")
    for name in ("panel.svg.fragment", "definition.json"):
        shutil.copy(src / name, out / name)
    print("built conductor")


def mnmd_source():
    """OP-XY-MNMD at its commit. MD E12 gets the repository's silent stand-in for
    its samples, scoped as make_engine.py scopes an engine's headers: its screen
    needs no samples."""
    out = source("OP-XY-MNMD")
    silent = (out / "voices" / "silent" / "private_e12.hpp").read_text()
    (out / "machines" / "mde12" / "private_e12.hpp").write_text(
        silent.replace("namespace md {", "namespace md_mde12 {} namespace md = md_mde12; namespace md_mde12 {"))
    return out / "machines"


def kit_labels(kits):
    """Each kit model's control labels, from its kit.h, which the drum page's
    header shows. Kits not named keep the labels they had."""
    path = HERE / "kit-labels.json"
    labels = json.loads(path.read_text()) if path.exists() else {}
    for kit, folder in kits.items():
        text = (folder / "kit.h").read_text()
        # A row may name its labels with a macro (Dust's DUST_LABELS): spell it out.
        for name, value in re.findall(r"#define (\w+) (\{[^}]*\})", text):
            text = text.replace(f", {name},", f", {value},")
        body = text[re.search(r"const \w+ model\[models\] = \{", text).end():]
        body = body[:body.index("};")]
        rows = re.findall(r'\{\s*"([^"]*)"\s*,[^{]*\{([^}]*)\}', body, re.S)
        labels[kit] = [re.findall(r'"([^"]*)"', row) for _, row in rows]
    path.write_text(json.dumps(labels))


def tetragon():
    """The Tetragon kits at their commit, previewed on the per-key mixer channels' SDK."""
    kits = source("OP-XY-Tetragon")
    kit_labels({kit: kits / kit for kit in TETRAGON})
    for mid in TETRAGON:
        preview("pad", "--machine", kits / mid, HERE / "m" / mid)


def trigon():
    """The Trigon kits at their release, previewed on the per-key mixer channels' SDK."""
    kits = source("OP-XY-Trigon")
    kit_labels({kit: kits / kit for kit in TRIGON})
    for mid in TRIGON:
        preview("pad", "--machine", kits / mid, HERE / "m" / mid)


def build(projects):
    if not FONT.exists():
        sys.exit(f"No screen font at {FONT}; set XY_FONT to Univers Next Pro Light")
    wanted = lambda project: not projects or project in projects
    if wanted("mnmd"):
        upstream()
    if wanted("tetragon") or wanted("trigon"):
        pad_sdk()
    (HERE / "font").mkdir(exist_ok=True)
    if FONT.resolve() != (HERE / "font" / "UniversNextPro-Light.ttf").resolve():
        shutil.copy(FONT, HERE / "font" / "UniversNextPro-Light.ttf")
    for name, checkout in SDKS.items():
        if (checkout / "sdk" / "browser").exists():
            (HERE / "sdk" / name).mkdir(parents=True, exist_ok=True)
            for module in ("display.mjs", "controls.mjs"):
                shutil.copy(checkout / "sdk" / "browser" / module, HERE / "sdk" / name / module)
    if wanted("hexagon"):
        pads = source("opxy-pads")
        for mid in HEXAGON:
            preview("staging", "--machine", pads / mid, HERE / "m" / mid)
    if wanted("mnmd"):
        machines = mnmd_source()
        kit_labels({kit: machines / kit for kit in KITS})
        for folder in sorted(machines.iterdir()):
            if not (folder / "machine.json").exists() or folder.name in MDKIT + ROM_SCREENS:
                continue
            preview("pr3", "--machine", folder, HERE / "m" / folder.name)
        for mid in MDKIT:
            preview("drum", "--machine", machines / mid, HERE / "m" / mid)
    if wanted("grains"):
        source("opxy-grains")
        preview("pr3", "--source", grains_wrap(), HERE / "m" / "grains")
    if wanted("nonagon"):
        nonagon = source("opxy-nonagon")
        for mid in NONAGON:
            if mid in NONAGON_SAMPLE:
                preview("pr3", "--source", sample_wrap(mid, nonagon), HERE / "m" / mid)
            else:
                preview("staging", "--machine", nonagon / mid, HERE / "m" / mid)
    if wanted("modfx"):
        modfx = source("OP-XY-Macro")
        preview("aux", "--machine", MODFX / "omnifilter", HERE / "m" / "omnifilter")
        for mid in ("chroma", "lint"):
            preview("effects", "--source", effect_wrap(mid, modfx), HERE / "m" / mid)
    if wanted("conductor"):
        conductor()
    if wanted("tetragon"):
        tetragon()
    if wanted("trigon"):
        trigon()


def grid(ids, columns, out):
    args, scale = [], ""
    for k, mid in enumerate(ids):
        args += ["-i", HERE / "out" / f"{mid}.mp4"]
        scale += f"[{k}]scale=480:220[v{k}];"
    layout = "|".join(f"{(k % columns) * 484}_{(k // columns) * 224}" for k in range(len(ids)))
    graph = scale + "".join(f"[v{k}]" for k in range(len(ids))) + f"xstack=inputs={len(ids)}:layout={layout}:fill=black:shortest=1"
    run("ffmpeg", "-loglevel", "error", "-y", *args, "-filter_complex", graph, "-movflags", "+faststart",
        "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-an", f"{out}.mp4")
    run("ffmpeg", "-loglevel", "error", "-y", "-ss", "4", "-i", f"{out}.mp4", "-frames:v", "1", "-q:v", "3", f"{out}.jpg")


def thumbnails(projects):
    """The small poster each machine's tile shows: about 10 KB, against 40 KB for the full one."""
    for poster in (SITE / "assets" / "media").glob("*/*.jpg"):
        if projects and poster.parent.name not in projects:
            continue
        if not poster.stem.endswith("-t") and poster.stem not in ("hexagon", "nonagon", "tetragon", "trigon", "overview"):
            run("ffmpeg", "-loglevel", "error", "-y", "-i", poster, "-vf", "scale=360:-2", "-q:v", "4", poster.with_name(f"{poster.stem}-t.jpg"))


def publish(projects):
    if not projects:
        grid(HERO, 3, SITE / "assets" / "media" / "hero")
        # A phone's hero: half the size, for a screen that can't show more.
        run("ffmpeg", "-loglevel", "error", "-y", "-i", SITE / "assets" / "media" / "hero.mp4", "-vf", "scale=724:-2", "-movflags", "+faststart",
            "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-an", SITE / "assets" / "media" / "hero-s.mp4")
        run("ffmpeg", "-loglevel", "error", "-y", "-i", SITE / "assets" / "media" / "hero.jpg", "-vf", "scale=724:-2", "-q:v", "4", SITE / "assets" / "media" / "hero-s.jpg")
    for project, spec in MEDIA.items():
        if projects and project not in projects:
            continue
        target = SITE / "assets" / "media" / project
        target.mkdir(parents=True, exist_ok=True)
        ids = spec["ids"] or [p.name for p in sorted((HERE / "src" / "OP-XY-MNMD" / "machines").iterdir())
                              if (p / "machine.json").exists() and p.name not in [*MDKIT_REPLACES, "mdkit"]]
        for mid in ids:
            for ext in ("mp4", "jpg"):
                shutil.copy(HERE / "out" / f"{mid}.{ext}", target / f"{mid}.{ext}")
        for name, members, columns in spec.get("grids", []):
            grid(members, columns, target / name)
        print(f"published {project}")
    thumbnails(projects)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--publish", action="store_true", help="copy rendered screens into assets/media")
    parser.add_argument("projects", nargs="*", help=f"only these projects: {', '.join(MEDIA)} (default: all)")
    args = parser.parse_args()
    unknown = set(args.projects) - set(MEDIA)
    if unknown:
        parser.error(f"unknown project: {', '.join(sorted(unknown))}")
    publish(args.projects) if args.publish else build(args.projects)
