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
const FormData = require("form-data");
const fetch = require("node-fetch");

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // updating match the domain  will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,

      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtubepartner",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
      ],
      accessType: "offline", // Ensure 'accessType' is set to 'offline' for refresh tokens
      prompt: "consent select_account", // Add prompt to force account selection and consent
    },

    async (accessToken, refreshToken, profile, cb) => {
      profile.accessToken = accessToken; // Add the accessToken to the profile object
      profile.refreshToken = refreshToken; //Add the refreshToken to the profile obj
      console.log("profile obj: ", profile);
      console.log("access token: ", accessToken);
      console.log("refresh token: ", refreshToken);
      const email = profile.emails[0].value;

      const userCheckQuery = `
      SELECT * FROM users WHERE email='${email}';
      `;
      const userResponse = await db.get(userCheckQuery);
      if (!userResponse) {
        const userName = `${profile.name.givenName}${uuidv4()}`;
        const userPassword = `${uuidv4()}`;
        const addUserQuery = `INSERT INTO users (username, email, password, refresh_token) VALUES (?, ?, ?, ?)`;
        profile.userName = userName;
        await db.run(addUserQuery, [
          userName,
          email,
          userPassword,
          refreshToken,
        ]);
      } else {
        profile.userName = userResponse.username;
        const updateRefreshTokenQuery = `UPDATE users SET refresh_token = ? WHERE email = ?`;
        await db.run(updateRefreshTokenQuery, [refreshToken, email]);
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

// get new AccessToken using refreshToken
const getNewAccessToken = async (refreshToken) => {
  const url = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams({
    client_id: process.env.clientID,
    client_secret: process.env.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error refreshing access token:", errorData);
      return null; //indicate error while generating access_token
    }

    const data = await response.json();
    console.log("new AccessToken: ", data.access_token);

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

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
      console.log("server is running on http://localhost:5000");
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
  "/upload-request",
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
      audience,
      category_id: categoryId,
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
        INSERT INTO VIDEOS(video_url, title, description, thumbnail_url, audience, category_id,
                            privacy_status,request_status, from_user, to_user) 
        VALUES(?, ?, ?, ?, ?, ?, ?,'pending', ?, ?);
      `;
      const addingResponse = await db.run(addDetailsQuery, [
        videoUploadResponse.url,
        title,
        description,
        thumbnailUploadResponse.url,
        audience,
        categoryId,
        privacyStatus,
        request.user.userName,
        creatorId,
      ]);

      console.log("Inserted video details:", addingResponse.lastID);
      return response
        .status(200)
        .json({ message: "Request made successfully" });
    } catch (error) {
      console.error("Error inserting video details:", error);
      response.status(500).send("Error inserting video details");
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// app.get("/login", async (request, response) => {
//   if (request.isAuthenticated()) {
//     // isAuthenticated() is a method which comes in passport module(which is accessed through request method)
//     response.redirect("/dashboard");
//   } else {
//     response.render(path.join(__dirname, "login.ejs"));
//   }
// });

app.get("/logout", async (request, response) => {
  request.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      request.session.destroy(() => {
        response.send("logged out successfully");
        console.log("logged out successfully");
        // response.redirect("http://localhost/login");
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

// app.get("/dashboard", async (request, response) => {
//   if (request.isAuthenticated()) {
//     // isAuthenticated is a method which comes from the passport Module. It returns true if the user is authenticated or else it returns false
//     // console.log(request.user);
//     response.render(path.join(__dirname, "dashboard.ejs"), {
//       user: request.user,
//     });
//   }
// });

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
    accessType: "offline", // Ensure 'accessType' is set to 'offline' for refresh tokens
    prompt: "consent select_account", // Add prompt to force account selection and consent
  })
);

app.get(
  "/oauth/redirect",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  async (request, response) => {
    //console.log(request.user);
    //response.redirect("/dashboard");
    response.redirect("http://localhost:3000");
  }
);

app.get("/user/details", async (request, response) => {
  if (request.isAuthenticated()) {
    console.log("user email", request.user.emails[0].value);
    const query = `
    SELECT username FROM users WHERE email=?;
    `;
    const dbResponse = await db.get(query, request.user.emails[0].value);
    response.json({
      username: dbResponse.username,
      userEmail: request.user.emails[0].value,
      userImage: request.user.photos[0].value,
      displayName: request.user.displayName,
    });
  }
});

app.get("/videos", async (request, response) => {
  const query = `
    SELECT * FROM videos;
    `;
  const dbResponse = await db.all(query);
  response.send(dbResponse);
});

// Function to update response_date_time to NULL in the database
const updateResponseDateTime = async (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//..............................................base-line...................
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

    for (let eachItem of requestsResponse) {
      if (
        eachItem.video_upload_status === "not uploaded" &&
        eachItem.request_status === "approved"
      ) {
        const newAccessToken = await getNewAccessToken(
          eachItem.video_refresh_token
        );
        if (!newAccessToken) {
          const updateResponseDateTimeQuery = `
            UPDATE videos SET response_date_time=NULL WHERE id=?
          `;
          await updateResponseDateTime(updateResponseDateTimeQuery, [
            eachItem.id,
          ]);
          eachItem.response_date_time = null; // Updating the response_date_time in the eachItem
        }
      }
    }

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
      return response.status(200).json(dbResponse);
    } catch (error) {
      console.error("Error retrieving video details:", error);
      return response.status(500).send("Error retrieving video details");
    }
  }
);

//update Request Status along with accessToken
app.put(
  "/response/:videoId",
  ensureAuthenticated,
  async (request, response) => {
    const { videoId } = request.params;
    const { creatorResponse } = request.body;
    console.log(
      "for approving request refreshToken: ",
      request.user.refreshToken
    );

    let editorRequestStatus;

    if (creatorResponse) {
      editorRequestStatus = "approved";
    } else {
      editorRequestStatus = "rejected";
    }

    try {
      let updateRequestStatusQuery;
      let queryParams;
      const dateTime = new Date().toISOString(); //changing date and time to ISO format

      if (editorRequestStatus === "approved") {
        // const newAccessToken = await getNewAccessToken(
        //   request.user.refreshToken
        // );
        updateRequestStatusQuery = `
          UPDATE videos 
          SET request_status = ?,response_date_time=?, video_refresh_token = ? 
          WHERE id = ?;
        `;
        queryParams = [
          editorRequestStatus,
          dateTime,
          request.user.refreshToken,
          videoId,
        ];
      } else {
        updateRequestStatusQuery = `
          UPDATE videos 
          SET request_status = ? ,response_date_time=?
          WHERE id = ?;
        `;
        queryParams = [editorRequestStatus, dateTime, videoId];
      }

      const dbResponse = await db.run(updateRequestStatusQuery, queryParams);
      response.send(dbResponse);
    } catch (error) {
      console.error("Error updating request status:", error);
      response.status(500).send("Error updating request status");
    }
  }
);

//resend request for approval due to expiry of accessToken
app.get("/resend/:videoId", ensureAuthenticated, async (request, response) => {
  const { videoId } = request.params;

  try {
    const updateResponseStatusQuery = `
      UPDATE videos
      SET request_status = 'pending'
      WHERE id = ?;
    `;

    const dbResponse = await db.run(updateResponseStatusQuery, [videoId]);

    // Check if the update was successful
    if (dbResponse.changes > 0) {
      response.status(200).json({
        status: "success",
        message: "Request status updated successfully",
      });
    } else {
      response.status(400).json({
        status: "failure",
        message: "Failed to update request status",
      });
    }
  } catch (error) {
    console.error("Error in resending:", error);
    response
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
});

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

const downloadFromUrl = async (fileUrl, videoId, fileType) => {
  try {
    const uniqueFilename = `${videoId}_${uuidv4()}.${fileType}`;
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
  const { videoId } = req.body;

  console.log("video id is :", videoId);

  const getVideoDetails = `
  select * from videos where id=?;
  `;

  const getVideoDetailsResponse = await db.get(getVideoDetails, [videoId]);

  const {
    video_url,
    title,
    description,
    thumbnail_url,
    audience,
    visibility,
    category_id,
    privacy_status,
    video_access_token,
    video_refresh_token,
  } = getVideoDetailsResponse;
  console.log("title,description:", title, description);
  console.log(
    "this is the refreshToken while uploading video: ",
    video_refresh_token
  );

  const newAccessToken = await getNewAccessToken(video_refresh_token);

  try {
    // Download video to local storage
    const videoFileName = await downloadFromUrl(video_url, videoId, "mp4");
    // Download thumbnail to local storage
    const thumbnailFileName = await downloadFromUrl(
      thumbnail_url,
      videoId,
      "jpg"
    );

    // Create a FormData instance for the video
    const videoForm = new FormData();
    videoForm.append(
      "resource",
      JSON.stringify({
        snippet: {
          title: title,
          description: description,
          categoryId: category_id,
        },
        status: {
          privacyStatus: privacy_status,
        },
      }),
      { contentType: "application/json" }
    );
    videoForm.append(
      "media",
      fs.createReadStream(`./videos/${videoFileName}`),
      {
        filename: path.basename(videoFileName),
        contentType: "video/mp4", // MIME type of the video file
      }
    );

    // Make the request to upload video to YouTube
    const videoResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: videoForm,
      }
    );

    if (!videoResponse.ok) {
      const errorBody = await videoResponse.text();
      const errorObj = JSON.parse(errorBody); //parsing it to obj
      console.error("Error uploading video:", errorObj);
      // Clean up the downloaded video file
      fs.unlink(`./videos/${videoFileName}`, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting video file:", unlinkError);
        }
      });
      // Clean up the downloaded thumbnail file
      fs.unlink(`./videos/${thumbnailFileName}`, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting thumbnail file:", unlinkError);
        }
      });
      if (errorObj.error.code === 403) {
        if (errorObj.error.errors[0].reason === "quotaExceeded") {
          return res.status(403).json({
            reason: "quotaExceeded",
            message:
              "Apologies! Our application has reached its quota for today. Please consider trying the upload again tomorrow. Thank you for your understanding!",
          });
        }
        return res.status(403).json({ message: errorObj.error.message });
      }
      return res.status(500).json({ message: "Failed to upload thumbnail" });
    }

    const videoResponseBody = await videoResponse.json();
    const youtubeVideoId = videoResponseBody.id;
    console.log("Response from YouTube:", videoResponseBody);

    //updating the video upload status in db
    const updateVideoUploadStatusQuery = `
    UPDATE videos SET video_upload_status='uploaded' WHERE id=?;
    `;
    const dbResponse = await db.run(updateVideoUploadStatusQuery, [videoId]);
    console.log("video update Status: ", dbResponse);

    // Clean up the downloaded video and thumbnail files
    fs.unlink(`./videos/${videoFileName}`, (unlinkError) => {
      if (unlinkError) {
        console.error("Error deleting video file:", unlinkError);
      }
    });

    // Upload thumbnail
    const thumbnailForm = new FormData();
    thumbnailForm.append(
      "media",
      fs.createReadStream(`./videos/${thumbnailFileName}`),
      {
        filename: path.basename(thumbnailFileName),
        contentType: "image/jpeg", // MIME type of the thumbnail file
      }
    );

    const thumbnailResponse = await fetch(
      `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${youtubeVideoId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: thumbnailForm,
      }
    );

    if (!thumbnailResponse.ok) {
      const errorBody = await thumbnailResponse.text();
      const errorObj = JSON.parse(errorBody); //parsing it to obj
      console.error("Error uploading thumbnail:", errorObj);
      // Clean up the downloaded thumbnail file
      fs.unlink(`./videos/${thumbnailFileName}`, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting thumbnail file:", unlinkError);
        }
      });
      if (errorObj.error.code === 403) {
        if (errorObj.error.errors[0].reason === "quotaExceeded") {
          return res.status(403).json({
            reason: "quotaExceeded",
            message:
              "Apologies! Our application has reached its quota for today. Please consider trying the upload again tomorrow. Thank you for your understanding!",
          });
        }
        return res.status(403).json({ message: errorObj.error.message });
      }
      return res.status(500).json({ message: "Failed to upload thumbnail" });
    }

    const thumbnailResponseBody = await thumbnailResponse.json();
    console.log("Thumbnail uploaded successfully:", thumbnailResponseBody);

    // Clean up the downloaded thumbnail file
    fs.unlink(`./videos/${thumbnailFileName}`, (unlinkError) => {
      if (unlinkError) {
        console.error("Error deleting thumbnail file:", unlinkError);
      }
    });

    res.json({
      message: "video uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Failed to upload video" });
  }
});
