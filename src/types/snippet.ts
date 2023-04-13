export type Token =
  | {
      type: 'element';
      tagName: string;
      properties: { className: string[] };
      children: { type: string; value: string }[];
      value?: undefined;
    }
  | {
      type: 'text';
      value: string;
      tagName?: undefined;
      properties?: { className: string[] };
      children?: undefined;
    }
  | {
      type: 'newline';
      value?: string;
      tagName?: undefined;
      properties?: { className: string[] };
      children?: undefined;
    };

export type Snippet = {
  name: string;
  lang: string;
  code: {
    type: string;
    children: Token[];
  };
};
