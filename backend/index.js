const express = require("express"); //base point
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const multer = require("multer");
const { v2 } = require("cloudinary");
const fs = require("fs");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { config } = require("dotenv"); // importing the config function and invoking it by calling it(i.e. config()) so that all the local environment variables are loaded into the memory and we can reference them
config(); // or we can just write //require('dotenv').config();
const session = require("express-session");
const ejs = require("ejs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//we don't need whole package of passport-google-oauth module, we only need a class named 'Strategy'(since class name starts with Capital letter) in that module
const cors = require("cors");

const request = require("request");

const app = express();

app.use(express.json()); // Middleware to parse JSON payloads

app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded payloads i.e  form data(ex-videos,photos etc) which is coming from fronted

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.KEY, //given secrete key,  and this secrete key is used to generate sessionId when a user login into out application. and keep this secreteKey as strong as we can
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // since our application is running on http server, we kept it as false, but when the application goes into production mode, we can keep it as true(if we want to run it on https)
  })
);

app.use(passport.initialize());
app.use(passport.session()); //integrates Passport.js with express-session to handle persistent login sessions by deserializing user information from the session on each request.
// and we can only use this passport.session() only when we are working with session in our express application. i.e app.use(session({...}))

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,

      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
    },

    async (accessToken, refreshToken, profile, cb) => {
      profile.accessToken = accessToken; // Add the accessToken to the profile object
      console.log(accessToken);
      const email = profile.emails[0].value;

      const userCheckQuery = `
      SELECT * FROM users WHERE email='${email}';
      `;
      const userResponse = await db.get(userCheckQuery);
      if (userResponse === undefined) {
        const userName = `${profile.name.givenName}${uuidv4()}`;
        const userPassword = `${uuidv4()}`;
        const addUserQuery = `
          INSERT INTO users(username,email,password)
          VALUES('${userName}','${email}','${userPassword}');
          `;
        const addResponse = await db.run(addUserQuery);
        console.log("new user id: ", addResponse.lastID);
      } else {
        profile.userName = userResponse.username;
        console.log("old user details:", userResponse);
      }

      cb(null, profile); // Pass the profile object to the serializeUser method
      //profile will be returned // here we can also save the details of the user in database using sql or mongos query
    }
  )
);

//if we want to save the user into our session storage, serializeUser saves user information into the session
passport.serializeUser(function (user, cb) {
  // Here we serialize only the user ID to save space
  //cb(null, user.id);
  cb(null, user);
});

//while deserializeUser retrieves user information from the session.Together, they enable persistent user authentication across multiple requests in an Express.js application using Passport.js.
passport.deserializeUser(function (obj, cb) {
  // passport.deserializeUser(async function (id, cb) {
  //   try {
  //     // In a real application, you'd fetch the user from the database here
  //     // const user = await User.findById(id);

  //     // For now, we'll just pass the user ID back
  //     const user = { id }; // Replace with the actual user fetching logic

  //     cb(null, user);
  //   } catch (err) {
  //     cb(err);
  //   }
  // });

  // here obj is user
  cb(null, obj);
});

app.use(express.static(path.join(__dirname, "public")));

// configuring cloudinary
v2.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.apiKey,
  api_secret: process.env.apiSecret,
});

//working with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

//initializing db and server
const dbPath = path.join(__dirname, "youtubetimer.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(5000, () => {
      console.log("server is running on http://localhost:5000/login");
    });
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.set("view engine", "ejs"); // express will know that the developer is going to work on ejs templates

//for checking authentication in for frontend
app.get("/oauth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ authenticated: true, user: req.user });
  } else {
    res.send({ authenticated: false });
  }
});

// Middleware to check if the user is authenticated for backend
const ensureAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }

  response.redirect("/oauth/google");
};

//uploading the files into server(ie./uploads folder)
app.post(
  "/upload",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (request, response) => {
    console.log(request.body);
    console.log(request.files);
    // Accessing title, description, privacy_status, creatorId
    const {
      title,
      description,
      privacy_status: privacyStatus,
      creator_id: creatorId,
    } = request.body;

    // Example: Upload thumbnail to cloudinary
    const thumbnailPath = request.files["thumbnail"][0].path;
    const thumbnailUploadResponse = await v2.uploader.upload(thumbnailPath, {
      resource_type: "image",
    });
    fs.unlinkSync(thumbnailPath);

    // Example: Upload video to cloudinary
    const videoPath = request.files["video"][0].path;
    const videoUploadResponse = await v2.uploader.upload(videoPath, {
      resource_type: "video",
    });
    fs.unlinkSync(videoPath);
    try {
      // Prepare and execute the SQL INSERT query using parameterized query
      const addDetailsQuery = `
        INSERT INTO VIDEOS(video_url, title, description, thumbnail_url, visibility, category_id,
                            privacy_status,request_status, from_user, to_user) 
        VALUES(?, ?, ?, ?, 'adult', 22, ?,'pending', ?, ?);
      `;
      const addingResponse = await db.run(addDetailsQuery, [
        videoUploadResponse.url,
        title,
        description,
        thumbnailUploadResponse.url,
        privacyStatus,
        request.user.userName,
        creatorId,
      ]);

      console.log("Inserted video details:", addingResponse.lastID);
      response.status(200).json({ message: "Request made successfully" });
    } catch (error) {
      console.error("Error inserting video details:", error);
      response.status(500).send("Error inserting video details");
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/login", async (request, response) => {
  if (request.isAuthenticated()) {
    // isAuthenticated() is a method which comes in passport module(which is accessed through request method)
    response.redirect("/dashboard");
  } else {
    response.render(path.join(__dirname, "login.ejs"));
  }
});

app.get("/logout", async (request, response) => {
  request.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      request.session.destroy(() => {
        response.send("logged out successfully");
        console.log("logged out successfully");
        //response.redirect("/login");
      });
    }
  });
});

app.get("/home", async (request, response) => {
  if (request.isAuthenticated()) {
    // isAuthenticated is a method which comes from the passport Module. It returns true if the user is authenticated or else it returns false
    //console.log(request.user);

    const db = request.app.locals.db; // Accessing the database connection
    // Now we can use the db object to query the database

    //const userVideos = await db.all("SELECT * FROM videos WHERE user_id = ?", request.user.id);

    response.send(request.user);
  } else {
    response.redirect("/oauth/google");
  }
});

app.get("/dashboard", async (request, response) => {
  if (request.isAuthenticated()) {
    // isAuthenticated is a method which comes from the passport Module. It returns true if the user is authenticated or else it returns false
    // console.log(request.user);
    response.render(path.join(__dirname, "dashboard.ejs"), {
      user: request.user,
    });
  }
});

app.get(
  "/oauth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtubepartner",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
  })
);

app.get(
  "/oauth/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (request, response) => {
    //console.log(request.user);
    //response.redirect("/dashboard");
    response.send(request.user);
  }
);

app.get("/user/details", async (request, response) => {
  const query = `
    SELECT * FROM users WHERE email='21je0219@iitism.ac.in';
    `;
  const dbResponse = await db.all(query);
  response.send(dbResponse);
});

app.get("/videos", async (request, response) => {
  const query = `
    SELECT * FROM videos;
    `;
  const dbResponse = await db.all(query);
  response.send(dbResponse);
});

//getting requests
app.get("/requests", ensureAuthenticated, async (request, response) => {
  try {
    // Assuming request.user is correctly populated by your authentication middleware
    const userName = request.user.userName;
    console.log(userName);

    const { role } = request.query; //accessing query parameter role which will have values as editor or creator
    let requestType;
    if (role === "creator") {
      requestType = "to_user";
    } else if (role === "editor") {
      requestType = "from_user";
    } else {
      return response.status(400).send("Invalid role parameter");
    }

    const getRequestsQuery = `
      SELECT * FROM VIDEOS WHERE ${requestType} = ?;
    `;
    const requestsResponse = await db.all(getRequestsQuery, [userName]);

    // Send the retrieved requests as the response
    response.status(200).json(requestsResponse);
  } catch (error) {
    console.error("Error retrieving requests:", error);
    response.status(500).send("Error retrieving requests");
  }
});

//getting videoDetails(request Details) with videoId
app.get(
  "/requests/:videoId",
  ensureAuthenticated,
  async (request, response) => {
    try {
      const { videoId } = request.params;
      console.log("request params", request.params);

      // Prepare and execute the SQL SELECT query using a parameterized query
      const getRequestDetailsQuery = `
      SELECT * FROM VIDEOS WHERE id = ?;
    `;
      const dbResponse = await db.get(getRequestDetailsQuery, [videoId]);
      console.log(dbResponse);

      // Send the retrieved requests as the response
      response.status(200).json(dbResponse);
    } catch (error) {
      console.error("Error retrieving video details:", error);
      response.status(500).send("Error retrieving video details");
    }
  }
);

//update requestStatus
app.put(
  "/response/:videoId",
  ensureAuthenticated,
  async (request, response) => {
    const { videoId } = request.params;
    const { creatorResponse } = request.body;

    let editorRequestStatus;

    if (creatorResponse) {
      editorRequestStatus = "approved";
    } else {
      editorRequestStatus = "rejected";
    }

    try {
      const updateRequestStatusQuery = `
        UPDATE videos SET request_status=? WHERE id=?;
      `;
      const dbResponse = await db.run(updateRequestStatusQuery, [
        editorRequestStatus,
        videoId,
      ]);
      response.send(dbResponse);
    } catch (error) {
      console.error("Error updating request status:", error);
      response.status(500).send("Error updating request status");
    }
  }
);

//delete the request
app.delete(
  "/delete/:videoId",
  ensureAuthenticated,
  async (request, response) => {
    const { videoId } = request.params;

    const deleteRequest = `
        DELETE FROM videos WHERE id=?;
    `;

    try {
      const deleteResponse = await db.run(deleteRequest, [videoId]);
      response.json({ message: "Video deleted successfully", deleteResponse });
    } catch (error) {
      console.error("Error deleting video:", error);
      response
        .status(500)
        .json({ error: "Failed to delete video. Please try again." });
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////
// Function to download files from URLs

const downloadFromUrl = async (fileUrl, videoId) => {
  try {
    const uniqueFilename = `${videoId}_${uuidv4()}.mp4`; // Assuming video files are in MP4 format
    const filePath = `./videos/${uniqueFilename}`;

    // Ensure the 'videos' directory exists
    if (!fs.existsSync("./videos")) {
      fs.mkdirSync("./videos");
    }

    const file = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      http
        .get(fileUrl, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve(filePath);
          });
        })
        .on("error", (err) => {
          fs.unlink(filePath, () => reject(err)); // Delete the file async if error occurs
        });
    });

    return uniqueFilename;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

app.post("/upload-video", async (req, res) => {
  const {
    videoId,
    title,
    description,
    privacyStatus,
    videoUrl,
    thumbnailUrl,
  } = req.body;

  try {
    // Download video to local storage
    const videoFileName = await downloadFromUrl(videoUrl, videoId);

    // Define the options for the request
    const options = {
      method: "POST",
      url:
        "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`, // Assuming accessToken is available in req.user
      },
      formData: {
        snippet: JSON.stringify({
          snippet: {
            title: title,
            description: description,
          },
          status: {
            privacyStatus: privacyStatus,
          },
        }),
        media: {
          value: fs.createReadStream(`./videos/${videoFileName}`),
          options: {
            filename: path.basename(videoFileName),
            contentType: "video/mp4", // MIME type of the video file
          },
        },
      },
    };

    // Make the request to upload video to YouTube
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error uploading video:", error);
        return res.status(500).json({ error: "Failed to upload video" });
      }
      console.log("Response from YouTube:", body);

      // Clean up the downloaded video file
      fs.unlink(`./videos/${videoFileName}`, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting video file:", unlinkError);
        }
      });

      res.json(JSON.parse(body)); // Respond with the JSON response from YouTube
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});
