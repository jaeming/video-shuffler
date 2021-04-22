export function shuffle(a) {
  var i = a.length, temp, r;
  while (0 !== i) {
    r = Math.floor(Math.random()*i)
    i -= 1
    temp = a[i]
    a[i] = a[r]
    a[r] = temp
  }
  return a
}