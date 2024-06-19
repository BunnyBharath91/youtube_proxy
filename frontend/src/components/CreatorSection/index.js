import React, { Component } from "react";
import "./index.css";
import Header from "../Header";

class CreatorSection extends Component {
  state = {
    requestsList: [],
    loading: true,
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = async () => {
    try {
      const response = await fetch("/requests?role=creator");
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
      }));
      console.log(updatedData);
      this.setState({
        loading: false,
        requestsList: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
    }
  };

  onApprove = async (videoId) => {
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: true }),
      });

      if (response.ok) {
        await this.getRequests();
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

  onReject = async (videoId) => {
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: false }),
      });

      if (response.ok) {
        await this.getRequests();
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

  renderRequest = (requestItem) => {
    const {
      videoId,
      videoUrl,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
    } = requestItem;

    const onHandleApprove = (event) => {
      event.stopPropagation();
      this.onApprove(videoId);
    };

    const onHandleReject = (event) => {
      event.stopPropagation();
      this.onReject(videoId);
    };

    return (
      <li
        key={videoId}
        className="request-card"
        onClick={() => this.props.history.push(`/creator_section/${videoId}`)}
      >
        <p className="editor-id">{fromUser}</p>
        <p className="video-title">{title}</p>
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
        {requestStatus === "pending" ? (
          <div>
            <button onClick={onHandleApprove}>Approve</button>
            <button onClick={onHandleReject}>Reject</button>
          </div>
        ) : (
          <p>Request Status: {requestStatus}</p>
        )}
      </li>
    );
  };

  render() {
    const { requestsList, loading } = this.state;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div className="creator-section">
        <Header />
        <h1>Requests for you</h1>
        {requestsList.length === 0 ? (
          <h1>There are no requests</h1>
        ) : (
          <ul className="requests-list">
            {requestsList.map((eachItem) => this.renderRequest(eachItem))}
          </ul>
        )}
      </div>
    );
  }
}

export default CreatorSection;
