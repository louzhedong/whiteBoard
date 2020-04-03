export default function mounted(options) {
  options.mounted &&
    typeof options.mounted === 'function' &&
    options.mounted();
}