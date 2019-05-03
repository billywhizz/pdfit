const { createReader, createWriterToModify, PDFPageModifier } = require('hummus')
const { PDFWStreamForFile, PDFRStreamForFile } = require('./')
const { join } = require('path')

async function addText(fname, tname) {
	// const stream = new PDFRStreamForFile(fname)
	// const pdfReader = createReader(stream)
	// const pageCount = pdfReader.getPagesCount()
	const pdfWriter = createWriterToModify(new PDFRStreamForFile(fname), new PDFWStreamForFile(tname))
	let page = 0
	const font = pdfWriter.getFontForFile(join(__dirname, '/tests/data/arial.ttf'))
	const opts = {
		font,
		size: 20,
		colorspace: 'gray',
		color: 0x00
	}
	while (page < 10) {
		const pageModifier = new PDFPageModifier(pdfWriter, page)
		pageModifier.startContext().getContext().writeText(`Page: ${page}`, 10, 600, opts)
		pageModifier.endContext().writePage()
		page++
	}
	pdfWriter.end()
}

addText(process.argv[2], process.argv[3]).catch(err => console.error(err))