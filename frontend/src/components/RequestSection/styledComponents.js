import styled from "styled-components";
import { TbReplace } from "react-icons/tb";

export const RequestSectionContainer = styled.div`
  min-height: calc(100vh - 60px);
  padding: 0px 5vw 24px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 76px);
  }
`;

export const Heading = styled.h1`
  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  font-weight: 600;
  padding: 20px 0px 10px;
  color: rgb(51, 65, 85);
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }

  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 20;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 22;
    }}px;

    line-height: 32px;
  }
  @media screen and (min-width: 1200px) {
    font-size: ${(props) => {
      return props.ratio * 24;
    }}px;
  }
`;

export const RequestForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const MediaFilesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }
`;

export const MediaContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 940px;
  height: 50vw;
  max-height: 460px;
  @media screen and (min-width: 768px) {
    width: 49%;
    height: 25vw;
  }
`;

export const FileUpdateSection = styled.div`
  width: 100%;
  height: 100%;

  position: relative;
`;
export const StyledFileReplaceIcon = styled(TbReplace)`
  background-color: black;
  padding: 8px;
  font-size: 45px;

  color: white;
  border-radius: 12px;
  position: absolute;
  top: 15px;
  left: 18px;
  z-index: 1;
`;
export const MyFile = styled.video`
  width: 100%;
  height: 100%;
  border: solid 2px #616e7c;
  border-radius: 10px;
`;

export const PreviewCard = styled.div`
  height: 100%;
  border: dashed 2px #616e7c;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(71, 85, 105);
`;

export const UploadIcon = styled.div`
  font-size: 34px;
`;
export const UploadText = styled.p`
  font-size: ${(props) => {
    return props.ratio * 13;
  }}px;
  font-weight: 500;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 13;
    }}px;
  }

  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
  }
`;
export const FileButton = styled.input``;

export const InputContainer = styled.div`
  position: relative;
  width: 100%; /* 100% for full width on small screens */
  max-width: 768px; /*max width for larger screens */
  margin-top: 12px;
  border: solid 1px #c7c7c7;
  border-radius: 4px;
  padding: 12px 12px 22px 12px;
`;

export const TitleLabel = styled.label`
  margin-bottom: 5px;

  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  font-weight: 500;
  line-height: 24px;
  color: rgb(71, 85, 105);
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 17;
    }}px;
  }
`;

export const InfoIcon = styled.span`
  display: inline-block;
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
  font-size: 12px;
`;
export const TitleTextArea = styled.textarea`
  width: 100%;

  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;

  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none; /* Prevents the user from resizing the textarea */
  overflow: hidden; /* Hides the scrollbar */
  font-family: Inter;
  line-height: 1.2em;
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 17;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
`;

export const CharCount = styled.div`
  position: absolute;
  bottom: 6px;
  right: 10px;

  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  color: #6c757d;
`;

export const DescriptionLabel = styled(TitleLabel)``;

export const DescriptionTextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;

  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  box-sizing: border-box;
  resize: none; /* Prevents the user from resizing the textarea */
  overflow-y: auto; /* Enables vertical scrollbar */
  height: auto; /* Ensure the textarea adjusts its height */
  max-height: calc(1.2em * 5); /* Set the maximum height to 5 rows */
  line-height: 1.2em; /* Adjust the line height to match your needs */
  font-family: Inter;
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 17;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
`;

export const FormElementsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  @media screen and (min-width: 768px) {
    justify-content: space-evenly;
  }
`;

export const FormElementContainer = styled.div`
  width: 100%;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 12px;
  @media screen and (min-width: 576px) {
    width: ${(props) => (props.creatorCode ? "100%" : "40%")};
  }
  @media screen and (min-width: 768px) {
    width: ${(props) => (props.creatorCode ? "100%" : "33%")};
  }
`;

export const FormElementHeading = styled.h2`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;

  font-weight: 600;
  color: rgb(51, 65, 85);
  margin-bottom: 8px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
  }

  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
`;

export const AudienceType = styled.label`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;

  line-height: 24px;
  margin-left: 14px;
  display: flex;
  align-items: center;
  column-gap: 6px;

  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    line-height: 32px;
  }
`;

export const AudienceTypeRadio = styled.input`
  width: 1.5em;
  height: 1.5em;
`;

export const FormElementSelect = styled.select`
  width: 150px;
  padding: 8px 12px;
  margin-left: 14px;
  color: #333333;
  border: 1px solid #dddddd;
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  /* for replacing default arrow styling*/
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-7-7 1.5-1.5L10 9.0l5.5-5.5L18 5.5z"/></svg>')
    no-repeat right 8px center/10px 10px; /* Change the SVG URL to your arrow icon */
`;

export const FormElementSelectOption = styled.option`
  width: 150px;
  padding: 8px 12px;
  margin-left: 14px;
  color: #333333;
  border: 1px solid #dddddd;
  cursor: pointer;
  border-radius: 5px;
  padding: 8px 12px;
  background-color: #ffffff; /* Adjust as per your design */
  color: #333333; /* Adjust as per your design */
`;

export const InputCreator = styled.input`
  width: clamp(140px, 60vw, 300px);
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #a19d9d;
  outline: none;
  margin-left: 14px;
  border-radius: 5px;
  @media screen and (min-width: 992px) {
    padding: 10px 18px;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
`;
export const Button = styled.button`
  align-self: ${(props) => {
    if (props.submit) {
      return "flex-start";
    }
  }};

  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  font-weight: 500;
  border: 1px solid gray;
  border-radius: 6px;
  padding: 8px 16px;
  margin-top: 12px;
  background-color: transparent;
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    padding: 10px 20px;
  }
`;

//loading section styling
export const LoadingSection = styled(RequestSectionContainer)`
  justify-content: center;
  align-items: center;
`;
export const LoadingImage = styled.img`
  width: min(50vw, 50vh);
`;

export const LoadingText = styled.p`
  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;

  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 20;
    }}px;
  }
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 24;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 32;
    }}px;
  }
`;

//submit message section styling
export const SubmitResponseSection = styled(RequestSectionContainer)`
  justify-content: center;
  align-items: center;
`;
export const SubmitResponseImage = styled(LoadingImage)``;
export const SubmitResponseMessage = styled(LoadingText)``;

//error message styling
export const ErrorMessage = styled.p`
  padding: 4px 0px 0px 12px;
  color: red;
  font-weight: 500;
  font-size: 12px;
  @media screen and (min-width: 576px) {
    font-size: 13px;
  }

  @media screen and (min-width: 756px) {
    font-size: 14px;
  }
  @media screen and (min-width: 992px) {
    font-size: 15px;
  }
  @media screen and (min-width: 1200px) {
    font-size: 16px;
  }
`;
