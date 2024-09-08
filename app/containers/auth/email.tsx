import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  VStack,
  Text,
  Flex,
  Alert,
  AlertIcon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import FullHeight from 'components/molecules/fullHeight';
import { EyeClosed, Eye } from 'phosphor-react';
import useLogin, { TypeAuth } from './hooks/useLogin';
import { useState } from 'react';
import Header from 'components/molecules/header';
import { sizeWidth } from 'utils/constants/size';
import IllustrationConfuse from './assets/illustration-confuse.svg';

const LoginEmailContainer = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const {
    formik,
    isLoadingSubmitted,
    messageError,
    typeAuth,
    isOpenModalNotRegis,
    onCloseModalNotRegis,
  } = useLogin();
  const label = typeAuth === TypeAuth.LOGIN ? 'Login' : 'Daftar';

  return (
    <>
      <Box margin="auto" minWidth="320px">
        <Box m="auto" maxW={{ md: sizeWidth }}>
          <Header title={label} />
        </Box>
        <FullHeight
          width={{
            base: 'full',
            md: sizeWidth,
          }}
          margin="auto"
          minWidth="320px"
          backgroundColor="#fdfeff"
          outline={{ md: '1px solid' }}
          outlineColor={{ md: 'gray.200' }}
        >
          <Flex w="full" justifyContent="center">
            <Box w="full" maxW={sizeWidth}>
              <VStack spacing={2.5} p="8">
                <Text fontSize="xl" fontWeight="medium">
                  {label} dengan Email
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color="greySecondaryText60"
                >
                  Isi form di bawah untuk {label.toLowerCase()}
                </Text>
              </VStack>

              <form onSubmit={formik.handleSubmit}>
                <Box px="5" mt="4">
                  <FormControl
                    mb="4"
                    isInvalid={!!formik.errors.email && formik.touched.email}
                  >
                    <FormLabel
                      fontSize="sm"
                      fontWeight="normal"
                      lineHeight="14px"
                    >
                      Email
                    </FormLabel>
                    <Input
                      data-testid="email"
                      borderRadius="full"
                      isDisabled={isLoadingSubmitted}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Masukkan email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <FormErrorMessage data-testid="form-error-email">
                        {formik.errors.email}
                      </FormErrorMessage>
                    ) : (
                      <></>
                    )}
                  </FormControl>
                  {TypeAuth.LOGIN === typeAuth ? (
                    <>
                      <FormControl
                        isInvalid={
                          !!formik.errors.password && formik.touched.password
                        }
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="normal"
                          lineHeight="14px"
                        >
                          Password
                        </FormLabel>
                        <InputGroup>
                          <Input
                            data-testid="password"
                            borderRadius="full"
                            isDisabled={isLoadingSubmitted}
                            id="password"
                            name="password"
                            placeholder="Masukkan password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            type={showPassword ? 'text' : 'password'}
                          />
                          <InputRightElement w="40px">
                            <IconButton
                              w="40px"
                              variant="unstyled"
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeClosed width="100%" />
                              ) : (
                                <Eye width="100%" />
                              )}
                            </IconButton>
                          </InputRightElement>
                        </InputGroup>
                        {formik.errors.password && formik.touched.password ? (
                          <FormErrorMessage data-testid="form-error-password">
                            {formik.errors.password}
                          </FormErrorMessage>
                        ) : (
                          <></>
                        )}
                      </FormControl>
                      <Box mb="4" textAlign="left" mt="2">
                        {/* <Link as={NextLink} mb="4" href="/forgot-password"> */}
                        <Text
                          fontSize="sm"
                          color="secondary.500"
                          textDecor="underline"
                        >
                          Lupa Password ?
                        </Text>
                        {/* </Link> */}
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
                <Box pos="fixed" bottom={0} w="full" maxW={sizeWidth} p="5">
                  <Button
                    data-testid="submit"
                    mt="4"
                    letterSpacing="0.2px"
                    size="md"
                    w="full"
                    isDisabled={isLoadingSubmitted}
                    isLoading={isLoadingSubmitted}
                    type="submit"
                    textTransform="uppercase"
                  >
                    {label}
                  </Button>
                </Box>
              </form>
              {!isLoadingSubmitted && messageError && (
                <Box
                  px={5}
                  textAlign="left"
                  fontSize="sm"
                  data-testid="form-error"
                >
                  <Alert status="error">
                    <AlertIcon />
                    {messageError}
                  </Alert>
                </Box>
              )}
            </Box>
          </Flex>
        </FullHeight>
      </Box>
      <Modal isOpen={isOpenModalNotRegis} onClose={onCloseModalNotRegis}>
        <ModalOverlay />
        <ModalContent w="353px" borderRadius="20px">
          <ModalBody px="4" py="5">
            <VStack alignItems="center" textAlign="center" spacing={6}>
              <IllustrationConfuse />
              <Text fontWeight="medium" fontSize="xl">
                Kamu belum terdaftar. Apakah kamu customer Delegasi?
              </Text>
              <Text color="greySecondaryText60">
                Hubungi AM jika kamu mengalami kendala login
              </Text>
              <VStack w="full" spacing={4}>
                {/* <NextLink href="/auth?type=register"> */}
                <Button w="full" textTransform="uppercase">
                  Bukan, Saya ingin daftar
                </Button>
                {/* </NextLink> */}

                <Button
                  w="full"
                  variant="outline"
                  textTransform="uppercase"
                  onClick={onCloseModalNotRegis}
                >
                  Ya, Kembali Ke Pilihan Login
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginEmailContainer;
