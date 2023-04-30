import { FC, ReactNode } from 'react';
import chroma from 'chroma-js';
import { useTheme } from './theme/useTheme';
import { ColorScale } from './types/theme';
import { Layouts } from './Layouts';
import { Palettes } from './Palettes';
import './Page.scss';

function getTextColor(bg: string, white: string, black: string) {
  if (bg === 'currentColor') {
    return 'currentColor';
  }
  if (bg === 'transparent') {
    return black;
  }
  const MIN_CONTRAST_RATIO = 7;
  const contrastWithBlack = chroma.contrast(bg, black);
  if (contrastWithBlack >= MIN_CONTRAST_RATIO) {
    return black;
  }
  return white;
}

const Card: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>{children}</div>
);

function Tile({ name, color, prefix }: { name: string, prefix: string, color: string }) {
  return (
    <div
      className="color-scale-color mono"
      style={{
        display: 'grid',
        gridTemplateColumns: '18ch 1fr',
        gap: 'var(--space-2)',
        padding: 'var(--space-2)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--font-weight-semibold)',
        backgroundColor: color.toString(),
        color: getTextColor(color, 'white', 'black'),
      }}
    >
      <span>{prefix}{name}</span>
      <span>{color}</span>
    </div>
  );
}

function Scale({ scale, prefix, name }: { scale: ColorScale, prefix: string, name: string }) {
  if (!scale) {
    return <div>Empty</div>;
  }
  return (
    <div className="color-scale">
      <h2>{name}</h2>
      <Card>
        {
          Object.entries(scale).map(([step, value]) => (
            <Tile key={step} color={value as string} prefix={`${prefix}${name}-`} name={step} />
          ))
        }
      </Card>
    </div>
  );
}

export function Page() {
  const { theme } = useTheme();

  return (
    <main>
      <section>
        <Palettes />
      </section>
      <section>
        <Layouts />
      </section>
      <section>
        <h1>Colors</h1>
        {
          Object.entries(theme.colors)
            .filter(([, color]) => typeof color === 'string')
            .map(([name, color]) => (
              <div key={name} className="color-scale">
                <h2>{name}</h2>
                <Card>
                  <Tile color={color as string} prefix={'--clr-'} name={name} />
                </Card>
              </div>
            ))
        }
      </section>
      <section>
        <h1>Scales</h1>
        {
          Object.entries(theme.colors)
            .filter(([, scale]) => typeof scale !== 'string')
            .map(([name, scale]) => (
              <Scale key={name} scale={scale as ColorScale} prefix={'--clr-'} name={name} />
            ))
        }
        <pre>
          {JSON.stringify(theme, null, 2)}
        </pre>
      </section>
    </main>
  );
}