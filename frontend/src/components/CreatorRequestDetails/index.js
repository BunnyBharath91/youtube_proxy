import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import { TailSpin } from "react-loader-spinner";
import notFound from "../../images/notFound.png";
import apology from "../../images/apology.png";
import {
  CreatorRequestDetailsSection,
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
  Button,
  ErrorMessage,
  Err,
  LoadingSection,
  FetchingErrorImage,
  FetchingErrorMessage,
} from "./styledComponents";
import { requestDetailsContent } from "../EditorRequestDetails/languageContent";
import { youtubeCategories } from "../RequestSection/languageContent";

class CreatorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      loading: true,
      fetchingErrorStatus: "",
      errorMessage: "",
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
        thumbnailUrl: eachItem.thumbnail_url,
        title: eachItem.title,
        description: eachItem.description,

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

  onApprove = async () => {
    const { videoId } = this.props.match.params;

    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: true }),
      });

      if (response.ok) {
        await this.getRequestDetails(videoId);
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      this.setState({
        errorMessage: "Failed to process your request. Please try again.",
      });
    }
  };

  onReject = async () => {
    const { videoId } = this.props.match.params;

    try {
      const response = await fetch(`/response/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorResponse: false }),
      });

      if (response.ok) {
        await this.getRequestDetails(videoId);
      } else {
        throw new Error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      this.setState({
        errorMessage: "Failed to process your request. Please try again.",
      });
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

  renderRequestDetailsSection = (renderRequestDetailsContent, fsr) => {
    const { requestDetails, errorMessage } = this.state;
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
      editor,
      requestedOn,
      requestStatus_,
      uploaded,
      pending,
      respondedOn,
      uploadStatus,
      approve,
      reject,
      approved,
      rejected,
    } = renderRequestDetailsContent;

    const {
      videoUrl,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      description,
      audience,

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
      <CreatorRequestDetailsSection>
        <RequestHeading ratio={fsr}>{requestHeading}</RequestHeading>
        <MediaContainer>
          <MediaCard>
            <RequestDetailsHeading ratio={fsr}>{video}: </RequestDetailsHeading>
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
            {editor}: <ElementValue ratio={fsr}>{fromUser}</ElementValue>
          </Element>
          <Element ratio={fsr}>
            {requestedOn}:
            <ElementValue ratio={fsr}>{requestedDateTime}</ElementValue>
          </Element>

          <Element ratio={fsr}>
            {requestStatus_}:{" "}
            <ElementValue ratio={fsr}>
              {" "}
              {requestStatus === "approved"
                ? approved
                : requestStatus === "pending"
                ? pending
                : rejected}
            </ElementValue>
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

        {requestStatus === "pending" && (
          <ButtonsContainer>
            <Button onClick={this.onApprove} ratio={fsr}>
              {approve}
            </Button>
            <Button onClick={this.onReject} ratio={fsr}>
              {reject}
            </Button>
          </ButtonsContainer>
        )}
        {errorMessage && (
          <ErrorMessage>
            <Err>Error:</Err>
            {errorMessage}
          </ErrorMessage>
        )}
      </CreatorRequestDetailsSection>
    );
  };

  render() {
    const { loading, fetchingErrorStatus } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { activeLanguage, fontSizeRatio: fsr, showInGray } = value;
          const {
            renderRequestDetailsContent,
            renderFetchingErrorContent,
          } = this.getRequestDetailsSectionData(activeLanguage);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {loading
                  ? this.renderLoading()
                  : fetchingErrorStatus
                  ? this.renderFetchingError(renderFetchingErrorContent)
                  : this.renderRequestDetailsSection(
                      renderRequestDetailsContent,
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

export default CreatorRequestDetails;
