import { useRef, useEffect } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Stem } from "vexflow";
import type { NoteData } from "../../domain/note";
import type { BaseClefType } from "../../domain/clef";
import { toVexFlowClef } from "../../domain/clef";

interface StaffProps {
  notes: NoteData[];
  clef: BaseClefType;
}

// NoteData.name ("C4") → VexFlow key ("c/4")
function toVexKey(name: string): string {
  const letter = name.slice(0, -1).toLowerCase();
  const octave = name.slice(-1);
  return `${letter}/${octave}`;
}

export default function Staff({ notes, clef }: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 前回の描画をクリア
    el.innerHTML = "";

    const vexClef = toVexFlowClef(clef);
    const scale = 1.5;
    const staveWidth = 160;
    const width = staveWidth * scale;
    const height = 200;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.scale(scale, scale);

    // 五線を描画（上に加線がある場合のスペース確保）
    const stave = new Stave(0, 10, staveWidth);
    stave.addClef(vexClef);
    stave.setContext(context);
    stave.draw();

    // 音符を作成（和音は keys 配列に複数指定）
    const keys = notes.map((n) => toVexKey(n.name));
    // B4（第3線）以上なら棒を下向きに
    const highestPosition = Math.max(...notes.map((n) => n.position));
    const stemDirection = highestPosition >= 4 ? Stem.DOWN : Stem.UP;
    const staveNote = new StaveNote({
      keys,
      duration: "q",
      clef: vexClef,
      stemDirection,
    });

    // Voice に追加して描画
    const voice = new Voice({ numBeats: 1, beatValue: 4 });
    voice.setStrict(false);
    voice.addTickables([staveNote]);

    // 五線の中央付近に音符を配置
    new Formatter().joinVoices([voice]).format([voice], 1);
    const noteAreaWidth = staveWidth - stave.getNoteStartX();
    staveNote.setXShift(noteAreaWidth / 2 - 15);

    voice.setStave(stave);
    voice.draw(context);
  }, [notes, clef]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    />
  );
}
