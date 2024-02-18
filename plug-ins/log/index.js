const base03 = '#002b36';
const base02 = '#073642';
const base01 = '#586e75';
const base00 = '#657b83';
const base0  = '#839496';
const base1  = '#93a1a1';
const base2  = '#eee8d5';
const base3  = '#fdf6e3';
const yellow = '#b58900';
const orange = '#cb4b16';
const red    = '#dc322f';
const magenta= '#d33682';
const violet = '#6c71c4';
const blue   = '#268bd2';
const cyan   = '#2aa198';
const green  = '#859900';

export function seq(str){
  // console.info('%c[SEQUENCE] %s', `background: ${base03}; color: ${blue}; border-radius: 2px; display: block; padding: 4px; margin: 0;`,  str);
}

export function log(str){
  // console.info('%c[LOG] %s', `background: ${base02}; color: ${green}; border-radius: 2px; display: block; padding: 4px; margin: 0;`,  str);
}

export function error(str){
  //console.error(str)
}
export function warn(str){
  //console.warn(str)

}
export function info(str){
  //console.info(str)

}
export function debug(str){
  //console.debug(str)

}
