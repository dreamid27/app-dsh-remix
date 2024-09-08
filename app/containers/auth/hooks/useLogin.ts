import { useRouter } from 'next/router';
import { useAuthContext } from 'utils/contexts/authContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IRequestAuth, SupabaseAuthUser } from 'utils/model/authModel';
import supabase, { loginEmailPassword } from 'services/supabase';
import { AxiosError } from 'axios';
import { AuthError } from '@supabase/supabase-js';
import { eventPosthog } from 'utils/helpers/eventTrack';
import * as Sentry from '@sentry/browser';
import {
  checkIsInAppWebView,
  flutterHandleAppleSignIn,
} from 'utils/constants/flutter_handler';
import {
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_ERROR,
  REGISTER_EMAIL_SUCCESS,
  REGISTER_EMAIL_FAILED,
  LOGIN_EMAIL_IS_NOT_REGISTERED,
} from 'utils/tracking/account';
import getJsonwebtoken from 'utils/helpers/jsonwebtoken';
import { useMutation } from '@tanstack/react-query';
import { checkEmail, registerEmail } from 'services/auth';
import axios from 'axios';
import IError from 'utils/interface/IError';

interface IFormInput {
  email: string;
  password: string;
}

interface IErrorAxiosResponse {
  error: string;
  message: string;
  statusCode: number;
}

export enum TypeAuth {
  LOGIN = 'login',
  REGISTER = 'register',
}

const validationSchema = Yup.object().shape({
  password: Yup.string().when('$typeAuth', {
    is: TypeAuth.LOGIN,
    then: Yup.string()
      .min(4, 'Password terlalu pendek')
      .required('Password tidak boleh kosong'),
    otherwise: Yup.string().notRequired(),
  }),
  email: Yup.string()
    .email('Format email tidak sesuai')
    .required('Email tidak boleh kosong'),
});

const useLogin = () => {
  const router = useRouter();
  const { as: asPage } = router.query;

  const typeAuth: TypeAuth = (router.query.type as TypeAuth) || TypeAuth.LOGIN;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: async (values) => {
      try {
        await validationSchema.validate(values, {
          context: { typeAuth },
          abortEarly: false,
        });
      } catch (validationErrors: any) {
        return validationErrors.inner.reduce((errors: any, error: any) => {
          errors[error.path] = error.message;
          return errors;
        }, {});
      }
      return {};
    },
    onSubmit: (values) =>
      typeAuth === TypeAuth.REGISTER
        ? handleRegisterEmail(values)
        : handleLoginEmail(values),

    validationSchema: validationSchema,
  });

  const { isLoading, handleLoginV2 } = useAuthContext();
  const [isLoginDummy, setLoginDummy] = useState(false);
  const [isLoadingLogin, setLoading] = useState(false);
  const [messageError, setMessageError] = useState<string>('');

  const {
    isOpen: isOpenModalNotRegis,
    onClose: onCloseModalNotRegis,
    onOpen: onOpenModalNotRegis,
  } = useDisclosure();

  const { mutate: mutateRegister, isLoading: isLoadingRegister } = useMutation({
    mutationFn: (email: string) => {
      const baseUrl = window.location.origin;
      return registerEmail(email, baseUrl);
    },
    onSuccess: (_, email) => {
      eventPosthog(REGISTER_EMAIL_SUCCESS, {
        email,
      });
      router.push('/auth/verification?email=' + email);
    },
    onError(err, email) {
      eventPosthog(REGISTER_EMAIL_FAILED, {
        email,
      });
      if (axios.isAxiosError(err)) {
        const error = err.response;
        const data = error?.data;
        const message =
          (data as any)?.message || (data as IError)?.error || err.message;
        const finalMessage = Array.isArray(message) ? message[0] : message;

        if (finalMessage.includes('registered')) {
          setMessageError(
            `Email sudah terdaftar. Silakan login atau gunakan email lain untuk daftar baru.`
          );
        } else {
          setMessageError(`${finalMessage}`);
        }
      } else {
        setMessageError(`Gagal daftar email, err: ${err}`);
      }
      throw err;
    },
  });

  const handleError = (
    error: AxiosError<IErrorAxiosResponse> | Error | AuthError,
    email?: string
  ) => {
    if (error instanceof AxiosError) {
      // Handle Axios errors with response data
      const responseData = error.response?.data;
      if (responseData?.error === 'USER_NOT_FOUND') {
        // Set the error message here
        setMessageError(
          `User dengan ${
            email ? `email ${email}` : ''
          } belum terdaftar, pastikan email yg anda gunakan benar dan jika anda merasa sudah mendaftar silahkan hubungi AM anda`
        );
      } else if (responseData?.error === 'USER_NOT_HAS_GROUP') {
        setMessageError(
          'User tidak memiliki group atau outlet, jika anda merasa sudah mendaftarkan outlet anda silahkan hubungi AM anda'
        );
      } else {
        setMessageError(
          `Terjadi Kesalahan, developer kami akan segera mengatasinya [${error?.response?.status}]`
        );
        Sentry.captureException(error);
      }
    } else if (error instanceof AuthError) {
      setMessageError('Email atau password yg dimasukan salah');
    } else {
      setMessageError(
        `Terjadi Kesalahan, Developer Kami akan segera mengatasinya [error: ${error.message}]`
      );
      Sentry.captureException(error);
    }
  };

  const handleLoginTelegram = (resp: any) => {
    handleLoginV2(resp);
  };

  const handleLoginTelegramV2 = async (resp: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    photo_url: string;
    auth_date: number;
    hash: string;
  }) => {
    try {
      setLoading(true);
      setMessageError('');

      eventPosthog(SIGNIN, {
        provider: 'telegram',
        response: resp,
      });
      const requestAuth: IRequestAuth = {
        email: '',
        telegram_user_id: resp.id.toString(),
        google_user_id: '',
        provider: 'telegram',
        name: `${resp.first_name} ${resp.last_name}`.trim(),
      };

      await handleLoginV2(requestAuth);
      eventPosthog(SIGNIN_SUCCESS, {
        provider: 'telegram',
        requestAuth,
      });
    } catch (error) {
      handleError(error as AxiosError | AuthError | Error);
      eventPosthog(SIGNIN_ERROR, {
        provider: 'telegram',
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginEmail = async (form: IFormInput) => {
    try {
      setLoading(true);
      setMessageError('');
      eventPosthog(SIGNIN, {
        provider: 'email',
        form,
      });

      const respCheckEmail = await checkEmail(form.email);
      if (!respCheckEmail.is_registered) {
        eventPosthog(LOGIN_EMAIL_IS_NOT_REGISTERED, {
          email: form.email,
        });
        onOpenModalNotRegis();
        return;
      }

      const resp = await loginEmailPassword({
        email: form.email,
        password: form.password,
      });

      const requestAuth: IRequestAuth = {
        telegram_user_id: '',
        google_user_id: resp.user.id || '',
        email: resp.user.email || '',
        provider: 'email',
        name: '',
      };

      await handleLoginV2(requestAuth);
      eventPosthog(SIGNIN_SUCCESS, {
        provider: 'email',
        form,
      });
    } catch (error) {
      handleError(error as AxiosError | AuthError | Error);
      eventPosthog(SIGNIN_ERROR, {
        provider: 'email',
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asPage === 'internal-delegasi') setLoginDummy(true);
  }, [asPage]);

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);
      eventPosthog(SIGNIN, {
        provider: 'google',
      });

      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
    } catch (error) {
      setMessageError((error as any).message);
      eventPosthog(SIGNIN_ERROR, {
        provider: 'google',
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginApple = async () => {
    try {
      setLoading(true);
      eventPosthog(SIGNIN, {
        provider: 'apple',
      });

      if (checkIsInAppWebView()) {
        const respLogin = await flutterHandleAppleSignIn();

        if (respLogin?.token) {
          router.push(`/login#access_token=${respLogin.token}`);
        } else {
          if (respLogin?.is_error) {
            throw new Error(
              respLogin?.error_message === 'Internal Server Error'
                ? 'User anda belum terdaftar, pastikan email tidak di hide, jika anda merasa sudah daftar silahkan hubungi AM anda'
                : respLogin?.error_message
            );
          }
        }
      } else {
        supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: `${window.location.origin}/login`,
          },
        });
      }
    } catch (error) {
      setMessageError((error as any).message);
      eventPosthog(SIGNIN_ERROR, {
        provider: 'apple',
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEmail = async (form: IFormInput) => {
    setMessageError('');
    mutateRegister(form.email);
  };

  useEffect(() => {
    const handleLoginToken = async () => {
      let responseUser: SupabaseAuthUser | null = null;
      try {
        // Get the fragment part of the URL (everything after "#")
        const hash = router.asPath.split('#')[1];

        // Check if the "access_token" exists in the hash
        if (hash && hash.includes('access_token=')) {
          // Split the hash by "&" to separate parameters and values
          const hashParams = hash.split('&');

          // Find and extract the "access_token" parameter
          const accessTokenParam = hashParams.find((param) =>
            param.includes('access_token=')
          );

          const jwt = await getJsonwebtoken();

          if (accessTokenParam) {
            setLoading(true);
            const accessToken = accessTokenParam.split('=')[1];
            responseUser = jwt.decode(accessToken) as SupabaseAuthUser;

            const requestAuth: IRequestAuth = {
              telegram_user_id: '',
              google_user_id: responseUser?.sub || '',
              email: responseUser.email || '',
              provider: 'google',
              name: responseUser.user_metadata.full_name || '',
            };

            await handleLoginV2(requestAuth);
            eventPosthog(SIGNIN_SUCCESS, {
              provider: 'google',
              requestAuth,
            });
          }
        }
      } catch (error) {
        handleError(error as Error | AxiosError, responseUser?.email);
        eventPosthog(SIGNIN_ERROR, {
          provider: 'google',
          error,
        });
      } finally {
        setLoading(false);
      }
    };

    handleLoginToken();
  }, [router.asPath]);

  useEffect(() => {
    if (isLoading) {
      setMessageError('');
    }
  }, [isLoading]);
  return {
    isLoading,
    isLoginDummy,
    isLoadingSubmitted: isLoadingLogin || isLoadingRegister,
    messageError,
    handleLoginGoogle,
    handleLoginTelegram,
    handleLoginTelegramV2,
    handleLoginApple,
    formik,
    setLoginDummy,
    typeAuth,
    isOpenModalNotRegis,
    onCloseModalNotRegis,
  };
};

export default useLogin;
