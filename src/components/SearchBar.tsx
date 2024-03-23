import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  inputPlaceholder: string;
  buttonText: string;
  inputValue: string;
  inputFunc: (e: ChangeEvent<HTMLInputElement>) => void;
  buttonFunc: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ inputPlaceholder, inputValue, buttonText, inputFunc, buttonFunc }) => {
  return (
    <SearchBarContainer>
      <SearchInput placeholder={inputPlaceholder} onChange={(e) => inputFunc(e)} value={inputValue ? inputValue : ''} />
      <SearchButton onClick={buttonFunc}>{buttonText}</SearchButton>
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled.div`
  background-color: #2f2f2f;
  width: 100%;
  height: 45px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 90%;
  height: 95%;
  border: 0;
  font-family: montserrat;
  padding-inline: 10px;
  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button`
  width: 10%;
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
