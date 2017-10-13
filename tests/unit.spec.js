const should = require('should')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')
const [ readFileAsync, writeFileAsync ] = [readFile, writeFile].map(f => promisify(f))
const { split, duplicate, countPages } = require("../")
const { join } = require('path')

const fixtures = join(__dirname, './data/')

describe('The "pdf" module: /lib/pdf', function () {

	it('should get correct 3 pages for multi page document', async function () {
		const doc = (await readFileAsync(`${fixtures}/multi.pdf`)).toString('base64')
		const pages = await countPages(doc)
		pages.should.equal(3)
	});

	it('should get correct 1 page for single page document', async function () {
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		const pages = await countPages(doc)
		pages.should.equal(1)
	});

	it('should split a three page document into 3 documents', async function () {
		const doc = (await readFileAsync(`${fixtures}/multi.pdf`)).toString('base64')
		const { pages } = await split(doc)
		pages.length.should.equal(3)
	});

	it('should split a one page document into 1 document', async function () {
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		const { pages } = await split(doc)
		pages.length.should.equal(1)
	});

	it('should duplicate a one page document twice and return a 3 page document', async function () {
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 2)
		pages = await countPages(document)
		pages.should.equal(3)
	});

	it('should duplicate a one page document once and return a 2 page document', async function () {
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 1)
		pages = await countPages(document)
		pages.should.equal(2)
	});

	it('should duplicate a one page document 0 times and return a 1 page document', async function () {
		const doc = (await readFileAsync(`${fixtures}/single.pdf`)).toString('base64')
		let pages = await countPages(doc)
		pages.should.equal(1)
		const { document } = await duplicate(doc, 0)
		pages = await countPages(document)
		pages.should.equal(1)
	});

});
