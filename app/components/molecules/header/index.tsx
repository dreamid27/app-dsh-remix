import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft } from "phosphor-react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { sizeWidth } from "utils/constants/size";
import useBack from "utils/hooks/useBack";

interface HeaderProps {
  title?: string;
  side?: React.ReactNode;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  leftIcon?: ReactElement;
  leftConfirmation?: (innerFunction?: () => void) => void;
  onBack?: () => void;
  hideShadow?: boolean;
  tooltipInfo?: string;
  fullWidth?: boolean;
}

const Header = ({
  title,
  children,
  side,
  leftIcon,
  leftConfirmation,
  onBack,
  rightContent,
  hideShadow,
  tooltipInfo,
  fullWidth,
}: HeaderProps) => {
  const { handleBack } = useBack();
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(48);
  const tooltipDisclosure = useDisclosure();

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  return (
    <>
      {/* Space For Headers */}
      <Box style={{ height: height }} w="full"></Box>
      <Box
        className="header-app"
        ref={ref}
        bg="white"
        boxShadow={
          hideShadow
            ? "none"
            : "0 0.125rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.15)"
        }
        pos="fixed"
        top={0}
        zIndex={"sticky"}
        w="full"
        maxW={{ md: fullWidth ? 'full' : sizeWidth }}
      >
        <Container>
          <Flex paddingY="2">
            <Flex alignItems="center" w="full" justifyContent="space-between">
              <Flex alignItems="center">
                <IconButton
                  variant="ghost"
                  aria-label="back"
                  size="sm"
                  icon={
                    leftIcon === undefined ? (
                      <ArrowLeft size="20" weight="bold" />
                    ) : (
                      leftIcon
                    )
                  }
                  onClick={
                    leftConfirmation !== undefined
                      ? () => leftConfirmation(onBack || handleBack)
                      : onBack || handleBack
                  }
                />
                <Text
                  ml="2"
                  fontSize="md"
                  fontWeight="semibold"
                  data-testid="title"
                >
                  {title}
                </Text>
                {!!tooltipInfo && (
                  <Box
                    border="1px"
                    ml="2"
                    width="4"
                    height="4"
                    rounded="full"
                    backgroundColor="gray.400"
                    borderColor="gray.400"
                    color="white"
                    onClick={() => tooltipDisclosure.onOpen()}
                  >
                    <Center>
                      <Text fontWeight="bold" fontSize="xs">
                        i
                      </Text>
                    </Center>
                  </Box>
                )}
              </Flex>
              {rightContent ? <Box>{rightContent}</Box> : null}
            </Flex>
            {side}
          </Flex>
          {children}
        </Container>
      </Box>

      <Modal
        isCentered
        isOpen={tooltipDisclosure.isOpen}
        onClose={tooltipDisclosure.onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <Box width="100%" px="4" py="5">
            <Text textAlign="center" fontWeight="semibold" fontSize="lg">
              Informasi
            </Text>
            <Text
              textAlign="center"
              py="5"
              fontSize="sm"
              color="greySecondaryText60"
            >
              {tooltipInfo}
            </Text>
            <Center>
              <Button width="100%" onClick={() => tooltipDisclosure.onClose()}>
                OK, SAYA MENGERTI
              </Button>
            </Center>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
