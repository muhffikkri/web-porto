import { SCENES } from '../../data/scenes'
import { SceneTitle } from '../ui/SceneTitle'
import { FloatPanel } from '../ui/FloatPanel'
import { ABOUT } from '../../data/profile'

const Z = SCENES[1].z

export function AboutScene() {
  return (
    <section className="panel panel--wide" aria-labelledby="about-heading">
      <div className="panel-center">
        <SceneTitle title="ABOUT" index="01" id="about-heading" />
        <p className="scene-lede">
          Machine Learning Engineer working on clinical signal processing and spatiotemporal
          forecasting. I build models that hold up outside the notebook.
        </p>
      </div>

      {ABOUT.map((field) => (
        <FloatPanel
          key={field.label}
          sceneZ={Z}
          offsetZ={field.offsetZ}
          side={field.side}
          y={field.y}
        >
          <dl className="about-field">
            <dt>{field.label}</dt>
            <dd>
              <span className="about-value">{field.value}</span>
              <span className="about-note">{field.note}</span>
            </dd>
          </dl>
        </FloatPanel>
      ))}
    </section>
  )
}