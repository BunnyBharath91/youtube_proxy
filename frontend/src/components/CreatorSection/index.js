import { Component } from "react";
import "./index.css";
import Header from "../Header";
import { v4 as uuidv4 } from "uuid";

class CreatorSection extends Component {
  state = {
    requestsList: [],
    loading: true,
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = async () => {
    const response = await fetch("/requests");
    if (response.ok) {
      const data = await response.json();
      console.log("fetched data: ", data);
      const updatedData = data.map((eachItem) => ({
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
      }));
      this.setState({
        loading: false,
        requestsList: updatedData,
      });
    } else {
      console.log("request failed with status: ", response.status);
    }
  };

  renderRequest = (requestItem) => {
    const { fromUser, title, thumbnailUrl } = requestItem;
    return (
      <li key={uuidv4()} className="request-card">
        <p className="editor-id">{fromUser}</p>
        <p className="video-title">{title}</p>
        <img alt="thumbnail" src={thumbnailUrl} className="thumbnail" />
        <button>Reject</button>
        <button>Approve</button>
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
