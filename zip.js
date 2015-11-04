// reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT

var localHeaderA = new Uint8Array([
	0x50, 0x4b, 0x03, 0x04, // local file header signature
	0x00, 0x00, // version needed to extract
	0x00, 0x00, // general purpose bit flag
	0x00, 0x00, // compression method
	0x00, 0x00, // last mod file time
	0x00, 0x00, // last mod file date
	0x00, 0x00, 0x00, 0x00, // crc-32
	0x00, 0x00, 0x00, 0x00, // compressed size
	0x00, 0x00, 0x00, 0x00, // uncompressed size
	0x00, 0x00, // file name length
	0x00, 0x00, // extra field length
]);

var centralHeaderA = new Uint8Array([
	0x50, 0x4b, 0x01, 0x02, // central file header signature
	0x3f, 0x00, // version made by (spec version 6.3, MS-DOS)
	0x0a, 0x00, // version needed to extract (version 1.0)
	0x00, 0x00, // general purpose bit flag
	0x00, 0x00, // compression method (stored)
	0x00, 0x00, // last mod file time (00:00:00)
	0x00, 0x21, // last mod file date (1980/01/01)
	0x00, 0x00, 0x00, 0x00, // crc-32
]);

var centralHeaderB = new Uint8Array([
	0x00, 0x00, // extra field length
	0x00, 0x00, // file comment length
	0x00, 0x00, // disk number start
	0x00, 0x00, // internal file attributes
	0x00, 0x00, 0x00, 0x00, // external file attributes // 0x20, 0x00, 0x00, 0x00,
]);

var endRecordA = new Uint8Array([
	0x50, 0x4b, 0x05, 0x06, // end of central dir signature
	0x00, 0x00, // number of this disk
	0x00, 0x00, // number of the disk with the start of the central directory
	0x00, 0x00, // total number of entries in the central directory on this disk
	0x00, 0x00, // total number of entries in the central directory
	0x00, 0x00, 0x00, 0x00, // size of the central directory
]);

var endRecordB = new Uint8Array([
	0x00, 0x00, // .ZIP file comment length
]);

function encodeLong(v) {
	var ab = new ArrayBuffer(4);
	new DataView(ab).setUint32(0, v, true);
	return ab;
}

function encodeShort(v) {
	var ab = new ArrayBuffer(2);
	new DataView(ab).setUint16(0, v, true);
	return ab;
}

function zip(type, entries) {
	var local = [];
	var central = [];
	var position = 0;
	for (var entry of entries) {
		var size = encodeLong(entry.data.length);
		local.push(localHeaderA, entry.data);
		central.push(centralHeaderA, size, size, encodeShort(entry.name.length), centralHeaderB, encodeLong(position), entry.name);
		position += localHeaderA.byteLength + entry.data.length;
	}
	var end = [endRecordA, encodeLong(position), endRecordB];
	return new Blob([].concat(local, central, end), {type: type});
}
