import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  inputPlaceholder: string;
  buttonText: string;
  inputValue: string;
  inputFunc: (e: ChangeEvent<HTMLInputElement>) => void;
  buttonFunc: () => void;
  buttonWidth?: string;
  inputWidth?: string;
  ComponentHeight?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  inputPlaceholder,
  inputValue,
  buttonText,
  inputFunc,
  buttonFunc,
  buttonWidth,
  inputWidth,
  ComponentHeight,
}) => {
  return (
    <SearchBarContainer $height={ComponentHeight}>
      <SearchInput $width={inputWidth} placeholder={inputPlaceholder} onChange={(e) => inputFunc(e)} value={inputValue ? inputValue : ''} />
      <SearchButton $width={buttonWidth} onClick={buttonFunc}>
        {buttonText}
      </SearchButton>
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled.div<{ $height?: string }>`
  background-color: #2f2f2f;
  width: 100%;
  height: ${(p) => (p.$height ? p.$height : '45px')};
  border-radius: 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const SearchInput = styled.input<{ $width?: string }>`
  width: ${(p) => (p.$width ? p.$width : '90%')};
  height: 95%;
  border: 0;
  font-family: montserrat;
  padding-inline: 10px;
  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button<{ $width?: string }>`
  width: ${(p) => (p.$width ? p.$width : '10%')};

  height: 95%;
  border: 0;
  font-family: montserrat;

  background-color: #d82f2f;
  color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #af2828;
  }
`;
export default SearchBar;
