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
} from "./styledComponents";

class RequestSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      responseStatus: "",
      responseMessage: "",
      videoUrl: "",
      thumbnailUrl: "",
      videoTitle: "",
      videoDescription: "",
      thumbnailError: "",
      videoError: "",
    };
  }

  onNewRequest = () => {
    window.location.reload();
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/upload-request", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({
          responseStatus: 200,
          responseMessage: data.message,
          loading: false,
        });
      } else {
        console.error("Upload failed with status:", response.status);
        this.setState({
          responseStatus: 500,
          responseMessage: "Upload failed. Please try again.",
          loading: false,
        }); // Example error handling
      }
    } catch (error) {
      console.error("Error uploading:", error);
      this.setState({
        responseStatus: 500,
        responseMessage: "Error uploading. Please try again.",
        loading: false,
      }); // Example error handling
    }
  };

  onVideoPreview = (event) => {
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

  onThumbnailPreview = (event) => {
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
    });
  };

  onChangeDescription = (event) => {
    this.setState({
      videoDescription: event.target.value,
    });
  };

  renderSubmitMessage = () => {
    const { responseStatus, responseMessage } = this.state;
    return (
      <SubmitResponseSection>
        <SubmitResponseImage
          alt="loading img"
          src={responseStatus === 200 ? successful : errorWhileUploading}
        />
        <SubmitResponseMessage>{responseMessage}</SubmitResponseMessage>
        <Button onClick={this.onNewRequest} goBack>
          Go Back
        </Button>
      </SubmitResponseSection>
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

  renderRequestSection = (fsr) => {
    const {
      videoUrl,
      thumbnailUrl,
      videoTitle,
      videoDescription,
      thumbnailError,
    } = this.state;

    return (
      <>
        <RequestSectionContainer>
          <Heading ratio={fsr}>Make a Request By: </Heading>
          <RequestForm
            onSubmit={this.handleSubmit}
            encType="multipart/form-data"
          >
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
                      Your browser does not support the video tag.
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

                    <UploadText ratio={fsr}>
                      Click here to Upload your video
                    </UploadText>
                  </PreviewCard>
                )}
                <FileButton
                  type="file"
                  name="video"
                  id="video"
                  accept="video/mp4"
                  onChange={this.onVideoPreview}
                  required
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

                    <UploadText ratio={fsr}>
                      Click here to Upload your thumbnail
                    </UploadText>
                  </PreviewCard>
                )}
                <FileButton
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  accept="image/jpeg, image/png"
                  onChange={this.onThumbnailPreview}
                  required
                  hidden
                />
              </MediaContainer>
            </MediaFilesContainer>
            <InputContainer>
              <TitleLabel htmlFor="title" ratio={fsr}>
                Title (required) <InfoIcon>?</InfoIcon>
              </TitleLabel>
              <TitleTextArea
                name="title"
                id="title"
                maxLength={100}
                value={videoTitle}
                onChange={this.onChangeTitle}
                rows={1} /* Start with a single row */
                onInput={(e) => {
                  // Adjust the height of the textarea to fit the content
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder=""
                ratio={fsr}
                required
              />
              <CharCount ratio={fsr}>{videoTitle.length}/100</CharCount>
            </InputContainer>
            <InputContainer>
              <DescriptionLabel htmlFor="description" ratio={fsr}>
                Description (required) <InfoIcon>?</InfoIcon>
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
                ratio={fsr}
                required
              />
              <CharCount ratio={fsr}>{videoDescription.length}/5000</CharCount>
            </InputContainer>
            <FormElementsContainer>
              <FormElementContainer>
                <FormElementHeading ratio={fsr}>
                  Audience (required)
                </FormElementHeading>
                <AudienceType ratio={fsr}>
                  <AudienceTypeRadio type="radio" name="audience" value="yes" />
                  Yes, made for kids
                </AudienceType>
                <AudienceType ratio={fsr}>
                  <AudienceTypeRadio type="radio" name="audience" value="no" />
                  No, not made for kids
                </AudienceType>
              </FormElementContainer>

              <FormElementContainer>
                <FormElementHeading htmlFor="status" ratio={fsr}>
                  Visibility (required):
                </FormElementHeading>
                <FormElementSelect name="privacy_status" id="status" required>
                  <FormElementSelectOption value="" disabled selected>
                    Select <IoMdArrowDropdown className="select-dropdown" />
                  </FormElementSelectOption>
                  <FormElementSelectOption value="public">
                    Public
                  </FormElementSelectOption>
                  <FormElementSelectOption value="private">
                    Private
                  </FormElementSelectOption>
                </FormElementSelect>
              </FormElementContainer>
              <FormElementContainer>
                <FormElementHeading as="label" htmlFor="category" ratio={fsr}>
                  Category (required):
                </FormElementHeading>
                <FormElementSelect name="category_id" id="category" required>
                  <FormElementSelectOption value="" disabled selected>
                    Select Category
                  </FormElementSelectOption>
                  <FormElementSelectOption value="22">
                    Educational
                  </FormElementSelectOption>
                </FormElementSelect>
              </FormElementContainer>
            </FormElementsContainer>
            <FormElementContainer>
              <FormElementHeading htmlFor="creator" ratio={fsr}>
                Creator id (required):
              </FormElementHeading>
              <InputCreator
                id="creator"
                name="creator_id"
                type="text"
                placeholder="fill creator id"
                ratio={fsr}
                required
              />
            </FormElementContainer>

            <Button type="submit" submit ratio={fsr}>
              Submit
            </Button>
          </RequestForm>
        </RequestSectionContainer>
      </>
    );
  };

  render() {
    const { responseMessage, loading } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const { fontSizeRatio, showInGray } = value;
          const fsr = fontSizeRatio;
          console.log("request section ratio: ", fsr);

          return (
            <div className={`${showInGray && "show-in-gray"} bg-container`}>
              <Header ratio={fsr} />
              <div className="main-container">
                {responseMessage
                  ? this.renderSubmitMessage()
                  : loading
                  ? this.renderLoading()
                  : this.renderRequestSection(fsr)}
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
