export function intersection(a,b){
  const response = new Set();
  for (const item of a) {
    if(b.has(item)) response.add(item)
  }
  return response;
}
export function difference(a,b){
  const response = new Set();
  for (const item of a) {
    if(!b.has(item)) response.add(item)
  }
  return response;
}

export default {intersection, difference};
