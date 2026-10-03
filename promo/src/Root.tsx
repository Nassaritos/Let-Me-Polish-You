import React from "react";
import { Composition } from "remotion";
import { FPS, T, TN } from "./theme";
import { LaunchVideo } from "./Video";
import { NetworkVideo } from "./NetworkVideo";

export const Root: React.FC = () => (
  <>
    {/* Primary: Reels / TikTok / Shorts */}
    <Composition id="LaunchVertical" component={LaunchVideo} durationInFrames={T.total} fps={FPS} width={1080} height={1920} />
    {/* Same cut without the song (SFX only) — for adding a trending sound in-app */}
    <Composition id="LaunchVerticalNoMusic" component={LaunchVideo} defaultProps={{ withMusic: false }} durationInFrames={T.total} fps={FPS} width={1080} height={1920} />
    {/* Prepared variants — layouts scale from the short side (see useLayout); review before posting */}
    <Composition id="LaunchSquare" component={LaunchVideo} durationInFrames={T.total} fps={FPS} width={1080} height={1080} />
    <Composition id="LaunchLandscape" component={LaunchVideo} durationInFrames={T.total} fps={FPS} width={1920} height={1080} />
    {/* Internal: AIESEC network launch for the MC page (storyboard-network.md) */}
    <Composition id="NetworkVertical" component={NetworkVideo} durationInFrames={TN.total} fps={FPS} width={1080} height={1920} />
  </>
);
