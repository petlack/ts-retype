import { TypeCluster } from "./types"

import './Cluster.css';

export function Cluster({ name, group, files, properties, names }: TypeCluster) {
  const namesMarkup = Object.entries(names).sort((a, b) => b[1] - a[1]).map(([name, freq]) => (
    <span key={name} className="name-freq">{name} ({freq}x)</span>
  ))
  const propertiesMarkup = properties.map(({ key, value }) => (
    <span key={key}>
      <span className="property key">{key}</span>
      <span>: </span>
      <span className="property value">{value}</span>
      <br />
    </span>
  ))
  const filesMarkup = files.map(({ file, pos }) => `${file} (${pos[0]} - ${pos[1]})`).join('\n')
  return (
    <div className="cluster">
      <div className="names">
        <h3>Names ({namesMarkup.length})</h3>
        <div className="pre">
          {namesMarkup}
        </div>
      </div>
      <div className="properties">
        <h3>Properties ({properties.length})</h3>
        <div className="pre">
          {propertiesMarkup}
        </div>
      </div>
      <div className="files">
        <h3>Files ({files.length})</h3>
        <pre>
          {filesMarkup}
        </pre>
      </div>
    </div>
  )
}