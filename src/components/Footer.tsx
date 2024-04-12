import Container from './Container';
import styled from 'styled-components';
import telegram from '../assets/images/telegram.png';
import github from '../assets/images/github.png';
import linkedin from '../assets/images/linkedin.png';
import coffeeIcon from '../assets/images/coffee-cup.png';

import footerLogo from '../assets/images/footer-logo.jpg';

const Footer = () => {
  return (
    <MainFooter>
      <Container>
        <FooterContainer>
          <FooterColumn>
            <FooterTitle>Контакты</FooterTitle>

            <ContactsItem href='https://t.me/ahrisai' target='_blank'>
              <ContactsLink>@ahrisai</ContactsLink>
              <ContactsIcon src={telegram} />
            </ContactsItem>

            <ContactsItem href='https://github.com/ahrisai' target='_blank'>
              <ContactsLink>ahrisai</ContactsLink>
              <ContactsIcon src={github} />
            </ContactsItem>

            <ContactsItem href='https://www.linkedin.com/in/ilia-shpak-8b1524298/' target='_blank'>
              <ContactsLink>Ilia Shpak</ContactsLink>
              <ContactsIcon src={linkedin} />
            </ContactsItem>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Если денег не жалко, то подкинь на кофе :3 </FooterTitle>
            <ContactsItem href='https://www.buymeacoffee.com/ahrisai' target='_blank'>
              <ContactsLink>buymeacoffee.com/ahrisai</ContactsLink>
              <CoffeeIcon src={coffeeIcon} />
            </ContactsItem>
          </FooterColumn>
          <Logo src={footerLogo} />
        </FooterContainer>
      </Container>
    </MainFooter>
  );
};

const MainFooter = styled.footer`
  background-color: rgb(31, 31, 31);

  padding: 30px 0;
`;

const FooterContainer = styled.div`
  width: 100%;
  height: 140px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FooterColumn = styled.div``;

const ContactsItem = styled.a`
  display: flex;
  column-gap: 10px;
  align-items: center;
  text-decoration: none;
  margin-left: 10px;
  margin-top: 10px;
  &:hover span {
    color: #979797;
  }
`;

const ContactsLink = styled.span`
  text-decoration: none;
  font-size: 16px;
  color: #444;
`;

const FooterTitle = styled.h3`
  color: #979797;
  margin-bottom: 15px;
`;

const ContactsIcon = styled.img`
  width: 20px;
  filter: invert(0.5);
`;

const CoffeeIcon = styled.img`
  width: 20px;
`;
const Logo = styled.img`
  height: 100px;
  border-radius: 5px;
`;

export default Footer;
