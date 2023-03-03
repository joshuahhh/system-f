export const SystemF: {
  top: (code: string) => Message[];
};

export type Message = {
  ty: 'out' | 'error';
  loc: [] | [[startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number]];
  msg: string;
}
