import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack, Link } from "@chakra-ui/react";
import { icon } from "@fortawesome/fontawesome-svg-core";

const socials = [
  {
    icon: faGlobe,
    url: "https://www.kidskoding.com"
  },
  {
    icon: faYoutube,
    url: "https://www.youtube.com/kidskoding"
  },
  {
    icon: faGithub,
    url: "https://github.com/kidskoding",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/anirudh-konidala/",
  },
  {
    icon: faInstagram,
    url: "https://www.instagram.com/anikoni2010/",
  },
];

const Header = () => {
  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      translateY={0}
      transitionProperty="transform"
      transitionDuration=".3s"
      transitionTimingFunction="ease-in-out"
      backgroundColor="#18181b"
    >
      <Box color="white" maxWidth="1280px" margin="0 auto">
        <HStack
          px={16}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
            <HStack spacing={8}>
              <Link href="#projects-section" onClick={handleClick("projects")}>
                Projects
              </Link>
              <Link href="#contactme-section" onClick={handleClick("contactme")}>
                Contact Me
              </Link>
            </HStack>
          </nav>
          <nav>
            <HStack spacing={6}>
              {socials.map((social, index) => (
                <Link key={index} href={social.url} isExternal>
                  <FontAwesomeIcon icon={social.icon} size="2x" />
                </Link>
              ))}
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};

export default Header;