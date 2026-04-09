import { AbsoluteFill, Sequence } from 'remotion'
import { SCENES, TRANSITION_FRAMES } from '../constants/timing'
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

export const MainVideo = () => (
  <AbsoluteFill style={{ background: '#0a0f1a' }}>
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
  </AbsoluteFill>
)
