import { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopy';
import { TypeCluster } from '../types';

import './Cluster.scss';

export function Cluster({ name, type, files, properties, names }: TypeCluster) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const sortedNames = Object.entries(names).sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    } else if (a[1] > b[1]) {
      return -1;
    } else {
      if (a[0] < b[0]) {
        return -1;
      } else if (a[0] > b[0]) {
        return 1;
      } else {
        return 0;
      }
    }
  });
  const namesMarkup = sortedNames.slice(1).map(([name, freq]) => (
    <span key={name} className="name-freq mono">{name} ({freq}x)</span>
  ));

  const alsoKnownMarkup = (
    namesMarkup.length > 0 ? (
      <>
        <span>Also known as</span>
        {namesMarkup}
      </>
    ) : <></>
  );
  const propertiesMarkup = properties.map(({ key, value }) => {
    return (
      <span key={key}>
        <span className="property key">
          {['string', 'number', 'symbol', 'boolean'].includes(key) ? `[key: ${key}]` : key}
        </span>
        <span>: </span>
        <span className="property value">{value}</span>
        <br />
      </span>
    );
  });
  const filesMarkup = files.map(({ file, lines }) => (
    <span
      key={`${file}${lines}`}
      className="file"
      onClick={() => copyToClipboard(`${file}:${lines[0]}`)}
    >{file} ({lines[0]} - {lines[1]})</span>
  ));
  const tooltipContent = {
    literal: 'Literal Type Declaration',
    alias: 'Type Alias Declaration',
    interface: 'Interface Declaration',
  }[type];
  return (
    <div className="cluster">
      <div className="title">
        <span
          className="mono"
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >{`{${type[0].toUpperCase()}}`}</span>
        <h2 className="mono">{namesMarkup.length > 0 ? `${sortedNames[0][0]} (${sortedNames[0][1]}x)` : sortedNames[0][0]}</h2>
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
      <span className={`tooltip ${isTooltipVisible ? 'visible' : ''}`}>{tooltipContent}</span>
    </div>
  )
}