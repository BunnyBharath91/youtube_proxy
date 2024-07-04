import { Component } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import loading from "../../images/loading.png";
import successful from "../../images/successful.jpg";
import errorWhileUploading from "../../images/errorWhileUploading.jpg";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import AccessibilitySection from "../AccessibilitySection";
import Header from "../Header";
import {
  RequestSectionContainer,
  Heading,
  RequestForm,
  MediaFilesContainer,
  MediaContainer,
  FileUpdateSection,
  StyledFileReplaceIcon,
  MyFile,
  PreviewCard,
  UploadIcon,
  UploadText,
  FileButton,
  InputContainer,
  TitleLabel,
  InfoIcon,
  TitleTextArea,
  CharCount,
  DescriptionLabel,
  DescriptionTextArea,
  FormElementsContainer,
  FormElementContainer,
  FormElementHeading,
  AudienceType,
  AudienceTypeRadio,
  FormElementSelect,
  FormElementSelectOption,
  InputCreator,
  Button,
  LoadingSection,
  LoadingImage,
  LoadingText,
  SubmitResponseSection,
  SubmitResponseImage,
  SubmitResponseMessage,
  ErrorMessage,
} from "./styledComponents";

import { requestSectionContent, youtubeCategories } from "./languageContent";

class RequestSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseStatus: "",
      videoUrl: "",
      thumbnailUrl: "",
      videoTitle: "",
      videoDescription: "",
      creatorInvitationCode: "",
      thumbnailError: "",
      videoError: "",
      titleError: "",
      descriptionError: "",
      audienceError: "",
      visibilityError: "",
      categoryError: "",
      invitationError: "",
    };
  }

  getRequestSectionData = (activeLanguage) => {
    switch (activeLanguage) {
      case "AR":
        return requestSectionContent.AR;
      case "BN":
        return requestSectionContent.BN;
      case "ZH":
        return requestSectionContent.ZH;
      case "EN":
        return requestSectionContent.EN;
      case "FR":
        return requestSectionContent.FR;
      case "HI":
        return requestSectionContent.HI;
      case "PT":
        return requestSectionContent.PT;
      case "RU":
        return requestSectionContent.RU;
      case "ES":
        return requestSectionContent.ES;
      case "TE":
        return requestSectionContent.TE;
      case "UR":
        return requestSectionContent.UR;

      default:
        return null;
    }
  };

  onNewRequest = () => {
    window.location.reload();
  };

  checkAllFields = () => {
    const { videoUrl, thumbnailUrl, videoTitle, videoDescription } = this.state;
    let isValid = true;

    if (!videoUrl) {
      this.setState({ videoError: "Please select a video" });
      isValid = false;
    }

    if (!thumbnailUrl) {
      this.setState({ thumbnailError: "Please select a thumbnail" });
      isValid = false;
    }

    if (!videoTitle) {
      this.setState({ titleError: "Please give title for your video" });
      isValid = false;
    }

    if (!videoDescription) {
      this.setState({
        descriptionError: "Please give description for your video",
      });
      isValid = false;
    }

    const audience = document.querySelector('input[name="audience"]:checked');
    if (!audience) {
      this.setState({ audienceError: "Please select audience type" });
      isValid = false;
    }

    const visibility = document.getElementById("status").value;
    if (!visibility) {
      this.setState({ visibilityError: "Please select visibility" });
      isValid = false;
    }

    const category = document.getElementById("category").value;
    if (!category) {
      this.setState({ categoryError: "Please select category" });
      isValid = false;
    }

    const invitationCode = document.getElementById("creator").value;
    if (!invitationCode) {
      this.setState({ invitationError: "Please give creator invitation code" });
      isValid = false;
    }

    return isValid;
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.checkAllFields()) {
      return;
    }

    console.log("responseStatus:IN_PROGRESS");
    this.setState({
      responseStatus: "IN_PROGRESS",
    });

    const form = event.currentTarget;
    const formData = new FormData(form);
    console.log("formData:", formData);

    try {
      const response = await fetch("/upload-request", {
        method: "POST",
        body: formData,
      });
      console.log("response for uploadrequest:", response);
      console.log("response.ok: ", response.ok);

      if (response.ok) {
        console.log("responseStatus:200");
        this.setState({
          responseStatus: 200,
        });
      } else {
        console.error("Upload failed with status:", response.status);
        this.setState({
          responseStatus: 500,
        });
      }
    } catch (error) {
      console.error("Error uploading:", error);
      this.setState({
        responseStatus: 400,
      });
    }
  };

  onChangeVideo = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024 * 1024 * 1024) {
        // Check if file size is greater than 2MB
        this.setState({
          videoError: "Video file size should not exceed 256GB.",
          videoUrl: "", // Reset the thumbnail URL
        });
        console.log("file size is more than 256GB");
        event.target.value = null; // Reset the file input
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.setState({
          videoUrl: reader.result,
          videoError: "",
        });
        console.log(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading video file:", error);
      };
    }
  };

  onChangeThumbnail = (event) => {
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
          thumbnailError: "",
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
      titleError: "",
    });
  };

  onChangeDescription = (event) => {
    this.setState({
      videoDescription: event.target.value,
      descriptionError: "",
    });
  };

  onChangeVisibility = (event) => {
    this.setState({
      visibilityError: "",
    });
  };

  onChangeCategory = (event) => {
    this.setState({
      categoryError: "",
    });
  };

  onChangeCreatorInvitationCode = (event) => {
    this.setState({
      creatorInvitationCode: event.target.value,
      invitationError: "",
    });
  };

  removeAudienceError = () => {
    this.setState({
      audienceError: "",
    });
  };

  onTitleBlur = (event) => {
    if (event.target.value === "") {
      this.setState({
        titleError: "please give title for your video",
      });
    } else {
      this.setState({
        titleError: "",
      });
    }
  };

  onDescriptionBlur = (event) => {
    if (event.target.value === "") {
      this.setState({
        descriptionError: "please give description for your video",
      });
    } else {
      this.setState({
        descriptionError: "",
      });
    }
  };

  onVisibilityBlur = (event) => {
    if (event.target.value === "") {
      this.setState({
        visibilityError: "please select visibility",
      });
    } else {
      this.setState({
        visibilityError: "",
      });
    }
  };

  onCategoryBlur = (event) => {
    if (event.target.value === "") {
      this.setState({
        categoryError: "please select category",
      });
    } else {
      this.setState({
        categoryError: "",
      });
    }
  };

  onCreatorInvitationCodeInputBlur = (event) => {
    if (event.target.value === "") {
      this.setState({
        invitationError: "please give creator invitation code",
      });
    } else {
      this.setState({
        invitationError: "",
      });
    }
  };

  renderSubmitMessage = (renderSubmitMessageContent) => {
    const { responseStatus } = this.state;
    const {
      successMessage,
      clientErrorMessage,
      serverErrorMessage,
      goBack,
    } = renderSubmitMessageContent;
    return (
      <SubmitResponseSection>
        <SubmitResponseImage
          alt="loading img"
          src={responseStatus === 200 ? successful : errorWhileUploading}
        />
        <SubmitResponseMessage>
          {responseStatus === 200
            ? successMessage
            : responseStatus === 400
            ? clientErrorMessage
            : serverErrorMessage}
        </SubmitResponseMessage>
        <Button onClick={this.onNewRequest} goBack>
          {goBack}
        </Button>
      </SubmitResponseSection>
    );
  };

  renderLoading = (renderLoadingContent) => {
    const { loadingText } = renderLoadingContent;
    return (
      <LoadingSection>
        <LoadingImage alt="loading img" src={loading} />
        <LoadingText>{loadingText}...</LoadingText>
      </LoadingSection>
    );
  };

  renderRequestSection = (
    renderRequestSectionContent,

    fsr
  ) => {
    const {
      videoUrl,
      thumbnailUrl,
      videoTitle,
      videoDescription,
      videoError,
      thumbnailError,
      titleError,
      descriptionError,
      audienceError,
      visibilityError,
      categoryError,
      invitationError,
    } = this.state;

    const {
      heading,
      myFileText,
      uploadVideoText,
      uploadThumbnailText,
      title_,
      description_,
      audience_,
      madeForKids,
      notMadeForKids,
      visibility_,
      select,
      public_,
      private_,
      category,
      selectCategory,
      creatorInvitationCode,
      submit,
    } = renderRequestSectionContent;

    return (
      <RequestSectionContainer>
        <Heading ratio={fsr}>{heading}: </Heading>
        <RequestForm onSubmit={this.handleSubmit} encType="multipart/form-data">
          <MediaFilesContainer>
            <MediaContainer>
              {videoUrl ? (
                <FileUpdateSection>
                  <StyledFileReplaceIcon
                    onClick={() => {
                      document.getElementById("video").click(); // Trigger the file input click when the card is clicked
                    }}
                  />

                  <MyFile controls preload="auto">
                    <source src={videoUrl} type="video/mp4" />
                    {myFileText}
                  </MyFile>
                </FileUpdateSection>
              ) : (
                <PreviewCard
                  onClick={() => {
                    document.getElementById("video").click(); // Trigger the file input click when the card is clicked
                  }}
                >
                  <UploadIcon>
                    <RiVideoUploadLine />
                  </UploadIcon>

                  <UploadText ratio={fsr}>{uploadVideoText}</UploadText>
                </PreviewCard>
              )}
              <ErrorMessage>{videoError}</ErrorMessage>
              <FileButton
                type="file"
                name="video"
                id="video"
                accept="video/mp4"
                onChange={this.onChangeVideo}
                hidden
              />
            </MediaContainer>
            <MediaContainer>
              {thumbnailUrl ? (
                <FileUpdateSection>
                  <StyledFileReplaceIcon
                    onClick={() => {
                      document.getElementById("thumbnail").click(); // Trigger the file input click when the card is clicked
                    }}
                  />

                  <MyFile alt="thumbnail-prev" as="img" src={thumbnailUrl} />
                </FileUpdateSection>
              ) : (
                <PreviewCard
                  className="myFile preview-card"
                  onClick={() => {
                    document.getElementById("thumbnail").click(); // Trigger the file input click when the card is clicked
                  }}
                >
                  <UploadIcon>
                    <RiVideoUploadLine />
                  </UploadIcon>

                  <UploadText ratio={fsr}>{uploadThumbnailText}</UploadText>
                </PreviewCard>
              )}
              <ErrorMessage>{thumbnailError}</ErrorMessage>
              <FileButton
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/jpeg, image/png"
                onChange={this.onChangeThumbnail}
                hidden
              />
            </MediaContainer>
          </MediaFilesContainer>
          <InputContainer>
            <TitleLabel htmlFor="title" ratio={fsr}>
              {title_} <InfoIcon>?</InfoIcon>
            </TitleLabel>
            <TitleTextArea
              name="title"
              id="title"
              maxLength={100}
              value={videoTitle}
              onChange={this.onChangeTitle}
              rows={1} /* Starting with a single row */
              onInput={(e) => {
                // Adjust the height of the textarea to fit the content
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder=""
              onBlur={this.onTitleBlur}
              ratio={fsr}
            />
            <CharCount ratio={fsr}>{videoTitle.length}/100</CharCount>
          </InputContainer>
          <ErrorMessage>{titleError}</ErrorMessage>
          <InputContainer>
            <DescriptionLabel htmlFor="description" ratio={fsr}>
              {description_}
              <InfoIcon>?</InfoIcon>
            </DescriptionLabel>
            <DescriptionTextArea
              name="description"
              id="description"
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
              onBlur={this.onDescriptionBlur}
              ratio={fsr}
            />
            <CharCount ratio={fsr}>{videoDescription.length}/5000</CharCount>
          </InputContainer>
          <ErrorMessage>{descriptionError}</ErrorMessage>
          <FormElementsContainer>
            <FormElementContainer>
              <FormElementHeading ratio={fsr}>{audience_}</FormElementHeading>
              <AudienceType ratio={fsr}>
                <AudienceTypeRadio
                  type="radio"
                  name="audience"
                  value="yes"
                  onChange={this.removeAudienceError}
                />
                {madeForKids}
              </AudienceType>
              <AudienceType ratio={fsr}>
                <AudienceTypeRadio
                  type="radio"
                  name="audience"
                  value="no"
                  onChange={this.removeAudienceError}
                />
                {notMadeForKids}
              </AudienceType>
              <ErrorMessage>{audienceError}</ErrorMessage>
            </FormElementContainer>

            <FormElementContainer>
              <FormElementHeading htmlFor="status" ratio={fsr}>
                {visibility_}:
              </FormElementHeading>
              <FormElementSelect
                name="privacy_status"
                id="status"
                onBlur={this.onVisibilityBlur}
                onChange={this.onChangeVisibility}
              >
                <FormElementSelectOption value="" disabled selected>
                  {select} <IoMdArrowDropdown className="select-dropdown" />
                </FormElementSelectOption>
                <FormElementSelectOption value="public">
                  {public_}
                </FormElementSelectOption>
                <FormElementSelectOption value="private">
                  {private_}
                </FormElementSelectOption>
              </FormElementSelect>
              <ErrorMessage>{visibilityError}</ErrorMessage>
            </FormElementContainer>
            <FormElementContainer>
              <FormElementHeading as="label" htmlFor="category" ratio={fsr}>
                {category}:
              </FormElementHeading>
              <FormElementSelect
                name="category_id"
                id="category"
                onBlur={this.onCategoryBlur}
                onChange={this.onChangeCategory}
              >
                <FormElementSelectOption value="" disabled selected>
                  {selectCategory}
                </FormElementSelectOption>
                {youtubeCategories.map((eachItem) => (
                  <FormElementSelectOption value={eachItem.id}>
                    {eachItem.category}
                  </FormElementSelectOption>
                ))}
              </FormElementSelect>
              <ErrorMessage>{categoryError}</ErrorMessage>
            </FormElementContainer>
          </FormElementsContainer>
          <FormElementContainer creatorCode>
            <FormElementHeading htmlFor="creator" ratio={fsr}>
              {creatorInvitationCode}:
            </FormElementHeading>
            <InputCreator
              id="creator"
              name="creator_invitation_code"
              type="text"
              placeholder="fill creator id"
              onBlur={this.onCreatorInvitationCodeInputBlur}
              onChange={this.onChangeCreatorInvitationCode}
              ratio={fsr}
            />
            <ErrorMessage>{invitationError}</ErrorMessage>
          </FormElementContainer>

          <Button type="submit" submit ratio={fsr}>
            {submit}
          </Button>
        </RequestForm>
      </RequestSectionContainer>
    );
  };

  render() {
    const { responseStatus } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { activeLanguage, fontSizeRatio, showInGray } = value;
          const fsr = fontSizeRatio;
          console.log("request section ratio: ", fsr);

          const {
            renderLoadingContent,
            renderSubmitMessageContent,
            renderRequestSectionContent,
          } = this.getRequestSectionData(activeLanguage);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header ratio={fsr} />
              <div className="main-container">
                {responseStatus === 200 ||
                responseStatus === 400 ||
                responseStatus === 500
                  ? this.renderSubmitMessage(renderSubmitMessageContent)
                  : responseStatus === "IN_PROGRESS"
                  ? this.renderLoading(renderLoadingContent)
                  : this.renderRequestSection(
                      renderRequestSectionContent,

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

export default RequestSection;
