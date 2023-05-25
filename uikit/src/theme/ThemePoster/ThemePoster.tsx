import React from 'react';
import { Box, Button, Container, Divider, Grid, Heading, Image, useThemeUI } from 'theme-ui';

const ColorsPoster = () => {
  const context = useThemeUI();
  const { theme, colorMode, setColorMode } = context;

  const markup = Object.entries(theme.colors).map(([name, value]) => <Box key={name} sx={{ height: 20, bg: value }}></Box>);
  return (
    <Grid columns={5}>
      {markup}
    </Grid>
  );
};

const ButtonsPoster = () => {
  const context = useThemeUI();
  const { theme } = context;

  const markup = Object.keys(theme.buttons).map(variant => <Button key={variant} variant={variant}>{variant}</Button>);
  return (
    <Grid columns={3}>
      {markup}
    </Grid>
  );
};


export const ThemePoster = () => {
  const context = useThemeUI();
  const { theme, colorMode, setColorMode } = context;
  return (
    <Container style={{ marginTop: '3em' }}>
      <Heading as='h1'>Theming Examples</Heading>

      <Heading as='h2'>
        Site
      </Heading>

      <Grid columns={3}>
        <Box>
          <Heading as='h1'>Heading 1</Heading>
          <Heading as='h2'>Heading 2</Heading>
          <Heading as='h3'>Heading 3</Heading>
          <Heading as='h4'>Heading 4</Heading>
          <Heading as='h5'>Heading 5</Heading>
          <p>
            Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies
            vehicula.
          </p>
        </Box>

        <Box>
          <Heading as='h2'>Example body text</Heading>
          <p>
            Nullam quis risus eget <a href='#'>urna mollis ornare</a> vel eu leo. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh
            ultricies vehicula.
          </p>
          <p>
            <small>This line of text is meant to be treated as fine print.</small>
          </p>
          <p>
            The following snippet of text is <strong>rendered as bold text</strong>.
          </p>
          <p>
            The following snippet of text is <em>rendered as italicized text</em>.
          </p>
          <p>
            An abbreviation of the word attribute is <abbr title='attribute'>attr</abbr>.
          </p>
        </Box>
        <ColorsPoster />
      </Grid>

      <Grid>
        <Heading>Buttons</Heading>
        <ButtonsPoster />
      </Grid>
    </Container >
  );
};

