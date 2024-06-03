import Container from './Container';
import styled from 'styled-components';
import telegram from '../assets/images/telegram.png';
import github from '../assets/images/github.png';
import linkedin from '../assets/images/linkedin.png';
import faceitLogo from '../assets/images/faceitlogo.png';
import steamLogo from '../assets/images/steam-logo.png';
import gmailIcon from '../assets/images/sended-friend-req.png';
import footerLogo from '../assets/images/cs2-logo.png';

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
            <FooterTitle>Сотрудничество</FooterTitle>
            <ContactsItem href='mailto:ilia280704@gmail.com'>
              <ContactsLink>ilia280704@gmail.com</ContactsLink>
              <ContactsIcon src={gmailIcon} />
            </ContactsItem>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Интеграции</FooterTitle>

            <LogosContainer>
              <Logo src={faceitLogo} />
              <Logo src={steamLogo} />

              <Logo src={footerLogo} />
            </LogosContainer>
          </FooterColumn>
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
  height: 100px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FooterColumn = styled.div``;
const LogosContainer = styled.div`
  display: flex;
  column-gap: 15px;
  align-items: flex-end;
`;
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

const Logo = styled.img`
  height: 50px;
  border-radius: 5px;
`;

export default Footer;
