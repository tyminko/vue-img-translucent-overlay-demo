export default function (prefix) {
  const now = () => {
    const time = Date.now()
    let last = lastNow || time
    lastNow = time > last ? time : last + 1
    return lastNow
  }
  let lastNow = null
  return `${prefix}${Math.random().toString(36).substr(2)}${now().toString(36).substr(5)}`
}
