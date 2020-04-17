export default (d: Document, tag: string, id: string, jsSrc: string, cb: Function) => {
  const element = d.getElementsByTagName(tag)[0];
  const fjs = element;
  let js = element;
  js = d.createElement(tag);
  js.id = id;
  (js as any).src = jsSrc;
  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs);
  } else {
    d.head.appendChild(js);
  }
  (js as any).onload = cb;
}