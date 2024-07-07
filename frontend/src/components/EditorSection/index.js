import React, { Component } from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import {
  noRequests,
  successful,
  forbidden,
  errorWhileUploading,
  apology,
  loading,
} from "../../images";
import { TailSpin } from "react-loader-spinner";
import {
  EditorSectionContainer,
  EditorSectionHeading,
  RequestsTableHeader,
  TableElement,
  NoRequestsContainer,
  NoRequestsImage,
  ApologiesText,
  StyledLink,
  RequestsContainer,
  RequestCard,
  RequestThumbnail,
  RequestTextContainer,
  VideoTitle,
  CreatorId,
  Id,
  StatusAndButtonsContainer,
  RequestStatus,
  Status,
  ButtonsContainer,
  VideoUploadedText,
  RequestedDateTime,
  LargeScreenRequestStatus,
  ResponseDateTime,
  ExtraLargeScreenUploadButtonContainer,
  LargeScreenDeleteButtonContainer,
  LoadingSection,
  FetchingErrorImage,
  FetchingErrorMessage,
  UploadResponseSection,
  UploadResponseImage,
  UploadResponseMessage,
  Button,
} from "./styledComponents";
import { requestsSectionContent, postRequestContent } from "./languageContent";

class EditorSectionRequests extends Component {
  state = {
    requestsList: [],
    loading: true,
    fetchingErrorStatus: "",
    uploadResponse: "",
    uploadResponseMessage: "",
    uploadResponseImg: "",
  };

  componentDidMount() {
    this.getRequests();
  }

  getEditorSectionData = (activeLanguage) => {
    switch (activeLanguage) {
      case "AR":
        return requestsSectionContent.AR;
      case "BN":
        return requestsSectionContent.BN;
      case "ZH":
        return requestsSectionContent.ZH;
      case "EN":
        return requestsSectionContent.EN;
      case "FR":
        return requestsSectionContent.FR;
      case "HI":
        return requestsSectionContent.HI;
      case "PT":
        return requestsSectionContent.PT;
      case "RU":
        return requestsSectionContent.RU;
      case "ES":
        return requestsSectionContent.ES;
      case "TE":
        return requestsSectionContent.TE;
      case "UR":
        return requestsSectionContent.UR;

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

  getRequests = async () => {
    this.setState({
      loading: true,
    });
    console.log("editor section loading: true ");
    try {
      const response = await fetch(`/requests?role=editor`);

      if (!response.ok) {
        this.setState({
          loading: false,
          fetchingErrorStatus: response.status,
        });
        return;
      }
      const data = await response.json();

      const updatedData = data.map((eachItem) => ({
        videoId: eachItem.id,
        videoUrl: eachItem.video_url,
        title: eachItem.title,
        description: eachItem.description,
        thumbnailUrl: eachItem.thumbnail_url,
        playLists: eachItem.playLists,
        audience: eachItem.audience,
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
      this.setState({ loading: false, fetchingErrorStatus: 400 });
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

  onUploadVideo = async (activeLanguage, videoId) => {
    const {
      successMessage,
      videoQuotaExceeded,
      videoForbidden,
      error500,
      thumbnailQuotaExceeded,
      thumbnailForbidden,
      error409,
    } = this.getPostRequestContent(activeLanguage);

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
        uploadResponseMessage: "Error while uploading video",
        uploadResponseImg: errorWhileUploading,
      });
      //   alert("Error uploading video");
    }
  };

  resendRequest = async (videoId) => {
    this.setState({ loading: true });

    try {
      const response = await fetch(`/resend/${videoId}`);
      if (response.ok) {
        window.location.reload();
        alert("Resent successfully");
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

  renderRequest = (activeLanguage, renderRequestContent, requestItem, fsr) => {
    const {
      videoId,
      requestStatus,
      toUser,
      title,
      thumbnailUrl,
      videoUploadStatus,
      requestedDateTime,
      responseDateTime,
    } = requestItem;
    const {
      to,
      requestStatus_,
      approved,
      pending,
      rejected,
      upload,
      resend,
      delete_,
      videoUploaded,
    } = renderRequestContent;

    const handleUpload = (event) => {
      event.stopPropagation();
      this.onUploadVideo(activeLanguage, videoId);
    };

    const handleDelete = (event) => {
      event.stopPropagation(); //prevents the event from bubbling up the DOM tree, effectively stopping any parent elements from handling the event.
      this.onDeleteRequest(videoId);
    };

    const handleResendRequest = (event) => {
      event.stopPropagation();
      this.resendRequest(videoId);
    };

    const requestedDate = requestedDateTime.slice(0, 10);
    const requestedTime = requestedDateTime.slice(11);

    let responseDate, responseTime;
    if (responseDateTime) {
      responseDate = responseDateTime.slice(0, 10);
      responseTime = responseDateTime.slice(11, 19);
    }

    return (
      //RequestCard,RequestThumbnail,RequestTextContainer
      <RequestCard
        key={videoId}
        onClick={() => this.props.history.push(`/editor_section/${videoId}`)}
      >
        <RequestThumbnail alt="thumbnail" src={thumbnailUrl} loading="lazy" />
        <RequestTextContainer className="request-card-text-container">
          <VideoTitle ratio={fsr}>
            This is my video title nothing fancy words just for checking
            text-overflow: ellipses property. I mean is it working or not{" "}
            {title}
          </VideoTitle>
          <CreatorId ratio={fsr}>
            {to}: <Id>{toUser}</Id>
          </CreatorId>
          <StatusAndButtonsContainer>
            <RequestStatus ratio={fsr}>
              {requestStatus_}:{" "}
              <Status>
                {requestStatus === "approved"
                  ? approved
                  : requestStatus === "pending"
                  ? pending
                  : rejected}
              </Status>
            </RequestStatus>

            <ButtonsContainer className="request-card-buttons-container">
              {requestStatus === "approved" &&
                (responseDateTime ? (
                  videoUploadStatus === "not uploaded" && (
                    <Button onClick={handleUpload}>{upload}</Button>
                  )
                ) : (
                  <Button onClick={handleResendRequest}>{resend}</Button>
                ))}

              {videoUploadStatus === "uploaded" && (
                <VideoUploadedText className="video-uploaded-text" ratio={fsr}>
                  {videoUploaded}
                </VideoUploadedText>
              )}
              {videoUploadStatus === "not uploaded" &&
                requestStatus !== "pending" && (
                  <Button onClick={handleDelete} delete>
                    {delete_}
                  </Button>
                )}
            </ButtonsContainer>
          </StatusAndButtonsContainer>
        </RequestTextContainer>
        <RequestedDateTime ratio={fsr}>
          <span>{requestedDate}</span>
          <span>{requestedTime}</span>
        </RequestedDateTime>
        <LargeScreenRequestStatus ratio={fsr}>
          {requestStatus === "approved"
            ? approved
            : requestStatus === "pending"
            ? pending
            : rejected}
        </LargeScreenRequestStatus>
        {/* <ResponseDateTime>
          {responseDateTime ? responseDateTime : "-"}
        </ResponseDateTime> */}
        {responseDateTime ? (
          <ResponseDateTime ratio={fsr}>
            <span>{responseDate}</span>
            <span>{responseTime}</span>
          </ResponseDateTime>
        ) : (
          <ResponseDateTime>{"-"}</ResponseDateTime>
        )}
        <ExtraLargeScreenUploadButtonContainer>
          {requestStatus === "approved" ? (
            responseDateTime ? (
              videoUploadStatus === "not uploaded" ? (
                <Button onClick={handleUpload}>{upload}</Button>
              ) : (
                "-"
              )
            ) : (
              <Button onClick={handleResendRequest}>{resend}</Button>
            )
          ) : (
            "-"
          )}
        </ExtraLargeScreenUploadButtonContainer>
        <LargeScreenDeleteButtonContainer>
          {videoUploadStatus === "not uploaded" &&
          requestStatus !== "pending" ? (
            <Button onClick={handleDelete} delete>
              {delete_}
            </Button>
          ) : (
            "-"
          )}
        </LargeScreenDeleteButtonContainer>
      </RequestCard>
    );
  };

  renderLoading = () => {
    return (
      <LoadingSection>
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </LoadingSection>
    );
  };

  renderFetchingError = (renderFetchingErrorContent) => {
    const { error500, retry } = renderFetchingErrorContent;

    const retryFetching = () => {
      this.getRequests();
    };

    return (
      <LoadingSection>
        <FetchingErrorImage alt="fetching error img" src={apology} />
        <FetchingErrorMessage>{error500}</FetchingErrorMessage>

        <Button onClick={retryFetching}>{retry}</Button>
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

  renderEditorSection = (
    renderRequestsSectionContent,
    activeLanguage,
    fsr,
    sUl
  ) => {
    const { requestsList } = this.state;
    const {
      sectionHeading,
      video,
      status,
      upload,
      delete_,
      requestedOn,
      respondedOn,
      editorApologiesText,
      makeARequest,
      renderRequestContent,
    } = renderRequestsSectionContent;
    return (
      <EditorSectionContainer>
        <EditorSectionHeading ratio={fsr}>
          {sectionHeading}
        </EditorSectionHeading>
        {requestsList.length > 0 && (
          <RequestsTableHeader ratio={fsr}>
            <TableElement video>{video}</TableElement>
            <TableElement requestedDateTime>{requestedOn}</TableElement>
            <TableElement status>{status}</TableElement>
            <TableElement respondedDateTime>{respondedOn}</TableElement>
            <TableElement upload>{upload} </TableElement>
            <TableElement delete>{delete_} </TableElement>
          </RequestsTableHeader>
        )}
        {requestsList.length === 0 ? (
          //NoRequestsContainer,NoRequestsImage,ApologiesText
          <NoRequestsContainer>
            <NoRequestsImage alt="loading img" src={noRequests} />
            <ApologiesText className="loading-text" ratio={fsr}>
              {editorApologiesText}
            </ApologiesText>
            <StyledLink to="/request_section" sUl={sUl}>
              <Button>{makeARequest}</Button>
            </StyledLink>
          </NoRequestsContainer>
        ) : (
          <RequestsContainer>
            {requestsList.map((eachItem) =>
              this.renderRequest(
                activeLanguage,
                renderRequestContent,
                eachItem,
                fsr
              )
            )}
          </RequestsContainer>
        )}
      </EditorSectionContainer>
    );
  };

  render() {
    const { loading, fetchingErrorStatus, uploadResponse } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const {
            activeLanguage,
            fontSizeRatio,
            showInGray,
            showUnderLines: sUl,
          } = value;
          const fsr = fontSizeRatio;
          console.log("editor section ratio: ", fontSizeRatio);
          const {
            renderRequestsSectionContent,
            renderFetchingErrorContent,
            renderUploadResponseContent,
          } = this.getEditorSectionData(activeLanguage);

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
                  : this.renderEditorSection(
                      renderRequestsSectionContent,
                      activeLanguage,
                      fsr,
                      sUl
                    )}
              </div>
              <AccessibilitySection />
              <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Slide}
                stacked
              />
            </div>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default EditorSectionRequests;
