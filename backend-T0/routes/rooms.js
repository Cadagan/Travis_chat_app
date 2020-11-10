require('dotenv').config();
const url = require('url');
var express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
var router = express.Router();

var accessKeyId = process.env.accessKeyId;
var secretAccessKey = process.env.secretAccessKey;
var bucket_used = process.env.s3_bucket;
const execSync = require('child_process').execSync;

const LOCAL = true;

if (!LOCAL) {
  var myIp = execSync(
    'curl http://169.254.169.254/latest/meta-data/public-hostname',
    {encoding: 'utf-8'},
  );
}

const {client} = require('../database');

// Cita: https://codeytek.com/course/upload-files-images-on-amazon-web-services-course/upload-files-images-on-amazon-web-services-content/file-uploads-on-amazon-web-services-aws-multer-s3-node-js-react-js-express-aws-sdk/
// To storage all the images for the arqui chat of group 21
var s3 = new aws.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  Bucket: bucket_used,
});

// Para subir una imagen
var chatImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'chat-grupo-21',
    acl: 'public-read',
    key: function(req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname),
      );
    },
  }),
  limits: {fileSize: 2000000}, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('chatImage');

// Para checkear que solo sea del tipo imagen que queremos
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only for the chat!');
  }
}
/** Para subir
 * @route POST /rooms/chat-img-upload
 * @desc Upload post image
 * @access public
 */
router.post('/:roomid/chat-img-upload', (req, res) => {
  chatImgUpload(req, res, error => {
    // console.log( 'requestOkokok', req.file );
    // console.log( 'error', error );
    res.append('CurrentInstance', myIp);
    if (error) {
      console.log('errors', error);
      res.json({error: error});
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log('Error: No File Selected!');
        res.json('Error: No File Selected');
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location; // Save the file name into database into chat model
        insertImageToDatabase(imageLocation, req.params.roomid).then(result => {
          //If it worked we send it immediately
          res.json({
            image: imageName,
            location: imageLocation,
          });
        });
      }
    }
  });
});

router.get('/:roomid/image', function(req, res, next) {
  let room_id = req.params.roomid;
  res.append('CurrentInstance', myIp);
  const query = {
    text: 'SELECT room_image FROM rooms WHERE id=$1',
    values: [room_id],
  };
  client.query(query, (err, queryRes) => {
    if (err) {
      console.log('Error doing image getting query.');
      const data = {
        roomImage:
          'https://www.elcomercio.com/files/article_main/uploads/2016/10/28/5813ffd918991.jpeg',
      };
      res.status(200).send(JSON.stringify(data));
    } else {
      if (queryRes.rows.length > 0) {
        const data = {roomImage: queryRes.rows[0].room_image};
        res.status(200).send(JSON.stringify(data));
      } else {
        console.log("Couldn't find a single room by that id.");
        const data = {
          roomImage:
            'https://www.elcomercio.com/files/article_main/uploads/2016/10/28/5813ffd918991.jpeg',
        };
        res.status(200).send(JSON.stringify(data));
      }
    }
  });
});

router.post('/join', function(req, res, next) {
  let id = req.body.roomid;
  let password = req.body.password;
  res.append('CurrentInstance', myIp);
  const query = {
    text: 'SELECT password, private FROM rooms WHERE id=$1',
    values: [id],
  };
  client.query(query, (err, queryRes) => {
    if (err) {
      console.log('No room id.');
      const data = {
        passwordCorrect: 'False',
      };
      res.status(200).send(JSON.stringify(data));
    } else {
      if (!queryRes.rows[0].private || password == queryRes.rows[0].password) {
        const data = {passwordCorrect: 'true'};
        res.status(200).send(JSON.stringify(data));
      } else {
        console.log('Wrong password or no room id');
        const data = {passwordCorrect: 'false'};
        res.status(200).send(JSON.stringify(data));
      }
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.append('CurrentInstance', myIp);
  const rooms = [];
  const query = {
    // give the query a unique name
    name: 'fetch-user',
    text: 'SELECT name,id, private FROM rooms',
  };

  client.query(query, (err, queryRes) => {
    if (err) {
      console.log(err.stack);
    } else {
      queryRes.rows.forEach(room => {
        rooms.push({
          roomName: room.name,
          roomId: room.id,
          private: room.private,
        });
      });
    }
    res.status(200).send(rooms);
  });
});

router.post('/new', function(req, res, next) {
  res.append('CurrentInstance', myIp);
  let roomName = req.body.roomName;
  let isPrivate = req.body.private;
  let password = req.body.password;
  console.log(`Inserting ${roomName}, private: ${isPrivate} into the database`);
  res.status(200);
  if (roomName !== undefined) {
    insertToDatabase(roomName, isPrivate, password)
      .then(r => {
        res.status(200).send('OK');
      })
      .catch(r => {
        res.status(400);
      });
  }
});

async function insertToDatabase(roomName, isPrivate, password) {
  // we don't need to dispose of the client (it will be undefined)
  try {
    await client.query('BEGIN');
    const queryText =
      'INSERT INTO rooms(name, private, password) VALUES ($1, $2, $3)';
    const res = await client.query(queryText, [roomName, isPrivate, password]);
    await client.query('COMMIT');
  } catch (e) {
    console.log(`Error: ${e}`);
    await client.query('ROLLBACK');
    throw e;
  }
}

async function insertImageToDatabase(room_image, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE rooms SET room_image=$1 WHERE id=$2';
    const res = await client.query(queryText, [room_image, id]);
    await client.query('COMMIT');
  } catch (e) {
    console.log(`Error: ${e}`);
    await client.query('ROLLBACK');
    throw e;
  }
}

module.exports = router;
