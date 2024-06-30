import styled from "styled-components";
import { Link } from "react-router-dom";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 7vw 12px;

  @media screen and (min-width: 576px) {
    padding-top: 10vw;
  }
  @media screen and (min-width: 992px) {
    padding-top: 6vw;
  }
`;

export const UpperDescription = styled.p`
  font-size: ${(props) => {
    return props.ratio * 8;
  }}px;
  background-color: #f1f1f1;
  font-weight: 600;
  border-radius: 14px;
  padding: 4px 12px;
  margin-bottom: 4px;

  @media screen and (min-width: 576px) {
    margin-bottom: 8px;
  }
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 12;
    }}px;
    margin-bottom: 8px;
  }
  @media screen and (min-width: 992px) {
    margin-bottom: 12px;
  }
`;

export const MainDescription = styled.h1`
  width: 70vw;
  max-width: 700px;
  font-weight: 600;
  font-size: ${(props) => {
    return props.ratio * 16;
  }}px;
  line-height: 1.25;
  margin-bottom: 10px;
  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 18;
    }}px;
  }
  @media screen and (min-width: 768px) {
    width: 70vw;
    font-size: ${(props) => {
      return props.ratio * 22;
    }}px;
    margin-bottom: 16px;
  }
  @media screen and (min-width: 992px) {
    width: 60vw;
    font-size: ${(props) => {
      return props.ratio * 30;
    }}px;
    margin-bottom: 18px;
  }
  @media screen and (min-width: 1200px) {
    width: 55vw;
    margin-bottom: 22px;
  }
`;

export const LowerDescription = styled.p`
  color: gray;
  width: 85vw;
  max-width: 840px;
  font-size: ${(props) => {
    return props.ratio * 12;
  }}px;
  margin-bottom: 12px;

  @media screen and (min-width: 576px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
  }

  @media screen and (min-width: 768px) {
    width: 80vw;
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    margin-bottom: 14px;
  }
  @media screen and (min-width: 992px) {
    width: 75vw;
    font-size: ${(props) => {
      return props.ratio * 20;
    }}px;
    margin-bottom: 22px;
  }
  @media screen and (min-width: 1200px) {
    width: 70vw;

    margin-bottom: 22px;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
export const GetStartedButton = styled.button`
  font-size: ${(props) => {
    return props.ratio * 12;
  }}px;
  padding: 6px 12px;
  border-radius: 16px;
  border: solid 1px gray;
  background-color: transparent;
  font-weight: 500;
  @media screen and (min-width: 768px) {
    font-size: ${(props) => {
      return props.ratio * 14;
    }}px;
    padding: 6px 12px;
    border-radius: 18px;
  }
  @media screen and (min-width: 992px) {
    font-size: ${(props) => {
      return props.ratio * 16;
    }}px;
    padding: 10px 16px;
    border-radius: 20px;
  }
  @media screen and (min-width: 1200px) {
    padding: 12px 18px;
    border-radius: 22px;
  }
`;
