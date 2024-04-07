import styled from 'styled-components';

const SelectOption = styled.div`
  height: 40px;
  border-bottom: 1px solid #808080;
  display: flex;
  align-items: center;
  color: var(--main-text-color);
  cursor: pointer;
  border-radius: 5px;
  padding: 3px;
  &:hover {
    background-color: #808080;
  }
  &:last-child {
    border-bottom: transparent;
  }
`;

const SingleOption = styled.div`
  grid-area: 1/1/2/3;
  max-width: 100%;
  overflow: hidden;

  white-space: nowrap;
  color: var(--main-text-color);
  margin-left: 2px;
  margin-right: 2px;
  box-sizing: border-box;

  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  column-gap: 10px;
  img {
    height: 35px;
    width: 35px;
    border-radius: 5px;
  }
`;

export const CustomOption: React.FC<any> = ({ innerProps, label, data }) => (
  <SelectOption {...innerProps}>
    <img
      src={data.image}
      alt={label}
      style={{
        marginRight: '8px',
        width: '35px',
        height: '35px',
      }}
    />
    {label}
  </SelectOption>
);

export const CustomSingleValue: React.FC<any> = ({ innerProps, data }) => (
  <SingleOption {...innerProps}>
    <img src={data.image} />
    {data.label}
  </SingleOption>
);
export const customStyles = {
  control: (baseStyles: any) => ({
    ...baseStyles,

    background: '#373737',
    boxShadow: '0',
    borderColor: '#484848',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#808080',
    },
  }),
  menu: (baseStyles: any) => ({
    ...baseStyles,
    background: '#373737',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    '& img': {
      borderRadius: '3px',
    },

    '& ::-webkit-scrollbar': {
      width: '8px',
    },

    '& ::-webkit-scrollbar-track': {
      background: '#484848',
    },

    '& ::-webkit-scrollbar-thumb': {
      background: '#808080',
      borderRadius: '4px',
    },

    '& ::-webkit-scrollbar-thumb:hover': {
      background: '#a0a0a0',
    },
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    background: '#fbfbfb',
    color: '#fff',
    display: 'flex',
  }),
};
