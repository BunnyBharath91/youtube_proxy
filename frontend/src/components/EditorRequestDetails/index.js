import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import loading from "../../images/loading.png";
import { TailSpin } from "react-loader-spinner";
import notFound from "../../images/notFound.png";
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
  FetchingErrorImage,
  FetchingErrorMessage,
  UploadResponseSection,
  UploadResponseImage,
  UploadResponseMessage,
  Button,
} from "./styledComponents";
import { requestDetailsContent } from "./languageContent";
import { postRequestContent } from "../EditorSection/languageContent";
import { youtubeCategories } from "../RequestSection/languageContent";

class EditorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      loading: true,
      fetchingErrorStatus: "",
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

  getRequestDetailsSectionData = (activeLanguage) => {
    switch (activeLanguage) {
      case "AR":
        return requestDetailsContent.AR;
      case "BN":
        return requestDetailsContent.BN;
      case "ZH":
        return requestDetailsContent.ZH;
      case "EN":
        return requestDetailsContent.EN;
      case "FR":
        return requestDetailsContent.FR;
      case "HI":
        return requestDetailsContent.HI;
      case "PT":
        return requestDetailsContent.PT;
      case "RU":
        return requestDetailsContent.RU;
      case "ES":
        return requestDetailsContent.ES;
      case "TE":
        return requestDetailsContent.TE;
      case "UR":
        return requestDetailsContent.UR;

      default:
        return null;
    }
  };

  getPostRequestContent = (activeLanguage) => {
    switch (activeLanguage) {
      case "AR":
        return postRequestContent.AR;
      case "BN":
        return postRequestContent.BN;
      case "ZH":
        return postRequestContent.ZH;
      case "EN":
        return postRequestContent.EN;
      case "FR":
        return postRequestContent.FR;
      case "HI":
        return postRequestContent.HI;
      case "PT":
        return postRequestContent.PT;
      case "RU":
        return postRequestContent.RU;
      case "ES":
        return postRequestContent.ES;
      case "TE":
        return postRequestContent.TE;
      case "UR":
        return postRequestContent.UR;

      default:
        return null;
    }
  };

  getRequestDetails = async (videoId) => {
    this.setState({
      loading: true,
    });
    try {
      const response = await fetch(`/requests/${videoId}`);
      if (!response.ok) {
        this.setState({
          loading: false,
          fetchingErrorStatus: response.status,
        });
        return;
      }
      const eachItem = await response.json();
      console.log("fetched data: ", eachItem);
      const updatedData = {
        videoId: eachItem.id,
        videoUrl: eachItem.video_url,
        title: eachItem.title,
        description: eachItem.description,
        thumbnailUrl: eachItem.thumbnail_url,
        audience: eachItem.audience,
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
      this.setState({ loading: false, fetchingErrorStatus: 500 }); //just kept the errorStatus as 500 to show the fetchingError component
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

  onUploadVideo = async (activeLanguage) => {
    const {
      successMessage,
      videoQuotaExceeded,
      videoForbidden,
      error500,
      thumbnailQuotaExceeded,
      thumbnailForbidden,
      error409,
    } = this.getPostRequestContent(activeLanguage);

    const { requestDetails } = this.state;
    const { videoId } = requestDetails;
    const requestBody = {
      videoId,
    };
    this.setState({
      uploadResponse: "IN_PROGRESS",
    });
    try {
      const response = await fetch("/upload-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct Content-Type header
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("upload response data: ", responseData);
      if (response.ok) {
        this.setState({
          uploadResponse: "SUCCESS",
          uploadResponseMessage: successMessage,
        });
        console.log("Video uploaded successfully:", responseData);
        // window.location.reload(); // Reload the page
        // alert("Video uploaded successfully");
      } else {
        if (response.status === 403) {
          if (responseData.reason === "video quotaExceeded") {
            this.setState({
              uploadResponse: "FAILURE",
              uploadResponseMessage: videoQuotaExceeded,
              uploadResponseImg: apology,
            });
          } else if (responseData.reason === "thumbnail quotaExceeded") {
            this.setState({
              uploadResponse: "FAILURE",
              uploadResponseMessage: thumbnailQuotaExceeded,
              uploadResponseImg: apology,
            });
          } else if (responseData.reason === "video upload forbidden") {
            this.setState({
              uploadResponse: "FAILURE",
              uploadResponseMessage: videoForbidden,
              uploadResponseImg: forbidden,
            });
          } else {
            this.setState({
              uploadResponse: "FAILURE",
              uploadResponseMessage: thumbnailForbidden,
              uploadResponseImg: forbidden,
            });
          }
        } else if (response.status === 409) {
          this.setState({
            uploadResponse: "FAILURE",
            uploadResponseMessage: error409,
            uploadResponseImg: apology,
          });
        } else {
          this.setState({
            uploadResponse: "FAILURE",
            uploadResponseMessage: error500,
            uploadResponseImg: errorWhileUploading,
          });
        }

        console.log("response of error", response);
        // alert("Error while uploading");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      this.setState({
        uploadResponse: "FAILURE",
        uploadResponseMessage: error500,
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
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </LoadingSection>
    );
  };

  renderFetchingError = (renderFetchingErrorContent) => {
    const { fetchingErrorStatus } = this.state;
    const { notFoundError, otherError, retry } = renderFetchingErrorContent;

    const retryFetching = () => {
      const { videoId } = this.props.match.params;
      this.getRequestDetails(videoId);
    };

    return (
      <LoadingSection>
        <FetchingErrorImage
          alt="fetching error img"
          src={fetchingErrorStatus === 404 ? notFound : apology}
        />
        <FetchingErrorMessage>
          {fetchingErrorStatus === 404 ? notFoundError : otherError}
        </FetchingErrorMessage>
        {fetchingErrorStatus !== 404 && (
          <Button onClick={retryFetching}>{retry}</Button>
        )}
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

  renderUploadResponse = (renderUploadResponseContent) => {
    const {
      uploadResponse,
      uploadResponseMessage,
      uploadResponseImg,
    } = this.state;
    const { inProgressMessage, goBack } = renderUploadResponseContent;

    return (
      <UploadResponseSection>
        <UploadResponseImage
          alt="loading img"
          src={
            uploadResponse === "IN_PROGRESS"
              ? loading
              : uploadResponse === "SUCCESS"
              ? successful
              : uploadResponseImg
          }
        />
        {uploadResponse === "IN_PROGRESS" ? (
          <>
            <UploadResponseMessage>{inProgressMessage}</UploadResponseMessage>
          </>
        ) : (
          <>
            <UploadResponseMessage>
              {uploadResponseMessage}
            </UploadResponseMessage>
            <Button onClick={this.onResetUploadResponse}>{goBack}</Button>
          </>
        )}
      </UploadResponseSection>
    );
  };

  renderRequestDetailsSection = (
    renderRequestDetailsContent,
    activeLanguage,
    fsr
  ) => {
    const { requestDetails } = this.state;
    const {
      requestHeading,
      video,
      mediaItemText,
      thumbnail,
      title_,
      description_,
      audience_,
      kids,
      adults,
      visibility_,
      category,
      creator,
      requestedOn,
      requestStatus_,
      uploaded,
      pending,
      respondedOn,
      uploadStatus,
      upload,
      deleteRequest,
      resendRequest,
      approved,
      rejected,
    } = renderRequestDetailsContent;
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

    const categoryName = youtubeCategories.filter(
      (eachItem) => eachItem.id === categoryId
    )[0].category;

    return (
      <>
        <EditorRequestDetailsSection>
          <RequestHeading ratio={fsr}>{requestHeading}</RequestHeading>
          <MediaContainer>
            <MediaCard>
              <RequestDetailsHeading ratio={fsr}>
                {video}:{" "}
              </RequestDetailsHeading>
              <MediaItem controls poster={thumbnailUrl} preload="auto">
                <source src={videoUrl} type="video/mp4" />
                {mediaItemText}
              </MediaItem>
            </MediaCard>
            <MediaCard>
              <RequestDetailsHeading ratio={fsr}>
                {thumbnail}:
              </RequestDetailsHeading>
              <MediaItem alt="thumbnail" as="img" src={thumbnailUrl} />
            </MediaCard>
          </MediaContainer>

          <TextContainer>
            <VideoTitleHeading ratio={fsr}>{title_}</VideoTitleHeading>
            <VideoTitle ratio={fsr}>{title}</VideoTitle>
          </TextContainer>
          <TextContainer>
            <VideoDescriptionHeading ratio={fsr}>
              {description_}
            </VideoDescriptionHeading>
            <VideoDescription ratio={fsr}>{description}</VideoDescription>
          </TextContainer>
          <ElementsContainer>
            <Element ratio={fsr}>
              {audience_}:
              <ElementValue ratio={fsr}>
                {audience === "yes" ? kids : adults}
              </ElementValue>
            </Element>
            <Element ratio={fsr}>
              {visibility_}:
              <ElementValue ratio={fsr}>{privacyStatus}</ElementValue>
            </Element>
            <Element ratio={fsr}>
              {category}:<ElementValue ratio={fsr}>{categoryName}</ElementValue>
            </Element>

            <Element ratio={fsr}>
              {creator}:<ElementValue ratio={fsr}>{toUser}</ElementValue>
            </Element>
            <Element ratio={fsr}>
              {requestedOn}:
              <ElementValue ratio={fsr}>{requestedDateTime}</ElementValue>
            </Element>

            <Element ratio={fsr}>
              {requestStatus_}:{" "}
              <ElementValue ratio={fsr}>
                {requestStatus === "approved"
                  ? approved
                  : requestStatus === "pending"
                  ? pending
                  : rejected}
              </ElementValue>{" "}
            </Element>
            <Element ratio={fsr}>
              {respondedOn}:
              <ElementValue ratio={fsr}>
                {responseDateTime
                  ? `${responseDateTime.slice(0, 10)} ${responseDateTime.slice(
                      11,
                      19
                    )}`
                  : "NA"}
              </ElementValue>
            </Element>
            <Element ratio={fsr}>
              {uploadStatus}:
              <ElementValue ratio={fsr}>
                {videoUploadStatus === "uploaded" ? uploaded : pending}
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
                  <Button
                    onClick={() => this.onUploadVideo(activeLanguage)}
                    upload
                  >
                    {upload}
                  </Button>
                )
              ) : (
                <Button onClick={this.resendRequest} resend>
                  {resendRequest}
                </Button>
              ))}

            {videoUploadStatus === "not uploaded" &&
              requestStatus !== "pending" && (
                <Button onClick={this.onDeleteRequest} ratio={fsr} delete>
                  {deleteRequest}
                </Button>
              )}
          </ButtonsContainer>
        </EditorRequestDetailsSection>
      </>
    );
  };

  render() {
    const { loading, fetchingErrorStatus, uploadResponse } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { activeLanguage, fontSizeRatio, showInGray } = value;
          const fsr = fontSizeRatio;
          console.log("editor request details ratio:", fontSizeRatio);
          const {
            renderRequestDetailsContent,
            renderFetchingErrorContent,
            renderUploadResponseContent,
          } = this.getRequestDetailsSectionData(activeLanguage);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : fetchingErrorStatus
                  ? this.renderFetchingError(renderFetchingErrorContent)
                  : uploadResponse
                  ? this.renderUploadResponse(renderUploadResponseContent)
                  : this.renderRequestDetailsSection(
                      renderRequestDetailsContent,
                      activeLanguage,
                      fsr
                    )}
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
