import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import { InputHTMLAttributes } from 'react';

interface CommonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  props?: any;
}

const CommonInput: FC<CommonInputProps> = ({ onChange, value, placeholder, ...props }) => {
  return <CustomInput placeholder={placeholder} value={value ? value : ''} onChange={(e) => onChange(e)} {...props} />;
};

const CustomInput = styled.input`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;

  font-size: 16px;
  color: #d1cfcf;
  &:hover {
    border-color: #8f8f8f;
    cursor: pointer;
  }
  img {
    display: block;
    width: 20px;
    filter: invert(0.5);
  }
  &:disabled {
    opacity: 0.7;
    &:hover {
      border-color: #565656;
      cursor: auto;
    }
  }
`;

export default CommonInput;
