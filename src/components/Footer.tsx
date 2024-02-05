import Container from './Container';
import styled from 'styled-components';

const Footer = () => {
  return (
    <MainFooter>
      <Container>
        <FooterContainer>
          <FooterColumn>
            <FooterTitle>Contact Me</FooterTitle>

            <ContactsItem href='https://t.me/ahrisai' target='_blank'>
              <ContactsLink>@ahrisai</ContactsLink>
              <ContactsIcon src='/images/telegram.png' />
            </ContactsItem>

            <ContactsItem href='https://github.com/ahrisai' target='_blank'>
              <ContactsLink>ahrisai</ContactsLink>
              <ContactsIcon src='/images/github.png' />
            </ContactsItem>

            <ContactsItem href='https://www.linkedin.com/in/ilia-shpak-8b1524298/' target='_blank'>
              <ContactsLink>Ilia Shpak</ContactsLink>
              <ContactsIcon src='/images/linkedin.png' />
            </ContactsItem>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>If you don't need money lend me a cup of coffee plz :3 </FooterTitle>
            <ContactsItem href='https://www.buymeacoffee.com/ahrisai' target='_blank'>
              <ContactsLink>buymeacoffee.com/ahrisai</ContactsLink>
              <ContactsIcon src='/images/coffee-cup.png' />
            </ContactsItem>
          </FooterColumn>
          <Logo src='/images/footer-logo.jpg' />
        </FooterContainer>
      </Container>
    </MainFooter>
  );
};

const MainFooter = styled.footer`
  background-color: #202020;
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
`;

const ContactsLink = styled.span`
  text-decoration: none;
  font-size: 16px;
  color: #444;
  &:hover {
    color: #979797;
  }
`;

const FooterTitle = styled.h3`
  color: #979797;
  margin-bottom: 15px;
`;

const ContactsIcon = styled.img`
  width: 20px;
`;

const Logo = styled.img`
  height: 100px;
  border-radius: 5px;
`;

export default Footer;
