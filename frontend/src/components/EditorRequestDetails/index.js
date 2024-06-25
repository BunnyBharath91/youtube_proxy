import { Component } from "react";
import "./index.css";
import Header from "../Header";

class EditorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      loading: true,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { videoId } = match.params;
    console.log("videoId: ", videoId);

    this.getRequestDetails(videoId);
  }

  getRequestDetails = async (videoId) => {
    try {
      const response = await fetch(`/requests/${videoId}`);
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const eachItem = await response.json();
      console.log("fetched data: ", eachItem);
      const updatedData = {
        videoId: eachItem.id,
        videoUrl: eachItem.video_url,
        title: eachItem.title,
        description: eachItem.description,
        thumbnailUrl: eachItem.thumbnail_url,
        playLists: eachItem.playLists,
        visibility: eachItem.visibility,
        tags: eachItem.tags,
        categoryId: eachItem.category_id,
        privacyStatus: eachItem.privacy_status,
        fromUser: eachItem.from_user,
        toUser: eachItem.to_user,
        requestedDateTime: eachItem.requested_date_time,
        responseDateTime: eachItem.response_date_time,
        videoAccessToken: eachItem.video_access_token,
        requestStatus: eachItem.request_status,
        videoUploadStatus: eachItem.video_upload_status,
      };

      this.setState({
        loading: false,
        requestDetails: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
    }
  };

  onDeleteRequest = async () => {
    const { videoId } = this.props.match.params;
    try {
      const response = await fetch(`/delete/${videoId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        alert("Your Request Deleted Successfully");
        this.props.history.push("/editor_section/requests");
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request. Please try again.");
    }
  };

  onUploadVideo = async () => {
    const { requestDetails } = this.state;
    const {
      videoId,
      videoUrl,
      title,
      thumbnailUrl,
      description,
      privacyStatus,
    } = requestDetails;
    const requestBody = {
      videoId,
      videoUrl,
      title,
      thumbnailUrl,
      description,
      privacyStatus,
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

      if (response.ok) {
        const responseData = await response.json();
        console.log("Video uploaded successfully:", responseData);
        window.location.reload(); // Reload the page
        alert("Video uploaded successfully");
      } else {
        console.log("Error while uploading:", response.status);
        throw new Error("Error while uploading. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        loading: false,
      });
      throw new Error("Error while uploading. Please try again.");
    }
  };

  resendRequest = async () => {
    const { requestDetails } = this.state;
    const { videoId } = requestDetails;
    this.setState({ loading: true });

    try {
      const response = await fetch(`/resend/${videoId}`);
      if (response.ok) {
        alert("Resent successfully");
        window.location.reload();
      } else {
        throw new Error("Error in resending. Please try again.");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error("Error in resending:", error);
      throw new Error("Error in resending. Please try again.");
      this.setState({ loading: false });
    }
  };

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <img
          alt="loading img"
          src="https://cdni.iconscout.com/illustration/premium/thumb/wait-a-minute-6771645-5639826.png"
          className="loading-img"
        />
        <p className="loading-text">Please Wait!, We are on your request...</p>
      </div>
    );
  };

  renderRequestDetailsSection = () => {
    const { requestDetails } = this.state;
    const {
      videoUrl,
      requestStatus,
      audience,
      toUser,
      title,
      thumbnailUrl,
      description,
      visibility,
      categoryId,
      privacyStatus,
      requestedDateTime,
      responseDateTime,
      videoUploadStatus,
    } = requestDetails;

    const responseDateTimeMs = new Date(responseDateTime).getTime();
    const currentTimeMs = new Date().getTime();
    const timeLimitMs = 55 * 60 * 1000;

    return (
      <div className="request-details-section">
        <h1 className="request-heading">Request Details</h1>
        <div className="request-details-media-container">
          <div className="request-details-media-card">
            <h2 className="request-details-heading">Video: </h2>
            <video
              controls
              poster={thumbnailUrl}
              preload="auto"
              className="media-item"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="request-details-media-card">
            <h2 className="request-details-heading">Thumbnail:</h2>
            <img alt="thumbnail" src={thumbnailUrl} className="media-item" />
          </div>
        </div>

        <div id="text-container">
          <h2 id="video-title-heading">Title</h2>
          <p id="video-title">{title}</p>
        </div>
        <div id="text-container">
          <h2 id="video-title-heading">Description</h2>
          <p id="video-title">{description}</p>
        </div>
        <div className="request-details-elements-container">
          <h2>
            Audience:<span>{audience === "yes" ? "kids" : "adults"}</span>
          </h2>
          <h2>
            Visibility:<span>{privacyStatus}</span>
          </h2>
          <h2>
            Category:<span>{categoryId}</span>
          </h2>

          <h2>
            Creator Id:<span>{toUser}</span>
          </h2>
          <h2>
            Requested on:
            <span>{requestedDateTime}</span>
          </h2>

          <h2>
            Request Status: <span>{requestStatus}</span>{" "}
          </h2>
          <h2>
            Responded on:
            <span>{responseDateTime ? responseDateTime : "NA"}</span>
          </h2>
          <h2>
            Upload Status:
            <span>
              {videoUploadStatus === "uploaded" ? "uploaded" : "pending"}
            </span>
          </h2>
        </div>
        <div className="editor-request-details-buttons-container">
          {requestStatus === "approved" &&
            videoUploadStatus === "not uploaded" &&
            (responseDateTimeMs + timeLimitMs > currentTimeMs ? (
              <button onClick={this.onUploadVideo}>Upload</button>
            ) : (
              <button onClick={this.resendRequest}>Resend Request</button>
            ))}

          {videoUploadStatus === "not uploaded" &&
            requestStatus === "approved" && (
              <button onClick={this.onDeleteRequest}>Delete request</button>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="main-container">
          {isLoading
            ? this.renderLoading()
            : this.renderRequestDetailsSection()}
        </div>
      </div>
    );
  }
}

export default EditorRequestDetails;
