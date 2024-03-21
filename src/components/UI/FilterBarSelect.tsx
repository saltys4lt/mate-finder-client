import { RootState } from '../../redux/index';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ClientUser from '../../types/ClientUser';
import { checkUserGameProfile } from '../../util/checkUserGameProfile';

const CustomSelect = styled.div`
  position: relative;
  display: inline-block;
  width: 50%;
`;

const SelectButton = styled.button`
  width: 100%;

  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 16px;
  color: #d1cfcf;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 20px;
    margin-right: 10px;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #181818;
  padding: 0;
  margin: 0;
  list-style: none;
  border: 2px solid #565656;
  border-top: none;
  border-radius: 0 0 7px 7px;
  overflow-y: auto;
  max-height: 200px;
`;

const DropdownItem = styled.li`
  padding: 5px 10px;
  color: #d1cfcf;
  cursor: pointer;
  display: flex;
  align-items: center;

  img {
    width: 30px;
    margin-right: 10px;
  }
`;

interface Option {
  value: string;
  label: string;
  image: string;
}

const FilterBarSelect: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([
    { value: 'cs2', label: 'Cs2', image: '/images/cs2-logo.png' },
    { value: 'Valorant', label: 'Valorant', image: '/images/valorant-logo.png' },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const user = useSelector((root: RootState) => root.userReducer.user);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    if (checkUserGameProfile(user as ClientUser) === 2) {
      setSelectedOption({ image: '', label: 'Выберите игру', value: 'both' });
    }
    if (checkUserGameProfile(user as ClientUser) === 1) {
      setOptions([options[0]]);
      setSelectedOption(options[0]);
    }
    if (checkUserGameProfile(user as ClientUser) === 0) {
      setOptions([options[1]]);

      setSelectedOption(options[1]);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <CustomSelect ref={selectRef}>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        {selectedOption && <img src={selectedOption.image} alt='' />}
        {selectedOption?.label}
      </SelectButton>
      {isOpen && (
        <DropdownList>
          {options.map((option) => (
            <DropdownItem key={option.value} onClick={() => handleSelect(option)}>
              <img src={option.image} alt='' />
              {option.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </CustomSelect>
  );
};

export default FilterBarSelect;
