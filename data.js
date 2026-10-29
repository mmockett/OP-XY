// Everything the site shows. To add a project or machine, add an entry here
// and drop its media in assets/media/<project>/. See README.md.
//
// status: one of the keys in `statuses`. Machines with a `catalog` id are
// checked against the Open-XY catalog when the page loads, and become "live"
// by themselves once published on its main branch.
//
// media: {type: "video", src, poster} | {type: "image", src} |
//        {type: "youtube", id} | omitted (the page draws a blank OP-XY screen
//        with the machine's real control labels). Screens are rendered by
//        tools/render (README.md), so they match the device. A project's
//        video may give its own `aspect` ("w / h") when its grid isn't 4 x 2.
//
// A project's `audio` names its preset clips, assets/audio/<project>.json:
// machine id -> [{preset, slug, src, role, phrase, seconds}]. Each card then
// gets a row of buttons that play them.

window.SITE = {
  owner: "Max Mockett",
  github: "https://github.com/mmockett",
  builder: "https://open-xy.com",
  sdkRepo: "https://github.com/etcetc000/open-xy",
  catalog: "https://github.com/etcetc000/open-xy/blob/main/catalog/machines.json",

  // The hero screen at the top of the page.
  hero: { type: "video", src: "assets/media/hexagon/hexagon.mp4", poster: "assets/media/hexagon/hexagon.jpg", alt: "The Hexagon Suite's six screens playing together: Wane, Bloom and Hollow on top; Orbit, Bend and Moth below" },

  statuses: {
    live: { label: "live",        note: "In the open-xy.com builder." },
    soon: { label: "coming soon", note: "Runs on the OP–XY. Coming to the open-xy.com builder." },
    diy:  { label: "diy",         note: "Needs samples from your own ROM. Build from source." },
    lab:  { label: "experimental", note: "Runs on the OP–XY; still being refined. Build from source." }
  },

  projects: [
    {
      id: "hexagon",
      audio: "assets/audio/hexagon.json",
      name: "Hexagon Suite",
      kicker: "six synths",
      status: "soon",
      version: "v1.0.0",
      repo: "https://github.com/mmockett/OP-XY-Hexagon",
      links: [],
      tagline: "Six synths, made to be played together.",
      description: [
        "Wane, Bloom, Hollow, Orbit, Bend and Moth: tape, additive, resonators, vector, phase distortion and a west-coast lowpass gate. Eight controls on two pages, with the OP–XY's envelopes, filter, LFOs and effects on top.",
        "Levels are matched and layouts shared, so they layer and swap within a project. Each has an animated screen that follows the sound."
      ],
      specs: [
        [["synths", "6"], ["controls", "8"], ["cpu", "2–6%"], ["os", "1.2.1"]],
        [["sdk", "1.4"], ["release", "v1.0.0"], ["screens", "6"], ["licence", "MIT"]]
      ],
      machines: [
        {
          id: "wane", name: "Wane", kind: "synth", catalog: "wane", status: "soon",
          after: "a worn cassette",
          description: "Polysynth through a worn cassette. Two detuned oscillators, a sub and noise per note. Wow, flutter and sag move the whole chord; age dulls the top and adds hiss.",
          screen: "Screen: a C60 cassette. The reels turn and the tape wobbles with the wow and flutter.",
          pages: [["shape", "detune", "drift", "warmth"], ["wow", "flutter", "sag", "age"]],
          cpu: "4.1%",
          media: { type: "video", src: "assets/media/hexagon/wane.mp4", poster: "assets/media/hexagon/wane.jpg", alt: "Wane's cassette screen, reels turning as four notes start" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/wane"
        },
        {
          id: "bloom", name: "Bloom", kind: "synth", catalog: "bloom", status: "soon",
          after: "additive synthesis",
          description: "Additive synth with 24 sine partials. Shape sets the waveform, vowel adds formants from oo to ee. Breath, blur and haze add drift, noise and beating.",
          screen: "Screen: partials as stems under a low sun, formants as hills behind.",
          pages: [["tilt", "shape", "stretch", "vowel"], ["breath", "blur", "haze", "time"]],
          cpu: "6.2%",
          media: { type: "video", src: "assets/media/hexagon/bloom.mp4", poster: "assets/media/hexagon/bloom.jpg", alt: "Bloom's screen: partials as stems, formant hills sliding as the vowel sweeps" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bloom"
        },
        {
          id: "hollow", name: "Hollow", kind: "synth", catalog: "hollow", status: "soon",
          after: "blown and bowed bodies",
          description: "Blown and bowed resonator. Eight tuned resonances shaped like a voice, violin, organ pipe or wine glass. Held notes resonate together; spread adds drifting detuned copies.",
          screen: "Screen: an engraved acoustics plate, with flames that rise with each resonance.",
          pages: [["breath", "body", "bright", "ring"], ["air", "vowel", "spread", "sympathy"]],
          cpu: "4.9%",
          media: { type: "video", src: "assets/media/hexagon/hollow.mp4", poster: "assets/media/hexagon/hollow.jpg", alt: "Hollow's engraved acoustics plate, the body changing from a voice to wine glasses" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/hollow"
        },
        {
          id: "orbit", name: "Orbit", kind: "synth", catalog: "orbit", status: "soon",
          after: "the Prophet VS",
          description: "Vector synth. Four single-cycle waves on a diamond, mixed by a point moving in a circle, ellipse, figure 8 or steps. Grit runs it through an old DAC, down to 10 kHz and 8 bits.",
          screen: "Screen: the VS joystick field, each note's path, and the mixed wave on a scope.",
          pages: [["bank", "x", "y", "orbit"], ["rate", "path", "grit", "detune"]],
          cpu: "2.4%",
          media: { type: "video", src: "assets/media/hexagon/orbit.mp4", poster: "assets/media/hexagon/orbit.jpg", alt: "Orbit's diamond with points tracing a figure 8, the mixed wave on a scope" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/orbit"
        },
        {
          id: "bend", name: "Bend", kind: "synth", catalog: "bend", status: "soon",
          after: "the Casio CZ",
          description: "Phase distortion. Sine, saw, square, pulse, or three resonant waves that sweep like a filter. A second line adds an interval, detune or ring mod.",
          screen: "Screen: the phase map beside its waveform, drawn like the CZ manual.",
          pages: [["wave", "bend", "detune", "ring"], ["interval", "warp", "noise", "lofi"]],
          cpu: "2.6%",
          media: { type: "video", src: "assets/media/hexagon/bend.mp4", poster: "assets/media/hexagon/bend.jpg", alt: "Bend's phase map bending into steeper teeth beside a dot-matrix waveform" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bend"
        },
        {
          id: "moth", name: "Moth", kind: "synth", catalog: "moth", status: "soon",
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
      status: "lab",
      version: "v0.1.0",
      repo: "https://github.com/mmockett/OP-XY-Nonagon",
      links: [],
      tagline: "Nine experimental sounds, each grown from a piece of physics.",
      description: [
        "Sand, Cocoa, Ghost, Coin, Recur, Fermi, Mach, Butterfly and Drop. Each starts from something odd in the physical world (Chladni's sand figures, the hot chocolate effect, a phantom pitch heard only between the ears, Euler's disk, a scrambled picture that always comes home, the Fermi–Pasta–Ulam–Tsingou chain, a supersonic flyby, the Hofstadter butterfly and the Leidenfrost drop) and turns it into an instrument with eight controls on two pages.",
        "Each screen is one object, drawn in outline, that every control visibly changes. Their levels match Hexagon's. They run on the OP–XY but are still being refined, so expect rough edges."
      ],
      specs: [
        [["synths", "7"], ["sample", "2"], ["cpu", "1–6%"], ["os", "1.2.1"]],
        [["sdk", "1.4"], ["release", "v0.1.0"], ["screens", "9"], ["licence", "MIT"]]
      ],
      media: { type: "video", aspect: "1448 / 668", src: "assets/media/nonagon/nonagon.mp4", poster: "assets/media/nonagon/nonagon.jpg", alt: "Nonagon Suite's nine screens playing together: Sand, Cocoa and Ghost on top; Coin, Recur and Fermi in the middle; Mach, Butterfly and Drop below" },
      machines: [
        {
          id: "sand", name: "Sand", kind: "synth", status: "lab",
          after: "Chladni's figures",
          description: "A bowed plate strewn with sand. Grains rattle on its moving areas, then settle into the figure's nodal lines, leaving a glassy tone. Tilt runs the sand downhill; shake keeps it jumping.",
          screen: "Screen: the plate on its column, tipping with tilt, the sand drawing the figure.",
          pages: [["figure", "bow", "sand", "grain"], ["plate", "settle", "tilt", "shake"]],
          cpu: "5.4%",
          media: { type: "video", src: "assets/media/nonagon/sand.mp4", poster: "assets/media/nonagon/sand.jpg", alt: "Sand's plate tipping on its column as three notes ring, the sand running downhill" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/sand"
        },
        {
          id: "cocoa", name: "Cocoa", kind: "synth", status: "lab",
          after: "the hot chocolate effect",
          description: "A spoon tapping a mug of cocoa. Stirred-in powder fills the drink with bubbles that slow sound down, so each tap starts low and climbs to pitch as they clear. Cup, fill and spoon set the ring.",
          screen: "Screen: the mug, spoon in the drink; froth on the drink clears as the note comes into tune.",
          pages: [["powder", "taps", "fizz", "cup"], ["fill", "spoon", "pops", "stir"]],
          cpu: "5.7%",
          media: { type: "video", src: "assets/media/nonagon/cocoa.mp4", poster: "assets/media/nonagon/cocoa.jpg", alt: "Cocoa's mug, the spoon tapping as the drink darkens with powder" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/cocoa"
        },
        {
          id: "ghost", name: "Ghost", kind: "sample engine", status: "lab",
          after: "the Huggins pitch",
          description: "Binaural phantom pitches, for headphones: notes made of breath and hum whose pitch lives between the ears. Orbit walks the voice round your head. Load a sample and it becomes the bed; without one, Ghost breathes its own.",
          screen: "Screen: a Pepper's ghost stage. Split parts the apparition into twins; ring gives it halos.",
          pages: [["ring", "voice", "split", "trade"], ["beat", "orbit", "near", "bed"]],
          cpu: "3.0%",
          media: { type: "video", src: "assets/media/nonagon/ghost.mp4", poster: "assets/media/nonagon/ghost.jpg", alt: "Ghost's stage, the apparition parting into twins as split rises" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/ghost"
        },
        {
          id: "coin", name: "Coin", kind: "synth", status: "lab",
          after: "Euler's disk",
          description: "A disk spun on a mirror. As it falls, its wobble speeds up, so each note's ring rises and quickens until it settles. Size, disk and base set the metal and the surface; many adds companion disks.",
          screen: "Screen: the disk spinning on its base, leaning as it slows, rings spreading across the glass.",
          pages: [["spin", "size", "disk", "base"], ["wobble", "air", "ring", "many"]],
          cpu: "1.5%",
          media: { type: "video", src: "assets/media/nonagon/coin.mp4", poster: "assets/media/nonagon/coin.jpg", alt: "Coin's disk spinning on its mirror base as companion disks join" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/coin"
        },
        {
          id: "recur", name: "Recur", kind: "sample engine", status: "lab",
          after: "Arnold's cat map",
          description: "A sample cut into tiles and shuffled by a chaotic map that always comes home: step by step the loop scrambles, then returns exactly to the original. Map, grid and slice set the shuffle.",
          screen: "Screen: a sliding-tile puzzle tin; each map shuffles its own picture.",
          pages: [["pos", "grid", "slice", "map"], ["step", "rate", "depth", "chrd"]],
          cpu: "1.2%",
          media: { type: "video", src: "assets/media/nonagon/recur.mp4", poster: "assets/media/nonagon/recur.jpg", alt: "Recur's puzzle tin, the picture's tiles scrambling and returning" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/recur"
        },
        {
          id: "fermi", name: "Fermi", kind: "synth", status: "lab",
          after: "the FPUT problem",
          description: "A chain of masses on nonlinear springs. Energy in its first mode spreads into higher ones, then flows almost wholly back, so the tone slowly breathes. More energy and stiffer springs push it into chaos.",
          screen: "Screen: the chain on its stand, drawn back by energy, with a damping lever and a timing pendulum.",
          pages: [["energy", "masses", "springs", "time"], ["disperse", "mode", "damping", "seed"]],
          cpu: "3.8%",
          media: { type: "video", src: "assets/media/nonagon/fermi.mp4", poster: "assets/media/nonagon/fermi.jpg", alt: "Fermi's chain of masses swelling as energy is turned up" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/fermi"
        },
        {
          id: "mach", name: "Mach", kind: "synth", status: "lab",
          after: "a supersonic flyby",
          description: "Each note flies a sound past you at up to Mach 3: the Doppler sweep, the sonic boom as the Mach cone crosses, and an echo off the ground, all worked out from the geometry of the pass.",
          screen: "Screen: the pass seen from above, wavefronts trailing the source and the cone sweeping the listener.",
          pages: [["mach", "pass", "source", "dur"], ["boom", "air", "tune", "echo"]],
          cpu: "4.5%",
          media: { type: "video", src: "assets/media/nonagon/mach.mp4", poster: "assets/media/nonagon/mach.jpg", alt: "Mach's flybys, the wavefronts folding into a cone as mach rises" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/mach"
        },
        {
          id: "butterfly", name: "Butterfly", kind: "synth", status: "lab",
          after: "the Hofstadter butterfly",
          description: "The fractal spectrum of an electron in a crystal under a magnetic field, played as a ringing chain. Flux reshapes the bands and gaps; coupling traps the ringing in place.",
          screen: "Screen: a butterfly whose wing edges are the spectrum and whose markings are the chain.",
          pages: [["flux", "coupling", "spread", "strike"], ["glow", "site", "tilt", "wingbeat"]],
          cpu: "5.6%",
          media: { type: "video", src: "assets/media/nonagon/butterfly.mp4", poster: "assets/media/nonagon/butterfly.jpg", alt: "Butterfly's wings reshaping as flux is turned" },
          source: "https://github.com/mmockett/OP-XY-Nonagon/tree/main/butterfly"
        },
        {
          id: "drop", name: "Drop", kind: "synth", status: "lab",
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
      version: "main",
      repo: "https://github.com/mmockett/OP-XY-ModFX",
      links: [],
      tagline: "A filter for every track, and a 1970s effects box for the sends.",
      description: [
        "Two machines that work across the whole OP–XY instead of on one track. Omnifilter sits on an aux track, takes no instrument slot and steers all eight instrument tracks at once. Lint is a send effect, with its own page on FX I or II.",
        "Omnifilter's screen is a rangefinder's lens; Lint's is the effects box seen from above."
      ],
      specs: [
        [["aux", "1"], ["send", "1"], ["presets", "12"], ["os", "1.2.1"]],
        [["sdk", "1.5"], ["release", "main"], ["screens", "2"], ["licence", "MIT"]]
      ],
      machines: [
        {
          id: "omnifilter", name: "Omnifilter", kind: "aux module", catalog: "omnifilter", status: "soon",
          description: "One filter and envelope for the whole OP–XY. Cutoff, reso, attack and release are set on all eight instrument tracks, as if each track's own encoder had turned. Lock them on steps and the whole mix opens and closes with the pattern.",
          screen: "Screen: a rangefinder camera's lens. Cutoff opens the eight-bladed iris, reso sharpens it into a star, attack and release turn its rings.",
          pages: [["cutoff", "reso", "attack", "release"]],
          presets: ["open", "warm", "dark", "acid", "pluck", "swell"],
          cpu: "0.8%", cpuNote: "of the audio",
          media: { type: "video", src: "assets/media/modfx/omnifilter.mp4", poster: "assets/media/modfx/omnifilter.jpg", alt: "Omnifilter's lens: the iris closing, sharpening into a star, its rings turning, then opening" },
          source: "https://github.com/mmockett/OP-XY-ModFX/tree/main/omnifilter"
        },
        {
          id: "lint", name: "Lint", kind: "send effect", catalog: "lint", status: "soon",
          after: "Finegear's Dust Collector",
          description: "Two tape saturations, an optical phaser, a gritty echo and a three-spring tank, in any of six orders. One can be patched into the echo's feedback loop, and two LFOs move them. At full send a track runs wholly through the box.",
          screen: "Screen: the box from above, its four bays in order on one patch cable. Each control moves its own bay.",
          pages: [["dust", "spring", "echo", "phase"], ["time", "tone", "rate", "tape 2"]],
          shift: ["order", "loop", "wobble", "shape"],
          presets: ["Dusty", "Tank", "Slapback", "Swoosh", "Runaway", "Crushed"],
          cpu: "7.4%", cpuNote: "of the audio",
          media: { type: "video", src: "assets/media/modfx/lint.mp4", poster: "assets/media/modfx/lint.jpg", alt: "Lint's effects box: dust, spring and echo turned up, then Shift held to reorder the bays and patch tape 2 into the echo's loop" },
          source: "https://github.com/mmockett/OP-XY-ModFX/tree/main/lint"
        }
      ]
    },

    {
      id: "mnmd",
      name: "MNMD",
      kicker: "machinedrum + monomachine",
      status: "soon",
      version: "v1.1.3",
      repo: "https://github.com/mmockett/OP-XY-MNMD",
      links: [],
      tagline: "Elektron's Machinedrum and Monomachine, rebuilt for the OP–XY.",
      description: [
        "Eighteen engines: four Machinedrum kits and fourteen Monomachine synths. No Elektron code, firmware or ROM data. Voices were matched by ear and by measurement against the original ROMs in an emulator, and written in fixed point for the OP–XY's Blackfin.",
        "The kits play like the OP–XY's Drumline, with a different machine on each of the 24 keys. The synths play chromatically, with the Monomachine's SYN page as two pages of four controls."
      ],
      specs: [
        [["kits", "4"], ["synths", "14"], ["keys", "24"], ["os", "1.2.1"]],
        [["dsp", "fixed"], ["release", "v1.1.3"], ["screens", "18"], ["licence", "MIT"]]
      ],
      media: { type: "video", src: "assets/media/mnmd/overview.mp4", poster: "assets/media/mnmd/overview.jpg", alt: "Eight MNMD screens: MD TRX, MD EFM, SID-6581, VO-6, FM STAT, SWAVE-PULSE, DPRO-WAVE and DPRO-DENS" },
      groups: [
        { title: "monomachine synths", note: "Chromatic, two pages of four." },
        { title: "machinedrum kits", note: "24 keys, a machine on each." }
      ],
      machines: [
        { id: "mmsid", group: 0, name: "SID-6581", kind: "synth", catalog: "mmsid", status: "soon",
          description: "The Commodore 64 sound chip: triangle, saw, pulse, mixed and noise, with pulse-width sweep, ring mod and sync.",
          pages: [["pw", "pwad", "pwrs", "wave"], ["mod", "msrc", "mfrq", "tune"]],
          presets: ["Saw", "Square", "Sweep", "Sync", "Ring", "Mixed", "Noise"],
          media: { type: "video", src: "assets/media/mnmd/mmsid.mp4", poster: "assets/media/mnmd/mmsid.jpg", alt: "SID-6581's screen: a stepped 4-bit saw" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsid" },
        { id: "mmvo6", group: 0, name: "VO-6", kind: "synth", catalog: "mmvo6", status: "soon",
          description: "Two-formant voice with twenty consonants. Vowels, robot speech and whispers.",
          pages: [["voc1", "voc2", "v sw", "voic"], ["cons", "clen", "cvol", "tune"]],
          presets: ["Ah", "Ee", "Oh", "Ma", "Sing La", "Robot Rr", "Whisper", "Tick"],
          media: { type: "video", src: "assets/media/mnmd/mmvo6.mp4", poster: "assets/media/mnmd/mmvo6.jpg", alt: "VO-6's screen: a vowel chart with the current vowel marked, beside its waveform" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmvo6" },
        { id: "mmstat", group: 0, name: "FM STAT", kind: "synth", catalog: "mmstat", status: "soon",
          description: "Two modulators into one carrier; the first has decay and feedback. Tines, bells, growls.",
          pages: [["1frq", "1fin", "1env", "1fb"], ["2frq", "2vol", "tone", "tune"]],
          presets: ["Tine", "Bell", "Growl", "Wobble"],
          media: { type: "video", src: "assets/media/mnmd/mmstat.mp4", poster: "assets/media/mnmd/mmstat.jpg", alt: "FM STAT's screen: an operator diagram, M1 and M2 into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmstat" },
        { id: "mmpulse", group: 0, name: "SWAVE-PULSE", kind: "synth", catalog: "mmpulse", status: "soon",
          description: "Detuned pulses with width sweep and two sub-octaves.",
          pages: [["unil", "uniw", "sub1", "sub2"], ["pw", "pwad", "pwrs", "tune"]],
          presets: ["Sweep", "Square", "Reed", "Strings", "Bass"],
          media: { type: "video", src: "assets/media/mnmd/mmpulse.mp4", poster: "assets/media/mnmd/mmpulse.jpg", alt: "SWAVE-PULSE's screen: a pulse wave over its sub-octaves" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpulse" },
        { id: "mmens", group: 0, name: "SWAVE-ENS", kind: "synth", catalog: "mmens", status: "soon",
          description: "A four-note chord of saws or pulses from one key, with chorus.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["pw", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Organ", "Seventh"],
          media: { type: "video", src: "assets/media/mnmd/mmens.mp4", poster: "assets/media/mnmd/mmens.jpg", alt: "SWAVE-ENS's screen as a chord plays" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmens" },
        { id: "mmpar", group: 0, name: "FM PAR", kind: "synth", catalog: "mmpar", status: "soon",
          description: "Three parallel modulators into one carrier, each with depth or decay.",
          pages: [["1frq", "1env", "2frq", "2env"], ["3frq", "3env", "tone", "tune"]],
          presets: ["Keys", "Organ", "Pluck", "Glass"],
          media: { type: "video", src: "assets/media/mnmd/mmpar.mp4", poster: "assets/media/mnmd/mmpar.jpg", alt: "FM PAR's screen: three operators into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpar" },
        { id: "mmdyn", group: 0, name: "FM DYN", kind: "synth", catalog: "mmdyn", status: "soon",
          description: "FM with pitch and depth envelopes on the first modulator, decay and feedback on the second.",
          pages: [["1frq", "1fen", "1vol", "1ven"], ["2frq", "2env", "2fb", "tune"]],
          presets: ["Strike", "Zap", "Bass", "Reed"],
          media: { type: "video", src: "assets/media/mnmd/mmdyn.mp4", poster: "assets/media/mnmd/mmdyn.jpg", alt: "FM DYN's screen: two operators into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdyn" },
        { id: "mmsaw", group: 0, name: "SWAVE-SAW", kind: "synth", catalog: "mmsaw", status: "soon",
          description: "Detuned saw stack with sub-octaves, from a single saw to a supersaw.",
          pages: [["unil", "uniw", "unix", ""], ["subx", "sub1", "sub2", "tune"]],
          presets: ["Stack", "Super", "Wide", "Thin", "Sub"],
          media: { type: "video", src: "assets/media/mnmd/mmsaw.mp4", poster: "assets/media/mnmd/mmsaw.jpg", alt: "SWAVE-SAW's screen: the saw stack over its sub-octaves" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsaw" },
        { id: "mmsin", group: 0, name: "GND-SIN", kind: "synth", catalog: "mmsin", status: "soon",
          description: "A sine wave.",
          pages: [["", "", "", "tune"]],
          presets: ["Sine"],
          media: { type: "video", src: "assets/media/mnmd/mmsin.mp4", poster: "assets/media/mnmd/mmsin.jpg", alt: "GND-SIN's screen: a sine" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsin" },
        { id: "mmnois", group: 0, name: "GND-NOIS", kind: "synth", catalog: "mmnois", status: "soon",
          description: "Noise, from white to red.",
          pages: [["st", "red", "ston", "tune"]],
          presets: ["White", "Pink", "Red", "Loud"],
          media: { type: "video", src: "assets/media/mnmd/mmnois.mp4", poster: "assets/media/mnmd/mmnois.jpg", alt: "GND-NOIS's screen as the noise turns red" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmnois" },
        { id: "mmdens", group: 0, name: "DPRO-DENS", kind: "synth", catalog: "mmdens", status: "diy",
          description: "A chord of up to four DigiPRO waves with chorus. Waves come from your own ROM.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Strings"],
          media: { type: "video", src: "assets/media/mnmd/mmdens.mp4", poster: "assets/media/mnmd/mmdens.jpg", alt: "DPRO-DENS's screen: a keyboard with the chord's notes marked, beside the wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdens" },
        { id: "mmwave", group: 0, name: "DPRO-WAVE", kind: "synth", catalog: "mmwave", status: "diy",
          description: "The Monomachine's single-cycle wave sets, scanned by wave position. Waves come from your own ROM.",
          pages: [["wave", "wp", "wpm", "wprs"], ["sync", "sfrq", "", "tune"]],
          presets: ["Set 11", "Morph", "Sweep", "Sync"],
          media: { type: "video", src: "assets/media/mnmd/mmwave.mp4", poster: "assets/media/mnmd/mmwave.jpg", alt: "DPRO-WAVE's screen: a wave set stacked in depth, the current wave bright" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmwave" },
        { id: "mmddrw", group: 0, name: "DPRO-DDRW", kind: "synth", catalog: "mmddrw", status: "diy",
          description: "Two DigiPRO waves, crossfaded, spread and bit-reduced.",
          pages: [["wav1", "mix", "wav2", "time"], ["br1", "wid", "br2", "tune"]],
          presets: ["Double", "Organ", "Crushed", "Voices"],
          media: { type: "video", src: "assets/media/mnmd/mmddrw.mp4", poster: "assets/media/mnmd/mmddrw.jpg", alt: "DPRO-DDRW's screen: two waves crossfaded" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmddrw" },
        { id: "mmbbox", group: 0, name: "DPRO-BBOX", kind: "synth", catalog: "mmbbox", status: "diy",
          description: "The Monomachine's 24 drum samples, one per key, from your own ROM.",
          pages: [["ptch", "strt", "rtrg", "rtim"]],
          presets: ["Kit", "Low", "Roll", "Glitch"],
          media: { type: "video", src: "assets/media/mnmd/mmbbox.mp4", poster: "assets/media/mnmd/mmbbox.jpg", alt: "DPRO-BBOX's screen as its samples are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmbbox" },

        { id: "mdtrx", group: 1, name: "MD TRX", kind: "drum kit", catalog: "mdtrx", status: "soon",
          description: "Analog-modelled drums: kick, snare, toms, clap, rim, cowbell, hats and cymbals.",
          kit: ["BD", "B2", "SD", "XT", "XC", "CP", "RS", "CB", "CH", "OH", "CY", "MA", "CL"],
          pages: [["ptch", "dec", "ramp", "rdec"], ["strt", "nois", "harm", "clip"]],
          media: { type: "video", src: "assets/media/mnmd/mdtrx.mp4", poster: "assets/media/mnmd/mdtrx.jpg", alt: "MD TRX's screen as BD, SD, CP and CB are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdtrx" },
        { id: "mdefm", group: 1, name: "MD EFM", kind: "drum kit", catalog: "mdefm", status: "soon",
          description: "FM drums, plus the GND snare, noise and impulse.",
          kit: ["BD", "SD", "XT", "CP", "RS", "CB", "HH", "CY", "SN", "NS", "IM"],
          pages: [["ptch", "dec", "ramp", "rdec"], ["mod", "mfrq", "mdec", "mfb"]],
          media: { type: "video", src: "assets/media/mnmd/mdefm.mp4", poster: "assets/media/mnmd/mdefm.jpg", alt: "MD EFM's screen as BD, SD, CP and CB are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdefm" },
        { id: "mdpi", group: 1, name: "MD P-I", kind: "drum kit", catalog: "mdpi", status: "soon",
          description: "Physically modelled drums and cymbals.",
          kit: ["BD", "SD", "MT", "ML", "MA", "RS", "RC", "CC", "HH"],
          pages: [["ptch", "dec", "hard", "hamr"], ["tens", "damp", "", ""]],
          media: { type: "video", src: "assets/media/mnmd/mdpi.mp4", poster: "assets/media/mnmd/mdpi.jpg", alt: "MD P-I's screen as BD, SD, MT and CC are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdpi" },
        { id: "mde12", group: 1, name: "MD E12", kind: "drum kit", catalog: "mde12", status: "diy",
          description: "The E12 family's sixteen sampled machines, from your own ROM.",
          kit: ["16 machines"],
          pages: [["ptch", "dec", "snap", "spln"], ["strt", "rtrg", "rtim", "bend"]],
          media: { type: "video", src: "assets/media/mnmd/mde12.mp4", poster: "assets/media/mnmd/mde12.jpg", alt: "MD E12's screen as BD, SD, CP and CB are struck" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mde12" }
      ]
    }
  ]

};
