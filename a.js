const { c, cpp, node , python } = require('compile-run');
function p(code, inp, output="yes") {
    let accept = 1
    python.runSource(code, { stdin: inp })
        .then(
            r => {
                if (r.stdout !== '') {
                    if (output !== r.stdout) {
                        accept = 2

                    }
                } else if (r.stderr !== '') {
                    accept = 3
                    console.log(r.stderr);
                }
            }
        )
        .catch(err => {
            return err.message
        })
    return accept
}
let t = 'print("yes");'
console.log(p(t));