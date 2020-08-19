// file.io
const express = require('express')
  , r = express.Router();
const Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

/**
 * This is an protected route
 * @route POST /api/fileio/upload
 * @consumes multipart/form-data
 * @param {file} fileio.formData.required - upload file
 * @group File - File Handling
 * @returns {Error}  default - Unexpected error
 */
r.post('/fileio/upload', function(req, res) {

  var saveTo = '';
  var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var uploadFolder = __dirname + '/../uploads/'; 
      saveTo = path.join(uploadFolder, filename);
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { 'Connection': 'close' });
      res.end(`Uploaded: ${saveTo}`);
    });
    return req.pipe(busboy);

});

module.exports = r;