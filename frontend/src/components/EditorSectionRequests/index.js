import React, { Component } from "react";
import "./index.css";
import Header from "../Header";

class EditorSection extends Component {
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

  onUploadVideo = async (requestItem) => {
    const {
      videoId,
      videoUrl,
      title,
      thumbnailUrl,
      description,
      privacyStatus,
    } = requestItem;

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
        console.log("response of error", response);
        alert("Error while uploading");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        isLoading: false,
      });
      alert("Error uploading video");
    }
  };

  resendRequest = async (videoId) => {
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

  renderRequest = (requestItem) => {
    const {
      videoId,
      videoUrl,
      requestStatus,
      toUser,
      title,
      thumbnailUrl,
      videoUploadStatus,
      responseDateTime,
    } = requestItem;

    const handleUpload = (event) => {
      event.stopPropagation();
      this.onUploadVideo(requestItem);
    };

    const handleDelete = (event) => {
      event.stopPropagation(); //prevents the event from bubbling up the DOM tree, effectively stopping any parent elements from handling the event.
      this.onDeleteRequest(videoId);
    };

    const responseDateTimeMs = new Date(responseDateTime).getTime();
    const currentTimeMs = new Date().getTime();
    const timeLimitMs = 55 * 60 * 1000;

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
            <p>Request Status: Approved</p>
            {videoUploadStatus === "not uploaded" ? (
              responseDateTimeMs + timeLimitMs > currentTimeMs ? (
                <button onClick={handleUpload}>Upload</button>
              ) : (
                <button onClick={handleResendRequest}>Resend Request</button>
              )
            ) : (
              <p>This video is uploaded</p>
            )}
          </div>
        )}

        {requestStatus === "pending" && <p>Request Status:Pending</p>}
        {requestStatus === "rejected" && <p> Request Status: Rejected</p>}
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

export default EditorSection;
