Here's some code for generating zip files.

It doesn't actually compress; it just stores.
And it's not entirely compliant with the spec.
There's just barely enough functionality to make it able to work with Firefox.
Like, the local file headers and the end of central dir signature are almost entirely blank.

You give it some data and filenames.
You get a Blob.

    zip(type, entries)

- `type` is the MIME type of the Blob.
- `entries` is an array of objects with the following properties:
  - `name` is the filename of the entry.
  - `data` is the data of the entry.

You have to give names and data as some value `v` such that `v.length` is the byte-length of however the Blob constructor would serialize `v`.
That means you can pass ASCII strings and Uint8Arrays.
