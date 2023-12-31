import { useLocation, useNavigate } from "react-router-dom";
import { HeaderTitle } from "../../utils/HeaderTitle";
import TextField from "../../components/TextField/TextField";
import { Envelope, EyeFill, EyeSlashFill, Lock } from "react-bootstrap-icons";
import Button from "../../components/Button/Button";
import { useFormSubmit } from "../../hooks/useFormSubmit";
import { loginValidationSchema } from "../../validations/login.validation";
import { useEffect, useState } from "react";
import { routes } from "../../router/constant";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  login,
  selectLoginError,
  selectLoginStatus,
} from "../../redux/authSlice";
import { toast } from "react-toastify";
import { ResponseStatus } from "../../enums/ResponseStatus";
import { LoginRequest } from "../../Schema/Requests/Login";

const Login = () => {
  const { pathname } = useLocation();
  const title = HeaderTitle(pathname);
  const [showPass, setShowPass] = useState<boolean>(false);
  const handleShowPassword = () => {
    setShowPass((pre) => !pre);
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLoginStatus);
  const error = useAppSelector(selectLoginError);
  const initialValues: LoginRequest = {
    email: "",
    password: "",
  };

  const handleSubmit = (values: LoginRequest) => {
    dispatch(login(values));
  };
  const formik = useFormSubmit(
    initialValues,
    handleSubmit,
    loginValidationSchema
  );
  useEffect(() => {
    if (status === ResponseStatus.SUCCEEDED) {
      navigate(`/${routes.ALL_STORES}`);
      toast.success("تم تسجيل الدخول بنجاح");
    } else if (status === ResponseStatus.FAILED) {
      toast.error(error);
    }
  }, [status, navigate, error]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-greyScale-lighter">
      <div className="flex flex-col w-64 gap-1 bg-white py-large px-x-large sm:w-96 rounded-med m-medium">
        <p className="flex justify-center font-semibold text-greyScale-main text-large my-medium">
          {title}
        </p>
        <form
          className="flex flex-col gap-2 my-medium"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <TextField
              id="email"
              startIcon={<Envelope />}
              label="ايميل"
              inputSize="x-large"
              value={formik.getFieldProps("email").value}
              onChange={formik.getFieldProps("email").onChange}
              onBlur={formik.getFieldProps("email").onBlur}
              helperText={
                formik.touched.email && Boolean(formik.errors.email)
                  ? String(formik.errors.email)
                  : ""
              }
            />
            <TextField
              id="password"
              startIcon={<Lock />}
              endIcon={
                showPass ? (
                  <EyeSlashFill onClick={handleShowPassword} />
                ) : (
                  <EyeFill onClick={handleShowPassword} />
                )
              }
              label="كلمة المرور"
              type={showPass ? "text" : "password"}
              inputSize="x-large"
              value={formik.getFieldProps("password").value}
              onChange={formik.getFieldProps("password").onChange}
              onBlur={formik.getFieldProps("password").onBlur}
              helperText={
                formik.touched.password && Boolean(formik.errors.password)
                  ? String(formik.errors.password)
                  : ""
              }
            />
          </div>
          <a
            href={`${routes.FORGOT_PASSWORD}`}
            className="text-primary-main text-small"
          >
            هل نسيت كلمة المرور؟
          </a>
          <Button
            variant="base-blue"
            disabled={false}
            text="تسجيل الدخول"
            size="xlg"
            type="submit"
            status={status}
          />
        </form>
        <p className="flex items-center justify-center text-greyScale-main text-medium gap-xx-small">
          ليس لديك حساب؟
          <a
            href={`${routes.REGISTER}`}
            className="text-primary-main text-medium"
          >
            اشتراك
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
