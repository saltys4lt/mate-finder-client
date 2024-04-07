import styled from 'styled-components';

const SelectOption = styled.div`
  border-bottom: 1px solid #808080;
  display: flex;
  align-items: center;

  cursor: pointer;
  &:hover {
    background-color: #808080;
  }
  &:last-child {
    border-bottom: transparent;
  }
`;

export const CustomOption: React.FC<any> = ({ innerProps, label, data }) => (
  <SelectOption {...innerProps}>
    <img
      src={data.image}
      alt={label}
      style={{
        marginRight: '8px',
        width: '100px',
        height: '40px',
      }}
    />
    {label}
  </SelectOption>
);

export const CustomSingleValue: React.FC<any> = ({ innerProps, label, data }) => (
  <SelectOption {...innerProps}>
    <img
      src={data.image}
      alt={label}
      style={{
        marginRight: '8px',
        width: '100px',
        height: '45px',
      }}
    />
    {label}
  </SelectOption>
);
export const customStyles = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    marginTop: '30px',
    height: '50px',

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
    height: '50px',

    background: '#fbfbfb',
    color: '#fff',
    display: 'flex',
  }),
};
