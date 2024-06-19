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
        alert("Error while uploading");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        loading: false,
      });
      alert("Error uploading video");
    }
  };

  resendRequest = async () => {
    const { requestDetails } = this.state;
    const { videoId } = requestDetails;
    this.setState({ loading: true });

    try {
      const response = await fetch(`/resend/${videoId}`);
      if (response.ok) {
        alert("Resend successfully");
        window.location.reload();
      } else {
        alert("Error in resending");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error("Error in resending:", error);
      alert("Error in resending");
      this.setState({ loading: false });
    }
  };

  render() {
    const { isLoading, requestDetails } = this.state;
    const {
      videoUrl,
      requestStatus,

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

    if (isLoading) {
      return <h1>Getting Data</h1>;
    }

    return (
      <div className="creator-request-details">
        <Header />
        <h1>Request Details</h1>
        <p>Requested To: {toUser}</p>
        <p>Title: {title}</p>
        <p>Description: {description}</p>
        <video
          width="640"
          height="360"
          controls
          poster={thumbnailUrl}
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <img alt="thumbnail" src={thumbnailUrl} />
        <p>Category: {categoryId}</p>
        <p>Visibility: {visibility}</p>
        <p>Privacy Status: {privacyStatus}</p>
        <p>Requested DateTime: {requestedDateTime}</p>
        <p>ResponseStatus: {requestStatus}</p>

        {requestStatus === "approved" && (
          <div>
            <p>Request Status: Approved</p>
            {videoUploadStatus === "not uploaded" ? (
              responseDateTimeMs + timeLimitMs > currentTimeMs ? (
                <button onClick={this.onUploadVideo}>Upload</button>
              ) : (
                <button onClick={this.resendRequest}>Resend Request</button>
              )
            ) : (
              <p>This video is uploaded</p>
            )}
          </div>
        )}
        {requestStatus === "pending" && <p>Request Status: Pending</p>}
        {requestStatus === "rejected" && <p> Request Status: Rejected</p>}
        <button onClick={this.onDeleteRequest}>Delete request</button>
      </div>
    );
  }
}

export default EditorRequestDetails;
