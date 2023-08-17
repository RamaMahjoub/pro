import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeaderTitle } from "../../utils/HeaderTitle";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import { RegisterDetailSchema } from "../../Schema/request/registerDetails.schema";
import { useFormSubmit } from "../../hooks/useFormSubmit";
import { registerDetailsValidationSchema } from "../../validations/registerDetails.validation";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { completeInfo, selectCompleteInfoStatus } from "../../redux/authSlice";
import Loading from "../../components/Loading/Clip";
import { routes } from "../../router/constant";
import { toast } from "react-toastify";

const RegisterDetails = () => {
  const { pathname } = useLocation();
  const title = HeaderTitle(pathname);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCompleteInfoStatus);
  let buttonContent;

  useEffect(() => {
    if (status === "succeeded") {
      navigate(`/${routes.REGISTERION_PENDING}`);
      toast.success("تم إرسال المعلومات إلى مشرف النظام بنجاح");
    }
  }, [status, navigate]);

  if (status === "loading") {
    buttonContent = <Loading />;
  } else if (status === "succeeded") {
    buttonContent = "إرسال";
  } else if (status === "idle") {
    buttonContent = "إرسال";
  } else if (status === "failed") {
    buttonContent = "إرسال";
  }
  const initialValues: RegisterDetailSchema = {
    name: "",
    location: "",
    phoneNumber: "",
  };

  const handleSubmit = (values: RegisterDetailSchema) => {
    dispatch(completeInfo(values));
  };

  const formik = useFormSubmit(
    initialValues,
    handleSubmit,
    registerDetailsValidationSchema
  );
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-greyScale-lighter">
      <div className="flex flex-col w-64 gap-1 bg-white py-large px-x-large sm:w-96 rounded-med m-medium">
        <p className="flex justify-center font-semibold text-greyScale-main text-large my-medium">
          {title}
        </p>
        <p className="flex justify-center text-greyScale-main text-small mb-medium">
          سيتم مراجعة المعلومات التي تقدمها من قبل فريقنا المختص وسيتم الموافقة
          على اشتراكك بعد التحقق من صحة واكتمال المعلومات المقدمة.
        </p>
        <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
          <TextField
            id="name"
            label="اسم المستودع"
            inputSize="x-large"
            value={formik.getFieldProps("name").value}
            onChange={formik.getFieldProps("name").onChange}
            onBlur={formik.getFieldProps("name").onBlur}
            helperText={
              formik.touched.name && Boolean(formik.errors.name)
                ? String(formik.errors.name)
                : ""
            }
          />
          <TextField
            id="location"
            label="العنوان التفصيلي"
            inputSize="x-large"
            value={formik.getFieldProps("location").value}
            onChange={formik.getFieldProps("location").onChange}
            onBlur={formik.getFieldProps("location").onBlur}
            helperText={
              formik.touched.location && Boolean(formik.errors.location)
                ? String(formik.errors.location)
                : ""
            }
          />
          <TextField
            id="phoneNumber"
            label="رقم هاتف المستودع"
            inputSize="x-large"
            value={formik.getFieldProps("phoneNumber").value}
            onChange={formik.getFieldProps("phoneNumber").onChange}
            onBlur={formik.getFieldProps("phoneNumber").onBlur}
            helperText={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
                ? String(formik.errors.phoneNumber)
                : ""
            }
          />
          <Button
            type="submit"
            variant="base-blue"
            disabled={false}
            text={buttonContent}
            size="xlg"
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterDetails;
