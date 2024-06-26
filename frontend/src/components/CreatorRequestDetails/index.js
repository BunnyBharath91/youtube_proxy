import { Component } from "react";
import "./index.css";
import Header from "../Header";
import loading from "../../images/loading.png";

class CreatorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      isLoading: true,
      errorMessage: "",
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
        isLoading: false,
        requestDetails: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
    }
  };

  onApprove = async () => {
    const { videoId } = this.props.match.params;

    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: true }),
      });

      if (response.ok) {
        await this.getRequestDetails(videoId);
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      this.setState({
        errorMessage: "Failed to process your request. Please try again.",
      });
    }
  };

  onReject = async () => {
    const { videoId } = this.props.match.params;

    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: false }),
      });

      if (response.ok) {
        await this.getRequestDetails(videoId);
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      this.setState({
        errorMessage: "Failed to process your request. Please try again.",
      });
    }
  };

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <img alt="loading img" src={loading} className="loading-img" />
        <p className="loading-text">Please Wait!, We are on your request...</p>
      </div>
    );
  };

  renderRequestDetailsSection = () => {
    const { requestDetails, errorMessage } = this.state;
    const {
      videoUrl,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      description,
      audience,
      visibility,
      categoryId,
      privacyStatus,
      requestedDateTime,
      responseDateTime,
      videoUploadStatus,
    } = requestDetails;
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
          <h2 className="small-heading">
            Audience:<span>{audience === "yes" ? "kids" : "adults"}</span>
          </h2>
          <h2 className="small-heading">
            Visibility:<span>{privacyStatus}</span>
          </h2>
          <h2 className="small-heading">
            Category:<span>{categoryId}</span>
          </h2>

          <h2 className="small-heading">
            Editor Id: <span>{fromUser}</span>
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

        {requestStatus === "pending" && (
          <div className="creator-request-details-buttons-container">
            <button onClick={this.onApprove}>Approve</button>
            <button onClick={this.onReject}>Reject</button>
          </div>
        )}
        {errorMessage && (
          <p className="error-message">
            <span className="error">Error:</span>
            {errorMessage}
          </p>
        )}
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

export default CreatorRequestDetails;

// {
//   videoUploadStatus === "uploaded" && "your video is uploaded";
// }
