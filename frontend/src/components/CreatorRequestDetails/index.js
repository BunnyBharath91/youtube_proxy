import { Component } from "react";
import "./index.css";
import Header from "../Header";

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

  render() {
    const { isLoading, requestDetails, errorMessage } = this.state;
    const {
      videoUrl,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      description,
      visibility,
      categoryId,
      privacyStatus,
      requestedDateTime,
    } = requestDetails;

    if (isLoading) {
      return <h1>Getting Data</h1>;
    }

    return (
      <div className="creator-request-details">
        <Header />
        <h1>Request Details</h1>
        <p>Requested By: {fromUser}</p>
        <p>Title: {title}</p>
        <p>Description: {description}</p>
        <p>From User: {fromUser}</p>
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
        {requestStatus === "pending" && (
          <div>
            <button onClick={this.onApprove}>Approve</button>
            <button onClick={this.onReject}>Reject</button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        )}
      </div>
    );
  }
}

export default CreatorRequestDetails;
