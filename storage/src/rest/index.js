const express = require("express");
const router = express.Router();
const through = require("through");

const controller = require("../controller");

const db_connection = require("../database");

const make_composite_key = (a, b, c) => a + b + c;

router
  .route("/files/:namespace/:directory/:file")
  .get( async (req, res) => {
    const { namespace, directory, file } = req.params;

    const {file: fdata, meta }= await controller.getFile(db_connection, namespace, `${directory}/${file}`);

    res
      .status(200)
      .append("Content-Type", meta.mimetype)
      .append("Content-Length", meta.size)
      .append("Libero-file-tags", "a=b,c=d")
      .append("Libero-file-id", meta.id)
      .append("Link", `${meta.sharedlink} rel=shared`)
      .append("Link", `${meta.publiclink} rel=public`)
      .append("Last-Modified", meta.updated)
      // Because you can't modify a file once it's PUT, we're using the file id as it's etag
      .append("Etag", meta.id)
      .send(fdata);


  })
  .put(async (req, res) => {
    const { namespace, directory, file } = req.params;
    const composite_key = make_composite_key(namespace, directory, file);
    const key = `${directory}/${file}`;

    const dataStream = through(
      function write(data) {
        this.queue(data);
      },
      function end() {
        this.queue(null);
      }
    );

    const streamData = {
      // The `req` object can be used as a stream
      stream: req,
      filename: key,
      mimetype: req.headers['content-type'],
      encoding: 'utf8',
    };

    const meta = {
      key,
      filename: key,
      mimeType: req.headers['content-type'],
      size:100,
      tags: [],
      namespace
    };

    const result = await controller.uploadFile(db_connection, streamData, meta).then(() => true).catch(() => false);

    res.json({ ok: result });
  })
  .head(async (req, res) => {
    const { namespace, directory, file } = req.params;
    const composite_key = make_composite_key(namespace, directory, file);

    const data = await controller
      .getFileMeta(db_connection, composite_key)
      .catch(() => ({ ok: false }));

    res
      .status(200)
      .append("Content-Type", data.mimetype)
      .append("Content-Length", data.size)
      .append("Libero-file-tags", "a=b,c=d")
      .append("Link", `${data.sharedlink} rel=shared`)
      .append("Link", `${data.publiclink} rel=public`)
      .append("Last-Modified", data.updated)
      // Because you can't modify a file once it's PUT, we're using the file id as it's etag
      .append("Etag", data.id)
      .end();
  });

module.exports = router;
