#!/usr/bin/env python3
"""Озвучка текстов прогулки голосами Piper.

    python3 scripts/tts.py --list ru                       # какие русские голоса вообще есть
    python3 scripts/tts.py audio/scripts/foo.txt --out audio/out --voices ru_RU-dmitri-medium

Модели голосов лежат на HuggingFace, а он закрыт политикой сети внутри сессии,
поэтому запускать это надо там, где есть интернет, — в раннере Actions.
"""

import argparse
import json
import pathlib
import shutil
import subprocess
import sys
from urllib.request import urlopen

from piper.download_voices import VOICES_JSON, download_voice

# Порядок предпочтения: сначала мужские, потом женские, качество medium.
# Если чего-то не окажется в каталоге, берём что есть — лишь бы русское.
PREFERRED = [
    "ru_RU-dmitri-medium",
    "ru_RU-irina-medium",
    "ru_RU-denis-medium",
    "ru_RU-ruslan-medium",
]


def catalogue() -> dict:
    with urlopen(VOICES_JSON, timeout=120) as r:
        return json.load(r)


def list_voices(prefix: str) -> list[str]:
    names = sorted(k for k in catalogue() if k.lower().startswith(prefix.lower()))
    return names


def resolve(requested: list[str]) -> list[str]:
    """Оставить только те голоса, которые правда есть в каталоге."""
    available = set(catalogue())
    if requested:
        missing = [v for v in requested if v not in available]
        if missing:
            print(f"Нет в каталоге: {', '.join(missing)}", file=sys.stderr)
        picked = [v for v in requested if v in available]
    else:
        picked = [v for v in PREFERRED if v in available]
        if not picked:
            picked = sorted(v for v in available if v.startswith("ru_RU"))[:2]
    if not picked:
        sys.exit("Не нашлось ни одного подходящего голоса.")
    return picked


def synthesize(text_file: pathlib.Path, voice: str, voice_dir: pathlib.Path,
               out_dir: pathlib.Path, length_scale: float, silence: float) -> pathlib.Path:
    download_voice(voice, voice_dir)
    wav = out_dir / f"{text_file.stem}--{voice}.wav"
    subprocess.run(
        [
            sys.executable, "-m", "piper",
            "-m", str(voice_dir / f"{voice}.onnx"),
            "-i", str(text_file),
            "-f", str(wav),
            "--length-scale", str(length_scale),
            "--sentence-silence", str(silence),
        ],
        check=True,
    )
    return wav


def to_mp3(wav: pathlib.Path, bitrate: str) -> pathlib.Path | None:
    """Сжать в mp3, если есть ffmpeg. Голый WAV весит раз в десять больше."""
    if not shutil.which("ffmpeg"):
        print("ffmpeg не найден, оставляю WAV.", file=sys.stderr)
        return None
    mp3 = wav.with_suffix(".mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
         "-codec:a", "libmp3lame", "-b:a", bitrate, "-ac", "1", str(mp3)],
        check=True,
    )
    wav.unlink()
    return mp3


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("text", nargs="?", help="текстовый файл или каталог с .txt")
    ap.add_argument("--out", default="audio/out")
    ap.add_argument("--voices", default="", help="через запятую; пусто — выбрать самому")
    ap.add_argument("--voice-dir", default=".voices")
    ap.add_argument("--length-scale", type=float, default=1.0,
                    help="больше единицы — медленнее речь")
    ap.add_argument("--silence", type=float, default=0.35,
                    help="пауза между предложениями, секунды")
    ap.add_argument("--bitrate", default="64k")
    ap.add_argument("--list", metavar="ПРЕФИКС", help="показать голоса и выйти, например ru")
    args = ap.parse_args()

    if args.list:
        for name in list_voices(args.list):
            print(name)
        return

    if not args.text:
        ap.error("нужен текстовый файл (или --list)")

    target = pathlib.Path(args.text)
    texts = sorted(target.glob("*.txt")) if target.is_dir() else [target]
    if not texts:
        sys.exit(f"В {target} нет ни одного .txt")
    out_dir = pathlib.Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    voice_dir = pathlib.Path(args.voice_dir)
    voice_dir.mkdir(parents=True, exist_ok=True)

    requested = [v.strip() for v in args.voices.split(",") if v.strip()]
    for voice in resolve(requested):
        print(f"::group::{voice}")
        total = 0
        for text_file in texts:
            wav = synthesize(text_file, voice, voice_dir, out_dir,
                             args.length_scale, args.silence)
            final = to_mp3(wav, args.bitrate) or wav
            size = final.stat().st_size // 1024
            total += size
            print(f"{final.name} — {size} КиБ")
        print(f"итого {total // 1024} МиБ")
        print("::endgroup::")


if __name__ == "__main__":
    main()
