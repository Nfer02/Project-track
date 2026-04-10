import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion'
import { SCENES, TRANSITION_FRAMES } from '../constants/timing'
import { useFonts } from '../hooks/useFonts'
import { Scene01Hook }      from '../scenes/Scene01Hook'
import { Scene02Problem }   from '../scenes/Scene02Problem'
import { Scene03Twist }     from '../scenes/Scene03Twist'
import { Scene04OCR }       from '../scenes/Scene04OCR'
import { Scene05Dashboard } from '../scenes/Scene05Dashboard'
import { Scene06Export }    from '../scenes/Scene06Export'
import { Scene07Pricing }   from '../scenes/Scene07Pricing'
import { Scene08CTA }       from '../scenes/Scene08CTA'

// Helper: duración de una escena
const dur = (scene: keyof typeof SCENES) =>
  SCENES[scene].end - SCENES[scene].start + TRANSITION_FRAMES

// Narration starts 8 frames (~0.27s) into each scene — tight sync
const NARR_DELAY = 8

export const MainVideo = () => {
  useFonts()
  return (
    <AbsoluteFill style={{ background: '#0a0f1a' }}>
      {/* Background music — full video, low volume */}
      <Audio
        src={staticFile('audio/bg_music.mp3')}
        volume={0.12}
        loop
      />

      {/* Visual scenes */}
      <Sequence from={SCENES.hook.start}      durationInFrames={dur('hook')}>
        <Scene01Hook />
      </Sequence>
      <Sequence from={SCENES.problem.start}   durationInFrames={dur('problem')}>
        <Scene02Problem />
      </Sequence>
      <Sequence from={SCENES.twist.start}     durationInFrames={dur('twist')}>
        <Scene03Twist />
      </Sequence>
      <Sequence from={SCENES.ocr.start}       durationInFrames={dur('ocr')}>
        <Scene04OCR />
      </Sequence>
      <Sequence from={SCENES.dashboard.start} durationInFrames={dur('dashboard')}>
        <Scene05Dashboard />
      </Sequence>
      <Sequence from={SCENES.export.start}    durationInFrames={dur('export')}>
        <Scene06Export />
      </Sequence>
      <Sequence from={SCENES.pricing.start}   durationInFrames={dur('pricing')}>
        <Scene07Pricing />
      </Sequence>
      <Sequence from={SCENES.cta.start}       durationInFrames={dur('cta')}>
        <Scene08CTA />
      </Sequence>

      {/* Narration tracks — positioned at scene start + small delay */}
      <Sequence from={SCENES.hook.start + NARR_DELAY}      durationInFrames={dur('hook')}>
        <Audio src={staticFile('audio/narr_01_hook.mp3')}     volume={1} />
      </Sequence>
      <Sequence from={SCENES.problem.start + NARR_DELAY}   durationInFrames={dur('problem')}>
        <Audio src={staticFile('audio/narr_02_problem.mp3')} volume={1} />
      </Sequence>
      <Sequence from={SCENES.twist.start + NARR_DELAY}     durationInFrames={dur('twist')}>
        <Audio src={staticFile('audio/narr_03_twist.mp3')}  volume={1} />
      </Sequence>
      <Sequence from={SCENES.ocr.start + NARR_DELAY}       durationInFrames={dur('ocr')}>
        <Audio src={staticFile('audio/narr_04_ocr.mp3')}    volume={1} />
      </Sequence>
      <Sequence from={SCENES.dashboard.start + NARR_DELAY} durationInFrames={dur('dashboard')}>
        <Audio src={staticFile('audio/narr_05_dashboard.mp3')} volume={1} />
      </Sequence>
      <Sequence from={SCENES.export.start + NARR_DELAY}    durationInFrames={dur('export')}>
        <Audio src={staticFile('audio/narr_06_export.mp3')} volume={1} />
      </Sequence>
      <Sequence from={SCENES.pricing.start + NARR_DELAY}   durationInFrames={dur('pricing')}>
        <Audio src={staticFile('audio/narr_07_pricing.mp3')} volume={1} />
      </Sequence>
      <Sequence from={SCENES.cta.start + NARR_DELAY}       durationInFrames={dur('cta')}>
        <Audio src={staticFile('audio/narr_08_cta.mp3')}   volume={1} />
      </Sequence>
    </AbsoluteFill>
  )
}
