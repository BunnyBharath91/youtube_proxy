import React, { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import loading from "../../images/loading.png";
import noRequests from "../../images/noRequests.jpg";
import {
  CreatorSectionContainer,
  CreatorSectionHeading,
  RequestsTableHeader,
  TableElement,
  NoRequestsContainer,
  NoRequestsImage,
  ApologiesText,
  StyledLink,
  RequestsContainer,
  RequestCard,
  RequestThumbnail,
  ResponseTextContainer,
  VideoTitle,
  EditorId,
  Id,
  StatusAndButtonsContainer,
  RequestStatus,
  Status,
  PendingStatusAndButtonsContainer,
  ButtonsContainer,
  RequestedDateTime,
  LargeScreenRequestStatus,
  ResponseDateTime,
  LargeScreenResponseButtonContainer,
  Button,
  LoadingSection,
  LoadingImage,
  LoadingText,
} from "./styledComponents";

class CreatorSection extends Component {
  state = {
    requestsList: [],
    loading: true,
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = async () => {
    try {
      const response = await fetch("/requests?role=creator");
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
      console.log(updatedData);
      this.setState({
        loading: false,
        requestsList: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
    }
  };

  onApprove = async (videoId) => {
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: true }),
      });

      if (response.ok) {
        await this.getRequests();
        alert("Request approved successfully");
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      throw new Error("Failed to process your request. Please try again.");
    }
  };

  onReject = async (videoId) => {
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: false }),
      });

      if (response.ok) {
        await this.getRequests();
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      throw new Error("Failed to process your request. Please try again.");
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

  renderRequest = (requestItem, fsr) => {
    const {
      videoId,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      requestedDateTime,
      responseDateTime,
    } = requestItem;

    const onHandleApprove = (event) => {
      event.stopPropagation();
      this.onApprove(videoId);
    };

    const onHandleReject = (event) => {
      event.stopPropagation();
      this.onReject(videoId);
    };

    const requestedDate = requestedDateTime.slice(0, 10);
    const requestedTime = requestedDateTime.slice(11);

    let responseDate, responseTime;
    if (responseDateTime) {
      responseDate = responseDateTime.slice(0, 10);
      responseTime = responseDateTime.slice(11, 19);
    }

    return (
      <RequestCard
        key={videoId}
        onClick={() => this.props.history.push(`/creator_section/${videoId}`)}
      >
        <RequestThumbnail alt="thumbnail" src={thumbnailUrl} />
        <ResponseTextContainer>
          <VideoTitle ratio={fsr}>
            This is my video title nothing fancy words just for checking
            text-overflow: ellipses property. I mean is it working or not{" "}
            {title}
          </VideoTitle>
          <EditorId ratio={fsr}>
            From: <Id>{fromUser}</Id>
          </EditorId>
          {requestStatus !== "pending" && (
            <RequestStatus ratio={fsr}>
              Status: <Status>{requestStatus}</Status>
            </RequestStatus>
          )}
          {requestStatus === "pending" && (
            <PendingStatusAndButtonsContainer>
              <RequestStatus ratio={fsr}>
                Status: <Status>{requestStatus}</Status>
              </RequestStatus>
              <ButtonsContainer>
                <Button onClick={onHandleApprove}>Approve</Button>
                <Button onClick={onHandleReject}>Reject</Button>
              </ButtonsContainer>
            </PendingStatusAndButtonsContainer>
          )}
        </ResponseTextContainer>
        <RequestedDateTime ratio={fsr}>
          <span>{requestedDate}</span>
          <span>{requestedTime}</span>
        </RequestedDateTime>
        <LargeScreenRequestStatus ratio={fsr}>
          {requestStatus}
        </LargeScreenRequestStatus>

        {responseDateTime ? (
          <ResponseDateTime ratio={fsr}>
            <span>{responseDate}</span>
            <span>{responseTime}</span>
          </ResponseDateTime>
        ) : (
          <ResponseDateTime>{"-"}</ResponseDateTime>
        )}
        <LargeScreenResponseButtonContainer>
          {requestStatus === "pending" ? (
            <Button onClick={onHandleApprove}>Approve</Button>
          ) : (
            "-"
          )}
        </LargeScreenResponseButtonContainer>
        <LargeScreenResponseButtonContainer>
          {requestStatus === "pending" ? (
            <Button onClick={onHandleReject}>Reject</Button>
          ) : (
            "-"
          )}
        </LargeScreenResponseButtonContainer>
      </RequestCard>
    );
  };

  renderCreatorSection = (fsr, sUl) => {
    const { requestsList } = this.state;
    return (
      <CreatorSectionContainer>
        <CreatorSectionHeading ratio={fsr}>
          Requests for you
        </CreatorSectionHeading>
        {requestsList.length > 0 && (
          <RequestsTableHeader ratio={fsr}>
            <TableElement video>Video</TableElement>
            <TableElement requestedDateTime>requested on</TableElement>
            <TableElement status>Status</TableElement>
            <TableElement respondedDateTime>responded on</TableElement>
            <TableElement approve>Approve</TableElement>
            <TableElement reject>Reject</TableElement>
          </RequestsTableHeader>
        )}
        {requestsList.length === 0 ? (
          <NoRequestsContainer>
            <NoRequestsImage alt="loading img" src={noRequests} />
            <ApologiesText ratio={fsr}>
              Sorry! there are no requests for you
            </ApologiesText>
            <StyledLink to="/" sUl={sUl}>
              <Button>Go To Home</Button>
            </StyledLink>
          </NoRequestsContainer>
        ) : (
          <RequestsContainer>
            {requestsList.map((eachItem) => this.renderRequest(eachItem, fsr))}
          </RequestsContainer>
        )}
      </CreatorSectionContainer>
    );
  };

  render() {
    const { loading } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray, showUnderLines: sUl } = value;
          const fsr = fontSizeRatio;
          console.log("creator section ratio: ", fontSizeRatio);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : this.renderCreatorSection(fsr, sUl)}
              </div>
              <AccessibilitySection />
            </div>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default CreatorSection;
