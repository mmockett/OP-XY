// Everything the site shows. To add a project or machine, add an entry here
// and drop its media in assets/media/<project>/. See README.md.
//
// status: one of the keys in `statuses`. Machines with a `catalog` id are
// checked against the Open-XY catalog when the page loads: published on its
// staging branch they become "beta" (beta.open-xy.com), on main "live"
// (open-xy.com). A machine in a builder links to its page there, and shows
// the catalog's tag for it: the version that builder installs. A project's
// `version` is its latest release, shown until the catalog says otherwise.
//
// media: {type: "video", src, poster} | {type: "image", src} |
//        {type: "youtube", id} | omitted (the page draws a blank OP-XY screen
//        with the machine's real control labels). Screens are rendered by
//        tools/render (README.md), so they match the device. A project's
//        or machine's video may give its own `aspect` ("w / h") when its grid isn't
//        4 x 2. A machine with `flagship` takes two columns.
//
// A project's `audio` names its preset clips, assets/audio/<project>.json:
// machine id -> [{preset, slug, src, role, phrase, seconds}]. Each card then
// gets a row of buttons that play them.

window.SITE = {
  owner: "Max Mockett",
  github: "https://github.com/mmockett",
  builder: "https://open-xy.com",
  beta: "https://beta.open-xy.com",
  sdkRepo: "https://github.com/etcetc000/open-xy",
  catalog: "https://github.com/etcetc000/open-xy/blob/main/catalog/machines.json",

  // The hero screen at the top of the page.
  hero: { type: "video", machines: ["moth", "hollow", "wane", "chroma", "ghost", "recur", "bloom", "orbit", "lint"], src: "assets/media/hero.mp4", poster: "assets/media/hero.jpg", small: { src: "assets/media/hero-s.mp4", poster: "assets/media/hero-s.jpg" }, alt: "Screens of Moth, Hollow and Wane on top; Chroma, Ghost and Recur in the middle; Bloom, Orbit and Lint below" },

  statuses: {
    live: { label: "live",        note: "In the open-xy.com builder." },
    beta: { label: "in beta",     note: "In the beta builder at beta.open-xy.com. Coming to open-xy.com." },
    soon: { label: "coming soon", note: "Runs on the OP–XY. Coming to the open-xy.com builder." },
    diy:  { label: "diy",         note: "Needs samples from your own ROM. Build from source." },
    lab:  { label: "experimental", note: "Runs on the OP–XY. Build from source." },
    dev:  { label: "in development", note: "In the works. Not yet installable." }
  },

  projects: [
    {
      id: "hexagon",
      audio: "assets/audio/hexagon.json",
      name: "Hexagon Suite",
      kicker: "six synths",
      status: "live",
      version: "v1.1.0",
      repo: "https://github.com/mmockett/OP-XY-Hexagon",
      links: [],
      tagline: "Six synths, made to be played together.",
      description: [
        "Wane, Bloom, Hollow, Orbit, Bend and Moth: tape, additive, resonators, vector, phase distortion and a west-coast lowpass gate. Eight controls on two pages, with the OP–XY's envelopes, filter, LFOs and effects on top.",
        "Levels are matched and layouts shared, so they layer and swap within a project. Each has an animated screen that follows the sound."
      ],
      specs: [
        [["synths", "6"], ["controls", "8"], ["cpu", "2–6%"], ["os", "1.2.1"]],
        [["sdk", "1.4"], ["release", "v1.1.0"], ["screens", "6"], ["licence", "MIT"]]
      ],
      machines: [
        {
          id: "wane", name: "Wane", kind: "synth", catalog: "wane", status: "live",
          after: "a worn cassette",
          description: "Polysynth through a worn cassette. Two detuned oscillators, a sub and noise per note. Wow, flutter and sag move the whole chord; age dulls the top and adds hiss.",
          screen: "Screen: a C60 cassette. The reels turn and the tape wobbles with the wow and flutter.",
          pages: [["shape", "detune", "drift", "warmth"], ["wow", "flutter", "sag", "age"]],
          cpu: "4.1%",
          media: { type: "video", src: "assets/media/hexagon/wane.mp4", poster: "assets/media/hexagon/wane.jpg", alt: "Wane's cassette screen, reels turning as four notes start" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/wane"
        },
        {
          id: "bloom", name: "Bloom", kind: "synth", catalog: "bloom", status: "live",
          after: "additive synthesis",
          description: "Additive synth with 24 sine partials. Shape sets the waveform, vowel adds formants from oo to ee. Breath, blur and haze add drift, noise and beating.",
          screen: "Screen: partials as stems under a low sun, formants as hills behind.",
          pages: [["tilt", "shape", "stretch", "vowel"], ["breath", "blur", "haze", "time"]],
          cpu: "6.2%",
          media: { type: "video", src: "assets/media/hexagon/bloom.mp4", poster: "assets/media/hexagon/bloom.jpg", alt: "Bloom's screen: partials as stems, formant hills sliding as the vowel sweeps" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bloom"
        },
        {
          id: "hollow", name: "Hollow", kind: "synth", catalog: "hollow", status: "live",
          after: "blown and bowed bodies",
          description: "Blown and bowed resonator. Eight tuned resonances shaped like a voice, violin, organ pipe or wine glass. Held notes resonate together; spread adds drifting detuned copies.",
          screen: "Screen: an engraved acoustics plate, with flames that rise with each resonance.",
          pages: [["breath", "body", "bright", "ring"], ["air", "vowel", "spread", "sympathy"]],
          cpu: "4.9%",
          media: { type: "video", src: "assets/media/hexagon/hollow.mp4", poster: "assets/media/hexagon/hollow.jpg", alt: "Hollow's engraved acoustics plate, the body changing from a voice to wine glasses" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/hollow"
        },
        {
          id: "orbit", name: "Orbit", kind: "synth", catalog: "orbit", status: "live",
          after: "the Prophet VS",
          description: "Vector synth. Four single-cycle waves on a diamond, mixed by a point moving in a circle, ellipse, figure 8 or steps. Grit runs it through an old DAC, down to 10 kHz and 8 bits.",
          screen: "Screen: the VS joystick field, each note's path, and the mixed wave on a scope.",
          pages: [["bank", "x", "y", "orbit"], ["rate", "path", "grit", "detune"]],
          cpu: "2.4%",
          media: { type: "video", src: "assets/media/hexagon/orbit.mp4", poster: "assets/media/hexagon/orbit.jpg", alt: "Orbit's diamond with points tracing a figure 8, the mixed wave on a scope" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/orbit"
        },
        {
          id: "bend", name: "Bend", kind: "synth", catalog: "bend", status: "live",
          after: "the Casio CZ",
          description: "Phase distortion. Sine, saw, square, pulse, or three resonant waves that sweep like a filter. A second line adds an interval, detune or ring mod.",
          screen: "Screen: the phase map beside its waveform, drawn like the CZ manual.",
          pages: [["wave", "bend", "detune", "ring"], ["interval", "warp", "noise", "lofi"]],
          cpu: "2.6%",
          media: { type: "video", src: "assets/media/hexagon/bend.mp4", poster: "assets/media/hexagon/bend.jpg", alt: "Bend's phase map bending into steeper teeth beside a dot-matrix waveform" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bend"
        },
        {
          id: "moth", name: "Moth", kind: "synth", catalog: "moth", status: "live",
          after: "Buchla's west coast",
          description: "FM sine, wavefolder and vactrol lowpass gate. Strike up for plucks, mallets and bongos; at zero it holds like a pad. Glow sets the gate's release.",
          screen: "Screen: a moth on a specimen plate, its wing edges drawn by the folded waveform.",
          pages: [["fold", "fm", "ratio", "strike"], ["glow", "bias", "mode", "drift"]],
          cpu: "4.9%",
          media: { type: "video", src: "assets/media/hexagon/moth.mp4", poster: "assets/media/hexagon/moth.jpg", alt: "Moth's wings, edged by the folded waveform, lighting with each plucked note" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/moth"
        }
      ]
    },

    {
      id: "nonagon",
      audio: "assets/audio/nonagon.json",
      name: "Nonagon Suite",
      kicker: "nine experiments",
      status: "live",
      version: "v0.3.0",
      repo: "https://github.com/mmockett/OP-XY-Nonagon",
      links: [],
      tagline: "Nine experimental sounds, each grown from a piece of physics.",
      description: [
        "Sand, Cocoa, Ghost, Coin, Recur, Fermi, Mach, Butterfly and Drop. Each starts from something odd in the physical world (Chladni's sand figures, the hot chocolate effect, a phantom pitch heard only between the ears, Euler's disk, a scrambled picture that always comes home, the Fermi–Pasta–Ulam–Tsingou chain, a supersonic flyby, the Hofstadter butterfly and the Leidenfrost drop) and turns it into an instrument with eight controls on two pages.",
        "Each screen is one object, drawn in outline, that every control visibly changes. Their levels match Hexagon's, so the two suites layer."
      ],
      specs: [
        [["synths", "7"], ["sample", "2"], ["cpu", "1–6%"], ["os", "1.2.1"]],
        [["sdk", "1.4"], ["release", "v0.3.0"], ["screens", "9"], ["licence", "MIT"]]
      ],
      media: { type: "video", aspect: "1448 / 668", src: "assets/media/nonagon/nonagon.mp4", poster: "assets/media/nonagon/nonagon.jpg", alt: "Nonagon Suite's nine screens playing together: Sand, Cocoa and Ghost on top; Coin, Recur and Fermi in the middle; Mach, Butterfly and Drop below" },
      machines: [
        {
          id: "sand", name: "Sand", kind: "synth", catalog: "sand", status: "live",
          after: "Chladni's figures",
          description: "A bowed plate strewn with sand. Grains rattle on its moving areas, then settle into the figure's nodal lines, leaving a glassy tone. Tilt runs the sand downhill; shake keeps it jumping.",
          screen: "Screen: the plate on its column, tipping with tilt, the sand drawing the figure.",
          pages: [["figure", "bow", "sand", "grain"], ["plate", "settle", "tilt", "shake"]],
          cpu: "5.4%",
          media: { type: "video", src: "assets/media/nonagon/sand.mp4", poster: "assets/media/nonagon/sand.jpg", alt: "Sand's plate tipping on its column as three notes ring, the sand running downhill" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/sand"
        },
        {
          id: "cocoa", name: "Cocoa", kind: "synth", catalog: "cocoa", status: "live",
          after: "the hot chocolate effect",
          description: "A spoon tapping a mug of cocoa. Stirred-in powder fills the drink with bubbles that slow sound down, so each tap starts low and climbs to pitch as they clear. Cup, fill and spoon set the ring.",
          screen: "Screen: the mug, spoon in the drink; froth on the drink clears as the note comes into tune.",
          pages: [["powder", "taps", "fizz", "cup"], ["fill", "spoon", "pops", "stir"]],
          cpu: "5.7%",
          media: { type: "video", src: "assets/media/nonagon/cocoa.mp4", poster: "assets/media/nonagon/cocoa.jpg", alt: "Cocoa's mug, the spoon tapping as the drink darkens with powder" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/cocoa"
        },
        {
          id: "ghost", name: "Ghost", kind: "sample engine", catalog: "ghost", status: "lab",
          after: "the Huggins pitch",
          description: "Binaural phantom pitches, for headphones: notes made of breath and hum whose pitch lives between the ears. Orbit walks the voice round your head. Load a sample and it becomes the bed; without one, Ghost breathes its own.",
          screen: "Screen: a Pepper's ghost stage. Split parts the apparition into twins; ring gives it halos.",
          pages: [["ring", "voice", "split", "trade"], ["beat", "orbit", "near", "bed"]],
          cpu: "3.0%",
          media: { type: "video", src: "assets/media/nonagon/ghost.mp4", poster: "assets/media/nonagon/ghost.jpg", alt: "Ghost's stage, the apparition parting into twins as split rises" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/ghost"
        },
        {
          id: "coin", name: "Coin", kind: "synth", catalog: "coin", status: "live",
          after: "Euler's disk",
          description: "A disk spun on a mirror. As it falls, its wobble speeds up, so each note's ring rises and quickens until it settles. Size, disk and base set the metal and the surface; many adds companion disks.",
          screen: "Screen: the disk spinning on its base, leaning as it slows, rings spreading across the glass.",
          pages: [["spin", "size", "disk", "base"], ["wobble", "air", "ring", "many"]],
          cpu: "1.5%",
          media: { type: "video", src: "assets/media/nonagon/coin.mp4", poster: "assets/media/nonagon/coin.jpg", alt: "Coin's disk spinning on its mirror base as companion disks join" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/coin"
        },
        {
          id: "recur", name: "Recur", kind: "sample engine", catalog: "recur", status: "lab",
          after: "Arnold's cat map",
          description: "A sample cut into tiles and shuffled by a chaotic map that always comes home: step by step the loop scrambles, then returns exactly to the original. Map, grid and slice set the shuffle.",
          screen: "Screen: a sliding-tile puzzle tin; each map shuffles its own picture.",
          pages: [["pos", "grid", "slice", "map"], ["step", "rate", "depth", "chrd"]],
          cpu: "1.2%",
          media: { type: "video", src: "assets/media/nonagon/recur.mp4", poster: "assets/media/nonagon/recur.jpg", alt: "Recur's puzzle tin, the picture's tiles scrambling and returning" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/recur"
        },
        {
          id: "fermi", name: "Fermi", kind: "synth", catalog: "fermi", status: "live",
          after: "the FPUT problem",
          description: "A chain of masses on nonlinear springs. Energy in its first mode spreads into higher ones, then flows almost wholly back, so the tone slowly breathes. More energy and stiffer springs push it into chaos.",
          screen: "Screen: the chain on its stand, drawn back by energy, with a damping lever and a timing pendulum.",
          pages: [["energy", "masses", "springs", "time"], ["disperse", "mode", "damping", "seed"]],
          cpu: "3.8%",
          media: { type: "video", src: "assets/media/nonagon/fermi.mp4", poster: "assets/media/nonagon/fermi.jpg", alt: "Fermi's chain of masses swelling as energy is turned up" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/fermi"
        },
        {
          id: "mach", name: "Mach", kind: "synth", catalog: "mach", status: "live",
          after: "a supersonic flyby",
          description: "Each note flies a sound past you at up to Mach 3: the Doppler sweep, the sonic boom as the Mach cone crosses, and an echo off the ground, all worked out from the geometry of the pass.",
          screen: "Screen: a schlieren photograph after Mach and Salcher's images of a bullet in flight, the wavefronts trailing the source and the cone sweeping the listener.",
          pages: [["mach", "pass", "source", "dur"], ["boom", "air", "tune", "echo"]],
          cpu: "4.5%",
          media: { type: "video", src: "assets/media/nonagon/mach.mp4", poster: "assets/media/nonagon/mach.jpg", alt: "Mach's flybys, the wavefronts folding into a cone as mach rises" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/mach"
        },
        {
          id: "butterfly", name: "Butterfly", kind: "synth", catalog: "butterfly", status: "live",
          after: "the Hofstadter butterfly",
          description: "The fractal spectrum of an electron in a crystal under a magnetic field, played as a ringing chain. Flux reshapes the bands and gaps; coupling traps the ringing in place.",
          screen: "Screen: a butterfly whose wing edges are the spectrum and whose markings are the chain.",
          pages: [["flux", "coupling", "spread", "strike"], ["glow", "site", "tilt", "wingbeat"]],
          cpu: "5.6%",
          media: { type: "video", src: "assets/media/nonagon/butterfly.mp4", poster: "assets/media/nonagon/butterfly.jpg", alt: "Butterfly's wings reshaping as flux is turned" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/butterfly"
        },
        {
          id: "drop", name: "Drop", kind: "synth", catalog: "drop", status: "live",
          after: "the Leidenfrost effect",
          description: "A drop skating on a hot pan on its own vapour, quivering into a star whose lobes set the beat. Heat and liquid decide how it floats, sizzles and boils away.",
          screen: "Screen: a skillet at an angle, star-shaped drops floating with their steam.",
          pages: [["heat", "size", "liquid", "beat"], ["groove", "vapour", "life", "crackle"]],
          cpu: "3.2%",
          media: { type: "video", src: "assets/media/nonagon/drop.mp4", poster: "assets/media/nonagon/drop.jpg", alt: "Drop's skillet, star-shaped drops quivering as the heat rises" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/drop"
        }
      ]
    },

    {
      id: "grains",
      name: "Grains",
      kicker: "granular sampler",
      status: "soon",
      version: "main",
      repo: "https://github.com/mmockett/OP-XY-Grains",
      links: [],
      tagline: "A granular sample synth.",
      description: [
        "Load a sample on the sampler page and play it chromatically. Grains read around a position that can scan, reverse or freeze, stack into chords and spread in stereo. Three modes: cloud (random), sync (tempo divisions) and osc (even overlap).",
        "The screen shows each grain's position and pitch above the sample's overview. All notes share a pool of 64 grains."
      ],
      specs: [
        [["engines", "1"], ["grains", "64"], ["modes", "3"], ["os", "1.2.1"]],
        [["shortest", "10ms"], ["longest", "2s"], ["overlap", "1–20"], ["licence", "MIT"]]
      ],
      machines: [
        { id: "grains", name: "Grains", kind: "sample engine", catalog: "grains", status: "soon",
          description: "Sample engine for the OP–XY's sampler page.",
          pages: [["pos", "scan", "size", "dens"], ["spry", "chrd", "shpe", "mode"]],
          media: { type: "video", src: "assets/media/grains/grains.mp4", poster: "assets/media/grains/grains.jpg", alt: "Grains' screen: a note held, pos scanned, then a minor chord" },
          source: "https://github.com/mmockett/OP-XY-Grains" }
      ]
    },

    {
      id: "modfx",
      name: "ModFX",
      kicker: "mod + effect",
      status: "soon",
      version: "v1.5.0",
      repo: "https://github.com/mmockett/OP-XY-ModFX",
      links: [],
      tagline: "A filter for every track, and a 1970s effects box and an ethereal stereo console for the sends.",
      description: [
        "Three machines that work across the whole OP–XY instead of on one track. Chroma and Lint are send effects, each with its own page on FX I or II. Omnifilter sits on an aux track, takes no instrument slot and steers all eight instrument tracks at once.",
        "Chroma's screen is a Victorian optical bench; Lint's is an effects chassis with its lid off; Omnifilter's is a rangefinder's lens."
      ],
      specs: [
        [["aux", "1"], ["send", "2"], ["presets", "19"], ["os", "1.2.1"]],
        [["sdk", "1.8"], ["release", "v1.5.0"], ["screens", "3"], ["licence", "MIT"]]
      ],
      machines: [
        {
          id: "chroma", name: "Chroma", kind: "send effect", catalog: "chroma", status: "lab",
          after: "Hologram's Chroma Console",
          description: "Four stereo modules in a row: character, movement, diffuse and texture. Choose an effect for each, from warm saturation and swirling phasers to vast clouds, reversed delays and worn cassette, and even a mono voice leaves wide.",
          screen: "Screen: a Victorian optical bench. The magic lantern's flame burns as Character's effect does, the prism rocks and doubles with Movement, and its light fans out with Diffuse. Time slides the ground-glass screen along the rail.",
          pages: [["charactr", "movement", "diffuse", "texture"], ["tilt", "rate", "time", "drift"]],
          shift: ["charactr", "movement", "diffuse", "texture"],
          presets: ["Halo", "Aurora", "Mirage", "Tide", "Postcard", "Mosaic", "Static"],
          cpu: "7.2–10.8%", cpuNote: "of the audio",
          media: { type: "video", src: "assets/media/modfx/chroma.mp4", poster: "assets/media/modfx/chroma.jpg", alt: "Chroma's optical bench: the light fanning wider as its modules turn up, then Shift held to change its effects to howl, swirl, slice and radio" },
          source: "https://github.com/mmockett/OP-XY-ModFX/tree/main/chroma"
        },
        {
          id: "lint", name: "Lint", kind: "send effect", catalog: "lint", status: "soon",
          after: "Finegear's Dust Collector",
          description: "Two tape saturations, an optical phaser, a gritty echo and a three-spring tank, in any of six orders. One can be patched into the echo's feedback loop, and two LFOs move them. At full send a track runs wholly through the box.",
          screen: "Screen: an effects chassis with its lid off, seen from above. Its four modules sit in order on one patch cable, and each control moves a part of its module.",
          pages: [["dust", "phase", "echo", "spring"], ["tape 2", "rate", "time", "tone"]],
          shift: ["order", "shape", "loop", "wobble"],
          presets: ["Dusty", "Tank", "Slapback", "Swoosh", "Runaway", "Crushed"],
          cpu: "7.8%", cpuNote: "of the audio",
          media: { type: "video", src: "assets/media/modfx/lint.mp4", poster: "assets/media/modfx/lint.jpg", alt: "Lint's chassis: dust, phase and echo turned up, then Shift held to reorder the modules and patch tape 2 into the echo's loop" },
          source: "https://github.com/mmockett/OP-XY-ModFX/tree/main/lint"
        },
        {
          id: "omnifilter", name: "Omnifilter", kind: "aux module", catalog: "omnifilter", status: "soon",
          description: "One filter and envelope for the whole OP–XY. Cutoff, reso, attack and release are set on all eight instrument tracks, as if each track's own encoder had turned. Lock them on steps and the whole mix opens and closes with the pattern.",
          screen: "Screen: a rangefinder camera's lens. Cutoff opens the eight-bladed iris, reso sharpens it into a star, attack and release turn its rings.",
          pages: [["cutoff", "reso", "attack", "release"]],
          presets: ["open", "warm", "dark", "acid", "pluck", "swell"],
          cpu: "0.8%", cpuNote: "of the audio",
          media: { type: "video", src: "assets/media/modfx/omnifilter.mp4", poster: "assets/media/modfx/omnifilter.jpg", alt: "Omnifilter's lens: the iris closing, sharpening into a star, its rings turning, then opening" },
          source: "https://github.com/mmockett/OP-XY-ModFX/tree/main/omnifilter"
        }
      ]
    },

    {
      id: "mnmd",
      name: "MNMD",
      kicker: "machinedrum + monomachine",
      status: "live",
      version: "v1.1.6",
      repo: "https://github.com/mmockett/OP-XY-MNMD",
      links: [],
      tagline: "Elektron's Machinedrum and Monomachine, rebuilt for the OP–XY.",
      description: [
        "Sixteen engines: two Machinedrum kits and fourteen Monomachine synths, from the Commodore 64's sound chip and FM bells to robot speech and supersaws.",
        "The kits play like the OP–XY's Drumline, with a different machine on each of the 24 keys. The synths play chromatically, with the Monomachine's SYN page as two pages of four controls."
      ],
      specs: [
        [["kits", "2"], ["synths", "14"], ["keys", "24"], ["os", "1.2.1"]],
        [["drums", "49"], ["release", "v1.1.6"], ["screens", "16"], ["licence", "MIT"]]
      ],
      media: { type: "video", src: "assets/media/mnmd/overview.mp4", poster: "assets/media/mnmd/overview.jpg", alt: "Eight MNMD screens: MD KIT, MD E12, SID-6581, VO-6, FM STAT, SWAVE-PULSE, DPRO-WAVE and DPRO-DENS" },
      groups: [
        { title: "machinedrum kits", note: "24 keys, a machine on each." },
        { title: "monomachine synths", note: "Chromatic, two pages of four." }
      ],
      machines: [
        { id: "mmsid", group: 1, name: "SID-6581", kind: "synth", catalog: "mmsid", status: "live",
          description: "The Commodore 64 sound chip: triangle, saw, pulse, mixed and noise, with pulse-width sweep, ring mod and sync.",
          pages: [["pw", "pwad", "pwrs", "wave"], ["mod", "msrc", "mfrq", "tune"]],
          presets: ["Saw", "Square", "Sweep", "Sync", "Ring", "Mixed", "Noise"],
          media: { type: "video", src: "assets/media/mnmd/mmsid.mp4", poster: "assets/media/mnmd/mmsid.jpg", alt: "SID-6581's screen: a stepped 4-bit saw" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsid" },
        { id: "mmvo6", group: 1, name: "VO-6", kind: "synth", catalog: "mmvo6", status: "live",
          description: "Two-formant voice with twenty consonants. Vowels, robot speech and whispers.",
          pages: [["voc1", "voc2", "v sw", "voic"], ["cons", "clen", "cvol", "tune"]],
          presets: ["Ah", "Ee", "Oh", "Ma", "Sing La", "Robot Rr", "Whisper", "Tick"],
          media: { type: "video", src: "assets/media/mnmd/mmvo6.mp4", poster: "assets/media/mnmd/mmvo6.jpg", alt: "VO-6's screen: a vowel chart with the current vowel marked, beside its waveform" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmvo6" },
        { id: "mmstat", group: 1, name: "FM STAT", kind: "synth", catalog: "mmstat", status: "live",
          description: "Two modulators into one carrier; the first has decay and feedback. Tines, bells, growls.",
          pages: [["1frq", "1fin", "1env", "1fb"], ["2frq", "2vol", "tone", "tune"]],
          presets: ["Tine", "Bell", "Growl", "Wobble"],
          media: { type: "video", src: "assets/media/mnmd/mmstat.mp4", poster: "assets/media/mnmd/mmstat.jpg", alt: "FM STAT's screen: an operator diagram, M1 and M2 into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmstat" },
        { id: "mmpulse", group: 1, name: "SWAVE-PULSE", kind: "synth", catalog: "mmpulse", status: "live",
          description: "Detuned pulses with width sweep and two sub-octaves.",
          pages: [["unil", "uniw", "sub1", "sub2"], ["pw", "pwad", "pwrs", "tune"]],
          presets: ["Sweep", "Square", "Reed", "Strings", "Bass"],
          media: { type: "video", src: "assets/media/mnmd/mmpulse.mp4", poster: "assets/media/mnmd/mmpulse.jpg", alt: "SWAVE-PULSE's screen: a pulse wave over its sub-octaves" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpulse" },
        { id: "mmens", group: 1, name: "SWAVE-ENS", kind: "synth", catalog: "mmens", status: "live",
          description: "A four-note chord of saws or pulses from one key, with chorus.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["pw", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Organ", "Seventh"],
          media: { type: "video", src: "assets/media/mnmd/mmens.mp4", poster: "assets/media/mnmd/mmens.jpg", alt: "SWAVE-ENS's screen as a chord plays" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmens" },
        { id: "mmpar", group: 1, name: "FM PAR", kind: "synth", catalog: "mmpar", status: "live",
          description: "Three parallel modulators into one carrier, each with depth or decay.",
          pages: [["1frq", "1env", "2frq", "2env"], ["3frq", "3env", "tone", "tune"]],
          presets: ["Keys", "Organ", "Pluck", "Glass"],
          media: { type: "video", src: "assets/media/mnmd/mmpar.mp4", poster: "assets/media/mnmd/mmpar.jpg", alt: "FM PAR's screen: three operators into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpar" },
        { id: "mmdyn", group: 1, name: "FM DYN", kind: "synth", catalog: "mmdyn", status: "live",
          description: "FM with pitch and depth envelopes on the first modulator, decay and feedback on the second.",
          pages: [["1frq", "1fen", "1vol", "1ven"], ["2frq", "2env", "2fb", "tune"]],
          presets: ["Strike", "Zap", "Bass", "Reed"],
          media: { type: "video", src: "assets/media/mnmd/mmdyn.mp4", poster: "assets/media/mnmd/mmdyn.jpg", alt: "FM DYN's screen: two operators into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdyn" },
        { id: "mmsaw", group: 1, name: "SWAVE-SAW", kind: "synth", catalog: "mmsaw", status: "beta",
          description: "Detuned saw stack with sub-octaves, from a single saw to a supersaw.",
          pages: [["unil", "uniw", "unix", ""], ["subx", "sub1", "sub2", "tune"]],
          presets: ["Stack", "Super", "Wide", "Thin", "Sub"],
          media: { type: "video", src: "assets/media/mnmd/mmsaw.mp4", poster: "assets/media/mnmd/mmsaw.jpg", alt: "SWAVE-SAW's screen: the saw stack over its sub-octaves" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsaw" },
        { id: "mmsin", group: 1, name: "GND-SIN", kind: "synth", catalog: "mmsin", status: "beta",
          description: "A sine wave.",
          pages: [["", "", "", "tune"]],
          presets: ["Sine"],
          media: { type: "video", src: "assets/media/mnmd/mmsin.mp4", poster: "assets/media/mnmd/mmsin.jpg", alt: "GND-SIN's screen: a sine" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsin" },
        { id: "mmnois", group: 1, name: "GND-NOIS", kind: "synth", catalog: "mmnois", status: "beta",
          description: "Noise, from white to red.",
          pages: [["st", "red", "ston", "tune"]],
          presets: ["White", "Pink", "Red", "Loud"],
          media: { type: "video", src: "assets/media/mnmd/mmnois.mp4", poster: "assets/media/mnmd/mmnois.jpg", alt: "GND-NOIS's screen as the noise turns red" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmnois" },
        { id: "mmdens", group: 1, name: "DPRO-DENS", kind: "synth", catalog: "mmdens", status: "diy",
          description: "A chord of up to four DigiPRO waves with chorus. Waves come from your own ROM.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Strings"],
          media: { type: "video", src: "assets/media/mnmd/mmdens.mp4", poster: "assets/media/mnmd/mmdens.jpg", alt: "DPRO-DENS's screen: a keyboard with the chord's notes marked, beside the wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdens" },
        { id: "mmwave", group: 1, name: "DPRO-WAVE", kind: "synth", catalog: "mmwave", status: "diy",
          description: "The Monomachine's single-cycle wave sets, scanned by wave position. Waves come from your own ROM.",
          pages: [["wave", "wp", "wpm", "wprs"], ["sync", "sfrq", "", "tune"]],
          presets: ["Set 11", "Morph", "Sweep", "Sync"],
          media: { type: "video", src: "assets/media/mnmd/mmwave.mp4", poster: "assets/media/mnmd/mmwave.jpg", alt: "DPRO-WAVE's screen: a wave set stacked in depth, the current wave bright" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmwave" },
        { id: "mmddrw", group: 1, name: "DPRO-DDRW", kind: "synth", catalog: "mmddrw", status: "diy",
          description: "Two DigiPRO waves, crossfaded, spread and bit-reduced.",
          pages: [["wav1", "mix", "wav2", "time"], ["br1", "wid", "br2", "tune"]],
          presets: ["Double", "Organ", "Crushed", "Voices"],
          media: { type: "video", src: "assets/media/mnmd/mmddrw.mp4", poster: "assets/media/mnmd/mmddrw.jpg", alt: "DPRO-DDRW's screen: two waves crossfaded" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmddrw" },
        { id: "mmbbox", group: 1, name: "DPRO-BBOX", kind: "synth", catalog: "mmbbox", status: "diy",
          description: "The Monomachine's 24 drum samples, one per key, from your own ROM.",
          pages: [["ptch", "strt", "rtrg", "rtim"]],
          presets: ["Kit", "Low", "Roll", "Glitch"],
          media: { type: "video", src: "assets/media/mnmd/mmbbox.mp4", poster: "assets/media/mnmd/mmbbox.jpg", alt: "DPRO-BBOX's screen as its samples are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmbbox" },

        { id: "mdkit", group: 0, name: "MD KIT", kind: "drum machine", catalog: "mdkit", status: "dev", flagship: true,
          description: "One drum machine for four of the Machinedrum's families: TRX, EFM, P-I and GND, 33 machines in all. Any of them goes on any of the 24 keys, and each key keeps its own controls. A key chokes its own last note, as on the Machinedrum.",
          screen: "Screen: the machine's sounding part in section, like a patent drawing: the drumhead's waves, the snare wires, the clap's echo chamber, GND's tuning fork. Each machine has its own drawing, and every control moves it.",
          kit: ["TRX 13", "EFM 8", "P-I 9", "GND 3"],
          pages: [["ptch", "dec", "ramp", "rdec"], ["strt", "nois", "harm", "clip"]],
          shift: ["kit", "machine", "choke", ""],
          media: { type: "video", aspect: "1448 / 668", src: "assets/media/mnmd/mdkit.mp4", poster: "assets/media/mnmd/mdkit.jpg", alt: "Nine of MD KIT's machines playing together: kick, cowbell and clap on top; FM tom, open hat and maracas in the middle; struck bar, tuning fork and noise below" } },
        { id: "mde12", group: 0, name: "MD E12", kind: "drum kit", catalog: "mde12", status: "diy",
          description: "The E12 family's sixteen sampled machines, from your own ROM.",
          screen: "Screen: a strip of tape on a splicing block, with each machine's own recording.",
          kit: ["16 machines"],
          pages: [["ptch", "dec", "snap", "spln"], ["strt", "rtrg", "rtim", "bend"]],
          media: { type: "video", src: "assets/media/mnmd/mde12.mp4", poster: "assets/media/mnmd/mde12.jpg", alt: "MD E12's screen, a strip of tape on a splicing block, as BD, SD, CP and OH are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mde12" }
      ]
    }
  ]

};
