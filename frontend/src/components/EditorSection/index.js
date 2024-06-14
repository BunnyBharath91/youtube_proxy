import { Component } from "react";
import "./index.css";
import Header from "../Header";

class EditorSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      responseMessage: "",
    };
  }

  onNewRequest = () => {
    this.setState({
      responseMessage: "",
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ responseMessage: data.message, loading: false }); // Assuming your backend sends a JSON response with a 'message' field
      } else {
        console.error("Upload failed with status:", response.status);
        this.setState({
          responseMessage: "Upload failed. Please try again.",
          loading: false,
        }); // Example error handling
      }
    } catch (error) {
      console.error("Error uploading:", error);
      this.setState({
        responseMessage: "Error uploading. Please try again.",
        loading: false,
      }); // Example error handling
    }
  };

  render() {
    const { responseMessage, loading } = this.state;

    if (loading) {
      return <h1>Please wait for a moment. We are sending your request</h1>;
    }

    if (responseMessage) {
      return (
        <div>
          <h1>{responseMessage}</h1>
          <button onClick={this.onNewRequest}>
            Retry or Send another request
          </button>
        </div>
      );
    }

    return (
      <div className="editor-section-container">
        <Header />
        <h1 className="heading">THIS IS EDITOR SECTION</h1>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="video">Video:</label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/mp4"
              required
            />
          </div>
          <div>
            <label htmlFor="thumbnail">Thumbnail:</label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/jpeg, image/png"
              required
            />
          </div>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Your video title"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              name="description"
              id="description"
              placeholder="Your video description"
              required
            />
          </div>
          <div>
            <label htmlFor="status">Visibility:</label>
            <select name="privacy_status" id="status" required>
              <option value="" disabled selected>
                Select visibility
              </option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select name="category_id" id="category" required>
              <option value="" disabled selected>
                Select Category
              </option>
              <option value="22">Educational</option>
            </select>
          </div>
          <div>
            <label htmlFor="creator">creator id:</label>
            <input
              id="creator"
              name="creator_id"
              type="text"
              placeholder="fill creator id"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default EditorSection;
