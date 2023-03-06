import { TypeCluster } from './types'

import './Cluster.css';
import { useCopyToClipboard } from './hooks/useCopy';

export function Cluster({ name, files, properties, names }: TypeCluster) {
  const [_copyValue, copyToClipboard] = useCopyToClipboard();

  const namesMarkup = Object.entries(names).sort((a, b) => b[1] - a[1]).map(([name, freq]) => (
    <span key={name} className="name-freq mono">{name} ({freq}x)</span>
  ))

  const alsoKnownMarkup = (
    namesMarkup.length > 1 ? (
      <>
        <span>Also known as</span>
        {namesMarkup}
      </>
    ) : <></>
  );
  const propertiesMarkup = properties.map(({ key, value }) => (
    <span key={key}>
      <span className="property key">{key}</span>
      <span>: </span>
      <span className="property value">{value}</span>
      <br />
    </span>
  ))
  const filesMarkup = files.map(({ file, lines }) => (
    <span
      key={`${file}${lines}`}
      className="file"
      onClick={() => copyToClipboard(`${file}:${lines[0]}`)}
    >{file} ({lines[0]} - {lines[1]})</span>
  ))
  return (
    <div className="cluster">
      <div className="title">
        <span>{'{}'}</span>
        <h2 className="mono">{name}</h2>
        <div className="row">
          {alsoKnownMarkup}
        </div>
      </div>
      <div className="properties">
        <h3>Type properties ({properties.length})</h3>
        <div className="pre mono">
          {propertiesMarkup}
        </div>
      </div>
      <div className="files">
        <h3>Found in {files.length} files</h3>
        <pre>
          {filesMarkup}
        </pre>
      </div>
    </div>
  )
}