import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Header from "../Header";
import loading from "../../images/loading.png";
import apology from "../../images/apology.png";
import errorWhileUploading from "../../images/errorWhileUploading.jpg";
import forbidden from "../../images/forbidden.jpg";
import successful from "../../images/successful.jpg";
import noRequests from "../../images/noRequests.jpg";

class EditorSectionRequests extends Component {
  state = {
    requestsList: [],
    loading: true,
    uploadResponse: "",
    uploadResponseMessage: "",
    uploadResponseImage: "",
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = async () => {
    try {
      const response = await fetch(`/requests?role=editor`);
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data = await response.json();
      const updatedData = data.map((eachItem) => ({
        videoId: eachItem.id,
        videoUrl: eachItem.video_url,
        title: eachItem.title,
        description: eachItem.description,
        thumbnailUrl: eachItem.thumbnail_url,
        playLists: eachItem.playLists,
        audience: eachItem.audience,
        categoryId: eachItem.category_id,
        privacyStatus: eachItem.privacy_status,
        fromUser: eachItem.from_user,
        toUser: eachItem.to_user,
        requestedDateTime: eachItem.requested_date_time,
        responseDateTime: eachItem.response_date_time,
        videoAccessToken: eachItem.video_access_token,
        requestStatus: eachItem.request_status,
        videoUploadStatus: eachItem.video_upload_status,
      }));

      this.setState({
        loading: false,
        requestsList: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
    }
  };

  onDeleteRequest = async (videoId) => {
    try {
      const response = await fetch(`/delete/${videoId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        await this.getRequests();
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.log("error occurred: ", error);
    }
  };

  onUploadVideo = async (videoId) => {
    const requestBody = {
      videoId,
    };
    this.setState({
      loading: true,
    });
    try {
      const response = await fetch("/upload-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct Content-Type header
        },
        body: JSON.stringify(requestBody),
      });

      this.setState({
        loading: false,
      });

      const responseData = await response.json();
      console.log("upload response data: ", responseData);
      if (response.ok) {
        this.setState({
          loading: false,
          uploadResponse: "success",
          uploadResponseMessage: responseData.message,
        });
        console.log("Video uploaded successfully:", responseData);
        // window.location.reload(); // Reload the page
        // alert("Video uploaded successfully");
      } else {
        if (response.status === 403) {
          if (responseData.reason === "quotaExceeded") {
            this.setState({
              loading: false,
              uploadResponse: "failure",
              uploadResponseMessage: responseData.message,
              uploadResponseImage: apology,
            });
          } else {
            this.setState({
              loading: false,
              uploadResponse: "failure",
              uploadResponseMessage: responseData.message,
              uploadResponseImage: forbidden,
            });
          }
        } else {
          this.setState({
            loading: false,
            uploadResponse: "failure",
            uploadResponseMessage: responseData.message,
            uploadResponseImage: errorWhileUploading,
          });
        }

        console.log("response of error", response);
        // alert("Error while uploading");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        loading: false,
        uploadResponse: "failure",
        uploadResponseMessage: "Error while uploading video",
        uploadResponseImage: errorWhileUploading,
      });
      //   alert("Error uploading video");
    }
  };

  resendRequest = async (videoId) => {
    this.setState({ loading: true });

    try {
      const response = await fetch(`/resend/${videoId}`);
      if (response.ok) {
        window.location.reload();
        alert("Resent successfully");
      } else {
        this.setState({ loading: false });
        throw new Error("Error in resending. Please try again.");
      }
    } catch (error) {
      console.error("Error in resending:", error);
      this.setState({ loading: false });
      throw new Error("Error in resending. Please try again.");
    }
  };

  renderRequest = (requestItem) => {
    const {
      videoId,
      requestStatus,
      toUser,
      title,
      thumbnailUrl,
      videoUploadStatus,
      requestedDateTime,
      responseDateTime,
    } = requestItem;

    const handleUpload = (event) => {
      event.stopPropagation();
      this.onUploadVideo(videoId);
    };

    const handleDelete = (event) => {
      event.stopPropagation(); //prevents the event from bubbling up the DOM tree, effectively stopping any parent elements from handling the event.
      this.onDeleteRequest(videoId);
    };

    const responseDateTimeMs = new Date(responseDateTime).getTime();
    const currentTimeMs = new Date().getTime();
    const timeLimitMs = 55 * 60 * 1000;
    console.log(responseDateTimeMs + timeLimitMs > currentTimeMs);

    const handleResendRequest = (event) => {
      event.stopPropagation();
      this.resendRequest(videoId);
    };

    return (
      <li
        key={videoId}
        className="request-card"
        onClick={() => this.props.history.push(`/editor_section/${videoId}`)}
      >
        <img
          alt="thumbnail"
          src={thumbnailUrl}
          className="request-card-thumbnail"
        />
        <div className="request-card-text-container">
          <p className="video-title">
            This is my video title nothing fancy words just for checking
            text-overflow: ellipses property. I mean is it working or not{" "}
            {title}
          </p>
          <p className="creator-id">To: {toUser}</p>
          <div className="status-delete-container">
            {requestStatus === "approved" && <p>Status: Approved</p>}
            {requestStatus === "pending" && <p>Status:Pending</p>}
            {requestStatus === "rejected" && <p>Status: Rejected</p>}
            <div className="request-card-buttons-container">
              {requestStatus === "approved" &&
                (responseDateTime ? (
                  videoUploadStatus === "not uploaded" && (
                    <button
                      onClick={handleUpload}
                      className="extra-large-screen-upload-button"
                    >
                      Upload
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleResendRequest}
                    className="resend-request-button"
                  >
                    Resend
                  </button>
                ))}

              {videoUploadStatus === "uploaded" && (
                <p className="video-uploaded-text">video uploaded</p>
              )}
              {videoUploadStatus === "not uploaded" &&
                requestStatus === "approved" && (
                  <button
                    onClick={handleDelete}
                    className="delete-request-button"
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        </div>
        <p className="extra-large-screen-requested-date-time">
          {requestedDateTime}
        </p>
        <p className="large-screen-request-status">{requestStatus}</p>
        <p className="extra-large-screen-requested-date-time">
          {responseDateTime ? responseDateTime : "-"}
        </p>
        <div className="extra-large-screen-upload-button-container">
          {requestStatus === "approved" ? (
            responseDateTime ? (
              videoUploadStatus === "not uploaded" ? (
                <button
                  onClick={handleUpload}
                  className="extra-large-screen-upload-button"
                >
                  Upload
                </button>
              ) : (
                "-"
              )
            ) : (
              <button
                onClick={handleResendRequest}
                className="resend-request-button"
              >
                Resend
              </button>
            )
          ) : (
            "-"
          )}
        </div>
        <div className="large-screen-delete-button-container">
          {videoUploadStatus === "not uploaded" ? (
            <button
              className="large-screen-delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          ) : (
            "-"
          )}
        </div>
      </li>
    );
  };

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <img alt="loading img" src={loading} className="loading-img" />
        <p className="loading-text">Please Wait!, We are on your request...</p>
      </div>
    );
  };

  onResetUploadResponse = () => {
    this.setState({
      uploadResponse: "",
      uploadResponseMessage: "",
    });
    window.location.reload(); // Reload the page
  };

  renderUploadResponse = () => {
    const {
      uploadResponse,
      uploadResponseMessage,
      uploadResponseImage,
    } = this.state;

    return (
      <div className="request-section loading-section">
        <img
          alt="loading img"
          src={uploadResponse === "success" ? successful : uploadResponseImage}
          className="loading-img"
        />
        <p className="loading-text">{uploadResponseMessage}</p>
        <button onClick={this.onResetUploadResponse} className="go-back-button">
          Go Back
        </button>
      </div>
    );
  };

  renderEditorSection = () => {
    const { requestsList } = this.state;
    return (
      <div className="editor-section">
        <h1 className="editor-section-heading">Requests you made</h1>
        {requestsList.length > 0 && (
          <div className="requests-table-header">
            <p className="video-column">Video</p>
            <p className="requested-date-time-column">requested on</p>
            <p className="status-column">Status</p>
            <p className="requested-date-time-column">responded on</p>
            <p className="upload-video-column">Upload </p>
            <p className="delete-request-column">Delete </p>
          </div>
        )}
        {requestsList.length === 0 ? (
          <div className="request-section loading-section">
            <img alt="loading img" src={noRequests} className="loading-img" />
            <p className="loading-text">Sorry! you haven't made any requests</p>
            <Link to="/request_section">
              <button>Make a Request</button>
            </Link>
          </div>
        ) : (
          <ul className="requests-container">
            {requestsList.map((eachItem) => this.renderRequest(eachItem))}
          </ul>
        )}
      </div>
    );
  };

  render() {
    const { loading, uploadResponse } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="main-container">
          {loading
            ? this.renderLoading()
            : uploadResponse
            ? this.renderUploadResponse()
            : this.renderEditorSection()}
        </div>
      </div>
    );
  }
}

export default EditorSectionRequests;
