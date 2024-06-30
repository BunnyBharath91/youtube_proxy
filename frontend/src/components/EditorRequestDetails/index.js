import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import loading from "../../images/loading.png";
import apology from "../../images/apology.png";
import errorWhileUploading from "../../images/errorWhileUploading.jpg";
import forbidden from "../../images/forbidden.jpg";
import successful from "../../images/successful.jpg";
import {
  EditorRequestDetailsSection,
  RequestHeading,
  MediaContainer,
  MediaCard,
  RequestDetailsHeading,
  MediaItem,
  TextContainer,
  VideoTitleHeading,
  VideoTitle,
  VideoDescriptionHeading,
  VideoDescription,
  ElementsContainer,
  Element,
  ElementValue,
  ButtonsContainer,
  LoadingSection,
  LoadingImage,
  LoadingText,
  UploadResponseSection,
  UploadResponseImage,
  UploadResponseMessage,
  Button,
} from "./styledComponents";

class EditorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      loading: true,
      uploadResponse: "",
      uploadResponseMessage: "",
      uploadResponseImg: "",
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
    const { videoId } = requestDetails;
    const requestBody = {
      videoId,
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

      const responseData = await response.json();
      console.log("upload response data: ", responseData);
      if (response.ok) {
        this.setState({
          loading: false,
          uploadResponse: "success",
          uploadResponseMessage: responseData.message,
        });
        console.log("Video uploaded successfully:", responseData);
        // window.location.reload(); // Reload the page
        // alert("Video uploaded successfully");
      } else {
        if (response.status === 403) {
          if (responseData.reason === "quotaExceeded") {
            this.setState({
              loading: false,
              uploadResponse: "failure",
              uploadResponseMessage: responseData.message,
              uploadResponseImg: apology,
            });
          } else {
            this.setState({
              loading: false,
              uploadResponse: "failure",
              uploadResponseMessage: responseData.message,
              uploadResponseImg: forbidden,
            });
          }
        } else {
          this.setState({
            loading: false,
            uploadResponse: "failure",
            uploadResponseMessage: responseData.message,
            uploadResponseImg: errorWhileUploading,
          });
        }

        console.log("response of error", response);
        // alert("Error while uploading");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        loading: false,
        uploadResponse: "failure",
        uploadResponseMessage: "Error while uploading video",
        uploadResponseImg: errorWhileUploading,
      });
      //   alert("Error uploading video");
    }
  };

  resendRequest = async () => {
    const { requestDetails } = this.state;
    const { videoId } = requestDetails;
    this.setState({ loading: true });

    try {
      const response = await fetch(`/resend/${videoId}`);
      if (response.ok) {
        alert("Resent successfully");
        window.location.reload();
      } else {
        this.setState({ loading: false });
        throw new Error("Error in resending. Please try again.");
      }
    } catch (error) {
      console.error("Error in resending:", error);

      this.setState({ loading: false });
      throw new Error("Error in resending. Please try again.");
    }
  };

  renderLoading = () => {
    return (
      <LoadingSection>
        <LoadingImage alt="loading img" src={loading} />
        <LoadingText>Please Wait!, We are on your request...</LoadingText>
      </LoadingSection>
    );
  };

  onResetUploadResponse = () => {
    this.setState({
      uploadResponse: "",
      uploadResponseMessage: "",
    });
    window.location.reload(); // Reload the page
  };

  renderUploadResponse = () => {
    const {
      uploadResponse,
      uploadResponseMessage,
      uploadResponseImg,
    } = this.state;

    return (
      <UploadResponseSection>
        <UploadResponseImage
          alt="loading img"
          src={uploadResponse === "success" ? successful : uploadResponseImg}
        />
        <UploadResponseMessage>{uploadResponseMessage}</UploadResponseMessage>
        <Button onClick={this.onResetUploadResponse}>Go Back</Button>
      </UploadResponseSection>
    );
  };

  renderRequestDetailsSection = (fsr) => {
    const { requestDetails } = this.state;
    const {
      videoUrl,
      requestStatus,
      audience,
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

    return (
      <>
        <EditorRequestDetailsSection>
          <RequestHeading ratio={fsr}>Request Details</RequestHeading>
          <MediaContainer>
            <MediaCard>
              <RequestDetailsHeading ratio={fsr}>Video: </RequestDetailsHeading>
              <MediaItem controls poster={thumbnailUrl} preload="auto">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </MediaItem>
            </MediaCard>
            <MediaCard>
              <RequestDetailsHeading ratio={fsr}>
                Thumbnail:
              </RequestDetailsHeading>
              <MediaItem alt="thumbnail" as="img" src={thumbnailUrl} />
            </MediaCard>
          </MediaContainer>

          <TextContainer>
            <VideoTitleHeading ratio={fsr}>Title</VideoTitleHeading>
            <VideoTitle ratio={fsr}>{title}</VideoTitle>
          </TextContainer>
          <TextContainer>
            <VideoDescriptionHeading ratio={fsr}>
              Description
            </VideoDescriptionHeading>
            <VideoDescription ratio={fsr}>{description}</VideoDescription>
          </TextContainer>
          <ElementsContainer>
            <Element ratio={fsr}>
              Audience:
              <ElementValue ratio={fsr}>
                {audience === "yes" ? "kids" : "adults"}
              </ElementValue>
            </Element>
            <Element ratio={fsr}>
              Visibility:
              <ElementValue ratio={fsr}>{privacyStatus}</ElementValue>
            </Element>
            <Element ratio={fsr}>
              Category:<ElementValue ratio={fsr}>{categoryId}</ElementValue>
            </Element>

            <Element ratio={fsr}>
              Creator Id:<ElementValue ratio={fsr}>{toUser}</ElementValue>
            </Element>
            <Element ratio={fsr}>
              Requested on:
              <ElementValue ratio={fsr}>{requestedDateTime}</ElementValue>
            </Element>

            <Element ratio={fsr}>
              Request Status:{" "}
              <ElementValue ratio={fsr}>{requestStatus}</ElementValue>{" "}
            </Element>
            <Element ratio={fsr}>
              Responded on:
              <ElementValue ratio={fsr}>
                {responseDateTime ? responseDateTime : "NA"}
              </ElementValue>
            </Element>
            <Element ratio={fsr}>
              Upload Status:
              <ElementValue ratio={fsr}>
                {videoUploadStatus === "uploaded" ? "uploaded" : "pending"}
              </ElementValue>
            </Element>
          </ElementsContainer>
          <ButtonsContainer>
            {/* {videoUploadStatus === "not uploaded" && responseDateTime === null ? (
            <button onClick={this.resendRequest}>Resend Request</button>
          ) : (
            <button onClick={this.onUploadVideo}>Upload</button>
          )} */}

            {requestStatus === "approved" &&
              (responseDateTime ? (
                videoUploadStatus === "not uploaded" && (
                  <Button onClick={this.onUploadVideo} upload>
                    Upload
                  </Button>
                )
              ) : (
                <Button onClick={this.resendRequest} resend>
                  Resend Request
                </Button>
              ))}

            {videoUploadStatus === "not uploaded" &&
              requestStatus !== "pending" && (
                <Button onClick={this.onDeleteRequest} ratio={fsr} delete>
                  Delete request
                </Button>
              )}
          </ButtonsContainer>
        </EditorRequestDetailsSection>
      </>
    );
  };

  render() {
    const { loading, uploadResponse } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray } = value;
          const fsr = fontSizeRatio;
          console.log("editor request details ratio:", fontSizeRatio);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : uploadResponse
                  ? this.renderUploadResponse()
                  : this.renderRequestDetailsSection(fsr)}
              </div>
              <AccessibilitySection />
            </div>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default EditorRequestDetails;
