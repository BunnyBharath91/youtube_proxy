import { Component } from "react";
import LanguageAndAccessibilityContext from "../../context/languageAndAccessibilityContext";
import {
  AccessibilityCardContainer,
  AccessibilityImg,
  CloseIcon,
  AccessibilityCard,
  AccessibilityCardElement,
} from "./styledComponents";

class AccessibilitySection extends Component {
  state = {
    showAccessibilityCard: false,
  };

  toggleAccessibilityCard = () => {
    this.setState((prevState) => ({
      showAccessibilityCard: !prevState.showAccessibilityCard,
    }));
  };

  render() {
    const { showAccessibilityCard } = this.state;

    return (
      <LanguageAndAccessibilityContext.Consumer>
        {(value) => {
          const {
            fontSizeRatio: fsr,
            showInGray,
            increaseRatio,
            decreaseRatio,
            toggleGrayScale,
            showUnderLines,
            toggleUnderLines,
            resetSettings,
          } = value;
          console.log(fsr);

          const onIncreaseRatio = () => {
            increaseRatio();
          };

          const onDecreaseRatio = () => {
            decreaseRatio();
          };

          const onToggleGrayScale = () => {
            toggleGrayScale();
          };

          const onToggleUnderLines = () => {
            toggleUnderLines();
          };

          const onResetSettings = () => {
            resetSettings();
          };

          return (
            <AccessibilityCardContainer show={showAccessibilityCard}>
              {showAccessibilityCard ? (
                <CloseIcon onClick={this.toggleAccessibilityCard} />
              ) : (
                <AccessibilityImg onClick={this.toggleAccessibilityCard} />
              )}

              <AccessibilityCard ratio={fsr}>
                <AccessibilityCardElement onClick={onIncreaseRatio}>
                  Increase Text
                </AccessibilityCardElement>
                <AccessibilityCardElement onClick={onDecreaseRatio}>
                  Decrease Text
                </AccessibilityCardElement>
                <AccessibilityCardElement onClick={onToggleGrayScale}>
                  {showInGray ? "Remove Gray" : "Show in Gray"}
                </AccessibilityCardElement>
                <AccessibilityCardElement onClick={onToggleUnderLines}>
                  {showUnderLines ? "Remove UnderLines" : "Show UnderLines"}
                </AccessibilityCardElement>
                <AccessibilityCardElement onClick={onResetSettings}>
                  Reset Settings
                </AccessibilityCardElement>
              </AccessibilityCard>
            </AccessibilityCardContainer>
          );
        }}
      </LanguageAndAccessibilityContext.Consumer>
    );
  }
}

export default AccessibilitySection;
