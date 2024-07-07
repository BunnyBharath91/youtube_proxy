import styled from "styled-components";
import { Link } from "react-router-dom";

export const EditorSectionContainer = styled.div`
  min-height: calc(100vh - 60px);
  padding: 0px 5vw 24px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 76px);
  }
`;

export const EditorSectionHeading = styled.h1`
  font-size: ${(props) => {
    return props.ratio * 17;
  }}px;
  font-weight: 600;
  padding: 20px 0px 10px;
  color: rgb(51, 65, 85);
  border-bottom: solid 1px #cbd5e1;

  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 20;
    }}px;
    line-height: 32px;
    margin-bottom: 0px;
  }
  @media screen and (min-width: 1200px) {
    font-size: ${(props) => {
      return props.ratio * 22;
    }}px;
  }
`;

export const RequestsTableHeader = styled.ul`
  display: none;

  @media screen and (min-width: 992px) {
    display: block;
    display: flex;
    align-items: center;
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
    font-weight: 600;
    color: rgb(51, 65, 85);
    border-bottom: solid 1px #cbd5e1;
    padding: 12px 0px;
  }
`;

export const TableElement = styled.li`
  @media screen and (min-width: 992px) {
    list-style-type: none;

    width: ${(props) => {
      if (props.video) {
        return "70%";
      } else if (props.status || props.delete) {
        return "15%";
      } else {
        return "0%";
      }
    }};
    display: ${(props) =>
      props.video || props.status || props.delete ? "block" : "none"};
  }

  padding-left: ${(props) => (props.video ? "12px" : "0px")};

  @media screen and (min-width: 1200px) {
    display: block;

    width: ${(props) => {
      if (props.video) {
        return "40%";
      } else if (props.requestedDateTime || props.respondedDateTime) {
        return "14%";
      } else if (props.status || props.upload) {
        return "10%";
      } else if (props.delete) {
        return "12%";
      } else {
        return "0%";
      }
    }};
    text-align: ${(props) =>
      props.upload || props.delete ? "center" : "flex-start"};
  }
`;

//no requests section styling
export const NoRequestsContainer = styled.div`
  min-height: calc(100vh - 160px);
  padding: 1vw 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 180px);
  }
`;

export const NoRequestsImage = styled.img`
  width: min(50vw, 50vh);
`;

export const ApologiesText = styled.p`
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

export const StyledLink = styled(Link)`
  text-decoration: ${(props) => (props.sUl ? "underline" : "none")};
`;

export const RequestsContainer = styled.ul`
  display: flex;
  flex-direction: column;
`;

//request details styling

export const RequestCard = styled.div`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  border-bottom: solid 1px #e8e3e3;
  cursor: pointer;

  @media screen and (min-width: 576px) {
    flex-direction: row;
    padding-bottom: 10px;
  }
  @media screen and (min-width: 992px) {
    align-items: flex-start;
  }
`;

export const RequestThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 16/9;

  border-radius: 8px;

  @media screen and (min-width: 576px) {
    width: 40%;
  }
  @media screen and (min-width: 992px) {
    width: 22%;
  }
  @media screen and (min-width: 1200px) {
    width: 13%;
  }
`;

export const RequestTextContainer = styled.div`
  display: block;
  padding: 12px 10px;

  @media screen and (min-width: 576px) {
    padding: 4px 10px;
    width: 60%;
  }
  @media screen and (min-width: 768px) {
    padding-top: 8px;
  }
  @media screen and (min-width: 992px) {
    width: 48%;
    padding-right: 3%;
  }
  @media screen and (min-width: 1200px) {
    width: 27%;
    padding-right: 3%;
  }
`;

export const VideoTitle = styled.p`
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    font-weight: 500;
    line-height: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Show only 2 lines */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
  @media screen and (min-width: 1200px) {
  }
`;

export const CreatorId = styled.p`
  width: 100%;
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  font-weight: 500;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Show only 1 line */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  @media screen and (min-width: 576px) {
    -webkit-line-clamp: 2;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
  @media screen and (min-width: 768px) {
    -webkit-line-clamp: 1;
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
    line-height: 28px;
  }
  @media screen and (min-width: 1200px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
`;

export const Id = styled.span`
  color: gray;
  font-weight: 400;
  padding-left: 4px;
`;

export const StatusAndButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 4px;
  @media screen and (min-width: 576px) {
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    row-gap: 8px;
  }
  @media screen and (min-width: 992px) {
    display: none;
  }
`;
export const RequestStatus = styled.h2`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  font-weight: 600;
  margin: 0px 0px 4px 0px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
`;

export const Status = styled.span`
  color: gray;
  font-weight: 400;
  padding-left: 4px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.5rem;
`;

export const VideoUploadedText = styled.p`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
`;

export const RequestedDateTime = styled.p`
  display: none;
  color: gray;
  font-weight: 500;
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  @media screen and (min-width: 1200px) {
    display: block;
    display: flex;
    flex-direction: column;

    width: 14%;
  }
`;

export const LargeScreenRequestStatus = styled.p`
  display: none;

  color: gray;

  font-weight: 500;
  @media screen and (min-width: 992px) {
    display: block;
    width: 15%;
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
  @media screen and (min-width: 1200px) {
    width: 10%;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
`;

export const ResponseDateTime = styled(RequestedDateTime)``;

export const ExtraLargeScreenUploadButtonContainer = styled.div`
  display: none;
  @media screen and (min-width: 1200px) {
    display: block;
    text-align: center;
    width: 10%;
  }
`;

export const LargeScreenDeleteButtonContainer = styled.div`
  display: none;
  @media screen and (min-width: 992px) {
    display: block;
    padding-left: 12px;

    width: 12%;
  }
  @media screen and (min-width: 1200px) {
    padding-left: 0px;
    text-align: center;
  }
`;

//loading section styling
export const LoadingSection = styled(EditorSectionContainer)`
  align-items: center;
  justify-content: center;
`;

//fetchingError section styling

export const FetchingErrorImage = styled.img`
  width: min(60vw, 60vh);
`;
export const FetchingErrorMessage = styled.p`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;

  @media screen and (min-width: 576px) {
    font-size: 20px;
  }
  @media screen and (min-width: 768px) {
    font-size: 24px;
  }
  @media screen and (min-width: 992px) {
    font-size: 32px;
  }
`;

//upload response section styling
export const UploadResponseSection = styled(EditorSectionContainer)`
  align-items: center;
  justify-content: center;
`;
export const UploadResponseImage = styled.img`
  width: min(50vw, 50vh);
`;
export const UploadResponseMessage = styled.p`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;

  @media screen and (min-width: 576px) {
    font-size: 20px;
  }
  @media screen and (min-width: 768px) {
    font-size: 24px;
  }
  @media screen and (min-width: 992px) {
    font-size: 32px;
  }
`;

export const Button = styled.button`
  border: 0.5px solid ${(props) => (props.delete ? "#E5484D" : "#3356C7")};
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.delete ? "#E5484D" : "#3356C7")};
  background-color: ${(props) => (props.delete ? "#FFF7F7" : "#edf2fe")};
  cursor: pointer;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.delete ? "#FFDBDC" : "#E1E9FF")};
  }
`;
