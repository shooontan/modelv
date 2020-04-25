function encode(text: string) {
  return window.btoa(text);
}

function decode(text: string) {
  return window.atob(text);
}

export const aikotoba = {
  encode,
  decode,
};
