import React, { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import apology from "../../images/apology.png";
import noRequests from "../../images/noRequests.jpg";
import { TailSpin } from "react-loader-spinner";
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
  FetchingErrorImage,
  FetchingErrorMessage,
} from "./styledComponents";
import { requestsSectionContent } from "../EditorSection/languageContent";

class CreatorSection extends Component {
  state = {
    requestsList: [],
    loading: true,
    fetchingErrorStatus: "",
  };

  componentDidMount() {
    this.getRequests();
  }

  getCreatorSectionContent = (activeLanguage) => {
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

  getRequests = async () => {
    try {
      const response = await fetch("/requests?role=creator");
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
        thumbnailUrl: eachItem.thumbnail_url,
        title: eachItem.title,
        description: eachItem.description,
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
      this.setState({ loading: false, fetchingErrorStatus: 400 });
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
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </LoadingSection>
    );
  };

  renderRequest = (renderRequestContent, requestItem, fsr) => {
    const {
      videoId,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      requestedDateTime,
      responseDateTime,
    } = requestItem;
    const {
      from,
      requestStatus_,
      approved,
      rejected,
      pending,
      approve,
      reject,
    } = renderRequestContent;

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
            {from}: <Id>{fromUser}</Id>
          </EditorId>
          {requestStatus !== "pending" && (
            <RequestStatus ratio={fsr}>
              {requestStatus_}:{" "}
              <Status>
                {" "}
                {requestStatus === "approved"
                  ? approved
                  : requestStatus === "pending"
                  ? pending
                  : rejected}
              </Status>
            </RequestStatus>
          )}
          {requestStatus === "pending" && (
            <PendingStatusAndButtonsContainer>
              <RequestStatus ratio={fsr}>
                {requestStatus_}:{" "}
                <Status>
                  {" "}
                  {requestStatus === "approved"
                    ? approved
                    : requestStatus === "pending"
                    ? pending
                    : rejected}
                </Status>
              </RequestStatus>
              <ButtonsContainer>
                <Button onClick={onHandleApprove}>{approve}</Button>
                <Button onClick={onHandleReject}>{reject}</Button>
              </ButtonsContainer>
            </PendingStatusAndButtonsContainer>
          )}
        </ResponseTextContainer>
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
            <Button onClick={onHandleApprove}>{approve}</Button>
          ) : (
            "-"
          )}
        </LargeScreenResponseButtonContainer>
        <LargeScreenResponseButtonContainer>
          {requestStatus === "pending" ? (
            <Button onClick={onHandleReject}>{reject}</Button>
          ) : (
            "-"
          )}
        </LargeScreenResponseButtonContainer>
      </RequestCard>
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

  renderCreatorSection = (renderRequestsSectionContent, fsr, sUl) => {
    const { requestsList } = this.state;
    const {
      sectionHeading,
      video,
      status,
      requestedOn,
      respondedOn,
      approve,
      reject,
      creatorApologiesText,
      renderRequestContent,
    } = renderRequestsSectionContent;
    return (
      <CreatorSectionContainer>
        <CreatorSectionHeading ratio={fsr}>
          {sectionHeading}
        </CreatorSectionHeading>
        {requestsList.length > 0 && (
          <RequestsTableHeader ratio={fsr}>
            <TableElement video>{video}</TableElement>
            <TableElement requestedDateTime>{requestedOn}</TableElement>
            <TableElement status>{status}</TableElement>
            <TableElement respondedDateTime>{respondedOn}</TableElement>
            <TableElement approve>{approve}</TableElement>
            <TableElement reject>{reject}</TableElement>
          </RequestsTableHeader>
        )}
        {requestsList.length === 0 ? (
          <NoRequestsContainer>
            <NoRequestsImage alt="loading img" src={noRequests} />
            <ApologiesText ratio={fsr}>{creatorApologiesText}</ApologiesText>
            <StyledLink to="/" sUl={sUl}>
              <Button>Go To Home</Button>
            </StyledLink>
          </NoRequestsContainer>
        ) : (
          <RequestsContainer>
            {requestsList.map((eachItem) =>
              this.renderRequest(renderRequestContent, eachItem, fsr)
            )}
          </RequestsContainer>
        )}
      </CreatorSectionContainer>
    );
  };

  render() {
    const { loading, fetchingErrorStatus } = this.state;

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
          console.log("creator section ratio: ", fontSizeRatio);
          const {
            renderRequestsSectionContent,
            renderFetchingErrorContent,
          } = this.getCreatorSectionContent(activeLanguage);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : fetchingErrorStatus
                  ? renderFetchingErrorContent(renderFetchingErrorContent)
                  : this.renderCreatorSection(
                      renderRequestsSectionContent,
                      fsr,
                      sUl
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

export default CreatorSection;
