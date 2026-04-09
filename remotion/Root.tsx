import { Composition } from 'remotion'
import { MainVideo } from './compositions/MainVideo'

export const Root = () => (
  <Composition
    id="MainVideo"
    component={MainVideo}
    durationInFrames={2250}
    fps={30}
    width={1920}
    height={1080}
  />
)
