// Plays Conductor's own control and display code on the host, frame by frame,
// for render.mjs. build.py compiles it against Conductor's source and its SDK
// and feeds it a scene on stdin, one event a line, at 30 frames a second:
//
//   frames <n>               how many frames to play
//   <frame> global <slot> <word>   one of M1's saved controls, as the track holds it
//   <frame> page <1..4>      an M key
//   <frame> turn <slot> <+1|-1>    a detent of one of the machine's own encoders
//   <frame> shift <0|1>      Shift held or released
//   <frame> row <0|1>        an encoder press: the header's first or second row
//
// For each frame it prints "f <frame>", then "n <node> <x> <y> <scale> <cos>
// <sin> <shade> <paint>" and "t <slot> <x> <y> <scale> <text>", Q10, which
// build.py turns into the artwork's SVG as the SDK's preview applies it.
#include "control.cpp"
#include "display.cpp"
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>

using namespace conductor;

static i32 words_out[opxy::control::display_words];
extern "C" u32 sdk_control_copies(u32) { return 1; }
extern "C" i32 sdk_control_display(u32 i) { return words_out[i]; }

struct Cue { u32 frame; char kind[8]; i32 a, b; };

static opxy::control::Input input;
static opxy::control::Overlay overlay;
static ControlState control_state;
static DisplayState display_state;
static conductor::Frame frame;

int main() {
    u32 frames = 0;
    std::vector<Cue> events;
    char line[128];
    while (std::fgets(line, sizeof line, stdin)) {
        Cue e = {};
        if (std::sscanf(line, "frames %u", &frames) == 1) continue;
        if (std::sscanf(line, "%u %7s %d %d", &e.frame, e.kind, &e.a, &e.b) >= 2) events.push_back(e);
    }

    // Track 12 at 120 bpm, playing from the song's start; the GUI ticks at
    // 60 a second, two to a frame.
    const u32 fps = 30, ticks_per_frame = 2;
    input.track = 11;
    input.transport.bpm_x10 = 1200;
    input.transport.playing = 1;
    input.elapsed_us = 1000000 / (fps * ticks_per_frame);
    control_reset(control_state);
    display_reset(display_state);
    opxy::draw::Input in;
    std::memset(&in, 0, sizeof in);
    in.track = 11;
    for (u32 i = 0; i < 4; ++i) in.shown[i] = static_cast<u8>(i);
    in.elapsed = 1024 / fps;
    unsigned long long song_ticks_x60 = 0;  // the song's position in 96ths of a quarter note, x60

    for (u32 f = 0; f < frames; ++f) {
        for (const Cue& e : events) {
            if (e.frame != f) continue;
            if (!std::strcmp(e.kind, "global")) input.values[11][e.a] = e.b;
            if (!std::strcmp(e.kind, "page")) input.page_key = static_cast<u32>(e.a);
            if (!std::strcmp(e.kind, "shift")) input.shift = static_cast<u32>(e.a);
            if (!std::strcmp(e.kind, "row"))
                for (u32 i = 0; i < 4; ++i) in.shown[i] = static_cast<u8>(e.a ? i + 4 : i);
            if (!std::strcmp(e.kind, "turn") && input.turn_count < opxy::control::turn_capacity) {
                opxy::control::Turn& t = input.turns[input.turn_count++];
                t.slot = static_cast<u8>(e.a);
                t.direction = static_cast<i16>(e.b);
            }
        }
        for (u32 k = 0; k < ticks_per_frame; ++k) {
            std::memset(&overlay, 0, sizeof overlay);
            input.transport.ticks96 = static_cast<u32>(song_ticks_x60 / 60);
            control(control_state, input, overlay);
            std::memcpy(words_out, overlay.display, sizeof words_out);
            input.page_key = 0;
            input.turn_count = 0;
            song_ticks_x60 += input.transport.bpm_x10 * 96u / 600u;  // a GUI tick's worth, x60
        }
        for (u32 i = 0; i < kGlobals; ++i) in.slots[i] = input.values[11][i];
        in.shift = input.shift;
        display(display_state, in, frame);

        std::printf("f %u\n", f);
        for (u32 i = 0; i < conductor::Frame::node_count; ++i) {
            const opxy::draw::Node& n = frame.nodes[i];
            std::printf("n %u %d %d %d %d %d %u %u\n", i, n.x, n.y, n.scale, n.cos, n.sin, n.shade, static_cast<u32>(n.paint));
        }
        for (u32 i = 0; i < conductor::Frame::text_count; ++i) {
            const opxy::draw::Text& t = frame.texts[i];
            std::printf("t %u %d %d %d %s\n", i, t.x, t.y, t.scale, t.chars);
        }
    }
}
