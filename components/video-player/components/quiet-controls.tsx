"use client";

import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  SpeakerHighIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react";

import { useEffect } from "react";
import { MuteControl } from "@/components/limeplay/mute-control";
import { PlaybackControl } from "@/components/limeplay/playback-control";
import { useMediaStore } from "@/hooks/limeplay/use-media";
import { usePlaybackStore } from "@/hooks/limeplay/use-playback";
import { useVolumeStore } from "@/hooks/limeplay/use-volume";

const controlClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-cream hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream";

export function QuietControls({ loop = false }: { loop?: boolean }) {
  const status = usePlaybackStore((state) => state.status);
  const muted = useVolumeStore((state) => state.muted);
  const media = useMediaStore((state) => state.mediaElement);

  // Shaka's attach step clears the video loop flag. Put it back when the
  // hero asked for a loop, including after the element reloads.
  useEffect(() => {
    if (!media || !loop) return;
    const apply = () => {
      media.loop = true;
    };
    apply();
    media.addEventListener("loadedmetadata", apply);
    media.addEventListener("play", apply);
    return () => {
      media.removeEventListener("loadedmetadata", apply);
      media.removeEventListener("play", apply);
    };
  }, [loop, media]);

  return (
    <div className="absolute bottom-3 left-3 z-30 flex gap-2">
      <PlaybackControl asChild>
        <button type="button" className={controlClass}>
          {status === "playing" ? (
            <PauseIcon weight="fill" className="size-4" aria-hidden="true" />
          ) : status === "ended" ? (
            <RepeatIcon className="size-4" aria-hidden="true" />
          ) : status === "buffering" || status === "loading" ? (
            <CircleNotchIcon className="size-4 animate-spin" weight="bold" aria-hidden="true" />
          ) : (
            <PlayIcon weight="fill" className="size-4" aria-hidden="true" />
          )}
        </button>
      </PlaybackControl>
      <MuteControl asChild>
        <button type="button" className={controlClass}>
          {muted ? (
            <SpeakerXIcon weight="fill" className="size-4" aria-hidden="true" />
          ) : (
            <SpeakerHighIcon weight="fill" className="size-4" aria-hidden="true" />
          )}
        </button>
      </MuteControl>
    </div>
  );
}
