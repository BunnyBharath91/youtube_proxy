import styled from "styled-components";
import { Link } from "react-router-dom";

export const CreatorSectionContainer = styled.div`
  min-height: calc(100vh - 60px);
  padding: 0px 5vw 24px;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 76px);
  }
`;

export const CreatorSectionHeading = styled.h1`
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
        return "61%";
      } else if (props.status) {
        return "15%";
      } else if (props.approve_ || props.reject_) {
        return "12%";
      } else {
        return "0%";
      }
    }};
    display: ${(props) =>
      props.video || props.status || props.approve_ || props.reject_
        ? "block"
        : "none"};
    text-align: ${(props) =>
      props.approve_ || props.reject_ ? "center" : "flex-start"};
  }

  padding-left: ${(props) => (props.video ? "12px" : "0px")};

  @media screen and (min-width: 1200px) {
    display: block;

    width: ${(props) => {
      if (props.video) {
        return "40%";
      } else if (props.requestedDateTime || props.respondedDateTime) {
        return "15%";
      } else if (props.status) {
        return "10%";
      } else if (props.approve_ || props.reject_) {
        return "10%";
      } else {
        return "0%";
      }
    }};
    text-align: ${(props) =>
      props.approve_ || props.reject_ ? "center" : "flex-start"};
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
  cursor: ${(props) => (props.wait ? "wait" : "pointer")};
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
    width: 20%;
  }
  @media screen and (min-width: 1200px) {
    width: 13%;
  }
`;

export const ResponseTextContainer = styled.div`
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
    width: 41%;
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

  transition: text-decoration 0.5s ease;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
  @media screen and (min-width: 1200px) {
  }
`;

export const EditorId = styled.p`
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
  @media screen and (min-width: 992px) {
    display: none;
  }
`;

export const Status = styled.span`
  color: gray;
  font-weight: 400;
  padding-left: 4px;
`;

export const PendingStatusAndButtonsContainer = styled.div`
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
export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.5rem;
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

    width: 15%;
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

export const LargeScreenResponseButtonContainer = styled.div`
  display: none;
  @media screen and (min-width: 992px) {
    display: block;
    width: 12%;
  }
  @media screen and (min-width: 1200px) {
    width: 10%;
  }
  text-align: center;
`;

//button colors
const buttonColors = {
  approve: "#46A758",
  reject: "#E54D2E",
  other: "#3356C7",
};

//button background colors
const buttonBgColors = {
  approve: "#F5FBF5",
  reject: "#FFF7F7",
  other: "#edf2fe",
};

//button hover background colors
const buttonHoverColors = {
  approve: "#E9F6E9",
  reject: "#FFDBDC",
  other: "#E1E9FF",
};

export const Button = styled.button`
  color: ${(props) =>
    props.approve_
      ? buttonColors.approve
      : props.reject_
      ? buttonColors.reject
      : buttonColors.other};
  border: 1px solid
    ${(props) =>
      props.approve_
        ? buttonColors.approve
        : props.reject_
        ? buttonColors.reject
        : buttonColors.other};
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) =>
    props.approve_
      ? buttonBgColors.approve
      : props.reject_
      ? buttonBgColors.reject
      : buttonBgColors.other};
  cursor: pointer;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.approve_
        ? buttonHoverColors.approve
        : props.reject_
        ? buttonHoverColors.reject
        : buttonHoverColors.other};
  }
`;

//loading section styling
export const LoadingSection = styled(CreatorSectionContainer)`
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
