import { Component } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { TbReplace } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";
import loading from "../../images/loading.png";
import successful from "../../images/successful.jpg";
import errorWhileUploading from "../../images/errorWhileUploading.jpg";
import Header from "../Header";
import "./index.css";

class RequestSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      responseStatus: "",
      responseMessage: "",
      videoUrl: "",
      thumbnailUrl: "",
      videoTitle: "",
      videoDescription: "",
      thumbnailError: "",
      videoError: "",
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
      const response = await fetch("/upload-request", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({
          responseStatus: 200,
          responseMessage: data.message,
          loading: false,
        });
      } else {
        console.error("Upload failed with status:", response.status);
        this.setState({
          responseStatus: 500,
          responseMessage: "Upload failed. Please try again.",
          loading: false,
        }); // Example error handling
      }
    } catch (error) {
      console.error("Error uploading:", error);
      this.setState({
        responseStatus: 500,
        responseMessage: "Error uploading. Please try again.",
        loading: false,
      }); // Example error handling
    }
  };

  onVideoPreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024 * 1024 * 1024) {
        // Check if file size is greater than 2MB
        this.setState({
          videoError: "Video file size should not exceed 256GB.",
          videoUrl: "", // Reset the thumbnail URL
        });
        event.target.value = null; // Reset the file input
        return;
      }

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
      if (file.size > 2 * 1024 * 1024) {
        // Check if file size is greater than 2MB
        this.setState({
          thumbnailError: "Thumbnail file size should not exceed 2MB.",
          thumbnailUrl: "", // Reset the thumbnail URL
        });
        event.target.value = null; // Reset the file input
        return;
      }

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

  onChangeTitle = (event) => {
    this.setState({
      videoTitle: event.target.value,
    });
  };

  onChangeDescription = (event) => {
    this.setState({
      videoDescription: event.target.value,
    });
  };

  renderSubmitMessage = () => {
    const { responseStatus, responseMessage } = this.state;
    return (
      <div className="request-section loading-section">
        <img
          alt="loading img"
          src={responseStatus === 200 ? successful : errorWhileUploading}
          className="loading-img"
        />
        <p className="loading-text">{responseMessage}</p>
        <button onClick={this.onNewRequest} className="go-back-button">
          Go Back
        </button>
      </div>
    );
  };

  renderLoading = () => {
    return (
      <div className="request-section loading-section">
        <img alt="loading img" src={loading} className="loading-img" />
        <p className="loading-text">Please Wait!, We are on your request...</p>
      </div>
    );
  };

  renderRequestSection = () => {
    const {
      videoUrl,
      thumbnailUrl,
      videoTitle,
      videoDescription,
      thumbnailError,
    } = this.state;

    return (
      <div className="request-section">
        <h1 className="request-heading">Make a Request By: </h1>
        <form
          onSubmit={this.handleSubmit}
          encType="multipart/form-data"
          className="form-container"
        >
          <div className="media-files-container">
            <div className="media-container">
              {videoUrl ? (
                <div className="file-update-section">
                  <TbReplace
                    className="file-replace-icon"
                    onClick={() => {
                      document.getElementById("video").click(); // Trigger the file input click when the card is clicked
                    }}
                  />
                  <video className="myFile" controls preload="auto">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  className="myFile preview-card"
                  onClick={() => {
                    document.getElementById("video").click(); // Trigger the file input click when the card is clicked
                  }}
                >
                  <RiVideoUploadLine className="upload-icon" />
                  <p className="upload-text">Click here to Upload your video</p>
                </div>
              )}
              <input
                type="file"
                name="video"
                id="video"
                accept="video/mp4"
                onChange={this.onVideoPreview}
                className="file-button"
                required
                hidden
              />
            </div>
            <div className="media-container">
              {thumbnailUrl ? (
                <div className="file-update-section">
                  <TbReplace
                    className="file-replace-icon"
                    onClick={() => {
                      document.getElementById("thumbnail").click(); // Trigger the file input click when the card is clicked
                    }}
                  />
                  <img
                    alt="thumbnail-prev"
                    src={thumbnailUrl}
                    className="myFile"
                  />
                </div>
              ) : (
                <div
                  className="myFile preview-card"
                  onClick={() => {
                    document.getElementById("thumbnail").click(); // Trigger the file input click when the card is clicked
                  }}
                >
                  <RiVideoUploadLine className="upload-icon" />
                  <p className="upload-text">
                    Click here to Upload your thumbnail
                  </p>
                </div>
              )}
              <input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/jpeg, image/png"
                onChange={this.onThumbnailPreview}
                required
                hidden
              />
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="title" className="title-label">
              Title (required) <span className="info-icon">?</span>
            </label>
            <textarea
              name="title"
              id="title"
              className="title-textarea"
              maxLength={100}
              value={videoTitle}
              onChange={this.onChangeTitle}
              rows={1} /* Start with a single row */
              onInput={(e) => {
                // Adjust the height of the textarea to fit the content
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder=""
              required
            />
            <div className="char-count">{videoTitle.length}/100</div>
          </div>
          <div className="input-container">
            <label htmlFor="description" className="description-label">
              Description (required) <span className="info-icon">?</span>
            </label>
            <textarea
              name="description"
              id="description"
              className="description-textarea"
              maxLength={5000}
              value={videoDescription}
              onChange={this.onChangeDescription}
              rows={1} /* Start with a single row */
              onInput={(e) => {
                // Adjust the height of the textarea to fit the content
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder=""
              required
            />
            <div className="char-count">{videoDescription.length}/5000</div>
          </div>
          <div className="form-elements-container">
            <div className="form-element-container">
              <p className="form-element-heading">Audience (required)</p>
              <label className="audience-type">
                <input
                  type="radio"
                  name="audience"
                  value="yes"
                  className="audience-type-radio"
                />
                Yes, made for kids
              </label>
              <label className="audience-type">
                <input
                  type="radio"
                  name="audience"
                  value="no"
                  className="audience-type-radio"
                />
                No, not made for kids
              </label>
            </div>

            <div className="form-element-container">
              <label htmlFor="status" className="form-element-heading">
                Visibility (required):
              </label>
              <select name="privacy_status" id="status" required>
                <option value="" disabled selected>
                  Select <IoMdArrowDropdown className="select-dropdown" />
                </option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="form-element-container">
              <label htmlFor="category" className="form-element-heading">
                Category (required):
              </label>
              <select name="category_id" id="category" required>
                <option value="" disabled selected>
                  Select Category
                </option>
                <option value="22">Educational</option>
              </select>
            </div>
          </div>
          <div className="form-element-container">
            <label htmlFor="creator" className="form-element-heading">
              Creator id (required):
            </label>
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
  };

  render() {
    const { responseMessage, loading } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="main-container">
          {responseMessage
            ? this.renderSubmitMessage()
            : loading
            ? this.renderLoading()
            : this.renderRequestSection()}
        </div>
      </div>
    );
  }
}

export default RequestSection;
