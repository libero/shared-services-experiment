const express = require("express");
const router = express.Router();
const through = require("through");

const controller = require("../controller");

const db_connection = require("../database");

const make_composite_key = (a, b, c) => a + b + c;

router
  .route("/files/:namespace/:directory/:file")
  .get((req, res) => {
    const { namespace, directory, file } = req.params;

    const fdata = controller.getFile(namespace, `${directory}/${file}`);

    console.log(fdata);

    res.json({ ok: false });
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

    // req
    // .on("data", data => {
    // dataStream.write(data);
    // })
    // .on("end", () => {
    // dataStream.end();
    // console.log("ended");
    // });

    const streamData = {
      // TODO: We need to get this information from the incoming stream
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

    const result = await controller.uploadFile(db_connection, streamData, meta);

    res.json({ ok: true });
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
