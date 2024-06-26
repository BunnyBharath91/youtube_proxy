import React, { Component } from "react";
import "./index.css";
import Header from "../Header";
import loading from "../../images/loading.png";
import noRequests from "../../images/noRequests.jpg";

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
        alert("Request approved successfully");
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      throw new Error("Failed to process your request. Please try again.");
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
      throw new Error("Failed to process your request. Please try again.");
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

  renderRequest = (requestItem) => {
    const {
      videoId,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      requestedDateTime,
      responseDateTime,
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
        <img
          alt="thumbnail"
          src={thumbnailUrl}
          className="request-card-thumbnail"
        />
        <div
          className="request-card-text-container "
          id="response-card-text-container"
        >
          <p className="video-title">
            This is my video title nothing fancy words just for checking
            text-overflow: ellipses property. I mean is it working or not{" "}
            {title}
          </p>
          <p className="creator-id">From: {fromUser}</p>
          <div className="status-response-buttons-container">
            {requestStatus === "rejected" && (
              <p className="response-text">Status: {requestStatus}</p>
            )}
            {requestStatus === "approved" && (
              <p className="response-text">Status: {requestStatus}</p>
            )}
            {requestStatus === "pending" && (
              <div className="pending-status-buttons-container">
                <p className="response-text">Status: {requestStatus}</p>
                <div className="response-buttons-container">
                  <button
                    onClick={onHandleApprove}
                    className="request-approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={onHandleReject}
                    className="request-reject-button"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="extra-large-screen-response-date-time">
          {requestedDateTime}
        </p>
        <p className="large-screen-response-status">{requestStatus}</p>
        <p className="extra-large-screen-response-date-time">
          {responseDateTime ? responseDateTime : "-"}
        </p>
        <div className="large-screen-response-button-container">
          {requestStatus === "pending" ? (
            <button
              className="large-screen-response-button"
              onClick={onHandleApprove}
            >
              Approve
            </button>
          ) : (
            "-"
          )}
        </div>
        <div className="large-screen-response-button-container">
          {requestStatus === "pending" ? (
            <button
              className="large-screen-response-button"
              onClick={onHandleReject}
            >
              Reject
            </button>
          ) : (
            "-"
          )}
        </div>
      </li>
    );
  };

  renderEditorSection = () => {
    const { requestsList } = this.state;
    return (
      <div className="editor-section">
        <h1 className="editor-section-heading">Requests for you</h1>
        {requestsList.length > 0 && (
          <div className="requests-table-header">
            <p className="creator-section-video-column">Video</p>
            <p className="creator-section-requested-date-time-column">
              requested on
            </p>
            <p className="creator-section-status-column">Status</p>
            <p className="creator-section-requested-date-time-column">
              responded on
            </p>
            <p className="creator-section-approve-column">Approve</p>
            <p className="creator-section-reject-column">Reject</p>
          </div>
        )}
        {requestsList.length === 0 ? (
          <div className="request-section loading-section">
            <img alt="loading img" src={noRequests} className="loading-img" />
            <p className="loading-text">Sorry! there are no requests for you</p>
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
    const { loading } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="main-container">
          {loading ? this.renderLoading() : this.renderEditorSection()}
        </div>
      </div>
    );
  }
}

export default CreatorSection;
