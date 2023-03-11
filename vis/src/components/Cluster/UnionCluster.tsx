import { useState } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { UnionTypeCluster } from '../../types';

import './Cluster.scss';
import { sortNames } from './utils';

export function UnionCluster({ type, files, types, names }: UnionTypeCluster) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const sortedNames = sortNames(names);
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
  const propertiesMarkup = types.map(value => {
    return (
      <span key={value}>
        <span className="property value">{value}</span>
        <br />
      </span>
    );
  });
  const filesMarkup = files.map(({ type, file, lines }) => (
    <span
      key={`${file}${lines}`}
      className="file"
      onClick={() => copyToClipboard(`${file}:${lines[0]}`)}
    >{'{'}{type[0].toUpperCase()}{'}'} {file} ({lines[0]} - {lines[1]})</span>
  ));
  const tooltipContent = {
    union: 'Union Type Declaration',
  }[type];
  return (
    <div className="cluster">
      <div className="title">
        <span
          className="candidate-type mono"
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >{`{${type[0].toUpperCase()}}`}</span>
        <h2 className="mono">{namesMarkup.length > 0 ? `${sortedNames[0][0]} (${sortedNames[0][1]}x)` : sortedNames[0][0]}</h2>
        <div className="row">
          {alsoKnownMarkup}
        </div>
      </div>
      <div className="properties">
        <h3>Members ({types.length})</h3>
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
  );
}