const should = require('should') // eslint-disable-line no-unused-vars
const { promisify } = require('util')
const { split, duplicate, countPages, info } = require('../')
const { readFile } = require('fs')
const { join } = require('path')

const readFileAsync = promisify(readFile)

const fixtures = join(__dirname, './data/')


describe('The "pdf" module: /lib/pdf', () => { // eslint-disable-line no-undef

	it('should get correct 3 pages for multi page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/multi.pdf`)).toString('base64')
		const pages = await countPages(doc)
		pages.should.equal(3)
	})

	it('should get correct 1 page for single page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		const pages = await countPages(doc)
		pages.should.equal(1)
	})

	it('should split a three page document into 3 documents', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/multi.pdf`)).toString('base64')
		const { pages } = await split(doc)
		pages.length.should.equal(3)
	})

	it('should split a one page document into 1 document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		const { pages } = await split(doc)
		pages.length.should.equal(1)
	})

	it('should duplicate a one page document twice and return a 3 page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 2)
		pages = await countPages(document)
		pages.should.equal(3)
	})

	it('should duplicate a one page document once and return a 2 page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 1)
		pages = await countPages(document)
		pages.should.equal(2)
	})

	it('should duplicate a one page document 0 times and return a 1 page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 0)
		pages = await countPages(document)
		pages.should.equal(1)
	})

	it('should get correct info for 1 page document', async () => { // eslint-disable-line no-undef
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		const pdfInfo = await info(doc)
		pdfInfo.should.have.properties(['pageCount', 'level', 'trailer', 'objects', 'encrypted', 'pages'])
		pdfInfo.pageCount.should.equal(1)
		pdfInfo.level.should.equal(1.4)
		pdfInfo.objects.should.equal(98)
		pdfInfo.encrypted.should.equal(false)
		pdfInfo.pages.should.be.Array()
		pdfInfo.pages.length.should.equal(1)
		for (const page of pdfInfo.pages) {
			page.should.have.properties(['media', 'crop', 'trim', 'bleed', 'art', 'rotation', 'keys'])
			page.rotation.should.equal(0)
			page.media.should.be.eql([0, 0, 612, 792])
		}
	})

})
