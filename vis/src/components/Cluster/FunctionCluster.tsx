import { useState } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopy';
import { FunctionTypeCluster } from '../../types';

import './Cluster.scss';
import './FunctionalCluster.scss';
import { sortNames } from './utils';

type FnFoo = (aaa: string, bbb: number) => Promise<void>
type FnBar = (aaa: string, bbb: number) => Promise<void>

enum EnFoo { Ok, Fail }
enum EnBar { Ok, Fail }

type UnFoo = 'a' | 'b'
type UnBar = 'a' | 'b'

export function FunctionCluster({ type, files, parameters, returnType, names }: FunctionTypeCluster) {
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
  const propertiesMarkup = parameters.map(({ key, value }) => {
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
    function: 'Function Type Declaration',
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
        <span className="return-type mono">{returnType}</span>
      </div>
      <div className="properties">
        <h3>Parameters ({parameters.length})</h3>
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