const { readFile } = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(readFile)

async function parse(path = './test.pdf') {
	const pdf = await readFileAsync(path)
	let index = 0
	const lineBuffer = new Buffer(255)
	let bIndex = 0
	const lines = []
	while (index < pdf.length) {
		const b = pdf[index]
		if (b === 10) {

		} else if (b === 13) {
			lines.push(Buffer.from(lineBuffer.slice(0, bIndex)))
			bIndex = 0
		} else {
			lineBuffer[bIndex] = b
		}
		bIndex++
		index++
	}
	console.log(lines.length)
	const header = lines[0].toString()
	const match = header.match(/%PDF-(\d+)\.(\d+)/)
	const [, major, minor] = match
	const startxref = lines[lines.length - 2].toString()
	const xrefOffset = parseInt(startxref.match(/%x(\d+)/)[1], 16)
	console.dir ({ major, minor, xrefOffset })
	for (const line of lines) {
		const bytes = Array.prototype.slice.call(line.slice(0, 100)).map(c => String.fromCharCode(c))
		console.log(`${[...bytes]}`)
	}
	//console.dir(lines.slice(lines.length -3).map(l => l.toString()))
}

parse(process.argv[2]).catch(err => console.error(err))
