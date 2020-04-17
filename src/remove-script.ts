export default (d: Document, id: string) => {
  const element = d.getElementById(id);
  element?.parentNode?.removeChild(element);
}