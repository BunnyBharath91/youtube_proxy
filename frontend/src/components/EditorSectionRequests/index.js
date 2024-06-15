import React, { Component } from "react";
import "./index.css";
import Header from "../Header";

class EditorSectionRequests extends Component {
  state = {
    requestsList: [],
    loading: true,
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

  renderRequest = (requestItem) => {
    const {
      videoId,
      videoUrl,
      requestStatus,
      toUser,
      title,
      thumbnailUrl,
    } = requestItem;

    const handleDelete = (event) => {
      event.stopPropagation(); //prevents the event from bubbling up the DOM tree, effectively stopping any parent elements from handling the event.
      this.onDeleteRequest(videoId);
    };

    return (
      <li
        key={videoId}
        className="request-card"
        onClick={() => this.props.history.push(`/editor_section/${videoId}`)}
      >
        <p className="creator-id">TO: {toUser}</p>
        <p className="video-title">VIDEO TITLE: {title}</p>
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

        {requestStatus === "approved" && (
          <div>
            <p>Your request has been approved</p>
            <button>Upload</button>
          </div>
        )}
        {requestStatus === "pending" && <p>Your request is pending</p>}
        {requestStatus === "rejected" && <p> Your request is rejected</p>}
        <button onClick={handleDelete}>Delete request</button>
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
        <h1>Requests you made</h1>
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

export default EditorSectionRequests;
