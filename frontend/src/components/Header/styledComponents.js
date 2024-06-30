import { Link } from "react-router-dom";
import styled from "styled-components";

export const HeaderContainer = styled.header`
  max-width: 1920px;
  margin: 0px auto;
  height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 5vw;
  position: fixed;
  right: 0px;
  top: 0px;
  left: 0px;
  box-shadow: rgba(31, 45, 61, 0.15) 0px 2px 2px 0px;
  z-index: 1000;

  @media screen and (min-width: 992px) {
    height: 76px;
  }
`;

export const ProxyLogo = styled.img`
  width: 64px;
  height: 35px;
  cursor: pointer;
`;

export const HeaderList = styled.ul`
  padding-left: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 20px;
`;

export const HeaderItem = styled.li`
  list-style-type: none;
  font-weight: 500;
  color: rgb(56, 63, 72);
  cursor: pointer;
  font-size: ${(props) => {
    return props.ratio * 17;
  }}px;
  display: ${(props) => (props.request || props.username ? "none" : "block")};

  ${(props) =>
    props.menu &&
    `
    display: flex;
    flex-direction: column;
  `}
  @media screen and (min-width:576px) {
    display: ${(props) => (props.username ? "none" : "block")};
  }
  @media screen and (min-width: 768px) {
    display: block;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: ${(props) => (props.sUl ? "underline" : "none")};
  color: inherit;
`;

export const MenuLogo = styled.div`
  width: 22px;
  height: 16px;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export const HeaderUserImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
  }
`;

export const MenuContainer = styled.ul`
  padding: 0px;
  width: 300px;
  height: 100vh;

  position: fixed;
  top: 0px;
  right: 0px;
  overflow-y: auto;
  background: white;
  transition: width 0.5s ease-in 0s;
  transform: translate(0px);
  box-shadow: rgb(224, 231, 238) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 2px 6px 10px 0px;
  border-radius: 6px;
  display: ${(props) => (props.show ? "block" : "none")};
  font-size: ${(props) => {
    return props.ratio * 14;
  }}px;

  @media screen and (min-width: 768px) {
    max-height: 400px;
    width: 350px;
    top: 55px;
    right: max(5vw, calc((100vw - 1920px) / 2 + 5vw));
    font-size: ${(props) => {
      return props.ratio * 17;
    }}px;
  }

  //   @media screen and (min-width: 1024px) {
  //     display: none;
  //   }

  @media screen and (min-width: 1200px) {
    height: 60vh;
  }
`;

export const MenuItem = styled.li`
  list-style-type: none;
  height: 50px;
  border-top: 1px solid rgba(123, 135, 148, 0.16);
  display: flex;
  align-items: center;
  padding: 0px 26px;
  font-weight: 500;
  color: rgb(97, 110, 124);

  @media screen and (min-width: 992px) {
    height: 60px;
  }
`;

export const MenuUserItem = styled(MenuItem)`
  font-weight: 500;
  color: rgb(56, 63, 72);
  height: 78px;
  display: flex;
  align-items: center;
  padding: 18px 26px 0px;
  border: none;
  gap: 22px;
  font-size: ${(props) => {
    return props.ratio * 17;
  }}px;

  @media screen and (min-width: 992px) {
    padding-top: 0px;
  }
`;

export const MenuUserImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
`;

export const MenuUserName = styled.p`
  line-height: 1.43;
`;

export const MenuCloseIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-left: auto;
`;
