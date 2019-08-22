const express = require("express");
const router = express.Router();
const busboy = require('connect-busboy');

const controller = require("../controller");

const db_connection = require("../database");

const make_composite_key = (a, b, c) => a + b + c;

router.use(busboy({immediate: true}));

router
  .route("/files/:namespace/:directory/:file")
  .get((req, res) => {
    const { namespace, directory, file } = req.params;
  })
  .put(async (req, res) => {
    const { namespace, directory, file } = req.params;
    const composite_key = make_composite_key(namespace, directory, file);
    // You get the stream from req.busboy
    // This is going to be challenging because the API for working with streams
    // is not nice! It's pretty horrible, maybe I need to find a different library

    const streamData = {
      // TODO: We need to get this information from the incoming stream
      stream: {},
      filename: "",
      mimetype: "",
      encoding: "",
    };

    const result = await controller.uploadFile({}, {});

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
      .append('Content-Type', data.mimetype)
      .append('Content-Length', data.size)
      .append('Libero-file-tags', 'a=b,c=d')
      .append('Link', `${data.sharedlink} rel=shared`)
      .append('Link', `${data.publiclink} rel=public`)
      .append('Last-Modified', data.updated)
    // Because you can't modify a file once it's PUT, we're using the file id as it's etag
      .append('Etag', data.id)
      .end();
  });

module.exports = router;
