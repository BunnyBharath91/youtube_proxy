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
      } else if (props.approve || props.reject) {
        return "12%";
      } else {
        return "0%";
      }
    }};
    display: ${(props) =>
      props.video || props.status || props.approve || props.reject
        ? "block"
        : "none"};
    text-align: ${(props) =>
      props.approve || props.reject ? "center" : "flex-start"};
  }

  @media screen and (min-width: 1200px) {
    display: block;

    width: ${(props) => {
      if (props.video) {
        return "40%";
      } else if (props.requestedDateTime || props.respondedDateTime) {
        return "15%";
      } else if (props.status) {
        return "10%";
      } else if (props.approve || props.reject) {
        return "10%";
      } else {
        return "0%";
      }
    }};
    text-align: ${(props) =>
      props.approve || props.reject ? "center" : "flex-start"};
  }
`;

//no requests section styling
export const NoRequestsContainer = styled.div`
  min-height: calc(100vh - 60px);
  padding: 1vw 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 76px);
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
  height: 50vw;
  border-radius: 8px;

  @media screen and (min-width: 576px) {
    width: 40%;
    height: 20vw;
  }
  @media screen and (min-width: 992px) {
    width: 20%;
    height: 10vw;
  }
  @media screen and (min-width: 1200px) {
    width: 13%;
    height: min(7vw, 100px);
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

// export const StatusAndButtonsContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   margin-top: 4px;
//   @media screen and (min-width: 576px) {
//     flex-direction: column;
//     justify-content: space-around;
//     align-items: flex-start;
//     row-gap: 20px;
//   }
//   @media screen and (min-width: 992px) {
//     display: none;
//   }
// `;

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
  color: rgb(71, 85, 105);
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
  color: rgb(71, 85, 105);
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

export const Button = styled.button`
  border: 1px solid gray;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: transparent;
`;

//loading section styling
export const LoadingSection = styled(CreatorSectionContainer)`
  align-items: center;
  justify-content: center;
`;
export const LoadingImage = styled.img`
  width: min(50vw, 50vh);
`;

export const LoadingText = styled.p`
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
