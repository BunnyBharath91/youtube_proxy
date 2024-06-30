import styled from "styled-components";

export const CreatorRequestDetailsSection = styled.div`
  min-height: calc(100vh - 60px);
  padding: 0px 5vw 24px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 992px) {
    min-height: calc(100vh - 76px);
  }
`;

export const RequestHeading = styled.h1`
  background-color: white;

  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  font-weight: 600;
  padding: 20px 0px 10px;
  margin-bottom: 10px;
  color: rgb(51, 65, 85);
  border-bottom: solid 1px #cbd5e1;

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

export const MediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 12px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;
export const MediaCard = styled.div`
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 49%;
  }
`;

export const RequestDetailsHeading = styled.h2`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;
  font-weight: 600;
  color: rgb(54, 73, 98);
  line-height: 22px;
  padding-left: 4px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
    line-height: 24px;
  }

  @media screen and (min-width: 768px) {
    width: 45%;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    line-height: 28px;
    padding-left: 6px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
    line-height: 32px;
  }
`;

export const MediaItem = styled.video`
  width: 100%;
  height: 50vw;
  border-radius: 10px;

  @media screen and (min-width: 576px) {
    border-radius: 18px;
  }
  @media screen and (min-width: 768px) {
    height: 25vw;
    border-radius: 10px;
  }
  @media screen and (min-width: 1200px) {
    border-radius: 18px;
  }
`;

export const TextContainer = styled.div`
  width: 100%;
  max-width: 768px;
  margin-bottom: 12px;
  border: solid 1px #c7c7c7;
  border-radius: 4px;
  padding: 12px 12px 22px 12px;
`;
export const VideoTitleHeading = styled.h2`
  margin-bottom: 5px;
  font-size: ${(props) => {
    return props.ratio * 12;
  }}px;
  font-weight: 600;
  line-height: 18px;
  color: rgb(71, 85, 105);
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 13;
    }}px;
  }
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
  }
`;
export const VideoTitle = styled.p`
  border-radius: 4px;
  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  line-height: 1.2em;
  overflow-y: auto; /*vertical scrollbar when content overflows */
  max-height: 5em; /* Limit the height to four lines */

  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 17;
    }}px;
  }
`;

export const VideoDescriptionHeading = styled(VideoTitleHeading)``;
export const VideoDescription = styled(VideoTitle)``;

export const ElementsContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }
`;
export const Element = styled.h2`
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;

  font-weight: 600;
  color: rgb(54, 73, 98);
  margin-bottom: 8px;
  line-height: 22px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 15;
    }}px;
    line-height: 24px;
  }

  @media screen and (min-width: 768px) {
    width: 45%;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    line-height: 28px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
    line-height: 32px;
  }
`;

export const ElementValue = styled.span`
  color: rgb(44, 63, 88);
  font-weight: 400;
  padding-left: 12px;
  @media screen and (min-width: 768px) {
    width: 45%;
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
  }
`;
export const ButtonsContainer = styled.div`
  margin: 12px 0px 0px 8px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Button = styled.button`
  font-size: ${(props) => {
    if (props.ratio > 1) {
      return (1 + (props.ratio - 1) / 2) * 14;
    } else if (props.ratio < 1) {
      return (1 - (1 - props.ratio) / 2) * 14;
    } else {
      return 14;
    }
  }}px;
  font-weight: 500;
  border: 1px solid gray;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: transparent;
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      if (props.ratio > 1) {
        return (1 + (props.ratio - 1) / 2) * 16;
      } else if (props.ratio < 1) {
        return (1 - (1 - props.ratio) / 2) * 16;
      } else {
        return 16;
      }
    }}px;
    padding: 10px 20px;
  }
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  margin-top: 4px;
  color: red;
  margin-left: 1vw;
  font-weight: 500;
`;

export const Err = styled.span`
  font-size: 1.15rem;
  font-weight: 600;
  margin-right: 4px;
`;

//loading section styling
export const LoadingSection = styled(CreatorRequestDetailsSection)`
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
