export type TokenRoot = {
  type: 'root';
  children: Token[];
};

export type TokenElement = {
  type: 'element';
  children: Token[];
  properties?: { className: string[] };
  tagName?: string;
  value?: undefined;
};

export type TokenText = {
  type: 'text';
  children?: Token[];
  value: string;
  properties?: { className: string[] };
  tagName?: undefined;
};

export type TokenNewline = {
  type: 'newline';
  children?: undefined;
  properties?: { className: string[] };
  tagName?: undefined;
  value?: string;
};

export type Token = TokenElement | TokenText | TokenNewline;

export type Snippet = {
  name: string;
  lang: string;
  code: TokenRoot;
};
