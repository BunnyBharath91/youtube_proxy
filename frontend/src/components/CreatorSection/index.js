import React, { Component } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import { getSectionData } from "../Header/languageContent";
import RequestsFilter from "../RequestsFilter";
import { apology, noRequests } from "../../images";
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
    selectedFilter: "",
    requestsList: [],
    loading: true,
    fetchingErrorStatus: "",
    isProcessing: false,
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = async (status = "") => {
    this.setState({
      loading: true,
      selectedFilter: status,
    });
    try {
      const response = await fetch(
        `/requests?role=creator${status && `&req_status=${status}`}`
      );
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
    } catch (err) {
      this.setState({ loading: false, fetchingErrorStatus: 400 });
    }
  };

  onApprove = async (videoId) => {
    this.setState({
      isProcessing: true,
    });
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: true }),
      });

      if (response.ok) {
        toast.success("Request approved successfully");
        await this.getRequests();
      } else {
        toast.error("Request approval failed");
      }
    } catch (err) {
      toast.error("Failed to process request");
    }
    this.setState({
      isProcessing: false,
    });
  };

  onReject = async (videoId) => {
    this.setState({
      isProcessing: true,
    });
    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: false }),
      });

      if (response.ok) {
        toast.success("Request rejected successfully");
        await this.getRequests();
      } else {
        toast.error("Request rejection failed");
      }
    } catch (err) {
      toast.error("Failed to process request");
    }
    this.setState({
      isProcessing: false,
    });
  };

  renderLoading = () => {
    return (
      <LoadingSection>
        <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </LoadingSection>
    );
  };

  renderRequest = (renderRequestContent, requestItem, fsr) => {
    const { isProcessing } = this.state;
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
        wait={isProcessing}
      >
        <RequestThumbnail alt="thumbnail" src={thumbnailUrl} loading="lazy" />
        <ResponseTextContainer>
          <VideoTitle ratio={fsr}>{title}</VideoTitle>
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
                <Button onClick={onHandleApprove} approve_>
                  {approve}
                </Button>
                <Button onClick={onHandleReject} reject_>
                  {reject}
                </Button>
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
            <Button onClick={onHandleApprove} disabled={isProcessing} approve_>
              {approve}
            </Button>
          ) : (
            "-"
          )}
        </LargeScreenResponseButtonContainer>
        <LargeScreenResponseButtonContainer>
          {requestStatus === "pending" ? (
            <Button onClick={onHandleReject} disabled={isProcessing} reject_>
              {reject}
            </Button>
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
    const { loading, requestsList, selectedFilter } = this.state;
    const {
      creatorSectionHeading,
      video,
      status,
      requestedOn,
      respondedOn,
      approve,
      reject,
      apologiesText,
      backToHome,
      renderRequestContent,
    } = renderRequestsSectionContent;
    return (
      <CreatorSectionContainer>
        <CreatorSectionHeading ratio={fsr}>
          {creatorSectionHeading}
        </CreatorSectionHeading>
        <RequestsFilter
          getRequests={this.getRequests}
          selectedFilter={selectedFilter}
        />
        {loading ? (
          this.renderLoading()
        ) : (
          <>
            {requestsList.length > 0 && (
              <RequestsTableHeader ratio={fsr}>
                <TableElement video>{video}</TableElement>
                <TableElement requestedDateTime>{requestedOn}</TableElement>
                <TableElement status>{status}</TableElement>
                <TableElement respondedDateTime>{respondedOn}</TableElement>
                <TableElement approve_>{approve}</TableElement>
                <TableElement reject_>{reject}</TableElement>
              </RequestsTableHeader>
            )}
            {requestsList.length === 0 ? (
              <NoRequestsContainer>
                <NoRequestsImage alt="loading img" src={noRequests} />
                <ApologiesText ratio={fsr}>{apologiesText}</ApologiesText>
                <StyledLink to="/" sUl={sUl}>
                  <Button>{backToHome}</Button>
                </StyledLink>
              </NoRequestsContainer>
            ) : (
              <RequestsContainer>
                {requestsList.map((eachItem) =>
                  this.renderRequest(renderRequestContent, eachItem, fsr)
                )}
              </RequestsContainer>
            )}
          </>
        )}
      </CreatorSectionContainer>
    );
  };

  render() {
    const { fetchingErrorStatus } = this.state;

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
          } = getSectionData(requestsSectionContent, activeLanguage);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {fetchingErrorStatus
                  ? renderFetchingErrorContent(renderFetchingErrorContent)
                  : this.renderCreatorSection(
                      renderRequestsSectionContent,
                      fsr,
                      sUl
                    )}
              </div>
              <AccessibilitySection />
              <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
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

export default CreatorSection;
