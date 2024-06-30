import React, { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import loading from "../../images/loading.png";
import apology from "../../images/apology.png";
import errorWhileUploading from "../../images/errorWhileUploading.jpg";
import forbidden from "../../images/forbidden.jpg";
import successful from "../../images/successful.jpg";
import noRequests from "../../images/noRequests.jpg";
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
  LoadingImage,
  LoadingText,
  UploadResponseSection,
  UploadResponseImage,
  UploadResponseMessage,
  Button,
} from "./styledComponents";

class EditorSectionRequests extends Component {
  state = {
    requestsList: [],
    loading: true,
    uploadResponse: "",
    uploadResponseMessage: "",
    uploadResponseImg: "",
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

  onUploadVideo = async (videoId) => {
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

  renderRequest = (requestItem, fsr) => {
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

    const handleUpload = (event) => {
      event.stopPropagation();
      this.onUploadVideo(videoId);
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
        <RequestThumbnail alt="thumbnail" src={thumbnailUrl} />
        <RequestTextContainer className="request-card-text-container">
          <VideoTitle ratio={fsr}>
            This is my video title nothing fancy words just for checking
            text-overflow: ellipses property. I mean is it working or not{" "}
            {title}
          </VideoTitle>
          <CreatorId ratio={fsr}>
            To: <Id>{toUser}</Id>
          </CreatorId>
          <StatusAndButtonsContainer>
            <RequestStatus ratio={fsr}>
              Request Status: <Status>{requestStatus}</Status>
            </RequestStatus>

            <ButtonsContainer className="request-card-buttons-container">
              {requestStatus === "approved" &&
                (responseDateTime ? (
                  videoUploadStatus === "not uploaded" && (
                    <Button onClick={handleUpload}>Upload</Button>
                  )
                ) : (
                  <Button onClick={handleResendRequest}>Resend</Button>
                ))}

              {videoUploadStatus === "uploaded" && (
                <VideoUploadedText className="video-uploaded-text" ratio={fsr}>
                  video uploaded
                </VideoUploadedText>
              )}
              {videoUploadStatus === "not uploaded" &&
                requestStatus !== "pending" && (
                  <Button onClick={handleDelete}>Delete</Button>
                )}
            </ButtonsContainer>
          </StatusAndButtonsContainer>
        </RequestTextContainer>
        <RequestedDateTime ratio={fsr}>
          <span>{requestedDate}</span>
          <span>{requestedTime}</span>
        </RequestedDateTime>
        <LargeScreenRequestStatus ratio={fsr}>
          {requestStatus}
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
                <Button onClick={handleUpload}>Upload</Button>
              ) : (
                "-"
              )
            ) : (
              <Button onClick={handleResendRequest}>Resend</Button>
            )
          ) : (
            "-"
          )}
        </ExtraLargeScreenUploadButtonContainer>
        <LargeScreenDeleteButtonContainer>
          {videoUploadStatus === "not uploaded" &&
          requestStatus !== "pending" ? (
            <Button onClick={handleDelete}>Delete</Button>
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

  renderEditorSection = (fsr, sUl) => {
    const { requestsList } = this.state;
    return (
      <EditorSectionContainer>
        <EditorSectionHeading ratio={fsr}>
          Requests you made
        </EditorSectionHeading>
        {requestsList.length > 0 && (
          <RequestsTableHeader ratio={fsr}>
            <TableElement video>Video</TableElement>
            <TableElement requestedDateTime>requested on</TableElement>
            <TableElement status>Status</TableElement>
            <TableElement respondedDateTime>responded on</TableElement>
            <TableElement upload>Upload </TableElement>
            <TableElement delete>Delete </TableElement>
          </RequestsTableHeader>
        )}
        {requestsList.length === 0 ? (
          //NoRequestsContainer,NoRequestsImage,ApologiesText
          <NoRequestsContainer>
            <NoRequestsImage alt="loading img" src={noRequests} />
            <ApologiesText className="loading-text" ratio={fsr}>
              Sorry! you haven't made any requests
            </ApologiesText>
            <StyledLink to="/request_section" sUl={sUl}>
              <Button>Make a Request</Button>
            </StyledLink>
          </NoRequestsContainer>
        ) : (
          <RequestsContainer>
            {requestsList.map((eachItem) => this.renderRequest(eachItem, fsr))}
          </RequestsContainer>
        )}
      </EditorSectionContainer>
    );
  };

  render() {
    const { loading, uploadResponse } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray, showUnderLines: sUl } = value;
          const fsr = fontSizeRatio;
          console.log("editor section ratio: ", fontSizeRatio);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : uploadResponse
                  ? this.renderUploadResponse()
                  : this.renderEditorSection(fsr, sUl)}
              </div>
              <AccessibilitySection />
            </div>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default EditorSectionRequests;
