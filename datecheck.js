let possibles = []

for (var i = 0; i<=58; i++) {
  possibles.push(i+4)
}

let valids = []
possibles.forEach(function(date1) {
  possibles.forEach(function(date2) {
    if (date2 - date1 > 20) {
      if (date2 - date1 < 30) {
        if (date1 < 32) {
          if (date2 > 31) {
            valids.push([date1, date2])
          }
        }
      }
    }
  })
})

console.log(valids)
console.log(valids.length)
