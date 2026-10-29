// Everything the site shows. To add a project or machine, add an entry here
// and drop its media in assets/media/<project>/. See README.md.
//
// status: one of the keys in `statuses`. Machines with a `catalog` id are
// checked against the Open-XY catalog when the page loads, and move up to
// "review" (draft on staging) or "live" (published on main) by themselves.
//
// media: {type: "video", src, poster} | {type: "image", src} |
//        {type: "youtube", id} | omitted (the page draws a blank OP-XY screen
//        with the machine's real control labels).

window.SITE = {
  owner: "Max Mockett",
  github: "https://github.com/mmockett",
  builder: "https://open-xy.com",
  sdkRepo: "https://github.com/etcetc000/open-xy",
  catalog: "https://github.com/etcetc000/open-xy/blob/main/catalog/machines.json",

  // The hero screen at the top of the page.
  hero: { type: "video", src: "assets/media/hexagon/hexagon.mp4", poster: "assets/media/hexagon/hexagon.jpg", alt: "The Hexagon Suite's six screens playing together: Wane, Bloom and Hollow on top; Orbit, Bend and Moth below" },

  statuses: {
    live:   { label: "live",        note: "In the open-xy.com builder. Pick it, build, install." },
    review: { label: "in review",   note: "Tagged, measured on hardware and submitted to the Open-XY catalog." },
    soon:   { label: "coming soon", note: "Plays on an OP–XY today, waiting on SDK changes before it can be published." },
    diy:    { label: "diy",         note: "Needs samples captured from your own ROM, so it is built from source only." }
  },

  projects: [
    {
      id: "hexagon",
      name: "Hexagon Suite",
      kicker: "six synths",
      status: "review",
      version: "v1.0.0",
      repo: "https://github.com/mmockett/OP-XY-Hexagon",
      links: [
        { label: "publish pr #217", href: "https://github.com/etcetc000/open-xy/pull/217" }
      ],
      tagline: "Six old ways of making sound, rebuilt the OP–XY way.",
      description: [
        "Wane, Bloom, Hollow, Orbit, Bend and Moth each start from an analog or acoustic way of making sound: a worn cassette, drifting partials, resonating bodies, a vector joystick, phase distortion, a west-coast lowpass gate. Each is rebuilt for the OP–XY with eight controls on two pages, and the OP–XY's own envelopes, filter, LFOs and effects sit on top.",
        "They are made to be used together. Levels are matched, so an eight-note chord on any preset peaks between 0.4 and 0.8 of full scale, and the layouts are shared, so they layer and swap cleanly in one project. Each has its own screen drawn in fine outline, and the screen moves with the sound you hear."
      ],
      facts: [
        ["machines", "6 synths"],
        ["controls", "8 on two pages"],
        ["cpu", "2.4–6.2% a voice, on device"],
        ["os", "1.2.1"],
        ["sdk", "1.4, two-page header"],
        ["licence", "MIT"]
      ],
      machines: [
        {
          id: "wane", name: "Wane", kind: "synth", catalog: "wane", status: "review",
          after: "a worn cassette",
          description: "A polysynth played through a worn cassette. Two detuned oscillators, a sub and a little noise per note, then every note goes through the same tape, so wow, flutter and sag move the whole chord together. Age dulls the top, adds hiss and saturation.",
          screen: "A C60 cassette whose reels turn and whose tape wobbles past the head with the wow and flutter you hear. Age leaves it scratched, dusty and peeling.",
          pages: [["shape", "detune", "drift", "warmth"], ["wow", "flutter", "sag", "age"]],
          cpu: "4.1%",
          media: { type: "video", src: "assets/media/hexagon/wane.mp4", poster: "assets/media/hexagon/wane.jpg", alt: "Wane's cassette screen, reels turning as four notes start" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/wane"
        },
        {
          id: "bloom", name: "Bloom", kind: "synth", catalog: "bloom", status: "review",
          after: "additive synthesis",
          description: "Additive, from 24 sine partials. Shape sets the wave they add up to and vowel lays formants over them, oo to ee. Breath, blur and haze make the partials drift, smear into noise and beat against detuned copies, from a fast shimmer to frozen.",
          screen: "Each partial is a stem at its pitch and level, under a low sun, with the vowel's formants as hills behind.",
          pages: [["tilt", "shape", "stretch", "vowel"], ["breath", "blur", "haze", "time"]],
          cpu: "6.2%",
          media: { type: "video", src: "assets/media/hexagon/bloom.mp4", poster: "assets/media/hexagon/bloom.jpg", alt: "Bloom's screen: partials as stems, formant hills sliding as the vowel sweeps" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bloom"
        },
        {
          id: "hollow", name: "Hollow", kind: "synth", catalog: "hollow", status: "review",
          after: "blown and bowed bodies",
          description: "A blown and bowed resonator. Breath and a soft bow drive eight tuned resonances shaped like a voice, a violin body, an organ pipe or a wine glass. Held notes ring in sympathy with each other, and spread adds slowly drifting copies, like an ensemble.",
          screen: "A 19th-century acoustics plate: the body in section with its standing wave inside, beside resonators whose flames burn as high as each one rings.",
          pages: [["breath", "body", "bright", "ring"], ["air", "vowel", "spread", "sympathy"]],
          cpu: "4.9%",
          media: { type: "video", src: "assets/media/hexagon/hollow.mp4", poster: "assets/media/hexagon/hollow.jpg", alt: "Hollow's engraved acoustics plate, the body changing from a voice to wine glasses" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/hollow"
        },
        {
          id: "orbit", name: "Orbit", kind: "synth", catalog: "orbit", status: "review",
          after: "the Prophet VS",
          description: "A vector synth. Four single-cycle waves from one of eight banks sit at the corners of a diamond, and a point travelling a circle, ellipse, figure 8 or steps sets the mix, so the sound moves by itself. Grit plays it through an old DAC, down to 10 kHz and 8 bits.",
          screen: "The VS joystick field: the corner waves, each note's point on its path with a trail, and the mixed wave on a scope.",
          pages: [["bank", "x", "y", "orbit"], ["rate", "path", "grit", "detune"]],
          cpu: "2.4%",
          media: { type: "video", src: "assets/media/hexagon/orbit.mp4", poster: "assets/media/hexagon/orbit.jpg", alt: "Orbit's diamond with points tracing a figure 8, the mixed wave on a scope" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/orbit"
        },
        {
          id: "bend", name: "Bend", kind: "synth", catalog: "bend", status: "review",
          after: "the Casio CZ",
          description: "Phase distortion. Each note reads a sine through a bent phase map, from pure sine to saw, square, pulse or three resonant waves that sweep like a filter. Notes start bright and settle, so the resonant waves wah. A second line can sit at an interval, detuned or ring-modulated.",
          screen: "Drawn like the CZ manual: the phase map beside the waveform it makes, a dial per note showing its bend, and the eight waves.",
          pages: [["wave", "bend", "detune", "ring"], ["interval", "warp", "noise", "lofi"]],
          cpu: "2.6%",
          media: { type: "video", src: "assets/media/hexagon/bend.mp4", poster: "assets/media/hexagon/bend.jpg", alt: "Bend's phase map bending into steeper teeth beside a dot-matrix waveform" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/bend"
        },
        {
          id: "moth", name: "Moth", kind: "synth", catalog: "moth", status: "review",
          after: "Buchla's west coast",
          description: "A sine, frequency-modulated, folded, then sent through a vactrol lowpass gate that opens on each note and closes slowly. With strike up every note is a pluck, a mallet or a bongo; at zero it holds like a soft pad. Glow sets how slowly the gate closes.",
          screen: "A moth on a specimen plate. Its wing edges are the folded waveform, frayed by fm; its body is the vactrol's LED and photocell, lit by each strike.",
          pages: [["fold", "fm", "ratio", "strike"], ["glow", "bias", "mode", "drift"]],
          cpu: "4.9%",
          media: { type: "video", src: "assets/media/hexagon/moth.mp4", poster: "assets/media/hexagon/moth.jpg", alt: "Moth's wings, edged by the folded waveform, lighting with each plucked note" },
          source: "https://github.com/mmockett/OP-XY-Hexagon/tree/main/moth"
        }
      ]
    },

    {
      id: "mnmd",
      name: "MNMD",
      kicker: "machinedrum + monomachine",
      status: "review",
      version: "v1.1.3",
      repo: "https://github.com/mmockett/OP-XY-MNMD",
      links: [
        { label: "catalog pr #168", href: "https://github.com/etcetc000/open-xy/pull/168" }
      ],
      tagline: "The Machinedrum and Monomachine, written from scratch for the OP–XY.",
      description: [
        "Elektron's two cult machines from the early 2000s, rebuilt as eighteen OP–XY engines. There is no Elektron code, firmware or ROM data in it. Every voice was fitted by ear and by measurement against the original ROMs running in an emulator, then written in fixed point for the OP–XY's Blackfin, which has no floating point.",
        "The Machinedrum arrives as four drum kits that play like the OP–XY's Drumline: each of the 24 keys holds its own machine, from TRX's analog-modelled kick to EFM's FM cowbell, and the project saves every key. The Monomachine arrives as fourteen chromatic synths, each with its SYN page's two rows as two pages of four encoders. Each one draws its namesake on the screen: a kick drum and its pitch sweep, a SID's stepped saw, an FM operator diagram, a vowel chart."
      ],
      facts: [
        ["engines", "4 drum kits, 14 synths"],
        ["kit keys", "24 machines a kit"],
        ["dsp", "fixed point, fitted to the ROMs"],
        ["os", "1.2.0 fork, 1.2.1 catalog"],
        ["in review", "7 synths"],
        ["licence", "MIT"]
      ],
      media: { type: "image", src: "assets/media/mnmd/overview.png", alt: "Screens of MD TRX's kick and cowbell, and the Monomachine's DPRO-DENS, SWAVE-PULSE, SID-6581, VO-6, DPRO-WAVE and FM STAT" },
      groups: [
        { title: "monomachine synths", note: "Chromatic, two pages of four." },
        { title: "machinedrum kits", note: "24 keys, a machine on each." }
      ],
      machines: [
        { id: "mmsid", group: 0, name: "SID-6581", kind: "synth", catalog: "mmsid", status: "review",
          description: "The Commodore 64's sound chip as the Monomachine played it: triangle, saw, pulse, mixed and noise, with a pulse-width sweep, ring modulation and hard sync.",
          pages: [["pw", "pwad", "pwrs", "wave"], ["mod", "msrc", "mfrq", "tune"]],
          presets: ["Saw", "Square", "Sweep", "Sync", "Ring", "Mixed", "Noise"],
          media: { type: "image", src: "assets/media/mnmd/mmsid.png", alt: "SID-6581's screen: a stepped 4-bit saw" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsid" },
        { id: "mmvo6", group: 0, name: "VO-6", kind: "synth", catalog: "mmvo6", status: "review",
          description: "A singing, talking voice from two formants, with twenty consonants that can come before each vowel. Ah, ee and oh, robot r's and whispers.",
          pages: [["voc1", "voc2", "v sw", "voic"], ["cons", "clen", "cvol", "tune"]],
          presets: ["Ah", "Ee", "Oh", "Ma", "Sing La", "Robot Rr", "Whisper", "Tick"],
          media: { type: "image", src: "assets/media/mnmd/mmvo6.png", alt: "VO-6's screen: a vowel chart with the current vowel marked, beside its waveform" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmvo6" },
        { id: "mmstat", group: 0, name: "FM STAT", kind: "synth", catalog: "mmstat", status: "review",
          description: "Two modulators into one carrier, the first with its own decay and feedback. Tines, bells and growls.",
          pages: [["1frq", "1fin", "1env", "1fb"], ["2frq", "2vol", "tone", "tune"]],
          presets: ["Tine", "Bell", "Growl", "Wobble"],
          media: { type: "image", src: "assets/media/mnmd/mmstat.png", alt: "FM STAT's screen: an operator diagram, M1 and M2 into a carrier, beside the output wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmstat" },
        { id: "mmpulse", group: 0, name: "SWAVE-PULSE", kind: "synth", catalog: "mmpulse", status: "review",
          description: "Detuned pulses with a sweeping width and two sub-octaves. Strings, reeds and fat basses.",
          pages: [["unil", "uniw", "sub1", "sub2"], ["pw", "pwad", "pwrs", "tune"]],
          presets: ["Sweep", "Square", "Reed", "Strings", "Bass"],
          media: { type: "image", src: "assets/media/mnmd/mmpulse.png", alt: "SWAVE-PULSE's screen: a pulse wave over its sub-octaves" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpulse" },
        { id: "mmens", group: 0, name: "SWAVE-ENS", kind: "synth", catalog: "mmens", status: "review",
          description: "A four-voice chord of saws or pulses from a single key, with chorus. One finger, a whole string section.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["pw", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Organ", "Seventh"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmens" },
        { id: "mmpar", group: 0, name: "FM PAR", kind: "synth", catalog: "mmpar", status: "review",
          description: "Three modulators in parallel into one carrier, each with its own depth or decay. Keys, organs, plucks and glass.",
          pages: [["1frq", "1env", "2frq", "2env"], ["3frq", "3env", "tone", "tune"]],
          presets: ["Keys", "Organ", "Pluck", "Glass"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmpar" },
        { id: "mmdyn", group: 0, name: "FM DYN", kind: "synth", catalog: "mmdyn", status: "review",
          description: "FM with movement: the first modulator has its own pitch and depth envelopes, the second its decay and feedback. Strikes, zaps and reedy basses.",
          pages: [["1frq", "1fen", "1vol", "1ven"], ["2frq", "2env", "2fb", "tune"]],
          presets: ["Strike", "Zap", "Bass", "Reed"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdyn" },
        { id: "mmsaw", group: 0, name: "SWAVE-SAW", kind: "synth", catalog: "mmsaw", status: "soon",
          waiting: { label: "absent slots, #218", href: "https://github.com/etcetc000/open-xy/pull/218" },
          description: "A stack of detuned saws with sub-octaves, from a thin single saw to a wide supersaw.",
          pages: [["unil", "uniw", "unix", ""], ["subx", "sub1", "sub2", "tune"]],
          presets: ["Stack", "Super", "Wide", "Thin", "Sub"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsaw" },
        { id: "mmsin", group: 0, name: "GND-SIN", kind: "synth", catalog: "mmsin", status: "soon",
          waiting: { label: "absent slots, #218", href: "https://github.com/etcetc000/open-xy/pull/218" },
          description: "A pure sine at the played key. Nothing else, on purpose.",
          pages: [["", "", "", "tune"]],
          presets: ["Sine"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmsin" },
        { id: "mmnois", group: 0, name: "GND-NOIS", kind: "synth", catalog: "mmnois", status: "soon",
          waiting: { label: "absent slots, #218", href: "https://github.com/etcetc000/open-xy/pull/218" },
          description: "White noise, darkening through pink to red. A raw source for the OP–XY's filter and envelopes.",
          pages: [["st", "red", "ston", "tune"]],
          presets: ["White", "Pink", "Red", "Loud"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmnois" },
        { id: "mmdens", group: 0, name: "DPRO-DENS", kind: "synth", catalog: "mmdens", status: "diy",
          description: "A chord of up to four DigiPRO waves, each with its own chorus. The waves come from your own Monomachine ROM.",
          pages: [["pch2", "pch3", "pch4", "wave"], ["", "chrl", "chrw", "tune"]],
          presets: ["Major", "Minor", "Fifths", "Strings"],
          media: { type: "image", src: "assets/media/mnmd/mmdens.png", alt: "DPRO-DENS's screen: a keyboard with the chord's notes marked, beside the wave" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmdens" },
        { id: "mmwave", group: 0, name: "DPRO-WAVE", kind: "synth", catalog: "mmwave", status: "diy",
          description: "The Monomachine's own S-sets of single-cycle waves, captured from your ROM and moved through with wave position.",
          pages: [["wave", "wp", "wpm", "wprs"], ["sync", "sfrq", "", "tune"]],
          presets: ["Set 11", "Morph", "Sweep", "Sync"],
          media: { type: "image", src: "assets/media/mnmd/mmwave.png", alt: "DPRO-WAVE's screen: the S-set's waves stacked in depth, the current one bright" },
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmwave" },
        { id: "mmddrw", group: 0, name: "DPRO-DDRW", kind: "synth", catalog: "mmddrw", status: "diy",
          description: "Two DigiPRO waves crossfaded, spread and bit-reduced. Doubles, organs, crushed voices.",
          pages: [["wav1", "mix", "wav2", "time"], ["br1", "wid", "br2", "tune"]],
          presets: ["Double", "Organ", "Crushed", "Voices"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmddrw" },
        { id: "mmbbox", group: 0, name: "DPRO-BBOX", kind: "synth", catalog: "mmbbox", status: "diy",
          description: "The Monomachine's beat box: its 24 drum samples on 24 keys, from your own ROM.",
          pages: [["ptch", "strt", "rtrg", "rtim"]],
          presets: ["Kit", "Low", "Roll", "Glitch"],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mmbbox" },

        { id: "mdtrx", group: 1, name: "MD TRX", kind: "drum kit", catalog: "mdtrx", status: "soon",
          waiting: { label: "drum kind, #143", href: "https://github.com/etcetc000/open-xy/pull/143" },
          description: "The Machinedrum's analog-modelled family: kicks, snares, toms, clap, rim, cowbell, hats and cymbals, each with its own eight controls on its own key.",
          kit: ["BD", "B2", "SD", "XT", "XC", "CP", "RS", "CB", "CH", "OH", "CY", "MA", "CL"],
          pages: [["ptch", "dec", "ramp", "rdec"]],
          media: { type: "image", src: "assets/media/mnmd/mdtrx-bd.png", alt: "MD TRX's BD screen: a kick drum and beater beside its pitch sweep and wave" },
          gallery: [{ type: "image", src: "assets/media/mnmd/mdtrx-cb.png", alt: "MD TRX's CB screen: a cowbell struck by a stick" }],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdtrx" },
        { id: "mdefm", group: 1, name: "MD EFM", kind: "drum kit", catalog: "mdefm", status: "soon",
          waiting: { label: "drum kind, #143", href: "https://github.com/etcetc000/open-xy/pull/143" },
          description: "The FM family: kick, snare, tom, clap, rim, cowbell, hats and cymbal built from FM, plus the GND snare, noise and impulse.",
          kit: ["BD", "SD", "XT", "CP", "RS", "CB", "HH", "CY", "SN", "NS", "IM"],
          pages: [["ctrl 1", "ctrl 2", "ctrl 3", "ctrl 4"]],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdefm" },
        { id: "mdpi", group: 1, name: "MD P-I", kind: "drum kit", catalog: "mdpi", status: "soon",
          waiting: { label: "drum kind, #143", href: "https://github.com/etcetc000/open-xy/pull/143" },
          description: "Physical modelling: struck membranes, mallets, rods and cymbals that ring like the real things.",
          kit: ["BD", "SD", "MT", "ML", "MA", "RS", "RC", "CC", "HH"],
          pages: [["ctrl 1", "ctrl 2", "ctrl 3", "ctrl 4"]],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mdpi" },
        { id: "mde12", group: 1, name: "MD E12", kind: "drum kit", catalog: "mde12", status: "diy",
          description: "The E12 family's sixteen sampled machines, on samples you capture from your own Machinedrum ROM.",
          kit: ["16 machines"],
          pages: [["ctrl 1", "ctrl 2", "ctrl 3", "ctrl 4"]],
          source: "https://github.com/mmockett/OP-XY-MNMD/tree/main/machines/mde12" }
      ]
    },

    {
      id: "grains",
      name: "Grains",
      kicker: "granular sampler",
      status: "soon",
      version: "main",
      repo: "https://github.com/mmockett/OP-XY-Grains",
      links: [
        { label: "needs #181", href: "https://github.com/etcetc000/open-xy/pull/181" },
        { label: "needs #182", href: "https://github.com/etcetc000/open-xy/pull/182" }
      ],
      tagline: "Any sample, scattered into a cloud you can play.",
      description: [
        "Load a sample and play it across the keyboard. Grains read around a position that can scan through it either way or freeze, stack into octaves, fifths and chords, and spread across the stereo field. Cloud mode scatters them, sync puts them on the tempo's divisions, osc overlaps them evenly into a tone.",
        "The screen draws every grain where it reads in the sample and at what pitch, on lanes for the root and the octaves above, with the sample's overview and the play position underneath. Every note on every track shares 64 grains, handed out in proportion so a big chord never runs the OP–XY out."
      ],
      facts: [
        ["machines", "1 sample engine"],
        ["grains", "64, shared"],
        ["modes", "cloud, sync, osc, reversed"],
        ["grain size", "10 ms to 2 s"],
        ["os", "1.2.1"],
        ["licence", "MIT"]
      ],
      media: { type: "image", src: "assets/media/grains/chord.png", alt: "Grains' screen with a note held: grains stacked on a minor chord over two octaves above the sample's overview" },
      machines: [
        { id: "grains", name: "Grains", kind: "sample engine", catalog: "grains", status: "soon",
          waiting: { label: "sdk #181, #182", href: "https://github.com/etcetc000/open-xy/pull/181" },
          description: "A granular sample synth on the sampler page. One sample plays across the keyboard; pos, scan and spry choose where its grains read, so it needs no trim.",
          pages: [["pos", "scan", "size", "dens"], ["spry", "chrd", "shpe", "mode"]],
          media: { type: "image", src: "assets/media/grains/held.png", alt: "Grains held, the sample trimmed to its second half" },
          gallery: [
            { type: "image", src: "assets/media/grains/load.png", alt: "Grains with no sample loaded: load a sample, shift plus the sample key" },
            { type: "image", src: "assets/media/grains/rest.png", alt: "Grains at rest, one still grain at pos" },
            { type: "image", src: "assets/media/grains/chord.png", alt: "Grains with a note held, chord on minor" }
          ],
          source: "https://github.com/mmockett/OP-XY-Grains" }
      ]
    }
  ],

  // Changes to the Open-XY SDK that these machines needed. Their state is
  // refreshed from GitHub when the page loads.
  sdk: [
    { pr: 180, title: "Play a page-2 sample engine like the sampler: one sample on every key", state: "merged", for: "grains" },
    { pr: 181, title: "Let a page-2 sample engine draw its own screen and page its controls", state: "open", for: "grains" },
    { pr: 182, title: "Give a sample engine's own screen its sample's overview", state: "open", for: "grains" },
    { pr: 218, title: "Let a synth leave a parameter slot absent", state: "open", for: "mnmd" },
    { pr: 143, title: "Drum kind: fixes from running four per-key kits on an OP–XY", state: "open", for: "mnmd" },
    { pr: 190, title: "Hold each machine, not the whole catalog, to the module memory", state: "open", for: "all" }
  ]
};
