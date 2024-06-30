import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import loading from "../../images/loading.png";
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
  LoadingImage,
  LoadingText,
} from "./styledComponents";

class CreatorRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetails: {},
      isLoading: true,
      errorMessage: "",
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
        isLoading: false,
        requestDetails: updatedData,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      this.setState({ loading: false });
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
        <LoadingImage alt="loading img" src={loading} />
        <LoadingText>Please Wait!, We are on your request...</LoadingText>
      </LoadingSection>
    );
  };

  renderRequestDetailsSection = (fsr) => {
    const { requestDetails, errorMessage } = this.state;
    const {
      videoUrl,
      requestStatus,
      fromUser,
      title,
      thumbnailUrl,
      description,
      audience,
      visibility,
      categoryId,
      privacyStatus,
      requestedDateTime,
      responseDateTime,
      videoUploadStatus,
    } = requestDetails;
    return (
      <CreatorRequestDetailsSection>
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
            Visibility:<ElementValue ratio={fsr}>{privacyStatus}</ElementValue>
          </Element>
          <Element ratio={fsr}>
            Category:<ElementValue ratio={fsr}>{categoryId}</ElementValue>
          </Element>

          <Element ratio={fsr}>
            Editor Id: <ElementValue ratio={fsr}>{fromUser}</ElementValue>
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

        {requestStatus === "pending" && (
          <ButtonsContainer>
            <Button onClick={this.onApprove} ratio={fsr}>
              Approve
            </Button>
            <Button onClick={this.onReject} ratio={fsr}>
              Reject
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
    const { isLoading } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray } = value;
          const fsr = fontSizeRatio;
          console.log("creator request details ratio:", fontSizeRatio);
          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header />
              <div className="main-container">
                {isLoading
                  ? this.renderLoading()
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

export default CreatorRequestDetails;
