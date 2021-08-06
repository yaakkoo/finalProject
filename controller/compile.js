const Problem = require('../model/problem')
const { c, cpp, js, python } = require('compile-run');
const { editStatus, editNum, addSubmit } = require('../helper/helper')
const User = require('../model/user')


exports.compile = async (req, res) => {
    try {

        const problem = await Problem.findOne({ code: req.body.p_code });
        if (!problem) {
            return res.status(404).json({
                msg: "no problem"
            })
        }

        accept = 0

        let input = problem.input
        let output = problem.output
        let code = req.body.code

        for (i = 0; i < input.length; i++) {
            let inp = ''
            inp = input[i].flat(Infinity).join('\n')
            if (req.body.lang == 'cpp') {
                accept = await cpp_comp(code, inp, output[i])
            } else if (req.body.lang == 'c') {
                accept = await c_comp(code, inp, output[i])
            } else if (req.body.lang == 'python') {
                accept = await python_comp(code, inp, output[i])
            } else if (req.body.lang == 'js') {
                accept = await js_comp(code, inp, output[i])
            }
        }

        await editNum(req.body.name)
        await addSubmit(req.body.name, req.body.p_code, req.body.code);

        let submit = await editStatus(req.body.p_code, req.body.name, accept, req.body.code)
        if (accept == 1) {

            return res.status(200).json({
                Status: 'Accepted',
                submit: submit
            })
        } else if (accept == 2) {

            return res.status(200).json({
                Status: 'Wrong answer',
                submit: submit
            })
        }
        else if (accept == 3) {
            return res.status(200).json({
                Status: 'Compilation Error',
                Submit: submit
            })
        }
        else {
            return res.status(404).json({
                mag: accept
            })
        }
    } catch (error) {
        res.status(404).json({
            Error: error.meesage
        })
    }
}

async function cpp_comp(code, inp, output) {
    let accept = 1
    await cpp.runSource(code, { stdin: inp })
        .then(
            r => {
                if (r.stdout != '') {
                    if (output != r.stdout) {
                        accept = 2

                    }
                } else if (r.stderr != '') {
                    accept = 3
                }
            }
        )
        .catch(err => {
            return err.message
        })
    return accept
}

async function python_comp(code, inp, output) {
    let accept = 1
    await python.runSource(code, { stdin: inp })
        .then(
            r => {
                if (r.stdout != '') {
                    if (output != r.stdout) {
                        accept = 2

                    }
                } else if (r.stderr != '') {
                    accept = 3
                }
            }
        )
        .catch(err => {
            return err.message
        })
    return accept
}

async function js_comp(code, inp, output) {
    let accept = 1
    await js.runSource(code, { stdin: inp })
        .then(
            r => {
                if (r.stdout != '') {
                    if (output != r.stdout) {
                        accept = 2

                    }
                } else if (r.stderr != '') {
                    accept = 3
                }
            }
        )
        .catch(err => {
            return err.message
        })
    return accept
}

async function c_comp(code, inp, output) {
    let accept = 1
    await c.runSource(code, { stdin: inp })
        .then(
            r => {
                if (r.stdout != '') {
                    if (output != r.stdout) {
                        accept = 2

                    }
                } else if (r.stderr != '') {
                    accept = 3
                }
            }
        )
        .catch(err => {
            return err.message
        })
    return accept
}