import { Component } from "react";
import "./index.css";
import Header from "../Header";

class RequestSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      responseMessage: "",
      videoUrl: "",
      thumbnailUrl: "",
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
        this.setState({ responseMessage: data.message, loading: false });
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

  onVideoPreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.setState({
          videoUrl: reader.result,
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading video file:", error);
      };
    }
  };

  onThumbnailPreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.setState({
          thumbnailUrl: reader.result,
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading thumbnail file:", error);
      };
    }
  };

  render() {
    const { responseMessage, loading, videoUrl, thumbnailUrl } = this.state;

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
      <div className="bg-container">
        <Header />
        <div className="request-section">
          {/* <div className='custom-input'>
              <img id='chosen-img' alt='chosen-img-prev'/>
              <p id='file-name'></p>
              <input type='file' id='upload-button' accept='image/*' onChange={this.onUploadFile}/>
              <label htmlFor='upload-button'>
                  choose a file
              </label>
          </div> */}

          <h1 className="request-heading">Make a Request By: </h1>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <div>
              {videoUrl ? (
                <video width="100" height="100" controls preload="auto">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="preview-card">
                  <p>Select Video</p>
                </div>
              )}
              <label htmlFor="video">Video:</label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/mp4"
                onChange={this.onVideoPreview}
                required
              />
            </div>
            <div>
              {thumbnailUrl ? (
                <img
                  alt="thumbnail-prev"
                  src={thumbnailUrl}
                  className="thumbnail-img"
                />
              ) : (
                <div className="preview-card">
                  <p>Select Img</p>
                </div>
              )}
              <label htmlFor="thumbnail">Thumbnail:</label>
              <input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/jpeg, image/png"
                onChange={this.onThumbnailPreview}
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
              <label htmlFor="playlists">Playlists: </label>
              <select name="playlists" id="playlists">
                <option value="" disabled selected>
                  Select Playlists
                </option>
              </select>
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
      </div>
    );
  }
}

export default RequestSection;
