import styled from 'styled-components';

export const ConfirmButton = styled.button`
  display: inline;

  color: #c4c4c4;

  border: 0;

  padding: 7px 12px;
  background-color: #000000;
  cursor: pointer;
  font-size: 20px;
  text-transform: uppercase;
  font-family: 'montserrat';
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.03);
    background-color: #b92727;
    color: #fff;
  }
`;
